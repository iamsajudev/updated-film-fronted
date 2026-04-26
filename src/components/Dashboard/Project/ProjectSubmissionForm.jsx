"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Step1ProjectInfo from "./Step1ProjectInfo";
import Step2SubmitterInfo from "./Step2SubmitterInfo";
import Step3Credits from "./Step3Credits";
import Step4Specifications from "./Step4Specifications";
import Step5Screenings from "./Step5Screenings";
import Step6Payment from "./Step6Payment";
import ProgressBar from "./ProgressBar";
import Step4Media from "./Step4Media";

export default function ProjectSubmissionForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Project Information
        projectType: "",
        projectTitle: "",
        briefSynopsis: "",
        hasNonEnglishTitle: false,
        nonEnglishTitle: "",
        nonEnglishSynopsis: "",
        website: "",
        twitter: "",
        facebook: "",
        instagram: "",

        // Step 2: Submitter Information
        email: "",
        phone: "",
        address: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        country: "",
        birthDate: "",
        gender: "",
        pronouns: "",

        // Step 3: Credits
        directors: [{ firstName: "", middleName: "", lastName: "", priorCredits: "" }],
        writers: [{ firstName: "", middleName: "", lastName: "", priorCredits: "" }],
        producers: [{ firstName: "", middleName: "", lastName: "", priorCredits: "" }],
        keyCast: [{ firstName: "", middleName: "", lastName: "", role: "", priorCredits: "" }],

        // Step 4: Media (new)
        mediaLink: "",
        uploadedImage: null,
        uploadedImageFile: null,

        // Step 5: Specifications
        projectTypes: [],
        genres: "",
        runtimeHours: "00",
        runtimeMinutes: "00",
        runtimeSeconds: "00",
        completionDate: "",
        productionBudget: "",
        countryOfOrigin: "",
        countryOfFilming: "",
        language: "en",
        shootingFormat: "",
        aspectRatio: "16:9",
        filmColor: "Color",
        studentProject: "No",
        firstTimeFilmmaker: "No",

        // Step 6: Screenings
        screenings: [],
        distributors: [],
    });

    const updateFormData = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    // Update the validateStep function:
    const validateStep = () => {
        if (currentStep === 1) {
            if (!formData.projectType || !formData.projectTitle || !formData.briefSynopsis) {
                alert("Please fill in all required fields in Project Information");
                return false;
            }
        }
        if (currentStep === 2) {
            if (!formData.email || !formData.country) {
                alert("Please fill in all required fields in Submitter Information");
                return false;
            }
        }
        if (currentStep === 4) {
            if (!formData.mediaLink && !formData.uploadedImage) {
                alert("Please provide either a media link (YouTube/Vimeo) or upload a poster image");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, 7)); // Changed from 6 to 7
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (paymentIntentId) => {
        setIsSubmitting(true);

        try {
            const submissionData = {
                ...formData,
                paymentIntentId,
                submittedAt: new Date().toISOString(),
                title: formData.projectTitle,
                description: formData.briefSynopsis,
                category: formData.projectType,
                director: formData.directors?.[0]?.firstName + ' ' + formData.directors?.[0]?.lastName || 'Not specified',
                year: formData.completionDate ? new Date(formData.completionDate).getFullYear() : null,
                genre: formData.genres,
            };

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/projects/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                if (data.authToken) {
                    localStorage.setItem('token', data.authToken);
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }

                    window.dispatchEvent(new CustomEvent('authChanged', {
                        detail: { token: data.authToken, user: data.user }
                    }));
                }

                router.push(`/projects?success=true&projectId=${data.projectId}`);
            } else {
                throw new Error(data.message || 'Submission failed');
            }

        } catch (error) {
            alert(error.message || "There was an error submitting your project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepTitles = [
        "Project Information",
        "Submitter Information",
        "Credits",
        "Media",
        "Specifications",
        "Screenings",
        "Payment"
    ];

    // Define stepProps before using it
    const stepProps = {
        formData,
        updateFormData,
        onNext: nextStep,
        onPrev: prevStep,
    };

    // Update the renderStep function:
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1ProjectInfo {...stepProps} />;
            case 2:
                return <Step2SubmitterInfo {...stepProps} />;
            case 3:
                return <Step3Credits {...stepProps} />;
            case 4:  // Media Step
                return <Step4Media {...stepProps} />;
            case 5:
                return <Step4Specifications {...stepProps} />;
            case 6:
                return <Step5Screenings {...stepProps} />;
            case 7:
                return <Step6Payment
                    formData={formData}
                    updateFormData={updateFormData}
                    onSubmit={handleSubmit}
                    onPrev={prevStep}
                    isSubmitting={isSubmitting}
                    isLoggedIn={true}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#1EB97A] to-white bg-clip-text text-transparent">
                            Submit Your Project
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#1EB97A] to-emerald-500 mx-auto rounded-full mt-4 mb-6" />
                        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                            Complete the form below to submit your project for consideration.
                            Our team will review your submission and get back to you shortly.
                        </p>
                    </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <ProgressBar currentStep={currentStep} totalSteps={7} />

                    {/* Step Title */}
                    <div className="flex justify-between mt-4 px-2">
                        {stepTitles.map((title, index) => (
                            <div
                                key={index}
                                className={`
                                    hidden lg:block text-xs font-medium transition-colors duration-300
                                    ${index + 1 === currentStep
                                        ? "text-[#1EB97A] font-semibold"
                                        : index + 1 < currentStep
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                    }
                                `}
                            >
                                {title}
                            </div>
                        ))}
                        <div className="lg:hidden text-center">
                            <span className="text-[#1EB97A] font-semibold">Step {currentStep}</span>
                            <span className="text-gray-500 mx-2">/</span>
                            <span className="text-gray-400">7</span>
                            <span className="text-gray-500 ml-2">—</span>
                            <span className="text-gray-300 ml-2">{stepTitles[currentStep - 1]}</span>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
                >
                    <div className="relative">
                        {/* Decorative gradient line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1EB97A] via-emerald-500 to-transparent" />

                        {/* Form Content */}
                        <div className="p-6 sm:p-8 lg:p-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    {renderStep()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Help Text */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        Need help? <button className="text-[#1EB97A] hover:text-emerald-400 transition-colors">Contact Support</button>
                    </p>
                </div>
            </div>
        </div>
    );
}