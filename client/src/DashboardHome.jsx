import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, TrendingUp, Zap, ArrowRight, Activity, Calendar, Copy, Send } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import toast from 'react-hot-toast';
import { API_URL } from './config';

const DashboardHome = ({ setActiveTab, onQuickStart }) => {
    const { user } = useUser();
    const date = new Date();
    const hour = date.getHours();
    let greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    // --- REAL STATS STATE ---
    const [statsData, setStatsData] = useState({
        created: 0,
        published: 0,
        scheduled: 0
    });

    // --- FETCH DATA ON LOAD ---
    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`${API_URL}/api/history/${user.id}`);
                const posts = res.data.data;

                setStatsData({
                    created: posts.length,
                    published: posts.filter(p => p.status === 'published').length,
                    scheduled: posts.filter(p => p.status === 'scheduled').length
                });
            } catch (e) {
                console.error("Failed to load stats");
            }
        };

        fetchStats();
    }, [user]);

    const stats = [
        { label: 'Posts Created', value: statsData.created, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Published', value: statsData.published, icon: Send, color: 'text-green-400', bg: 'bg-green-400/10' }, // Swapped "Views" for "Published" (Real Data)
        { label: 'Scheduled', value: statsData.scheduled, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    const handleCopyLink = () => {
        navigator.clipboard.writeText("https://nexus-ai.com/ref/haris");
        toast.success("Referral link copied to clipboard!", {
            icon: '🚀',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-8 font-sans">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        {greeting}, {user?.firstName}
                    </h1>
                    <p className="text-slate-500 mt-1">Here is what's happening with your content today.</p>
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-medium text-slate-600 shadow-sm">
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* STATS GRID (NOW REAL) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN ACTION AREA */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* BIG CREATE CARD */}
                <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl group">
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Generate Next-Gen Content</h2>
                        <p className="text-blue-100 mb-8 max-w-md">
                            Use our advanced AI models to create viral LinkedIn posts, Twitter threads, and blog articles in seconds.
                        </p>
                        <button
                            onClick={() => setActiveTab('create')}
                            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition shadow-lg"
                        >
                            Open Studio <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
                    <div className="absolute bottom-0 right-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl"></div>
                </div>

                {/* QUICK START LIST */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" /> Trending Topics
                    </h3>
                    <div className="space-y-3 flex-1">
                        {["AI Agents in 2026", "Sustainable Web Design", "React 19 vs Vue", "Mental Health for Devs"].map((topic, i) => (
                            <button
                                key={i}
                                onClick={() => onQuickStart(topic)}
                                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition group flex justify-between items-center border border-transparent hover:border-slate-100"
                            >
                                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{topic}</span>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                            </button>
                        ))}
                    </div>

                    {/* Referral Button */}
                    <button
                        onClick={handleCopyLink}
                        className="mt-4 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                    >
                        <Copy className="w-3 h-3" /> Copy Referral Link
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;