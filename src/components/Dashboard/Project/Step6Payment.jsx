"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Helper function to convert country name to ISO 3166-1 alpha-2 code
const getCountryCode = (countryName) => {
    if (!countryName) return null;
    
    const countryMap = {
        'United States': 'US',
        'USA': 'US',
        'United States of America': 'US',
        'United Kingdom': 'GB',
        'UK': 'GB',
        'Great Britain': 'GB',
        'Bangladesh': 'BD',
        'India': 'IN',
        'Canada': 'CA',
        'Australia': 'AU',
        'Germany': 'DE',
        'France': 'FR',
        'Spain': 'ES',
        'Italy': 'IT',
        'Mexico': 'MX',
        'Brazil': 'BR',
        'Japan': 'JP',
        'China': 'CN',
        'South Korea': 'KR',
        'Korea': 'KR',
        'Netherlands': 'NL',
        'Sweden': 'SE',
        'Norway': 'NO',
        'Denmark': 'DK',
        'Finland': 'FI',
        'Ireland': 'IE',
        'New Zealand': 'NZ',
        'Singapore': 'SG',
        'Malaysia': 'MY',
        'Thailand': 'TH',
        'Vietnam': 'VN',
        'Philippines': 'PH',
        'Indonesia': 'ID',
        'Pakistan': 'PK',
        'Sri Lanka': 'LK',
        'Nepal': 'NP',
        'South Africa': 'ZA',
        'Egypt': 'EG',
        'Nigeria': 'NG',
        'Kenya': 'KE',
        'Ghana': 'GH',
        'Turkey': 'TR',
        'Russia': 'RU',
        'Poland': 'PL',
        'Ukraine': 'UA',
        'Romania': 'RO',
        'Greece': 'GR',
        'Portugal': 'PT',
        'Belgium': 'BE',
        'Austria': 'AT',
        'Switzerland': 'CH',
        'Czech Republic': 'CZ',
        'Czechia': 'CZ',
        'Hungary': 'HU',
        'Slovakia': 'SK',
        'Croatia': 'HR',
        'Serbia': 'RS',
        'Bulgaria': 'BG',
        'Cyprus': 'CY',
        'Estonia': 'EE',
        'Latvia': 'LV',
        'Lithuania': 'LT',
        'Slovenia': 'SI',
        'Luxembourg': 'LU',
        'Malta': 'MT',
        'Iceland': 'IS',
        'Israel': 'IL',
        'Saudi Arabia': 'SA',
        'UAE': 'AE',
        'United Arab Emirates': 'AE',
        'Qatar': 'QA',
        'Kuwait': 'KW',
        'Oman': 'OM',
        'Bahrain': 'BH',
        'Jordan': 'JO',
        'Lebanon': 'LB',
        'Morocco': 'MA',
        'Tunisia': 'TN',
        'Algeria': 'DZ',
        'Argentina': 'AR',
        'Chile': 'CL',
        'Colombia': 'CO',
        'Peru': 'PE',
        'Venezuela': 'VE',
        'Uruguay': 'UY',
        'Paraguay': 'PY',
        'Ecuador': 'EC',
        'Bolivia': 'BO',
        'Costa Rica': 'CR',
        'Panama': 'PA',
        'Dominican Republic': 'DO',
        'Puerto Rico': 'PR',
        'Jamaica': 'JM',
        'Trinidad and Tobago': 'TT',
        'Bahamas': 'BS',
        'Barbados': 'BB',
        'Fiji': 'FJ',
        'Papua New Guinea': 'PG'
    };
    
    // Try exact match first
    if (countryMap[countryName]) {
        return countryMap[countryName];
    }
    
    // Try case-insensitive match
    const lowerCountry = countryName.toLowerCase();
    for (const [key, value] of Object.entries(countryMap)) {
        if (key.toLowerCase() === lowerCountry) {
            return value;
        }
    }
    
    return null;
};

function PaymentForm({ formData, onSubmit, onPrev, isSubmitting }) {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(3);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements) {
            setError("Stripe is not loaded yet. Please try again.");
            return;
        }

        setProcessing(true);
        setError("");

        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError("Please login to continue");
                setProcessing(false);
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            
            // Create payment intent on your backend server
            const response = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ amount: 2500, currency: "usd" })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || "Failed to create payment intent");
            }

            const data = await response.json();
            const clientSecret = data.clientSecret;

            if (!clientSecret) {
                throw new Error("No client secret received");
            }

            // Get cardholder name from formData
            const cardholderName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.fullName || formData.name || 'Cardholder';
            const userEmail = formData.email || 'customer@example.com';

            // Prepare billing details
            const billingDetails = {
                email: userEmail,
                name: cardholderName,
            };

            // Add address only if we have valid data
            const address = {};
            if (formData.address && formData.address.trim()) {
                address.line1 = formData.address.trim();
            }
            if (formData.city && formData.city.trim()) {
                address.city = formData.city.trim();
            }
            if (formData.country && formData.country.trim()) {
                const countryCode = getCountryCode(formData.country);
                if (countryCode) {
                    address.country = countryCode;
                }
            }
            
            if (Object.keys(address).length > 0) {
                billingDetails.address = address;
            }

            // Confirm payment
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: billingDetails
                }
            });

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false);
            } else if (paymentIntent.status === "succeeded") {
                setPaymentSuccess(true);
                // Call the parent submit handler with payment intent ID
                await onSubmit(paymentIntent.id);
                
                // Start countdown for redirect
                let countdown = 3;
                const interval = setInterval(() => {
                    countdown--;
                    setRedirectCountdown(countdown);
                    if (countdown === 0) {
                        clearInterval(interval);
                        router.push('/projects');
                    }
                }, 1000);
            }
        } catch (err) {
            console.error("Payment error:", err);
            setError(err.message || "Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    if (paymentSuccess) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful! 🎉</h3>
                <p className="text-gray-600 mb-4">Your submission has been received successfully.</p>
                <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                        Redirecting to your projects page in <span className="font-bold">{redirectCountdown}</span> seconds...
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
                        <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-1000"
                            style={{ width: `${(3 - redirectCountdown) * 33.33}%` }}
                        ></div>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/projects')}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                    Click here if not redirected automatically →
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": { color: "#aab7c4" },
                                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                                },
                                invalid: {
                                    color: "#9e2146",
                                },
                            },
                            hidePostalCode: true,
                        }}
                    />
                </div>
                {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Submission Fee</p>
                        <p className="text-xs text-gray-500">Non-refundable</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">$25.00</p>
                        <p className="text-xs text-gray-500">USD</p>
                    </div>
                </div>
            </div>

            {/* Test Card Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Test Card for Payment:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                    <code className="px-2 py-1 bg-gray-200 rounded">4242 4242 4242 4242</code>
                    <span className="text-gray-500">|</span>
                    <code className="px-2 py-1 bg-gray-200 rounded">12/30</code>
                    <span className="text-gray-500">|</span>
                    <code className="px-2 py-1 bg-gray-200 rounded">123</code>
                </div>
                <p className="text-xs text-gray-400 mt-2">Use any future expiry date and any 3-digit CVC</p>
            </div>

            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={processing}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                    ← Previous
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing || isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition flex items-center gap-2"
                >
                    {processing || isSubmitting ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        "Pay & Submit"
                    )}
                </button>
            </div>
        </form>
    );
}

export default function Step6Payment({ formData, updateFormData, onSubmit, onPrev, isSubmitting }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
                <p className="text-gray-600 mt-1">Complete your submission with payment</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Important Information
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1 ml-2">
                    <li>• Payment is required to complete your submission</li>
                    <li>• Submission fees are non-refundable</li>
                    <li>• You will receive a confirmation email after successful payment</li>
                    <li>• Your project will be reviewed within 5-7 business days</li>
                </ul>
            </div>

            <Elements stripe={stripePromise}>
                <PaymentForm
                    formData={formData}
                    onSubmit={onSubmit}
                    onPrev={onPrev}
                    isSubmitting={isSubmitting}
                />
            </Elements>
        </div>
    );
}