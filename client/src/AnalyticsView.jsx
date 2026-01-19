import React from "react";
import {
    ArrowUp,
    ArrowDown,
    Eye,
    Zap,
    Activity,
    Users,
    Calendar,
} from "lucide-react";

const AnalyticsView = () => {
    const stats = [
        {
            label: "Total Impressions",
            value: "124.5K",
            change: "+12%",
            trend: "up",
            icon: Eye,
            color: "text-cyan-400",
            bg: "bg-cyan-400/10",
        },
        {
            label: "Engagement Rate",
            value: "4.2%",
            change: "+0.8%",
            trend: "up",
            icon: Zap,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
        },
        {
            label: "Profile Visits",
            value: "1,204",
            change: "-2%",
            trend: "down",
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
        {
            label: "Content Score",
            value: "92/100",
            change: "+5%",
            trend: "up",
            icon: Activity,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
        },
    ];

    // Simple CSS-only Chart Data
    const chartData = [40, 65, 45, 80, 55, 90, 70];

    return (
        <div className="max-w-7xl mx-auto p-8 font-sans">
            {/* HEADER */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
                    <p className="text-slate-500 mt-1">Real-time performance metrics.</p>
                </div>

                {/* Date Filter */}
                <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    <button className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg shadow">
                        7 Days
                    </button>
                    <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition">
                        30 Days
                    </button>
                    <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition">
                        3 Months
                    </button>
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                            >
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span
                                className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                            >
                                {stat.trend === "up" ? (
                                    <ArrowUp className="w-3 h-3 mr-1" />
                                ) : (
                                    <ArrowDown className="w-3 h-3 mr-1" />
                                )}
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">
                            {stat.value}
                        </div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* CHARTS SECTION */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* MAIN CHART */}
                <div className="lg:col-span-2 bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
                            <Activity className="text-blue-400" /> Growth Trajectory
                        </h3>

                        <div className="h-64 flex items-end justify-between gap-4">
                            {chartData.map((h, i) => (
                                <div
                                    key={i}
                                    className="w-full flex flex-col justify-end group cursor-pointer"
                                >
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all duration-500 relative"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-slate-900 text-xs font-bold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg">
                                            {h * 154}
                                        </div>
                                    </div>
                                    <div className="text-center text-xs text-slate-500 mt-3 font-bold">
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
                </div>

                {/* TOP CONTENT LIST */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Top Performing</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div
                                key={i}
                                className="flex gap-4 items-center p-3 hover:bg-slate-50 rounded-2xl transition cursor-pointer border border-transparent hover:border-slate-100"
                            >
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">
                                    {i + 1}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800 line-clamp-1">
                                        The Future of AI Agents in 2026
                                    </div>
                                    <div className="text-xs text-slate-400 flex gap-2 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" /> 1.2k
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Zap className="w-3 h-3" /> 4.5%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                        View All Content
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
