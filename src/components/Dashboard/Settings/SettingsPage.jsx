"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Loader2,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    Trash2,
    X
} from 'lucide-react';

const SettingsPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    
    // User Data State
    const [user, setUser] = useState({
        id: '',
        name: '',
        fullName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: 'Other',
        pronouns: 'Custom',
        birthdate: {
            year: '',
            month: '',
            day: ''
        },
        timezone: '(GMT+06:00) Dhaka Time',
        currency: 'BDT',
        isEmailVerified: false,
        profileImage: ''
    });

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Form state for editing
    const [editForm, setEditForm] = useState({ ...user });

    // Fetch user data on mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                router.push('/login');
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            const userData = data.data || data.user || data;
            
            // Parse name into first and last name
            const fullName = userData.fullName || userData.name || '';
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Parse birthdate if exists
            let birthdate = { year: '', month: '', day: '' };
            if (userData.birthdate) {
                const date = new Date(userData.birthdate);
                birthdate = {
                    year: date.getFullYear().toString(),
                    month: (date.getMonth() + 1).toString(),
                    day: date.getDate().toString()
                };
            }
            
            setUser({
                id: userData.id || userData._id,
                name: fullName,
                fullName: fullName,
                firstName: firstName,
                lastName: lastName,
                email: userData.email || '',
                phone: userData.phone || '',
                gender: userData.gender || 'Other',
                pronouns: userData.pronouns || 'Custom',
                birthdate: birthdate,
                timezone: userData.timezone || '(GMT+06:00) Dhaka Time',
                currency: userData.currency || 'BDT',
                isEmailVerified: userData.isEmailVerified || false,
                profileImage: userData.profileImage || userData.avatar || ''
            });
            
            setEditForm({
                id: userData.id || userData._id,
                name: fullName,
                fullName: fullName,
                firstName: firstName,
                lastName: lastName,
                email: userData.email || '',
                phone: userData.phone || '',
                gender: userData.gender || 'Other',
                pronouns: userData.pronouns || 'Custom',
                birthdate: birthdate,
                timezone: userData.timezone || '(GMT+06:00) Dhaka Time',
                currency: userData.currency || 'BDT',
                isEmailVerified: userData.isEmailVerified || false,
                profileImage: userData.profileImage || userData.avatar || ''
            });
            
            if (userData.profileImage || userData.avatar) {
                setAvatarPreview(userData.profileImage || userData.avatar);
            }
            
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    // Handle avatar upload
    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size should be less than 2MB');
                return;
            }
            
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setEditForm(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setEditForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle birthdate change
    const handleBirthdateChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            birthdate: { ...prev.birthdate, [field]: value }
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            
            // Prepare data for API
            const submitData = {
                fullName: `${editForm.firstName} ${editForm.lastName}`.trim(),
                name: `${editForm.firstName} ${editForm.lastName}`.trim(),
                phone: editForm.phone,
                gender: editForm.gender,
                pronouns: editForm.pronouns,
                timezone: editForm.timezone,
                currency: editForm.currency
            };
            
            // Add birthdate if all fields are filled
            if (editForm.birthdate.year && editForm.birthdate.month && editForm.birthdate.day) {
                const birthdate = new Date(
                    parseInt(editForm.birthdate.year),
                    parseInt(editForm.birthdate.month) - 1,
                    parseInt(editForm.birthdate.day)
                );
                submitData.birthdate = birthdate.toISOString();
            }
            
            // Add avatar if changed
            if (avatarFile) {
                const reader = new FileReader();
                const base64String = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(avatarFile);
                });
                submitData.profileImage = base64String;
            }
            
            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }
            
            setSuccess('Settings updated successfully!');
            
            // Refresh user data
            await fetchUserProfile();
            
            setTimeout(() => {
                setSuccess('');
            }, 3000);
            
        } catch (error) {
            console.error('Error updating settings:', error);
            setError(error.message || 'Failed to update settings');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle password change
    const handlePasswordChange = async () => {
        if (!passwordData.currentPassword) {
            setError('Current password is required');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        
        setSubmitting(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            
            const response = await fetch(`${API_URL}/api/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }
            
            setSuccess('Password changed successfully!');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            
            setTimeout(() => {
                setSuccess('');
            }, 3000);
            
        } catch (error) {
            console.error('Error changing password:', error);
            setError(error.message || 'Failed to change password');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        setSubmitting(true);
        
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            
            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            
            // Clear local storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login?message=Account deleted successfully');
            
        } catch (error) {
            console.error('Error deleting account:', error);
            setError(error.message || 'Failed to delete account');
            setShowDeleteModal(false);
        } finally {
            setSubmitting(false);
        }
    };

    // Years for birthdate dropdown
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                    <p className="mt-4 text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
                
                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <p className="text-green-700 font-medium">{success}</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <h1 className="text-3xl font-light text-gray-700 mb-10">My Account</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    {/* Left Column: Avatar */}
                    <div className="md:col-span-4 space-y-4">
                        <label className="block text-sm font-bold text-gray-600 uppercase tracking-tight">Avatar</label>
                        <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm mb-4 bg-gray-100">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                                    {editForm.firstName?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                        <p className="text-xs text-gray-400">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>

                    {/* Right Column: Fields */}
                    <div className="md:col-span-8 space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Name</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={editForm.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First name"
                                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded outline-none focus:border-blue-500 text-sm"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={editForm.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last name"
                                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Email</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    value={user.email}
                                    className="flex-1 px-3 py-2 border text-gray-500 border-gray-300 rounded outline-none focus:border-blue-500 text-sm bg-gray-50"
                                    disabled
                                />
                                <button
                                    type="button"
                                    className="text-black bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded text-xs font-bold whitespace-nowrap uppercase transition"
                                >
                                    Change Email
                                </button>
                            </div>
                            {!user.isEmailVerified && (
                                <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:underline mt-2"
                                >
                                    Confirm your email
                                </button>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Phone number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={editForm.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded outline-none focus:border-blue-500 text-sm"
                                placeholder="Enter phone number"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Gender</label>
                            <select
                                name="gender"
                                value={editForm.gender}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded outline-none focus:border-blue-500 text-sm bg-white"
                            >
                                <option value="Other">Other</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        {/* Pronouns */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Pronouns</label>
                            <select
                                name="pronouns"
                                value={editForm.pronouns}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded outline-none focus:border-blue-500 text-sm bg-white"
                            >
                                <option value="Custom">Custom</option>
                                <option value="He/Him">He/Him</option>
                                <option value="She/Her">She/Her</option>
                                <option value="They/Them">They/Them</option>
                            </select>
                        </div>

                        {/* Birthdate */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Birthdate</label>
                            <div className="grid grid-cols-3 gap-2">
                                <select
                                    value={editForm.birthdate.year}
                                    onChange={(e) => handleBirthdateChange('year', e.target.value)}
                                    className="px-3 py-2 border text-gray-700 border-gray-300 rounded outline-none focus:border-blue-500 text-sm bg-white"
                                >
                                    <option value="">Year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <select
                                    value={editForm.birthdate.month}
                                    onChange={(e) => handleBirthdateChange('month', e.target.value)}
                                    className="px-3 py-2 border text-gray-700 border-gray-300 rounded outline-none focus:border-blue-500 text-sm bg-white"
                                >
                                    <option value="">Month</option>
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                                <select
                                    value={editForm.birthdate.day}
                                    onChange={(e) => handleBirthdateChange('day', e.target.value)}
                                    className="px-3 py-2 border text-gray-700 border-gray-300 rounded outline-none focus:border-blue-500 text-sm bg-white"
                                >
                                    <option value="">Day</option>
                                    {days.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Timezone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Timezone</label>
                            <select
                                name="timezone"
                                value={editForm.timezone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded outline-none focus:border-blue-500 text-sm bg-white"
                            >
                                <option value="(GMT-12:00) International Date Line West">(GMT-12:00) International Date Line West</option>
                                <option value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US & Canada)</option>
                                <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
                                <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                                <option value="(GMT+01:00) London">(GMT+01:00) London</option>
                                <option value="(GMT+05:30) Mumbai">(GMT+05:30) Mumbai</option>
                                <option value="(GMT+06:00) Dhaka Time">(GMT+06:00) Dhaka Time</option>
                                <option value="(GMT+08:00) Singapore">(GMT+08:00) Singapore</option>
                                <option value="(GMT+09:00) Tokyo">(GMT+09:00) Tokyo</option>
                            </select>
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Currency</label>
                            <select
                                name="currency"
                                value={editForm.currency}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded outline-none focus:border-blue-500 text-sm bg-white"
                            >
                                <option value="USD">United States dollar - $</option>
                                <option value="BDT">Bangladeshi Taka - ৳</option>
                                <option value="EUR">Euro - €</option>
                                <option value="GBP">British Pound - £</option>
                                <option value="INR">Indian Rupee - ₹</option>
                            </select>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>

                        {/* Footer Links */}
                        <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => setShowPasswordModal(true)}
                                className="text-sm text-blue-600 hover:underline w-fit"
                            >
                                Change Password
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="text-sm text-red-600 hover:underline w-fit"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handlePasswordChange}
                                disabled={submitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
                            >
                                {submitting ? 'Changing...' : 'Change Password'}
                            </button>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">
                                Are you sure you want to delete your account? This action cannot be undone.
                            </p>
                            <p className="text-sm text-red-500">
                                All your data will be permanently removed.
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={submitting}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;