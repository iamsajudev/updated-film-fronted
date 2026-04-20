"use client";

export default function ProgressBar({ currentStep, totalSteps }) {
    const progress = (currentStep / totalSteps) * 100;
    
    const steps = [
        { number: 1, name: "Project Info" },
        { number: 2, name: "Submitter Info" },
        { number: 3, name: "Credits" },
        { number: 4, name: "Specifications" },
        { number: 5, name: "Screenings" },
        { number: 6, name: "Payment" }
    ];

    return (
        <div className="border-b border-gray-200">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700">
                            Step {currentStep} of {totalSteps}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {steps[currentStep - 1]?.name}
                        </p>
                    </div>
                    <div className="text-sm font-semibold text-blue-600">
                        {Math.round(progress)}% Complete
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step Indicators */}
                <div className="flex justify-between mt-4">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`flex flex-col items-center ${
                                step.number <= currentStep
                                    ? "text-blue-600"
                                    : "text-gray-400"
                            }`}
                        >
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                    step.number < currentStep
                                        ? "bg-blue-600 text-white"
                                        : step.number === currentStep
                                        ? "border-2 border-blue-600 text-blue-600"
                                        : "border-2 border-gray-300 text-gray-400"
                                }`}
                            >
                                {step.number < currentStep ? "✓" : step.number}
                            </div>
                            <span className="text-xs mt-1 hidden md:block">
                                {step.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}