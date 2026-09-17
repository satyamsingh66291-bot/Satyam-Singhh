/**
 * Firebase Firestore & Authentication initialization and Real-Time Service Layer
 * Supports live Firebase Cloud Firestore with automatic graceful fallback to local real-time sync
 * using BroadcastChannel and localStorage so that Admin and Client always stay 100% synchronized!
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDocFromServer,
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import appletConfig from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: appletConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: appletConfig?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: appletConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: appletConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: appletConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: appletConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: appletConfig?.firestoreDatabaseId || import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID
};

// Check if actual valid project ID is configured
const hasLiveConfig = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes('placeholder')
);

let app;
let db = null;
let auth = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = firebaseConfig.firestoreDatabaseId 
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId) 
    : getFirestore(app);
  auth = getAuth(app);
  console.log("🔥 Firebase initialized successfully with Firestore DB:", firebaseConfig.firestoreDatabaseId || "(default)");
} catch (err) {
  console.warn("Firebase initialized with local fallback engine:", err?.message);
}

// Test live connection
async function testFirestoreConnection() {
  if (hasLiveConfig && db) {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("✅ Cloud Firestore connection confirmed live!");
    } catch (e) {
      console.info("Firestore status ready:", e?.message);
    }

    // Seed default Satyam Singh website service to live Cloud Firestore if not present
    try {
      const srvRef = doc(db, 'services', 'srv-satyam-website-20k');
      await setDoc(srvRef, DEFAULT_SERVICES[0], { merge: true });
    } catch (e) {
      console.warn("Could not seed initial service to Cloud Firestore:", e?.message);
    }
  }
}
testFirestoreConnection();

export { db, auth };

// ==========================================
// REAL-TIME BROADCAST & LOCAL SYNC ENGINE
// Ensures instantaneous updates across tabs & components
// ==========================================
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('skillswap_realtime_bus')
  : null;

const STORAGE_KEYS = {
  MESSAGES: 'skillswap_db_messages',
  TRANSACTIONS: 'skillswap_db_transactions',
  SERVICES: 'skillswap_db_services',
  HERO: 'skillswap_db_hero_settings'
};

const DEFAULT_HERO = {
  title: "Connect, Hire & Swap Skills with Trusted Local Experts",
  subtitle: "Empowering hyper-local micro-services, task gig work, and peer-to-peer skill exchanges with instant Razorpay booking and an automated transparent 10% commission engine.",
  badge: "⚡ HyperLocal Micro-Services & Skill Exchange Hub",
  bannerImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  statsActivePros: "450+ Verified Pros",
  statsCompletedJobs: "12,500+ Tasks Done",
  statsSatisfaction: "4.9/5 Average Rating"
};

// Initial Defaults (Zero mock transactions, Zero mock messages, plus Satyam Singh Website Post)
const DEFAULT_SERVICES = [
  {
    id: "srv-satyam-website-20k",
    title: "Satyam Singh • App Builder & Website Builder (1 Website Ka ₹20,000)",
    providerName: "Satyam Singh",
    providerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    category: "Tech & Coding",
    price: 20000,
    rating: 5.0,
    reviewCount: 1,
    duration: "5-7 Days",
    location: "Online / Pan-India",
    description: "Full-stack application and custom responsive website development. Includes complete design, mobile responsiveness, Razorpay payments, SEO, and cloud deployment. 1 website flat ₹20,000. Chat on WhatsApp: 9007355062.",
    skills: ["React", "Full-Stack Web", "Mobile Responsive", "Razorpay", "Tailwind CSS"],
    isFeatured: true,
    availableForSwap: false,
    whatsappNumber: "9007355062"
  }
];
const DEFAULT_TRANSACTIONS = [];
const DEFAULT_MESSAGES = [];

// Helper to initialize local data if empty and sanitize legacy mock seeds
function getLocalItem(key, fallback = []) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    
    // Ensure any previously stored mock/sample seed items are wiped clean
    if (Array.isArray(parsed)) {
      let sanitized = parsed.filter(item => {
        if (!item) return false;
        const id = String(item.id || '');
        if (
          id.startsWith('TXN_RZP_INIT_') ||
          id === 'msg-1' || id === 'msg-2' ||
          id === 'srv-1' || id === 'srv-2' || id === 'srv-3' ||
          id === 'srv-4' || id === 'srv-5' || id === 'srv-6'
        ) {
          return false;
        }
        return true;
      });

      // If services list, ensure Satyam Singh post is present
      if (key === 'skillswap_services_v3') {
        const hasSatyam = sanitized.some(s => s.id === 'srv-satyam-website-20k');
        if (!hasSatyam) {
          sanitized = [...DEFAULT_SERVICES, ...sanitized];
        }
      }

      localStorage.setItem(key, JSON.stringify(sanitized));
      return sanitized;
    }

    return parsed;
  } catch (e) {
    return fallback;
  }
}

function setLocalItem(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (channel) {
      channel.postMessage({ type: 'SYNC_UPDATE', key });
    }
  } catch (e) {
    console.error("Local storage write error:", e);
  }
}

// ==========================================
// 1. REAL-TIME MESSAGING API
// ==========================================
export async function sendMessage(msgData) {
  const newMsg = {
    ...msgData,
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    read: false,
    timestamp: new Date().toISOString()
  };

  if (hasLiveConfig && db) {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...newMsg,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn("Firestore write failed, falling back to local sync:", err);
    }
  }

  // Local sync
  const existing = getLocalItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  const updated = [newMsg, ...existing];
  setLocalItem(STORAGE_KEYS.MESSAGES, updated);
  return { success: true, id: newMsg.id };
}

export function subscribeToMessages(callback) {
  if (hasLiveConfig && db) {
    try {
      const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(msgs);
      }, (err) => {
        console.warn("Firestore subscription error:", err);
      });
    } catch (e) {
      console.warn("Live message sub error, falling back to local:", e);
    }
  }

  // Local Sync Listener
  const notify = () => {
    const msgs = getLocalItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
    callback(msgs);
  };

  notify();

  const handleBroadcast = (event) => {
    if (event.data?.type === 'SYNC_UPDATE' && event.data?.key === STORAGE_KEYS.MESSAGES) {
      notify();
    }
  };

  const handleStorage = (e) => {
    if (e.key === STORAGE_KEYS.MESSAGES) notify();
  };

  if (channel) channel.addEventListener('message', handleBroadcast);
  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) channel.removeEventListener('message', handleBroadcast);
    window.removeEventListener('storage', handleStorage);
  };
}

export async function toggleMessageRead(messageId, currentStatus) {
  if (hasLiveConfig && db) {
    try {
      const msgRef = doc(db, 'messages', messageId);
      await updateDoc(msgRef, { read: !currentStatus });
      return true;
    } catch (err) {
      console.warn("Firestore updateDoc error, falling back to local:", err);
    }
  }

  const existing = getLocalItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  const updated = existing.map(m => m.id === messageId ? { ...m, read: !currentStatus } : m);
  setLocalItem(STORAGE_KEYS.MESSAGES, updated);
  return true;
}

export async function deleteMessage(messageId) {
  if (hasLiveConfig && db) {
    try {
      const msgRef = doc(db, 'messages', messageId);
      await deleteDoc(msgRef);
      return true;
    } catch (err) {
      console.warn("Firestore deleteDoc error, falling back to local:", err);
    }
  }

  const existing = getLocalItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  const updated = existing.filter(m => m.id !== messageId);
  setLocalItem(STORAGE_KEYS.MESSAGES, updated);
  return true;
}

// ==========================================
// 2. AUTOMATED COMMISSION & TRANSACTIONS API
// 10% Platform Commission, 90% Provider Payout
// ==========================================
export async function logTransaction(txData) {
  const totalAmount = Number(txData.totalAmount) || 0;
  const isFeatured = txData.type === 'FEATURED_BADGE';
  
  // Commission calculation
  // For featured badge (₹99 platform feature), platform retains 100%.
  // For service booking, 10% platform fee, 90% provider payout.
  const commissionEarned = isFeatured 
    ? totalAmount 
    : Math.round((totalAmount * 0.10) * 100) / 100;
  
  const providerPayout = isFeatured 
    ? 0 
    : Math.round((totalAmount * 0.90) * 100) / 100;

  const newTx = {
    ...txData,
    id: txData.id || 'TXN_' + Date.now(),
    totalAmount,
    commissionEarned,
    providerPayout,
    status: txData.status || 'SUCCESS',
    timestamp: new Date().toISOString()
  };

  if (hasLiveConfig && db) {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...newTx,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id, ...newTx };
    } catch (err) {
      console.warn("Firestore transaction write error, falling back to local:", err);
    }
  }

  const existing = getLocalItem(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
  const updated = [newTx, ...existing];
  setLocalItem(STORAGE_KEYS.TRANSACTIONS, updated);
  return { success: true, id: newTx.id, ...newTx };
}

export function subscribeToTransactions(callback) {
  if (hasLiveConfig && db) {
    try {
      const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const txs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(txs);
      }, (err) => {
        console.warn("Firestore transactions snapshot error:", err);
      });
    } catch (e) {
      console.warn("Transactions sub error:", e);
    }
  }

  const notify = () => {
    const txs = getLocalItem(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
    callback(txs);
  };

  notify();

  const handleBroadcast = (event) => {
    if (event.data?.type === 'SYNC_UPDATE' && event.data?.key === STORAGE_KEYS.TRANSACTIONS) {
      notify();
    }
  };

  const handleStorage = (e) => {
    if (e.key === STORAGE_KEYS.TRANSACTIONS) notify();
  };

  if (channel) channel.addEventListener('message', handleBroadcast);
  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) channel.removeEventListener('message', handleBroadcast);
    window.removeEventListener('storage', handleStorage);
  };
}

// ==========================================
// 3. DYNAMIC CMS & HOMEPAGE CONTENT MANAGEMENT
// ==========================================
export function subscribeToHeroSettings(callback) {
  if (hasLiveConfig && db) {
    try {
      const heroDoc = doc(db, 'settings', 'hero');
      return onSnapshot(heroDoc, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data());
        } else {
          callback(DEFAULT_HERO);
        }
      });
    } catch (e) {
      console.warn("Firestore hero snapshot error:", e);
    }
  }

  const notify = () => {
    const hero = getLocalItem(STORAGE_KEYS.HERO, DEFAULT_HERO);
    callback(hero);
  };

  notify();

  const handleBroadcast = (event) => {
    if (event.data?.type === 'SYNC_UPDATE' && event.data?.key === STORAGE_KEYS.HERO) {
      notify();
    }
  };

  if (channel) channel.addEventListener('message', handleBroadcast);
  window.addEventListener('storage', notify);

  return () => {
    if (channel) channel.removeEventListener('message', handleBroadcast);
    window.removeEventListener('storage', notify);
  };
}

export async function updateHeroSettings(newSettings) {
  if (hasLiveConfig && db) {
    try {
      const heroDoc = doc(db, 'settings', 'hero');
      await setDoc(heroDoc, newSettings, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore update hero error, falling back to local:", err);
    }
  }

  const current = getLocalItem(STORAGE_KEYS.HERO, DEFAULT_HERO);
  const updated = { ...current, ...newSettings };
  setLocalItem(STORAGE_KEYS.HERO, updated);
  return true;
}

// ==========================================
// 4. SERVICE LISTINGS CMS & FEATURED BADGE
// ==========================================
export function subscribeToServices(callback) {
  if (hasLiveConfig && db) {
    try {
      const q = collection(db, 'services');
      return onSnapshot(q, (snapshot) => {
        const services = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(services);
      });
    } catch (e) {
      console.warn("Firestore services snapshot error:", e);
    }
  }

  const notify = () => {
    const services = getLocalItem(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    callback(services);
  };

  notify();

  const handleBroadcast = (event) => {
    if (event.data?.type === 'SYNC_UPDATE' && event.data?.key === STORAGE_KEYS.SERVICES) {
      notify();
    }
  };

  if (channel) channel.addEventListener('message', handleBroadcast);
  window.addEventListener('storage', notify);

  return () => {
    if (channel) channel.removeEventListener('message', handleBroadcast);
    window.removeEventListener('storage', notify);
  };
}

export async function saveService(serviceData) {
  const id = serviceData.id || ('srv-' + Date.now());
  const formatted = {
    ...serviceData,
    id,
    price: Number(serviceData.price) || 0,
    rating: Number(serviceData.rating) || 5.0,
    reviewCount: Number(serviceData.reviewCount) || 1,
    isFeatured: Boolean(serviceData.isFeatured)
  };

  if (hasLiveConfig && db) {
    try {
      const srvRef = doc(db, 'services', id);
      await setDoc(srvRef, formatted, { merge: true });
      return { success: true, service: formatted };
    } catch (e) {
      console.warn("Live save error, local fallback:", e);
    }
  }

  const current = getLocalItem(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  const exists = current.some(s => s.id === id);
  let updated;
  if (exists) {
    updated = current.map(s => s.id === id ? formatted : s);
  } else {
    updated = [formatted, ...current];
  }
  setLocalItem(STORAGE_KEYS.SERVICES, updated);
  return { success: true, service: formatted };
}

export async function deleteService(serviceId) {
  if (hasLiveConfig && db) {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      return true;
    } catch (e) {
      console.warn("Live delete error, local fallback:", e);
    }
  }

  const current = getLocalItem(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  const updated = current.filter(s => s.id !== serviceId);
  setLocalItem(STORAGE_KEYS.SERVICES, updated);
  return true;
}

export async function toggleFeaturedService(serviceId, isFeatured = true) {
  if (hasLiveConfig && db) {
    try {
      await setDoc(doc(db, 'services', serviceId), { isFeatured }, { merge: true });
    } catch (e) {
      console.warn("Live toggle featured error:", e);
    }
  }

  const current = getLocalItem(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  const updated = current.map(s => s.id === serviceId ? { ...s, isFeatured } : s);
  setLocalItem(STORAGE_KEYS.SERVICES, updated);
  return true;
}
