import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Tag, 
  Receipt,
  RotateCcw,
  MessageCircle
} from 'lucide-react';
import { logTransaction, toggleFeaturedService } from '../firebase.js';

// Dynamically load Razorpay SDK
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  item, // Can be a service object OR { type: 'FEATURED_BADGE', service: serviceObj, price: 99 }
  onPaymentSuccess,
  showToast 
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);
  
  // Status states: 'FORM' | 'SUCCESS' | 'FAILURE'
  const [step, setStep] = useState('FORM');
  const [transactionResult, setTransactionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingWaUrl, setBookingWaUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('FORM');
      setTransactionResult(null);
      setErrorMessage('');
      setBookingWaUrl('');
      loadRazorpayScript().then((ready) => {
        setRazorpayReady(ready);
      });
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const isFeaturedPurchase = item.type === 'FEATURED_BADGE';
  const targetService = isFeaturedPurchase ? item.service : item;
  const amount = isFeaturedPurchase ? 99 : (Number(item.price) || 0);

  // 10% Automated Commission Engine
  const platformCommission = isFeaturedPurchase ? amount : Math.round(amount * 0.10 * 100) / 100;
  const providerPayout = isFeaturedPurchase ? 0 : Math.round(amount * 0.90 * 100) / 100;

  const generateWhatsAppUrl = (tx) => {
    const msg = `*New Service Booking Order*
🛠️ Service: ${tx.serviceTitle}
💵 Total Amount: ₹${tx.totalAmount.toLocaleString()}
🏷️ Category: ${targetService?.category || 'Service Booking'}
👤 Customer Name: ${tx.customerName || 'Customer'}
📞 Phone: ${tx.customerPhone || 'Not specified'}
✉️ Email: ${tx.customerEmail || 'Not specified'}
🧾 Order / Tx ID: ${tx.transactionId}
⚡ Status: Confirmed & Synced to Firestore

Hi Satyam, I have booked this service. Please confirm timeline and project requirements!`;
    return `https://wa.me/919007355062?text=${encodeURIComponent(msg)}`;
  };

  const executeSuccessfulTransaction = async (paymentId) => {
    setLoading(true);
    try {
      const txPayload = {
        transactionId: paymentId || `pay_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`,
        serviceId: targetService?.id || 'unknown',
        serviceTitle: isFeaturedPurchase ? `Featured Badge (7 Days) - ${targetService?.title}` : (targetService?.title || 'Micro-Service Booking'),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        totalAmount: amount,
        commissionEarned: platformCommission,
        providerPayout: providerPayout,
        status: 'SUCCESS',
        type: isFeaturedPurchase ? 'FEATURED_BADGE' : 'SERVICE_BOOKING',
        timestamp: new Date().toISOString()
      };

      const result = await logTransaction(txPayload);

      // If featured badge purchased, promote the service directly in Firestore
      if (isFeaturedPurchase && targetService?.id) {
        await toggleFeaturedService(targetService.id, true);
      }

      // Generate pre-filled WhatsApp link
      const waUrl = generateWhatsAppUrl(txPayload);
      setBookingWaUrl(waUrl);

      // Directly open pre-filled WhatsApp chat to 9007355062
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Could not auto open WhatsApp:', e);
      }

      setTransactionResult(result);
      setStep('SUCCESS');
      if (showToast) {
        showToast(
          isFeaturedPurchase
            ? 'Featured Badge activated! Service highlighted at top.'
            : 'Booking Confirmed & WhatsApp opened for 9007355062!',
          'success'
        );
      }
      if (onPaymentSuccess) onPaymentSuccess(result);
    } catch (err) {
      console.error("Failed to log transaction:", err);
      setErrorMessage(err.message || 'Transaction logging failed');
      setStep('FAILURE');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppBooking = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      if (showToast) showToast('Please enter your Name and Phone (WhatsApp) number first.', 'error');
      return;
    }
    await executeSuccessfulTransaction(`wa_order_${Date.now().toString().slice(-6)}`);
  };

  const handleRazorpayCheckout = async () => {
    if (!customerName || !customerEmail || !customerPhone) {
      if (showToast) showToast('Please enter your Name, Email, and Phone number.', 'error');
      return;
    }

    setLoading(true);
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

    // Check if we can open the real Razorpay checkout window
    const canUseNativeSdk = razorpayReady && window.Razorpay && razorpayKey !== 'rzp_test_placeholder';

    if (canUseNativeSdk) {
      try {
        const options = {
          key: razorpayKey,
          amount: amount * 100, // Amount in paise
          currency: 'INR',
          name: 'SkillSwap Hub',
          description: isFeaturedPurchase ? 'Featured Badge Promotion (1 Week)' : `Booking: ${targetService?.title}`,
          image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=120&q=80',
          handler: function (response) {
            executeSuccessfulTransaction(response.razorpay_payment_id);
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone
          },
          theme: {
            color: '#ea580c'
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(response.error?.description || 'Payment failed or declined by bank.');
          setStep('FAILURE');
          setLoading(false);
        });
        rzp.open();
        return;
      } catch (e) {
        console.warn("Native Razorpay failed to open, using test checkout flow:", e);
      }
    }

    // Interactive Test Checkout Mode (for development, preview sandbox & immediate test verification)
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="payment-modal-container"
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        
        {/* Close Button */}
        <button
          id="payment-modal-close"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: INITIAL PAYMENT & COMMISSION BREAKDOWN FORM */}
        {step === 'FORM' && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-bold">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Razorpay Gateway Gateway</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {isFeaturedPurchase ? "Promote Service as Featured" : "Confirm Booking & Payment"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isFeaturedPurchase 
                  ? "Feature your listing at the top of the homepage for 7 days."
                  : `Service provided by ${targetService?.providerName || 'Local Pro'}`}
              </p>
            </div>

            {/* Service & Price Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {targetService?.title}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Category: {targetService?.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Payable</div>
                </div>
              </div>

              {/* Automated Commission Engine (10% Fee) Visualizer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                    Platform Commission (10%):
                  </span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    ₹{platformCommission.toFixed(2)}
                  </span>
                </div>

                {!isFeaturedPurchase && (
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                      Direct Pro Payout (90%):
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{providerPayout.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                  Automated commission calculation stored in Firestore `transactions`.
                </div>
              </div>
            </div>

            {/* Customer Contact Fields */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Your Contact Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 dark:text-slate-300 font-medium">Full Name</label>
                  <input
                    id="payer-name-input"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 dark:text-slate-300 font-medium">Phone (WhatsApp)</label>
                  <input
                    id="payer-phone-input"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-300 font-medium">Email Address (for receipt)</label>
                <input
                  id="payer-email-input"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Razorpay Actions */}
            <div className="space-y-2 pt-2">
              <button
                id="pay-razorpay-button"
                type="button"
                disabled={loading}
                onClick={handleRazorpayCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading ? "Processing..." : `Pay ₹${amount.toLocaleString()} with Razorpay`}
                </span>
              </button>

              <button
                id="book-whatsapp-direct-button"
                type="button"
                disabled={loading}
                onClick={handleWhatsAppBooking}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Book & Chat on WhatsApp (9007355062)</span>
              </button>

              {/* Interactive Test Simulator Sandbox Bar */}
              <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Razorpay Test Sandbox Simulator:
                  </span>
                  <span>Instant Verification</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => executeSuccessfulTransaction(`pay_TEST_${Math.random().toString(36).substring(2, 8).toUpperCase()}`)}
                    className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
                  >
                    ✓ Simulate Success
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage("Payment simulated decline: Insufficient balance or bank timeout.");
                      setStep('FAILURE');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-colors"
                  >
                    ✗ Simulate Failure
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* STEP 2: INSTANT PAYMENT SUCCESS MODAL */}
        {step === 'SUCCESS' && transactionResult && (
          <div id="payment-success-modal" className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-900/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Payment Successful!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transaction recorded in Firestore under `transactions`
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left space-y-2.5 text-xs">
              
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700/80 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-200/70 dark:bg-slate-700 px-2 py-0.5 rounded text-[11px]">
                  {transactionResult.transactionId}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Amount Paid:</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  ₹{transactionResult.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">10% Platform Commission:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  ₹{transactionResult.commissionEarned.toFixed(2)}
                </span>
              </div>

              {!isFeaturedPurchase && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">90% Provider Payout:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{transactionResult.providerPayout.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400">
                <span>Timestamp:</span>
                <span>{new Date(transactionResult.timestamp).toLocaleString()}</span>
              </div>

            </div>

            {isFeaturedPurchase && (
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Featured Badge is now ACTIVE! Service pinned to top.</span>
              </div>
            )}

            <div className="space-y-2.5">
              {bookingWaUrl && (
                <a
                  id="success-whatsapp-open-btn"
                  href={bookingWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Open Booking Details on WhatsApp (9007355062)</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors"
              >
                Done / Back to Hub
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: PAYMENT FAILURE MODAL */}
        {step === 'FAILURE' && (
          <div id="payment-failure-modal" className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center ring-8 ring-rose-50 dark:ring-rose-900/30">
              <AlertCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Payment Failed
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errorMessage || "The transaction could not be authorized or was cancelled."}
              </p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              No money was deducted from your account. You can retry with a different card or UPI ID.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Payment</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
