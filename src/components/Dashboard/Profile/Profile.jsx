"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Camera,
    Mail,
    MapPin,
    Globe,
    Video,
    Edit2,
    Save,
    X,
    Briefcase,
    Calendar,
    ExternalLink,
    CheckCircle,
    Loader2,
    User,
    Phone,
    Link as LinkIcon,
    AlertCircle,
    Award,
    Film,
    Users,
    TrendingUp,
    AtSign,
    GraduationCap
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaVimeo, FaGithub, FaYoutube } from 'react-icons/fa';
import { getToken, getUser, updateUserProfile, subscribeToUserUpdates } from '@/utils/auth';

const Profile = () => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    // User Data State
    const [user, setUser] = useState({
        id: '',
        name: '',
        fullName: '',
        username: '',
        title: '',
        bio: '',
        location: '',
        email: '',
        phone: '',
        website: '',
        joined: '',
        avatar: '',
        coverPhoto: '',
        socials: {
            twitter: '',
            facebook: '',
            linkedin: '',
            instagram: '',
            vimeo: '',
            github: '',
            youtube: ''
        },
        stats: {
            projects: 0,
            submissions: 0,
            selections: 0,
            awards: 0,
            followers: 0,
            following: 0
        },
        skills: [],
        experience: [],
        education: []
    });

    // Form state for editing
    const [editForm, setEditForm] = useState({ ...user });
    const [newSkill, setNewSkill] = useState('');
    const [newExperience, setNewExperience] = useState({
        title: '',
        company: '',
        period: '',
        description: ''
    });
    const [showAddExperience, setShowAddExperience] = useState(false);
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    // Helper function to safely get image source
    const getImageSrc = (src, fallbackName = 'User') => {
        if (src && typeof src === 'string' && src.trim() !== '' && src !== 'null' && src !== 'undefined') {
            return src;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=3b82f6&color=fff&rounded=true&bold=true&size=128`;
    };

    // Fetch user data on mount
    useEffect(() => {
        let isMounted = true;
        let abortController = new AbortController();

        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError('');

                const token = getToken();
                if (!token) {
                    router.push('/login');
                    return;
                }

                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const endpoint = `${API_URL}/api/users/profile`;

                const timeoutId = setTimeout(() => {
                    if (isMounted) abortController.abort();
                }, 15000);

                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: abortController.signal
                });

                clearTimeout(timeoutId);

                if (!isMounted) return;

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                const userData = data.data || data.user || data;
                
                if (!isMounted) return;
                
                processUserData(userData);

            } catch (error) {
                if (!isMounted) return;
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                    return;
                }
                console.error('Error fetching profile:', error);
                setError(error.message || 'Failed to load profile data');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUserProfile();

        // Subscribe to profile updates from other components
        const unsubscribe = subscribeToUserUpdates((updatedUser) => {
            console.log('Profile updated from another component:', updatedUser);
            if (isMounted) {
                processUserData(updatedUser);
            }
        });

        return () => {
            isMounted = false;
            abortController.abort();
            unsubscribe();
        };
    }, [router]);

    const processUserData = (userData) => {
        const joinedDate = userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const formattedUser = {
            id: userData.id || userData._id,
            name: userData.name || userData.fullName || '',
            fullName: userData.fullName || userData.name || '',
            username: userData.username || '',
            title: userData.title || 'Filmmaker',
            bio: userData.bio || '',
            location: userData.location || '',
            email: userData.email || '',
            phone: userData.phone || '',
            website: userData.website || '',
            joined: joinedDate,
            avatar: userData.avatar || userData.profileImage || '',
            coverPhoto: userData.coverPhoto || '',
            socials: {
                twitter: userData.socialMedia?.twitter || userData.socials?.twitter || '',
                facebook: userData.socialMedia?.facebook || userData.socials?.facebook || '',
                linkedin: userData.socialMedia?.linkedin || userData.socials?.linkedin || '',
                instagram: userData.socialMedia?.instagram || userData.socials?.instagram || '',
                vimeo: userData.socialMedia?.vimeo || userData.socials?.vimeo || '',
                github: userData.socialMedia?.github || userData.socials?.github || '',
                youtube: userData.socialMedia?.youtube || userData.socials?.youtube || ''
            },
            stats: {
                projects: userData.stats?.projects || 0,
                submissions: userData.stats?.submissions || 0,
                selections: userData.stats?.selections || 0,
                awards: userData.stats?.awards || 0,
                followers: userData.stats?.followers || 0,
                following: userData.stats?.following || 0
            },
            skills: userData.skills || [],
            experience: userData.experience || [],
            education: userData.education || []
        };

        setUser(formattedUser);
        setEditForm(JSON.parse(JSON.stringify(formattedUser)));
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

            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => ({ ...prev, avatar: reader.result }));
                setIsUploading(false);
            };
            reader.onerror = () => {
                setError('Failed to read image file');
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Cover image size should be less than 5MB');
                return;
            }

            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => ({ ...prev, coverPhoto: reader.result }));
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password' || name === 'confirmPassword') {
            setPasswordData(prev => ({ ...prev, [name]: value }));
        } else {
            setEditForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSocialChange = (platform, value) => {
        setEditForm(prev => ({
            ...prev,
            socials: { ...prev.socials, [platform]: value }
        }));
    };

    const addSkill = () => {
        if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
            setEditForm(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setEditForm(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const addExperience = () => {
        if (newExperience.title && newExperience.company) {
            setEditForm(prev => ({
                ...prev,
                experience: [...prev.experience, { ...newExperience }]
            }));
            setNewExperience({ title: '', company: '', period: '', description: '' });
            setShowAddExperience(false);
        }
    };

    const removeExperience = (index) => {
        setEditForm(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        setSubmitting(true);
        setError('');

        try {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const submitData = {
                fullName: editForm.fullName || editForm.name,
                name: editForm.fullName || editForm.name,
                username: editForm.username,
                title: editForm.title,
                bio: editForm.bio,
                location: editForm.location,
                email: editForm.email,
                phone: editForm.phone,
                website: editForm.website,
                socialMedia: editForm.socials,
                skills: editForm.skills,
                experience: editForm.experience,
                stats: {
                    projects: parseInt(editForm.stats.projects) || 0,
                    submissions: parseInt(editForm.stats.submissions) || 0,
                    selections: parseInt(editForm.stats.selections) || 0,
                    awards: parseInt(editForm.stats.awards) || 0
                }
            };

            if (editForm.avatar && editForm.avatar.startsWith('data:image')) {
                submitData.profileImage = editForm.avatar;
            }
            if (editForm.coverPhoto && editForm.coverPhoto.startsWith('data:image')) {
                submitData.coverPhoto = editForm.coverPhoto;
            }

            if (passwordData.password && passwordData.password.trim() !== '') {
                if (passwordData.password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                if (passwordData.password !== passwordData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                submitData.password = passwordData.password;
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

            // Update localStorage with new data
            const updatedUserData = {
                ...getUser(),
                id: data.data?.id || data.user?.id,
                name: data.data?.fullName || data.user?.fullName || editForm.fullName,
                fullName: data.data?.fullName || data.user?.fullName || editForm.fullName,
                email: data.data?.email || data.user?.email || editForm.email,
                title: data.data?.title || data.user?.title || editForm.title,
                avatar: data.data?.avatar || data.user?.avatar || editForm.avatar,
                coverPhoto: data.data?.coverPhoto || data.user?.coverPhoto || editForm.coverPhoto,
                bio: data.data?.bio || data.user?.bio || editForm.bio,
                location: data.data?.location || data.user?.location || editForm.location,
                phone: data.data?.phone || data.user?.phone || editForm.phone,
                website: data.data?.website || data.user?.website || editForm.website,
                socials: data.data?.socials || data.user?.socials || editForm.socials,
                skills: data.data?.skills || data.user?.skills || editForm.skills,
                experience: data.data?.experience || data.user?.experience || editForm.experience,
                stats: data.data?.stats || data.user?.stats || editForm.stats
            };

            updateUserProfile(updatedUserData);

            // Refresh local state
            processUserData(updatedUserData);

            setSuccessMessage('Profile updated successfully!');
            setShowSuccessMessage(true);
            setIsEditing(false);
            setPasswordData({ password: '', confirmPassword: '' });

            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);

        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message || 'Failed to update profile');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setEditForm(JSON.parse(JSON.stringify(user)));
        setPasswordData({ password: '', confirmPassword: '' });
        setIsEditing(false);
        setError('');
        setNewSkill('');
        setShowAddExperience(false);
    };

    const getSocialIcon = (platform) => {
        switch (platform) {
            case 'twitter': return <FaTwitter className="w-4 h-4" />;
            case 'facebook': return <FaFacebook className="w-4 h-4" />;
            case 'linkedin': return <FaLinkedin className="w-4 h-4" />;
            case 'instagram': return <FaInstagram className="w-4 h-4" />;
            case 'vimeo': return <FaVimeo className="w-4 h-4" />;
            case 'github': return <FaGithub className="w-4 h-4" />;
            case 'youtube': return <FaYoutube className="w-4 h-4" />;
            default: return <Globe className="w-4 h-4" />;
        }
    };

    const getSocialColor = (platform) => {
        const colors = {
            twitter: 'hover:bg-[#1DA1F2]',
            facebook: 'hover:bg-[#1877f2]',
            linkedin: 'hover:bg-[#0a66c2]',
            instagram: 'hover:bg-[#E4405F]',
            vimeo: 'hover:bg-[#1ab7ea]',
            github: 'hover:bg-[#333]',
            youtube: 'hover:bg-[#FF0000]'
        };
        return colors[platform] || 'hover:bg-gray-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen pb-20">
            {/* Success Message Toast */}
            {showSuccessMessage && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-4 flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5" />
                        <p className="font-medium">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-4 flex items-center gap-3 text-white">
                        <AlertCircle className="w-5 h-5" />
                        <p className="font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Cover Photo Section */}
            <div className="relative h-80 lg:h-96 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-black/30"></div>
                
                {(() => {
                    const coverSrc = isEditing ? editForm.coverPhoto : user.coverPhoto;
                    if (coverSrc && coverSrc.trim() !== '' && coverSrc !== 'null') {
                        return (
                            <img
                                src={coverSrc}
                                alt="Cover"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 "
                            />
                        );
                    }
                    return (
                        <div className="w-full h-full bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900">
                            <div className="absolute inset-0 animate-pulse" style={{
                                background: 'linear-gradient(45deg, rgba(59,130,246,0.3), rgba(147,51,234,0.3), rgba(236,72,153,0.3))',
                                backgroundSize: '200% 200%',
                                animation: 'gradient 15s ease infinite'
                            }}></div>
                        </div>
                    );
                })()}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent "></div>

                {isEditing && (
                    <button
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 hover:bg-black/70 transition-all duration-200 z-20 text-white"
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                )}
                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                />

                {/* Edit/Save Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={submitting}
                                className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={submitting}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card with Avatar */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                            {/* Avatar Section - Centered */}
                            <div className="relative flex justify-center">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 blur-md group-hover:opacity-100 transition duration-300"></div>
                                    <div className="relative rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                        {isUploading ? (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                            </div>
                                        ) : (
                                            <img
                                                src={getImageSrc(isEditing ? editForm.avatar : user.avatar, user.fullName || user.name || 'User')}
                                                alt={user.name || 'User'}
                                                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                                            />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-2 right-2 bg-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                                            style={{
                                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                                border: '1px solid rgba(255,255,255,0.5)'
                                            }}
                                        >
                                            <Camera className="w-4 h-4 text-gray-600 transition-transform duration-300 group-hover/btn:scale-110" />
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="p-6 pt-4 text-center">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={editForm.fullName}
                                            onChange={handleInputChange}
                                            className="text-2xl font-bold text-gray-900 w-full mb-2 text-center border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Full Name"
                                        />
                                        <input
                                            type="text"
                                            name="title"
                                            value={editForm.title}
                                            onChange={handleInputChange}
                                            className="text-sm text-blue-600 font-medium w-full mb-4 text-center border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Professional Title"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.fullName || user.name}</h1>
                                        <p className="text-sm text-blue-600 font-medium mb-4">{user.title || 'Creative Professional'}</p>
                                    </>
                                )}

                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-500 mb-4">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-medium">Member since {user.joined}</span>
                                </div>

                                {user.bio && !isEditing && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Details Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform transition-all duration-300 hover:shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                    <AtSign className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm group">
                                    <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                                        <Mail className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleInputChange}
                                            className="flex-1 text-gray-600 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Email address"
                                        />
                                    ) : (
                                        <span className="text-gray-600 break-all">{user.email}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-sm group">
                                    <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                                        <Phone className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleInputChange}
                                            className="flex-1 text-gray-600 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Phone number"
                                        />
                                    ) : (
                                        <span className="text-gray-600">{user.phone || 'Not provided'}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-sm group">
                                    <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                                        <MapPin className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={editForm.location}
                                            onChange={handleInputChange}
                                            className="flex-1 text-gray-600 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Location"
                                        />
                                    ) : (
                                        <span className="text-gray-600">{user.location || 'Not provided'}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-sm group">
                                    <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="website"
                                            value={editForm.website}
                                            onChange={handleInputChange}
                                            className="flex-1 text-gray-600 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Website URL"
                                        />
                                    ) : (
                                        user.website ? (
                                            <a href={`https://${user.website}`} className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">
                                                {user.website}
                                            </a>
                                        ) : (
                                            <span className="text-gray-600">Not provided</span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Skills Section Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform transition-all duration-300 hover:shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skills & Expertise</h3>
                            </div>
                            {isEditing ? (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                            className="flex-1 text-gray-600 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Add a skill (e.g., React, Design)"
                                        />
                                        <button
                                            onClick={addSkill}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium whitespace-nowrap"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                        {editForm.skills.map((skill, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="hover:text-red-600 ml-1 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                    {user.skills.length > 0 ? (
                                        user.skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm text-center py-4">No skills added yet</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Biography Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all duration-300 hover:shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Biography</h2>
                            </div>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={editForm.bio}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full text-gray-600 leading-relaxed text-sm border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Tell us about yourself, your journey, achievements, and what drives you..."
                                />
                            ) : (
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {user.bio || 'No biography provided yet. Click edit to share your story.'}
                                </p>
                            )}
                        </div>

                        {/* Statistics Dashboard */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer">
                                <div className="p-2 bg-white/20 rounded-lg inline-block mb-2">
                                    <Film className="w-5 h-5" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editForm.stats.projects}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            stats: { ...prev.stats, projects: parseInt(e.target.value) || 0 }
                                        }))}
                                        className="text-2xl font-bold w-full text-center bg-white/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                ) : (
                                    <p className="text-2xl font-bold">{user.stats.projects}</p>
                                )}
                                <p className="text-xs font-medium uppercase tracking-wider opacity-90 mt-1">Projects</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer">
                                <div className="p-2 bg-white/20 rounded-lg inline-block mb-2">
                                    <Users className="w-5 h-5" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editForm.stats.submissions}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            stats: { ...prev.stats, submissions: parseInt(e.target.value) || 0 }
                                        }))}
                                        className="text-2xl font-bold w-full text-center bg-white/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                ) : (
                                    <p className="text-2xl font-bold">{user.stats.submissions}</p>
                                )}
                                <p className="text-xs font-medium uppercase tracking-wider opacity-90 mt-1">Submissions</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer">
                                <div className="p-2 bg-white/20 rounded-lg inline-block mb-2">
                                    <Award className="w-5 h-5" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editForm.stats.selections}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            stats: { ...prev.stats, selections: parseInt(e.target.value) || 0 }
                                        }))}
                                        className="text-2xl font-bold w-full text-center bg-white/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                ) : (
                                    <p className="text-2xl font-bold">{user.stats.selections}</p>
                                )}
                                <p className="text-xs font-medium uppercase tracking-wider opacity-90 mt-1">Selections</p>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer">
                                <div className="p-2 bg-white/20 rounded-lg inline-block mb-2">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editForm.stats.awards}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            stats: { ...prev.stats, awards: parseInt(e.target.value) || 0 }
                                        }))}
                                        className="text-2xl font-bold w-full text-center bg-white/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                ) : (
                                    <p className="text-2xl font-bold">{user.stats.awards}</p>
                                )}
                                <p className="text-xs font-medium uppercase tracking-wider opacity-90 mt-1">Awards</p>
                            </div>

                            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-4 text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer">
                                <div className="p-2 bg-white/20 rounded-lg inline-block mb-2">
                                    <Users className="w-5 h-5" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editForm.stats.followers}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            stats: { ...prev.stats, followers: parseInt(e.target.value) || 0 }
                                        }))}
                                        className="text-2xl font-bold w-full text-center bg-white/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                ) : (
                                    <p className="text-2xl font-bold">{user.stats.followers || 0}</p>
                                )}
                                <p className="text-xs font-medium uppercase tracking-wider opacity-90 mt-1">Followers</p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer">
                                <div className="p-2 bg-white/20 rounded-lg inline-block mb-2">
                                    <Users className="w-5 h-5" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editForm.stats.following}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            stats: { ...prev.stats, following: parseInt(e.target.value) || 0 }
                                        }))}
                                        className="text-2xl font-bold w-full text-center bg-white/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                ) : (
                                    <p className="text-2xl font-bold">{user.stats.following || 0}</p>
                                )}
                                <p className="text-xs font-medium uppercase tracking-wider opacity-90 mt-1">Following</p>
                            </div>
                        </div>

                        {/* Password Change Section */}
                        {isEditing && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Change Password</h2>
                                <p className="text-sm text-gray-500 mb-4">Leave blank to keep current password</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={passwordData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Experience Section */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                                Work Experience
                            </h2>
                            {isEditing && (
                                <div className="mb-6">
                                    {!showAddExperience ? (
                                        <button onClick={() => setShowAddExperience(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
                                            + Add Experience
                                        </button>
                                    ) : (
                                        <div className="space-y-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                                            <input type="text" placeholder="Job Title" value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                            <input type="text" placeholder="Company" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                            <input type="text" placeholder="Period (e.g., 2020 - Present)" value={newExperience.period} onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                            <textarea placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} rows={2} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                                            <div className="flex gap-2">
                                                <button onClick={addExperience} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">Add</button>
                                                <button onClick={() => setShowAddExperience(false)} className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200">Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="space-y-6">
                                {(isEditing ? editForm.experience : user.experience).map((exp, index) => (
                                    <div key={index} className="border-l-2 border-blue-200 pl-4 relative group">
                                        {isEditing && (
                                            <button onClick={() => removeExperience(index)} className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                                        <p className="text-sm text-blue-600 mb-1">{exp.company}</p>
                                        <p className="text-xs text-gray-400 mb-2">{exp.period}</p>
                                        <p className="text-sm text-gray-600">{exp.description}</p>
                                    </div>
                                ))}
                                {(!isEditing && user.experience.length === 0) && (
                                    <p className="text-gray-500 text-sm">No experience added yet</p>
                                )}
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                Education
                            </h2>
                            <div className="space-y-4">
                                {user.education && user.education.length > 0 ? (
                                    user.education.map((edu, index) => (
                                        <div key={index} className="border-l-2 border-green-200 pl-4">
                                            <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                                            <p className="text-sm text-green-600 mb-1">{edu.institution}</p>
                                            <p className="text-xs text-gray-400">{edu.year}</p>
                                            {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No education added yet</p>
                                )}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                                Connect & Follow
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(isEditing ? editForm.socials : user.socials).map(([platform, link]) => (
                                    link !== undefined && (
                                        <div key={platform} className="group">
                                            {isEditing ? (
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                                                    {getSocialIcon(platform)}
                                                    <input type="text" value={link} onChange={(e) => handleSocialChange(platform, e.target.value)} className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700" placeholder={`${platform} username/url`} />
                                                </div>
                                            ) : (
                                                link && link.trim() !== '' && (
                                                    <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between p-3 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-transparent transition-all duration-300 ${getSocialColor(platform)} group-hover:text-white`}>
                                                        <div className="flex items-center gap-3">
                                                            {getSocialIcon(platform)}
                                                            <span className="text-sm font-medium capitalize text-gray-700 group-hover:text-white transition-colors">{platform}</span>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white" />
                                                    </a>
                                                )
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Trophy = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

export default Profile;