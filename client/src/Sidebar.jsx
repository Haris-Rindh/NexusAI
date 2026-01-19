import React, { useState } from 'react';
import {
    LayoutDashboard, PenTool, TrendingUp, Layers,
    BarChart2, Settings, LogOut, ChevronRight, Zap,
    ListChecks
} from 'lucide-react';
import { useClerk } from "@clerk/clerk-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { signOut } = useClerk();
    const [isExpanded, setIsExpanded] = useState(true);

    const menuItems = [
        { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'create', label: 'Studio', icon: PenTool },
        { id: 'trends', label: 'Discover', icon: TrendingUp },
        { id: 'history', label: 'Vault', icon: Layers },
        { id: 'carousels', label: 'Carousel Builder', icon: Layers },
        { id: 'polls', label: 'Poll Creator', icon: ListChecks },
        { id: 'analyze', label: 'Analytics', icon: BarChart2 },
    ];

    return (
        <div
            className={`bg-slate-900 h-screen flex flex-col transition-all duration-300 border-r border-slate-800 ${isExpanded ? 'w-64' : 'w-20'}`}
        >
            {/* LOGO AREA */}
            <div className="h-20 flex items-center justify-center border-b border-slate-800 relative">
                {/* Full Logo */}
                <div className={`flex items-center gap-3 transition-all duration-300 ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0 w-0 overflow-hidden'}`}>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">N</div>
                    <span className="text-xl font-bold text-white tracking-tight">Nexus AI</span>
                </div>

                {/* Collapsed Logo Icon */}
                {!isExpanded && (
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">N</div>
                    </div>
                )}

                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute -right-3 top-8 bg-blue-600 rounded-full p-1 text-white hover:bg-blue-500 shadow-lg border border-slate-900 z-50"
                >
                    <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* MENU ITEMS */}
            <div className="flex-1 py-6 px-3 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group relative ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <item.icon className="w-5 h-5 min-w-[20px]" />

                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                            {item.label}
                        </span>

                        {/* Tooltip for collapsed mode */}
                        {!isExpanded && (
                            <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
                                {item.label}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* FOOTER / SETTINGS */}
            <div className="p-4 border-t border-slate-800">

                {/* Settings Button */}
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative ${!isExpanded && 'justify-center'}`}
                >
                    <Settings className="w-5 h-5" />
                    <span className={`${isExpanded ? 'block' : 'hidden'}`}>Settings</span>
                    {!isExpanded && <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-50">Settings</div>}
                </button>

                {/* Logout Button */}
                <button
                    onClick={() => signOut()}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-900/20 hover:text-red-500 transition-all mt-1 group relative ${!isExpanded && 'justify-center'}`}
                >
                    <LogOut className="w-5 h-5" />
                    <span className={`${isExpanded ? 'block' : 'hidden'}`}>Logout</span>
                    {!isExpanded && <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-50">Logout</div>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;