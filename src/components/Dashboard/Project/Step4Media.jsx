// Step4Media.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Step4Media({ formData, updateFormData, onNext, onPrev }) {
    const [mediaLink, setMediaLink] = useState(formData.mediaLink || "");
    const [uploadedImage, setUploadedImage] = useState(formData.uploadedImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            setError("Please upload a valid image (JPEG, PNG, WEBP, or GIF)");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        setError("");
        setIsUploading(true);

        // Convert to base64 for preview and storage
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setUploadedImage(base64String);
            updateFormData({
                uploadedImage: base64String,
                uploadedImageFile: file,
                posterMetadata: {
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type,
                    uploadedAt: new Date().toISOString()
                }
            });
            setIsUploading(false);
        };
        reader.onerror = () => {
            setError("Failed to read image file");
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setUploadedImage(null);
        updateFormData({ 
            uploadedImage: "",  // Use empty string instead of null for consistency
            uploadedImageFile: null,
            posterMetadata: {}
        });
    };

    const handleMediaLinkChange = (e) => {
        const value = e.target.value;
        setMediaLink(value);
        updateFormData({ mediaLink: value });
    };

    const handleNext = () => {
        // Validation - at least one media field is required
        if (!mediaLink && !uploadedImage) {
            setError("Please provide either a media link (YouTube/Vimeo) or upload a poster image");
            return;
        }

        // Validate YouTube/Vimeo URL format if provided
        if (mediaLink && !isValidMediaUrl(mediaLink)) {
            setError("Please enter a valid YouTube or Vimeo URL");
            return;
        }

        setError("");
        onNext();
    };

    const isValidMediaUrl = (url) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/;
        return youtubeRegex.test(url) || vimeoRegex.test(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Media & Visuals</h2>
                <p className="text-sm text-gray-400">
                    Add your project trailer/sizzle reel and a poster image to showcase your work.
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-[#1EB97A] to-emerald-500 rounded-full mt-2" />
            </div>

            {/* Media Link Field */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                    Media Link <span className="text-gray-500">(YouTube or Vimeo)</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <input
                        type="url"
                        value={mediaLink}
                        onChange={handleMediaLinkChange}
                        placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1EB97A]/50 focus:border-[#1EB97A] transition-all"
                    />
                </div>
                <p className="text-xs text-gray-500">
                    Paste your YouTube or Vimeo video URL. This will be used as your project trailer.
                </p>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-gray-900 text-gray-500">OR</span>
                </div>
            </div>

            {/* Image Upload Field */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                    Poster / Thumbnail Image
                </label>

                {!uploadedImage ? (
                    <div className="relative">
                        <label
                            htmlFor="image-upload"
                            className={`
                                flex flex-col items-center justify-center w-full h-64 
                                border-2 border-dashed border-gray-700 rounded-xl cursor-pointer
                                hover:border-[#1EB97A] hover:bg-gray-800/50 transition-all duration-300
                                ${isUploading ? "opacity-50 cursor-wait" : ""}
                            `}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {isUploading ? (
                                    <>
                                        <svg className="w-10 h-10 text-[#1EB97A] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-400">Uploading...</p>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-10 h-10 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-400">
                                            <span className="font-semibold text-[#1EB97A]">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, WEBP or GIF (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                        </label>
                    </div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                    >
                        <div className="relative rounded-xl overflow-hidden bg-gray-800">
                            <img
                                src={uploadedImage}
                                alt="Uploaded poster"
                                className="w-full h-64 object-contain"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                <button
                                    onClick={removeImage}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
                                >
                                    Remove Image
                                </button>
                                <label
                                    htmlFor="image-upload-replace"
                                    className="px-4 py-2 bg-[#1EB97A] hover:bg-emerald-700 text-white rounded-lg font-medium cursor-pointer transition-all duration-200"
                                >
                                    Replace
                                </label>
                                <input
                                    id="image-upload-replace"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                <p className="text-xs text-gray-500">
                    Upload a poster or thumbnail image for your project. This will be displayed alongside your project.
                </p>
            </div>

            {/* Preview Section */}
            {(mediaLink || uploadedImage) && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                >
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Preview</h3>
                    <div className="flex gap-4 flex-wrap">
                        {mediaLink && (
                            <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-[#1EB97A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                </svg>
                                <span className="text-gray-400">Media link added:</span>
                                <a 
                                    href={mediaLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[#1EB97A] hover:text-emerald-400 truncate max-w-[200px] transition-colors"
                                >
                                    {mediaLink.length > 40 ? mediaLink.substring(0, 40) + '...' : mediaLink}
                                </a>
                            </div>
                        )}
                        {uploadedImage && (
                            <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-[#1EB97A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-400">Poster image uploaded</span>
                                <button
                                    onClick={() => window.open(uploadedImage, '_blank')}
                                    className="text-xs text-[#1EB97A] hover:text-emerald-400 transition-colors"
                                >
                                    View
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                    <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
                <button
                    onClick={onPrev}
                    className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all duration-200"
                >
                    ← Previous
                </button>
                <button
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#1EB97A] to-emerald-600 hover:from-[#189663] hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#1EB97A]/20"
                >
                    Next Step →
                </button>
            </div>
        </motion.div>
    );
}