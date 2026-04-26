"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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

const Trophy = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

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

    const getImageSrc = (src, fallbackName = 'User') => {
        if (src && typeof src === 'string' && src.trim() !== '' && src !== 'null' && src !== 'undefined') {
            return src;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=1EB97A&color=fff&rounded=true&bold=true&size=128`;
    };

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

                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';
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

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us';

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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-[#1EB97A] animate-spin mx-auto" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-[#1EB97A]/20 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-400 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen pb-20">
            {/* Success Message Toast */}
            <AnimatePresence>
                {showSuccessMessage && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed top-4 right-4 z-50"
                    >
                        <div className="bg-gradient-to-r from-[#1EB97A] to-emerald-600 rounded-xl shadow-2xl p-4 flex items-center gap-3 text-white">
                            <CheckCircle className="w-5 h-5" />
                            <p className="font-medium">{successMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed top-4 right-4 z-50"
                    >
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-2xl p-4 flex items-center gap-3 text-white">
                            <AlertCircle className="w-5 h-5" />
                            <p className="font-medium">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cover Photo Section */}
            <div className="relative h-80 lg:h-96 overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                
                {(() => {
                    const coverSrc = isEditing ? editForm.coverPhoto : user.coverPhoto;
                    if (coverSrc && coverSrc.trim() !== '' && coverSrc !== 'null') {
                        return (
                            <img
                                src={coverSrc}
                                alt="Cover"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        );
                    }
                    return (
                        <div className="w-full h-full bg-gradient-to-r from-[#1EB97A]/30 via-emerald-500/20 to-teal-500/30">
                            <div className="absolute inset-0 animate-pulse" style={{
                                background: 'linear-gradient(45deg, rgba(30,185,122,0.3), rgba(16,185,129,0.3), rgba(20,184,166,0.3))',
                                backgroundSize: '200% 200%',
                                animation: 'gradient 15s ease infinite'
                            }}></div>
                        </div>
                    );
                })()}

                {isEditing && (
                    <button
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-xl p-2 hover:bg-black/70 transition-all duration-200 text-white"
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
                <div className="absolute top-4 right-4 flex gap-3 z-20">
                    {isEditing ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCancel}
                                disabled={submitting}
                                className="px-5 py-2.5 bg-gray-800/90 backdrop-blur-sm rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium border border-gray-700"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={submitting}
                                className="px-5 py-2.5 bg-gradient-to-r from-[#1EB97A] to-emerald-600 rounded-xl text-white hover:from-[#189663] hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-lg shadow-[#1EB97A]/20 disabled:opacity-50"
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
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2.5 bg-gray-800/90 backdrop-blur-sm rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium border border-gray-700"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card with Avatar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl"
                        >
                            <div className="relative flex justify-center mt-16">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1EB97A] via-emerald-500 to-teal-500 rounded-2xl opacity-75 blur-md group-hover:opacity-100 transition duration-300"></div>
                                    <div className="relative rounded-2xl border-4 border-gray-800 shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 w-32 h-32">
                                        {isUploading ? (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                                <Loader2 className="w-6 h-6 text-[#1EB97A] animate-spin" />
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
                                            className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-700 transition-all duration-300 border border-gray-600"
                                        >
                                            <Camera className="w-3.5 h-3.5 text-[#1EB97A]" />
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

                            <div className="p-6 pt-4 text-center">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={editForm.fullName}
                                            onChange={handleInputChange}
                                            className="text-2xl font-bold text-white w-full mb-2 text-center bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent"
                                            placeholder="Full Name"
                                        />
                                        <input
                                            type="text"
                                            name="title"
                                            value={editForm.title}
                                            onChange={handleInputChange}
                                            className="text-sm text-[#1EB97A] font-medium w-full mb-4 text-center bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent"
                                            placeholder="Professional Title"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-2xl font-bold text-white mb-1">{user.fullName || user.name}</h1>
                                        <p className="text-sm text-[#1EB97A] font-medium mb-4">{user.title || 'Creative Professional'}</p>
                                    </>
                                )}

                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full text-xs text-gray-400 mb-4">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-medium">Member since {user.joined}</span>
                                </div>

                                {user.bio && !isEditing && (
                                    <div className="mt-4 pt-4 border-t border-gray-800">
                                        <p className="text-sm text-gray-400 leading-relaxed">{user.bio}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Contact Details Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6 shadow-xl"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-gradient-to-br from-[#1EB97A] to-emerald-600 rounded-lg">
                                    <AtSign className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm group">
                                    <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-[#1EB97A]/20 transition-colors">
                                        <Mail className="w-4 h-4 text-gray-500 group-hover:text-[#1EB97A] transition-colors" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleInputChange}
                                            className="flex-1 text-white bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent"
                                            placeholder="Email address"
                                        />
                                    ) : (
                                        <span className="text-gray-400 break-all">{user.email}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-sm group">
                                    <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-[#1EB97A]/20 transition-colors">
                                        <Phone className="w-4 h-4 text-gray-500 group-hover:text-[#1EB97A] transition-colors" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleInputChange}
                                            className="flex-1 text-white bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent"
                                            placeholder="Phone number"
                                        />
                                    ) : (
                                        <span className="text-gray-400">{user.phone || 'Not provided'}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-sm group">
                                    <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-[#1EB97A]/20 transition-colors">
                                        <MapPin className="w-4 h-4 text-gray-500 group-hover:text-[#1EB97A] transition-colors" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={editForm.location}
                                            onChange={handleInputChange}
                                            className="flex-1 text-white bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent"
                                            placeholder="Location"
                                        />
                                    ) : (
                                        <span className="text-gray-400">{user.location || 'Not provided'}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-sm group">
                                    <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-[#1EB97A]/20 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-gray-500 group-hover:text-[#1EB97A] transition-colors" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="website"
                                            value={editForm.website}
                                            onChange={handleInputChange}
                                            className="flex-1 text-white bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent"
                                            placeholder="Website URL"
                                        />
                                    ) : (
                                        user.website ? (
                                            <a href={`https://${user.website}`} className="text-[#1EB97A] hover:text-emerald-400 break-all" target="_blank" rel="noopener noreferrer">
                                                {user.website}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">Not provided</span>
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Skills Section Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6 shadow-xl"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
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
                                            className="flex-1 text-white bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent"
                                            placeholder="Add a skill"
                                        />
                                        <button
                                            onClick={addSkill}
                                            className="px-4 py-2 bg-gradient-to-r from-[#1EB97A] to-emerald-600 text-white rounded-xl hover:from-[#189663] hover:to-emerald-700 transition-all duration-200 font-medium whitespace-nowrap"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                        {editForm.skills.map((skill, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1EB97A]/10 text-[#1EB97A] text-xs font-medium rounded-full border border-[#1EB97A]/30">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="hover:text-emerald-400 ml-1 transition-colors">
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
                                            <span key={index} className="px-3 py-1.5 bg-[#1EB97A]/10 text-[#1EB97A] text-xs font-medium rounded-full border border-[#1EB97A]/30">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm text-center py-4">No skills added yet</p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Biography Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8 shadow-xl"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-white">Biography</h2>
                            </div>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={editForm.bio}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full text-gray-300 leading-relaxed text-sm bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent resize-none"
                                    placeholder="Tell us about yourself, your journey, achievements, and what drives you..."
                                />
                            ) : (
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {user.bio || 'No biography provided yet. Click edit to share your story.'}
                                </p>
                            )}
                        </motion.div>

                        {/* Statistics Dashboard */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                        >
                            {[
                                { key: 'projects', icon: Film, gradient: 'from-[#1EB97A] to-emerald-600', label: 'Projects' },
                                { key: 'submissions', icon: Users, gradient: 'from-purple-500 to-pink-500', label: 'Submissions' },
                                { key: 'selections', icon: Award, gradient: 'from-amber-500 to-orange-500', label: 'Selections' },
                                { key: 'awards', icon: Trophy, gradient: 'from-yellow-500 to-orange-500', label: 'Awards' },
                                { key: 'followers', icon: Users, gradient: 'from-pink-500 to-rose-500', label: 'Followers' },
                                { key: 'following', icon: Users, gradient: 'from-indigo-500 to-purple-500', label: 'Following' }
                            ].map((stat) => (
                                <div key={stat.key} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 text-center text-white shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer`}>
                                    <div className="p-2 bg-white/20 rounded-lg inline-block mb-2">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editForm.stats[stat.key]}
                                            onChange={(e) => setEditForm(prev => ({
                                                ...prev,
                                                stats: { ...prev.stats, [stat.key]: parseInt(e.target.value) || 0 }
                                            }))}
                                            className="text-2xl font-bold w-full text-center bg-white/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                                        />
                                    ) : (
                                        <p className="text-2xl font-bold">{user.stats[stat.key] || 0}</p>
                                    )}
                                    <p className="text-xs font-medium uppercase tracking-wider opacity-90 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Password Change Section */}
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8 shadow-xl"
                            >
                                <h2 className="text-lg font-bold text-white mb-4">Change Password</h2>
                                <p className="text-sm text-gray-500 mb-4">Leave blank to keep current password</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={passwordData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent outline-none transition"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent outline-none transition"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Experience Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8 shadow-xl"
                        >
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#1EB97A]" />
                                Work Experience
                            </h2>
                            {isEditing && (
                                <div className="mb-6">
                                    {!showAddExperience ? (
                                        <button onClick={() => setShowAddExperience(true)} className="text-sm text-[#1EB97A] hover:text-emerald-400 font-medium inline-flex items-center gap-1">
                                            + Add Experience
                                        </button>
                                    ) : (
                                        <div className="space-y-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                            <input type="text" placeholder="Job Title" value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent" />
                                            <input type="text" placeholder="Company" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent" />
                                            <input type="text" placeholder="Period (e.g., 2020 - Present)" value={newExperience.period} onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent" />
                                            <textarea placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} rows={2} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1EB97A] focus:border-transparent resize-none" />
                                            <div className="flex gap-2">
                                                <button onClick={addExperience} className="px-3 py-1 bg-gradient-to-r from-[#1EB97A] to-emerald-600 text-white rounded-lg hover:from-[#189663] hover:to-emerald-700 transition-all duration-200">Add</button>
                                                <button onClick={() => setShowAddExperience(false)} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200">Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="space-y-6">
                                {(isEditing ? editForm.experience : user.experience).map((exp, index) => (
                                    <div key={index} className="border-l-2 border-[#1EB97A]/50 pl-4 relative group">
                                        {isEditing && (
                                            <button onClick={() => removeExperience(index)} className="absolute -top-2 -right-2 text-emerald-500 hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <h3 className="font-semibold text-white">{exp.title}</h3>
                                        <p className="text-sm text-[#1EB97A] mb-1">{exp.company}</p>
                                        <p className="text-xs text-gray-500 mb-2">{exp.period}</p>
                                        <p className="text-sm text-gray-400">{exp.description}</p>
                                    </div>
                                ))}
                                {(!isEditing && user.experience.length === 0) && (
                                    <p className="text-gray-500 text-sm">No experience added yet</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8 shadow-xl"
                        >
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-[#1EB97A]" />
                                Connect & Follow
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(isEditing ? editForm.socials : user.socials).map(([platform, link]) => (
                                    link !== undefined && (
                                        <div key={platform} className="group">
                                            {isEditing ? (
                                                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl border border-gray-700 hover:border-[#1EB97A]/50 transition-all duration-200">
                                                    {getSocialIcon(platform)}
                                                    <input type="text" value={link} onChange={(e) => handleSocialChange(platform, e.target.value)} className="flex-1 text-sm bg-transparent focus:outline-none text-white placeholder-gray-500" placeholder={`${platform} username/url`} />
                                                </div>
                                            ) : (
                                                link && link.trim() !== '' && (
                                                    <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between p-3 bg-gray-800 rounded-xl border border-gray-700 hover:border-transparent transition-all duration-300 ${getSocialColor(platform)} group-hover:text-white`}>
                                                        <div className="flex items-center gap-3">
                                                            {getSocialIcon(platform)}
                                                            <span className="text-sm font-medium capitalize text-gray-400 group-hover:text-white transition-colors">{platform}</span>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white" />
                                                    </a>
                                                )
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default Profile;