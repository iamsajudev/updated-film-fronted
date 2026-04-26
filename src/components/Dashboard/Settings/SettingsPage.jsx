"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    Trash2,
    X,
    User,
    Mail,
    Phone,
    Calendar,
    Globe,
    DollarSign,
    Shield,
    Key,
    Camera,
    Save
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
            
            const fullName = userData.fullName || userData.name || '';
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
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

    const handleBirthdateChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            birthdate: { ...prev.birthdate, [field]: value }
        }));
    };

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
            
            const submitData = {
                fullName: `${editForm.firstName} ${editForm.lastName}`.trim(),
                name: `${editForm.firstName} ${editForm.lastName}`.trim(),
                phone: editForm.phone,
                gender: editForm.gender,
                pronouns: editForm.pronouns,
                timezone: editForm.timezone,
                currency: editForm.currency
            };
            
            if (editForm.birthdate.year && editForm.birthdate.month && editForm.birthdate.day) {
                const birthdate = new Date(
                    parseInt(editForm.birthdate.year),
                    parseInt(editForm.birthdate.month) - 1,
                    parseInt(editForm.birthdate.day)
                );
                submitData.birthdate = birthdate.toISOString();
            }
            
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
            await fetchUserProfile();
            
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (error) {
            console.error('Error updating settings:', error);
            setError(error.message || 'Failed to update settings');
        } finally {
            setSubmitting(false);
        }
    };

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
            
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (error) {
            console.error('Error changing password:', error);
            setError(error.message || 'Failed to change password');
        } finally {
            setSubmitting(false);
        }
    };

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

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        { value: '1', label: 'January' }, { value: '2', label: 'February' },
        { value: '3', label: 'March' }, { value: '4', label: 'April' },
        { value: '5', label: 'May' }, { value: '6', label: 'June' },
        { value: '7', label: 'July' }, { value: '8', label: 'August' },
        { value: '9', label: 'September' }, { value: '10', label: 'October' },
        { value: '11', label: 'November' }, { value: '12', label: 'December' }
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#1EB97A] animate-spin mx-auto" />
                    <p className="mt-4 text-gray-400">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Success Message */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6 p-4 bg-gradient-to-r from-[#1EB97A]/10 to-emerald-500/10 border border-[#1EB97A]/30 rounded-xl"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-[#1EB97A]" />
                                <p className="text-[#1EB97A] font-medium">{success}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                        >
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <p className="text-red-400 font-medium">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
                >
                    <div className="h-1 bg-gradient-to-r from-[#1EB97A] via-emerald-500 to-transparent"></div>
                    
                    <div className="p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#1EB97A] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#1EB97A]/20">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                My Account
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-10">
                            {/* Left Column: Avatar */}
                            <div className="md:col-span-4 space-y-4">
                                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    Avatar
                                </label>
                                <div className="relative group">
                                    <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-xl bg-gray-800">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Profile"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1EB97A] to-emerald-600 text-white text-5xl font-bold">
                                                {editForm.firstName?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-2 right-2 p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition-colors border border-gray-600">
                                        <Camera className="w-4 h-4 text-gray-300" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                            </div>

                            {/* Right Column: Fields */}
                            <div className="md:col-span-8 space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                        Name
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={editForm.firstName}
                                            onChange={handleInputChange}
                                            placeholder="First name"
                                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={editForm.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Last name"
                                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                        Email
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="email"
                                                value={user.email}
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                                                disabled
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm font-semibold transition-colors"
                                        >
                                            Change Email
                                        </button>
                                    </div>
                                    {!user.isEmailVerified && (
                                        <button
                                            type="button"
                                            className="text-xs text-[#1EB97A] hover:text-emerald-400 mt-2 transition-colors"
                                        >
                                            Confirm your email
                                        </button>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                        Phone number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={editForm.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                    >
                                        <option value="Other">Other</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                {/* Pronouns */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                        Pronouns
                                    </label>
                                    <select
                                        name="pronouns"
                                        value={editForm.pronouns}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                    >
                                        <option value="Custom">Custom</option>
                                        <option value="He/Him">He/Him</option>
                                        <option value="She/Her">She/Her</option>
                                        <option value="They/Them">They/Them</option>
                                    </select>
                                </div>

                                {/* Birthdate */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                        Birthdate
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <select
                                            value={editForm.birthdate.year}
                                            onChange={(e) => handleBirthdateChange('year', e.target.value)}
                                            className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                        >
                                            <option value="">Year</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={editForm.birthdate.month}
                                            onChange={(e) => handleBirthdateChange('month', e.target.value)}
                                            className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                        >
                                            <option value="">Month</option>
                                            {months.map(month => (
                                                <option key={month.value} value={month.value}>{month.label}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={editForm.birthdate.day}
                                            onChange={(e) => handleBirthdateChange('day', e.target.value)}
                                            className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
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
                                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                        Timezone
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <select
                                            name="timezone"
                                            value={editForm.timezone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
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
                                </div>

                                {/* Currency */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                        Currency
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <select
                                            name="currency"
                                            value={editForm.currency}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                        >
                                            <option value="USD">United States dollar - $</option>
                                            <option value="BDT">Bangladeshi Taka - ৳</option>
                                            <option value="EUR">Euro - €</option>
                                            <option value="GBP">British Pound - £</option>
                                            <option value="INR">Indian Rupee - ₹</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-gradient-to-r from-[#1EB97A] to-emerald-600 hover:from-[#189663] hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-[#1EB97A]/20"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Footer Links */}
                                <div className="pt-6 border-t border-gray-800 flex flex-col gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(true)}
                                        className="text-sm text-[#1EB97A] hover:text-emerald-400 w-fit flex items-center gap-2 transition-colors"
                                    >
                                        <Key className="w-3.5 h-3.5" />
                                        Change Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="text-sm text-red-400 hover:text-red-300 w-fit flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Change Password Modal - Dark Theme */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowPasswordModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-800">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">Change Password</h2>
                                    <button
                                        onClick={() => setShowPasswordModal(false)}
                                        className="text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1EB97A] focus:ring-2 focus:ring-[#1EB97A]/20 transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="p-6 border-t border-gray-800 flex gap-3">
                                <button
                                    onClick={handlePasswordChange}
                                    disabled={submitting}
                                    className="flex-1 bg-gradient-to-r from-[#1EB97A] to-emerald-600 hover:from-[#189663] hover:to-emerald-700 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-50"
                                >
                                    {submitting ? 'Changing...' : 'Change Password'}
                                </button>
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 bg-gray-800 border border-gray-700 text-gray-300 py-2.5 rounded-xl font-semibold hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Account Modal - Dark Theme */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-2xl max-w-md w-full border border-red-500/30"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-red-500/20">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-red-400">Delete Account</h2>
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <p className="text-gray-400 mb-2">
                                    Are you sure you want to delete your account? This action cannot be undone.
                                </p>
                                <p className="text-sm text-red-400">
                                    All your data will be permanently removed.
                                </p>
                            </div>
                            
                            <div className="p-6 border-t border-gray-800 flex gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={submitting}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
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
                                    className="flex-1 bg-gray-800 border border-gray-700 text-gray-300 py-2.5 rounded-xl font-semibold hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsPage;