"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ currentStep, totalSteps }) {
    const progress = (currentStep / totalSteps) * 100;

    const steps = [
        { number: 1, name: "Project Info", icon: "📋" },
        { number: 2, name: "Submitter Info", icon: "👤" },
        { number: 3, name: "Credits", icon: "⭐" },
        { number: 4, name: "Specifications", icon: "⚙️" },
        { number: 5, name: "Screenings", icon: "🎬" },
        { number: 6, name: "Payment", icon: "💳" }
    ];

    return (
        <div className="sticky top-0 z-40 bg-linear-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100 shadow-sm">
            <div className="p-6 md:p-8">
                {/* Step Indicators - Desktop */}
                <div className="hidden md:flex justify-between relative">
                    {/* Connecting line */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
                    <div
                        className="absolute top-4 left-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300 -z-0"
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    />

                    {steps.map((step, index) => {
                        const isCompleted = step.number < currentStep;
                        const isCurrent = step.number === currentStep;
                        const isUpcoming = step.number > currentStep;

                        return (
                            <motion.div
                                key={step.number}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative z-10 flex flex-col items-center"
                            >
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                        ${isCompleted
                                            ? "bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                                            : isCurrent
                                                ? "bg-white border-2 border-purple-500 text-purple-600 shadow-lg ring-4 ring-purple-100"
                                                : "bg-white border-2 border-gray-200 text-gray-400"}
                                    `}
                                >
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.icon
                                    )}
                                </div>
                                <div className="mt-2 text-center">
                                    <p className={`text-xs font-medium ${isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                                        {step.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        Step {step.number}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                {/* Header Section */}
                <div className="flex justify-between items-center mb-3 mt-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                                <span className="text-white text-sm font-bold">{currentStep}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Step {currentStep} of {totalSteps}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-500 ml-10">
                            {steps[currentStep - 1]?.name}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {Math.round(progress)}%
                        </div>
                        <p className="text-xs text-gray-400">Complete</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-3">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 relative"
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </motion.div>
                    </div>

                    {/* Progress glow */}
                    <div
                        className="absolute -top-1 h-4 rounded-full bg-linear-to-r from-blue-500 to-purple-500 blur-md opacity-30 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>



                {/* Step Indicators - Mobile */}
                <div className="flex md:hidden justify-between gap-1">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`flex-1 text-center py-2 rounded-lg transition-all duration-300 ${step.number <= currentStep
                                    ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-sm"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                        >
                            <span className="text-xs font-medium">
                                {step.number <= currentStep ? "✓" : step.number}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add this to your global CSS or use inline styles for animation */}
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}