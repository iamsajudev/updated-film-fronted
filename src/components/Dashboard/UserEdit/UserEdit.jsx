"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const UserEdit = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userId, setUserId] = useState(null);
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        status: 'active',
        isActive: true,
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        bio: '',
        website: '',
        company: '',
        position: '',
        profileImage: '',
        profileImageBase64: '',
        socialMedia: {
            twitter: '',
            facebook: '',
            linkedin: '',
            instagram: ''
        },
        preferences: {
            emailNotifications: true,
            pushNotifications: false,
            language: 'en',
            timezone: 'UTC'
        }
    });

    const [imagePreview, setImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    // Get user ID from URL
    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        setUserId(id);
        fetchUser(id);
    }, []);

    // Fetch user data
    const fetchUser = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                router.push('/login');
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';
            const response = await fetch(`${API_URL}/api/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const data = await response.json();
            const user = data.data || data.user || data;
            
            setFormData({
                name: user.name || '',
                fullName: user.fullName || user.name || '',
                username: user.username || '',
                email: user.email || '',
                password: '',
                confirmPassword: '',
                role: user.role || 'user',
                status: user.status || (user.isActive ? 'active' : 'inactive'),
                isActive: user.isActive !== undefined ? user.isActive : true,
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                zipCode: user.zipCode || '',
                country: user.country || '',
                bio: user.bio || '',
                website: user.website || '',
                company: user.company || '',
                position: user.position || '',
                profileImage: user.profileImage || user.avatar || '',
                profileImageBase64: '',
                socialMedia: {
                    twitter: user.socialMedia?.twitter || '',
                    facebook: user.socialMedia?.facebook || '',
                    linkedin: user.socialMedia?.linkedin || '',
                    instagram: user.socialMedia?.instagram || ''
                },
                preferences: {
                    emailNotifications: user.preferences?.emailNotifications !== false,
                    pushNotifications: user.preferences?.pushNotifications || false,
                    language: user.preferences?.language || 'en',
                    timezone: user.preferences?.timezone || 'UTC'
                }
            });
            
            if (user.profileImage || user.avatar) {
                setImagePreview(user.profileImage || user.avatar);
            }
            
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    // Handle image upload and convert to base64
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }
            
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size should be less than 2MB');
                return;
            }
            
            setUploadingImage(true);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImagePreview(base64String);
                setFormData(prev => ({
                    ...prev,
                    profileImageBase64: base64String,
                    profileImage: '' // Clear the URL if base64 is used
                }));
                setUploadingImage(false);
            };
            reader.onerror = () => {
                setError('Failed to read image file');
                setUploadingImage(false);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const removeImage = () => {
        setImagePreview('');
        setFormData(prev => ({
            ...prev,
            profileImageBase64: '',
            profileImage: ''
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Handle social media changes
    const handleSocialChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [platform]: value
            }
        }));
    };

    // Handle preferences changes
    const handlePreferenceChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: value
            }
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        // Validate passwords if being changed
        if (formData.password) {
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                setSubmitting(false);
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                setSubmitting(false);
                return;
            }
        }

        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                router.push('/login');
                return;
            }

            // Prepare data for API (remove confirmPassword and empty password if not changed)
            const submitData = { ...formData };
            delete submitData.confirmPassword;
            if (!submitData.password) {
                delete submitData.password;
            }
            
            // If base64 image is present, use it; otherwise keep existing profileImage
            if (submitData.profileImageBase64) {
                submitData.profileImage = submitData.profileImageBase64;
                delete submitData.profileImageBase64;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';
            const response = await fetch(`${API_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update user');
            }

            setSuccess('User updated successfully!');
            
            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/admin/all-users?success=User updated successfully');
            }, 2000);
            
        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.message || 'Failed to update user');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/admin/all-users" 
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
                            <p className="text-gray-600 mt-1">Update user information and profile</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-green-600 text-sm">{success}</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-emerald-600 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h2>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Profile preview"
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 hover:bg-emerald-600 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {formData.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="profile-image"
                                />
                                <label
                                    htmlFor="profile-image"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Upload Image
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                    JPG, PNG or GIF. Max size 2MB.
                                </p>
                                {uploadingImage && (
                                    <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-emerald-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-emerald-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
                        <p className="text-sm text-gray-500 mb-4">Leave blank to keep current password</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role and Status */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Role & Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter street address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter city"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter state"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter ZIP code"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter country"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position
                                </label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter job position"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter user bio"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Twitter
                                </label>
                                <input
                                    type="text"
                                    value={formData.socialMedia.twitter}
                                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Twitter username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Facebook
                                </label>
                                <input
                                    type="text"
                                    value={formData.socialMedia.facebook}
                                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Facebook profile"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    LinkedIn
                                </label>
                                <input
                                    type="text"
                                    value={formData.socialMedia.linkedin}
                                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="LinkedIn profile"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instagram
                                </label>
                                <input
                                    type="text"
                                    value={formData.socialMedia.instagram}
                                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Instagram username"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                                    <p className="text-xs text-gray-500">Receive email notifications about account activity</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.preferences.emailNotifications}
                                        onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                                    <p className="text-xs text-gray-500">Receive push notifications in browser</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.preferences.pushNotifications}
                                        onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <select
                                        value={formData.preferences.language}
                                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="zh">Chinese</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timezone
                                    </label>
                                    <select
                                        value={formData.preferences.timezone}
                                        onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="EST">Eastern Time</option>
                                        <option value="CST">Central Time</option>
                                        <option value="MST">Mountain Time</option>
                                        <option value="PST">Pacific Time</option>
                                        <option value="GMT">GMT</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving Changes...
                                </>
                            ) : (
                                'Save All Changes'
                            )}
                        </button>
                        <Link
                            href="/admin/all-users"
                            className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>

                {/* Danger Zone */}
                <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">Danger Zone</h3>
                    <p className="text-sm text-emerald-600 mb-4">
                        Once you delete a user, there is no going back. Please be certain.
                    </p>
                    <button
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                                try {
                                    const token = localStorage.getItem('token');
                                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';
                                    const response = await fetch(`${API_URL}/api/users/${userId}`, {
                                        method: 'DELETE',
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'Content-Type': 'application/json'
                                        }
                                    });
                                    
                                    if (response.ok) {
                                        router.push('/admin/all-users?success=User deleted successfully');
                                    } else {
                                        throw new Error('Failed to delete user');
                                    }
                                } catch (error) {
                                    alert('Failed to delete user: ' + error.message);
                                }
                            }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserEdit;