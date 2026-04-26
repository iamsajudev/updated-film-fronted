"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Shield, Lock, AlertCircle, CheckCircle, TrendingUp, Clock, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Helper function to convert country name to ISO 3166-1 alpha-2 code
const getCountryCode = (countryName) => {
    if (!countryName) return null;

    const countryMap = {
        'United States': 'US', 'USA': 'US', 'United States of America': 'US',
        'United Kingdom': 'GB', 'UK': 'GB', 'Great Britain': 'GB',
        'Bangladesh': 'BD', 'India': 'IN', 'Canada': 'CA', 'Australia': 'AU',
        'Germany': 'DE', 'France': 'FR', 'Spain': 'ES', 'Italy': 'IT',
        'Mexico': 'MX', 'Brazil': 'BR', 'Japan': 'JP', 'China': 'CN',
        'South Korea': 'KR', 'Netherlands': 'NL', 'Sweden': 'SE', 'Norway': 'NO',
        'Denmark': 'DK', 'Finland': 'FI', 'Ireland': 'IE', 'New Zealand': 'NZ',
        'Singapore': 'SG', 'Malaysia': 'MY', 'Thailand': 'TH', 'Vietnam': 'VN',
        'Philippines': 'PH', 'Indonesia': 'ID', 'Pakistan': 'PK', 'Sri Lanka': 'LK',
        'Nepal': 'NP', 'South Africa': 'ZA', 'Egypt': 'EG', 'Nigeria': 'NG',
        'Kenya': 'KE', 'Ghana': 'GH', 'Turkey': 'TR', 'Russia': 'RU', 'Poland': 'PL',
        'Ukraine': 'UA', 'Romania': 'RO', 'Greece': 'GR', 'Portugal': 'PT',
        'Belgium': 'BE', 'Austria': 'AT', 'Switzerland': 'CH', 'Czech Republic': 'CZ',
        'Hungary': 'HU', 'Slovakia': 'SK', 'Croatia': 'HR', 'Serbia': 'RS',
        'Bulgaria': 'BG', 'Cyprus': 'CY', 'Estonia': 'EE', 'Latvia': 'LV',
        'Lithuania': 'LT', 'Slovenia': 'SI', 'Luxembourg': 'LU', 'Malta': 'MT',
        'Iceland': 'IS', 'Israel': 'IL', 'Saudi Arabia': 'SA', 'UAE': 'AE',
        'Qatar': 'QA', 'Kuwait': 'KW', 'Oman': 'OM', 'Bahrain': 'BH', 'Jordan': 'JO',
        'Lebanon': 'LB', 'Morocco': 'MA', 'Tunisia': 'TN', 'Algeria': 'DZ',
        'Argentina': 'AR', 'Chile': 'CL', 'Colombia': 'CO', 'Peru': 'PE', 'Venezuela': 'VE',
        'Uruguay': 'UY', 'Paraguay': 'PY', 'Ecuador': 'EC', 'Bolivia': 'BO',
        'Costa Rica': 'CR', 'Panama': 'PA', 'Dominican Republic': 'DO', 'Puerto Rico': 'PR',
        'Jamaica': 'JM', 'Trinidad and Tobago': 'TT', 'Bahamas': 'BS', 'Barbados': 'BB',
        'Fiji': 'FJ', 'Papua New Guinea': 'PG'
    };

    if (countryMap[countryName]) return countryMap[countryName];

    const lowerCountry = countryName.toLowerCase();
    for (const [key, value] of Object.entries(countryMap)) {
        if (key.toLowerCase() === lowerCountry) return value;
    }
    return null;
};

function PaymentForm({ formData, onSubmit, onPrev, isSubmitting, setIsProcessing }) {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [fingerprint, setFingerprint] = useState(null);
    const [focusedCard, setFocusedCard] = useState(false);

    useEffect(() => {
        const generateFingerprint = async () => {
            try {
                const fingerprint = await generateSimpleFingerprint();
                setFingerprint(fingerprint);
            } catch (err) {
                setFingerprint(`${Date.now()}-${Math.random()}`);
            }
        };
        generateFingerprint();
    }, []);

    const generateSimpleFingerprint = async () => {
        const components = [];
        components.push(navigator.userAgent);
        components.push(navigator.language);
        components.push(navigator.platform);
        components.push(screen.width + 'x' + screen.height);
        components.push(screen.colorDepth);
        components.push(new Date().getTimezoneOffset());
        components.push(navigator.hardwareConcurrency || 'unknown');
        components.push(navigator.deviceMemory || 'unknown');

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 50;
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("Fingerprint", 2, 15);
            components.push(canvas.toDataURL());
        } catch (e) {
            components.push('canvas-failed');
        }

        const str = components.join('||');
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            toast.error("Payment system is initializing. Please wait...");
            return;
        }

        setProcessing(true);
        setIsProcessing(true);
        setError("");

        const loadingToast = toast.loading("Processing payment and submitting your project...");

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Session expired. Please login again.", { id: loadingToast });
                setTimeout(() => router.push('/login'), 2000);
                setProcessing(false);
                setIsProcessing(false);
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';

            let clientIp = '';
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                clientIp = ipData.ip;
            } catch (err) {
                console.error("Failed to get IP:", err);
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: 2500,
                    currency: "usd",
                    fingerprint: fingerprint,
                    ip: clientIp,
                    metadata: {
                        userId: formData.userId || 'unknown',
                        projectId: formData.projectId || 'unknown',
                        email: formData.email || 'unknown'
                    }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Session expired. Please login again.");
                }
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || "Failed to initialize payment");
            }

            const data = await response.json();

            if (!data.clientSecret) {
                throw new Error("Payment initialization failed");
            }

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        email: formData.email,
                        name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
                        address: formData.address ? {
                            line1: formData.address,
                            city: formData.city,
                            country: getCountryCode(formData.country),
                        } : undefined
                    }
                },
                setup_future_usage: 'off_session'
            });

            if (stripeError) {
                toast.error(stripeError.message, { id: loadingToast });
                setError(stripeError.message);
                setProcessing(false);
                setIsProcessing(false);
            } else if (paymentIntent.status === "succeeded") {
                toast.success("Payment successful! Submitting your project...", { id: loadingToast });

                if (typeof window.gtag !== 'undefined') {
                    window.gtag('event', 'purchase', {
                        transaction_id: paymentIntent.id,
                        value: 50.00,
                        currency: 'USD',
                        payment_type: 'card'
                    });
                }

                setPaymentSuccess(true);
                await onSubmit(paymentIntent.id);

                setTimeout(() => {
                    router.push('/projects');
                }, 2000);
            }
        } catch (err) {
            console.error("Payment error:", err);
            if (err.name === 'AbortError') {
                toast.error("Payment request timed out. Please try again.", { id: loadingToast });
                setError("Payment request timed out. Please try again.");
            } else {
                toast.error(err.message || "Payment failed. Please try again or contact support.", { id: loadingToast });
                setError(err.message || "Payment failed. Please try again or contact support.");
            }
            setProcessing(false);
            setIsProcessing(false);
        }
    };

    if (paymentSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-gradient-to-br from-[#1EB97A] to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#1EB97A]/30"
                >
                    <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#1EB97A] to-emerald-500 bg-clip-text text-transparent mb-3">
                    Payment Successful!
                </h3>
                <p className="text-gray-400 mb-2">
                    Your project has been submitted and payment has been processed successfully!
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    You will receive a confirmation email shortly.
                </p>

                <div className="bg-gradient-to-r from-[#1EB97A]/10 to-emerald-500/10 rounded-xl p-5 max-w-md mx-auto border border-[#1EB97A]/20">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Loader2 className="w-5 h-5 text-[#1EB97A] animate-spin" />
                        <p className="text-sm text-[#1EB97A]">
                            Redirecting to your projects page...
                        </p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-[#1EB97A] to-emerald-500 h-1.5 rounded-full"
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "linear" }}
                        />
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-xl"
            >
                <div className="px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#1EB97A]" />
                        <h3 className="text-lg font-semibold text-white">Card Details</h3>
                    </div>
                </div>
                <div className="p-6">
                    <div
                        className={`bg-gray-800 border rounded-xl p-4 transition-all duration-300 ${focusedCard ? 'border-[#1EB97A] ring-2 ring-[#1EB97A]/20 shadow-md' : 'border-gray-700'
                            }`}
                    >
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#ffffff",
                                        "::placeholder": { color: "#6b7280" },
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        backgroundColor: "#1f2937",
                                    },
                                    invalid: {
                                        color: "#ef4444",
                                    },
                                },
                                hidePostalCode: true,
                            }}
                            onFocus={() => setFocusedCard(true)}
                            onBlur={() => setFocusedCard(false)}
                        />
                    </div>

                    {/* Security Badges */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Shield className="w-3 h-3 text-[#1EB97A]" />
                            <span>PCI Compliant</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Lock className="w-3 h-3 text-[#1EB97A]" />
                            <span>256-bit SSL</span>
                        </div>
                    </div>

                    {/* Test Card Info - Only in development */}
                    {process.env.NODE_ENV === 'development' &&
                        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test') && (
                            <div className="mt-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                <p className="text-xs font-semibold text-gray-400 mb-2">Test Card</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <code className="px-2 py-1 bg-gray-900 border border-gray-700 rounded font-mono text-gray-300">4242 4242 4242 4242</code>
                                    <code className="px-2 py-1 bg-gray-900 border border-gray-700 rounded font-mono text-gray-300">12/30</code>
                                    <code className="px-2 py-1 bg-gray-900 border border-gray-700 rounded font-mono text-gray-300">123</code>
                                </div>
                            </div>
                        )}
                </div>
            </motion.div>

            {/* Fee Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700"
            >
                <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Submission Fee</span>
                    <span className="text-2xl font-bold text-white">$50.00</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>Processing Fee</span>
                    <span>Included</span>
                </div>
                <div className="border-t border-gray-700 pt-3 mt-2">
                    <div className="flex justify-between items-center font-semibold">
                        <span className="text-gray-300">Total</span>
                        <span className="text-xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">$50.00 USD</span>
                    </div>
                </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 pt-2">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onPrev}
                    disabled={processing}
                    className="px-8 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
                >
                    ← Back
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!stripe || processing || isSubmitting}
                    className="group px-8 py-3 bg-gradient-to-r from-[#1EB97A] to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg shadow-[#1EB97A]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {processing || isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4" />
                            Pay & Submit ($50.00)
                        </>
                    )}
                </motion.button>
            </div>
        </form>
    );
}

export default function Step6Payment({ formData, updateFormData, onSubmit, onPrev, isSubmitting, isLoggedIn }) {
    const [processing, setProcessing] = useState(false);

    const getGradient = () => "from-[#1EB97A] to-emerald-600";

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1f2937',
                        color: '#fff',
                        borderRadius: '12px',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                    loading: {
                        duration: Infinity,
                    },
                }}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {/* Header Section */}
                <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#1EB97A]/20 to-emerald-500/20 border border-[#1EB97A]/30 text-[#1EB97A] text-xs font-semibold mb-4">
                        <span className="w-2 h-2 bg-[#1EB97A] rounded-full animate-pulse"></span>
                        Final Step - Step 7 of 7
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-14 h-14 bg-gradient-to-br ${getGradient()} rounded-2xl flex items-center justify-center shadow-lg shadow-[#1EB97A]/20`}>
                            <CreditCard className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Complete Payment
                            </h2>
                            <p className="text-gray-400 mt-1">Secure checkout to submit your project</p>
                        </div>
                    </div>
                </div>

                {/* Info Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-semibold text-blue-400">Secure Payment</span>
                        </div>
                        <p className="text-xs text-blue-300">256-bit SSL encryption</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-semibold text-purple-400">Quick Review</span>
                        </div>
                        <p className="text-xs text-purple-300">5-7 business days</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-semibold text-amber-400">Global Exposure</span>
                        </div>
                        <p className="text-xs text-amber-300">Reach wider audience</p>
                    </div>
                </div>

                {/* Payment Form */}
                <Elements stripe={stripePromise}>
                    <PaymentForm
                        formData={formData}
                        onSubmit={onSubmit}
                        onPrev={onPrev}
                        isSubmitting={isSubmitting}
                        setIsProcessing={setProcessing}
                    />
                </Elements>
            </motion.div>
        </>
    );
}