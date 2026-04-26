"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ currentStep, totalSteps }) {
    const progress = (currentStep / totalSteps) * 100;

    const steps = [
        { number: 1, name: "Project Info", icon: "📋" },
        { number: 2, name: "Submitter Info", icon: "👤" },
        { number: 3, name: "Credits", icon: "⭐" },
        { number: 4, name: "Media", icon: "🎥" },
        { number: 5, name: "Specifications", icon: "⚙️" },
        { number: 6, name: "Screenings", icon: "🎬" },
        { number: 7, name: "Payment", icon: "💳" }
    ];

    return (
        <div className="sticky top-0 z-40  backdrop-blur-sm border-b border-gray-800 shadow-2xl">
            <div className="p-6 md:p-8">
                {/* Step Indicators - Desktop */}
                <div className="hidden md:flex justify-between relative mb-8">
                    {/* Connecting line background */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-800 -z-0 rounded-full" />
                    
                    {/* Active connecting line */}
                    <motion.div
                        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-[#1EB97A] to-emerald-500 -z-0 rounded-full"
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />

                    {steps.map((step, index) => {
                        const isCompleted = step.number < currentStep;
                        const isCurrent = step.number === currentStep;

                        return (
                            <motion.div
                                key={step.number}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative z-10 flex flex-col items-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300
                                        ${isCompleted
                                            ? "bg-gradient-to-br from-[#1EB97A] to-emerald-600 text-white shadow-lg shadow-[#1EB97A]/30"
                                            : isCurrent
                                                ? "bg-gray-800 border-2 border-[#1EB97A] text-[#1EB97A] shadow-lg shadow-[#1EB97A]/20 ring-4 ring-[#1EB97A]/10"
                                                : "bg-gray-800 border border-gray-700 text-gray-500"}
                                    `}
                                >
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className="text-base">{step.icon}</span>
                                    )}
                                </motion.div>
                                
                                <div className="mt-3 text-center">
                                    <p className={`text-xs font-medium ${isCompleted || isCurrent ? "text-white" : "text-gray-500"}`}>
                                        {step.name}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">
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
                            <div className="w-8 h-8 bg-gradient-to-br from-[#1EB97A] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#1EB97A]/20">
                                <span className="text-white text-sm font-bold">{currentStep}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Step {currentStep} of {totalSteps}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-400 ml-10">
                            {steps[currentStep - 1]?.name}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-[#1EB97A] to-emerald-500 bg-clip-text text-transparent">
                            {Math.round(progress)}%
                        </div>
                        <p className="text-xs text-gray-500">Complete</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-3">
                    <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#1EB97A] via-emerald-500 to-teal-500 relative"
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </motion.div>
                    </div>

                    {/* Progress glow */}
                    <div
                        className="absolute -top-1 h-4 rounded-full bg-gradient-to-r from-[#1EB97A] to-emerald-500 blur-md opacity-30 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step Indicators - Mobile */}
                <div className="flex md:hidden justify-between gap-1 mt-4">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`flex-1 text-center py-2 rounded-lg transition-all duration-300 ${
                                step.number <= currentStep
                                    ? "bg-gradient-to-r from-[#1EB97A] to-emerald-600 text-white shadow-sm"
                                    : "bg-gray-800 text-gray-500"
                            }`}
                        >
                            <span className="text-xs font-medium">
                                {step.number <= currentStep ? "✓" : step.number}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

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