import Link from 'next/link';
import React from 'react';

// Modern Footer Component - Black Edition
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-black/95 backdrop-blur-sm border-t border-white/10 ">
            <div className="absolute inset-0 bg-linear-to-t from-white/5 to-transparent pointer-events-none" />
            <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
                    <div className="md:col-span-5 space-y-4">
                        <Link href="/" className="inline-block text-2xl font-bold bg-linear-to-r from-[#1EB97A] to-white/70 bg-clip-text text-transparent hover:from-white hover:to-[#1EB97A] transition-all duration-300">
                            NYBFF
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                            Your trusted platform for exceptional experiences. 
                            We're dedicated to delivering quality and innovation across every interaction.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <SocialLink href="#" ariaLabel="Facebook"><FacebookIcon /></SocialLink>
                            <SocialLink href="#" ariaLabel="LinkedIn"><LinkedInIcon /></SocialLink>
                            <SocialLink href="#" ariaLabel="Instagram"><InstagramIcon /></SocialLink>
                            <SocialLink href="#" ariaLabel="Twitter"><TwitterIcon /></SocialLink>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Explore</h3>
                        <ul className="space-y-3">
                            <FooterNavLink href="https://nybff.us/about-us/">About Us</FooterNavLink>
                            <FooterNavLink href="https://nybff.us/our-directors/">Our Directors</FooterNavLink>
                            <FooterNavLink href="https://nybff.us/newsroom/">Blog</FooterNavLink>
                            <FooterNavLink href="https://nybff.us/entry-rules/">Entry Rules</FooterNavLink>
                        </ul>
                    </div>
                    <div className="md:col-span-4">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support</h3>
                        <ul className="space-y-3">
                            <FooterNavLink href="/terms">Terms of Service</FooterNavLink>
                            <FooterNavLink href="/privacy">Privacy Policy</FooterNavLink>
                            <FooterNavLink href="https://nybff.us/contact/">Contact Us</FooterNavLink>
                            <FooterNavLink href="https://nybff.us/gallery/">Gallery</FooterNavLink>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p className="text-gray-500 text-center md:text-left">
                        © {currentYear}{' '}
                        <Link href="https://nybff.us/" target="_blank" className="text-gray-400 hover:text-[#1EB97A] transition-colors duration-200 font-medium">
                            NYBFF
                        </Link>
                        . All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/accessibility" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Accessibility</Link>
                        <Link href="/cookies" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Cookie Policy</Link>
                        <Link href="/sitemap" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, children, ariaLabel }) => (
    <a href={href} aria-label={ariaLabel} className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#1EB97A]/20 hover:border-[#1EB97A]/50 transition-all duration-300 hover:scale-110" target="_blank" rel="noopener noreferrer">
        {children}
    </a>
);

const FooterNavLink = ({ href, children }) => (
    <li>
        <Link href={href} className="text-gray-400 hover:text-[#1EB97A] text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
            {children}
        </Link>
    </li>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300 group-hover:text-white transition-colors">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300 group-hover:text-white transition-colors">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.205 0 22.225 0z" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300 group-hover:text-white transition-colors">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300 group-hover:text-white transition-colors">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default Footer;