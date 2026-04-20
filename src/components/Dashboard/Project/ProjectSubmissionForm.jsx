"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1ProjectInfo from "./Step1ProjectInfo";
import Step2SubmitterInfo from "./Step2SubmitterInfo";
import Step3Credits from "./Step3Credits";
import Step4Specifications from "./Step4Specifications";
import Step5Screenings from "./Step5Screenings";
import Step6Payment from "./Step6Payment";
import ProgressBar from "./ProgressBar";

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

        // Step 4: Specifications
        projectTypes: [],
        genres: "",
        runtimeHours: "00",
        runtimeMinutes: "00",
        runtimeSeconds: "00",
        completionDate: "",
        productionBudget: "",
        countryOfOrigin: "",
        countryOfFilming: "",
        language: "en", // Default to English
        shootingFormat: "",
        aspectRatio: "16:9",
        filmColor: "Color",
        studentProject: "No",
        firstTimeFilmmaker: "No",

        // Step 5: Screenings
        screenings: [],
        distributors: [],
    });

    const updateFormData = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        // Validate required fields before proceeding
        if (currentStep === 1) {
            if (!formData.projectType || !formData.projectTitle || !formData.briefSynopsis) {
                alert("Please fill in all required fields in Project Information");
                return;
            }
        }
        if (currentStep === 2) {
            if (!formData.email || !formData.country) {
                alert("Please fill in all required fields in Submitter Information");
                return;
            }
        }
        setCurrentStep((prev) => Math.min(prev + 1, 6));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // Helper function to validate and fix language code
    const getValidLanguageCode = (language) => {
        if (!language) return "en";

        // Map common language names to ISO codes
        const languageMap = {
            'english': 'en',
            'spanish': 'es',
            'french': 'fr',
            'german': 'de',
            'italian': 'it',
            'portuguese': 'pt',
            'chinese': 'zh',
            'japanese': 'ja',
            'korean': 'ko',
            'hindi': 'hi',
            'bengali': 'bn',
            'arabic': 'ar',
            'russian': 'ru',
            'turkish': 'tr',
            'dutch': 'nl',
            'polish': 'pl',
            'swedish': 'sv',
            'danish': 'da',
            'finnish': 'fi',
            'norwegian': 'no',
            'greek': 'el',
            'czech': 'cs',
            'hungarian': 'hu',
            'romanian': 'ro',
            'vietnamese': 'vi',
            'thai': 'th',
            'indonesian': 'id',
            'malay': 'ms',
            'hebrew': 'he',
            'arabic': 'ar'
        };

        const lowerLang = language.toLowerCase().trim();

        // If it's already a valid ISO code (2 chars)
        if (lowerLang.length === 2 && /^[a-z]{2}$/.test(lowerLang)) {
            return lowerLang;
        }

        // Try to map from language name
        if (languageMap[lowerLang]) {
            return languageMap[lowerLang];
        }

        // Default to English
        console.warn(`Unrecognized language: ${language}, defaulting to 'en'`);
        return "en";
    };

    const handleSubmit = async (paymentIntentId) => {
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Please login to submit your project');
                router.push('/login');
                return;
            }

            // Send ALL form data, not just mapped fields
            const submissionData = {
                // Send the entire formData
                ...formData,

                // Add payment info
                paymentIntentId,
                submittedAt: new Date().toISOString(),

                // Also include mapped fields for backend compatibility
                title: formData.projectTitle,
                description: formData.briefSynopsis,
                category: formData.projectType,
                director: formData.directors?.[0]?.firstName + ' ' + formData.directors?.[0]?.lastName || 'Not specified',
                year: formData.completionDate ? new Date(formData.completionDate).getFullYear() : null,
                genre: formData.genres,
            };

            console.log('Submitting complete data:', submissionData);

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.nybff.us';

            const response = await fetch(`${API_URL}/api/projects/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log('All project data saved successfully!');
                router.push(`/dashboard?success=true&projectId=${data.project?._id}`);
            } else {
                throw new Error(data.message || 'Submission failed');
            }

        } catch (error) {
            console.error("Error:", error);
            alert(error.message || "There was an error submitting your project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };



    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1ProjectInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <Step2SubmitterInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 3:
                return (
                    <Step3Credits
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 4:
                return (
                    <Step4Specifications
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 5:
                return (
                    <Step5Screenings
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 6:
                return (
                    <Step6Payment
                        formData={formData}
                        updateFormData={updateFormData}
                        onSubmit={handleSubmit}
                        onPrev={prevStep}
                        isSubmitting={isSubmitting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <ProgressBar currentStep={currentStep} totalSteps={6} />
            <div className="p-6">
                {renderStep()}
            </div>
        </div>
    );
}