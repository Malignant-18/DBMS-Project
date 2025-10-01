import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { state, logout } = useAuth();

    // Get user data from context
    const user = state.user;

    const linkStyle = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "text-white border-b-2 border-white px-3 py-2 text-sm font-medium transition-colors duration-200"
            : "text-gray-200 hover:text-white border-b-2 border-transparent hover:border-white px-3 py-2 text-sm font-medium transition-colors duration-200";

    const mobileLinkStyle = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "bg-indigo-600 text-white block px-3 py-2 rounded-md text-base font-medium"
            : "text-gray-200 hover:bg-indigo-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium";

    async function handleLogout() {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
            // Navigate anyway to ensure user is logged out from UI
            navigate('/');
        }
    }

    // Get user initials for avatar
    const getUserInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // If user is not authenticated, don't render navbar
    if (!user) {
        return null;
    }

    return (
        <nav className="shadow-xl border-b border-gray-800" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="bg-white p-2 rounded-lg mr-3 shadow-lg">
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-white">
                                EzyVote
                            </h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to='/home' className={linkStyle}>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Home
                                </div>
                            </NavLink>

                            <NavLink to='/clubs' className={linkStyle}>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Clubs
                                </div>
                            </NavLink>
                            
                            <NavLink to='/voting' className={linkStyle}>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Voting
                                </div>
                            </NavLink>

                            {/* Election Management/Results - Text changes based on user role */}
                            <NavLink to='/election-management' className={linkStyle}>
                                <div className="flex items-center">
                                    {user.role === 'user' ? (
                                        <>
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Results
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            Manage Elections
                                        </>
                                    )}
                                </div>
                            </NavLink>
                        </div>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {/* Profile dropdown */}
                            <div className="ml-3 relative">
                                <div>
                                    <button
                                        type="button"
                                        className="max-w-xs bg-white/10 backdrop-blur-sm rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 border border-white/20 cursor-pointer"
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black text-sm font-medium shadow-lg">
                                            {getUserInitials(user.name)}
                                        </div>
                                        <div className="ml-3 text-left">
                                            <p className="text-sm font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-gray-300">
                                                {user.role === 'admin' ? 'Admin' : user.role === 'user' ? 'User' : (user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student')}
                                            </p>
                                        </div>
                                        <svg className="ml-2 h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {isProfileOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-xl py-1 ring-1 ring-gray-700 focus:outline-none z-50 border border-gray-700" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
                                        <div className="px-4 py-2 border-b border-gray-700">
                                            <p className="text-sm text-white">{user.name}</p>
                                            <p className="text-sm text-gray-400">{user.reg_no}</p>
                                        </div>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Your Profile
                                            </div>
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Settings
                                            </div>
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                                        >
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign out
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="bg-white/10 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 border border-white/20"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
                        <NavLink to='/home' className={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
                            Home
                        </NavLink>
                        <NavLink to='/clubs' className={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
                            Clubs
                        </NavLink>
                        <NavLink to='/voting' className={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
                            Voting
                        </NavLink>
                        <NavLink to='/election-management' className={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
                            {user.role === 'user' ? 'Results' : 'Manage Elections'}
                        </NavLink>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-800" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
                        <div className="flex items-center px-5">
                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black font-medium shadow-lg">
                                {getUserInitials(user.name)}
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-white">{user.name}</div>
                                <div className="text-sm font-medium text-gray-300">{user.reg_no}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-indigo-600">
                                Your Profile
                            </a>
                            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-indigo-600">
                                Settings
                            </a>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-indigo-600"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;