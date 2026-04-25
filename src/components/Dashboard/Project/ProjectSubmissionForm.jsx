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
        language: "en",
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

            console.log('Submitting project data:', submissionData.projectTitle);

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
                console.log('Project submitted successfully!');
                
                // Auto-login: Save token and user data to localStorage
                if (data.authToken) {
                    localStorage.setItem('token', data.authToken);
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                    
                    // Dispatch auth events for other components
                    window.dispatchEvent(new CustomEvent('authChanged', { 
                        detail: { token: data.authToken, user: data.user } 
                    }));
                    
                    console.log('Auto-login successful!');
                    
                    // Show appropriate success message
                    if (data.user?.isNewUser) {
                        alert('Account created and project submitted successfully! You are now logged in.');
                    } else {
                        alert('Project submitted successfully! You are now logged in.');
                    }
                } else {
                    alert('Your project has been submitted successfully!');
                }
                
                // Redirect to projects page
                router.push(`/projects?success=true&projectId=${data.projectId}`);
            } else {
                throw new Error(data.message || 'Submission failed');
            }

        } catch (error) {
            console.error("Submission error:", error);
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
                        isLoggedIn={true}
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