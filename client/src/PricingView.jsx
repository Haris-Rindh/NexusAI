import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import toast from 'react-hot-toast';
import { Check, Star, Zap, Loader2 } from 'lucide-react';

const API_URL = "http://localhost:3000";

const PricingView = ({ dbUser, onUpgradeSuccess }) => {
    const { user } = useUser();
    const [isUpgrading, setIsUpgrading] = useState(false);

    const handleUpgrade = async () => {
        if (!user) return;
        setIsUpgrading(true);
        // Simulate checkout delay
        setTimeout(async () => {
            try {
                await axios.post(`${API_URL}/api/upgrade`, { userId: user.id });
                toast.success('Successfully upgraded to Pro!');
                onUpgradeSuccess();
            } catch (error) {
                toast.error('Failed to upgrade. Please try again.');
            } finally {
                setIsUpgrading(false);
            }
        }, 1500);
    };

    const isPro = dbUser?.planTier === 'Pro';

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Simple, transparent pricing</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Scale your LinkedIn presence with the power of advanced multi-model AI. No hidden fees.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                
                {/* FREE PLAN */}
                <div className={`bg-white rounded-3xl p-8 border ${isPro ? 'border-slate-200 shadow-sm' : 'border-blue-200 shadow-xl shadow-blue-900/5 relative overflow-hidden'}`}>
                    {/* Active Indicator */}
                    {!isPro && <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Current Plan</div>}
                    
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Free Starter</h2>
                    <p className="text-slate-500 text-sm mb-6">Perfect to test the waters.</p>
                    <div className="mb-6 flex items-baseline">
                        <span className="text-5xl font-extrabold text-slate-900">$0</span>
                        <span className="text-slate-500 ml-2">/ month</span>
                    </div>

                    <ul className="space-y-4 mb-8 text-sm font-medium text-slate-700">
                        <li className="flex items-center gap-3"><Check className="text-blue-500 w-5 h-5"/> 3 AI Generations per day</li>
                        <li className="flex items-center gap-3"><Check className="text-blue-500 w-5 h-5"/> Standard Models (Gemini/Groq)</li>
                        <li className="flex items-center gap-3"><Check className="text-blue-500 w-5 h-5"/> Basic Analytics</li>
                    </ul>

                    <button 
                        disabled
                        className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl"
                    >
                        {!isPro ? 'Your Current Plan' : 'Downgrade to Free'}
                    </button>
                </div>

                {/* PRO PLAN */}
                <div className={`bg-gradient-to-b from-blue-600 to-indigo-700 rounded-3xl p-8 border border-blue-600 shadow-2xl relative overflow-hidden text-white`}>
                    {/* Active Indicator */}
                    {isPro && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1"><Star className="w-3 h-3"/> Active Plan</div>}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-20"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Zap className="text-yellow-400"/> Professional</h2>
                        <p className="text-blue-100 text-sm mb-6">For serious creators and businesses.</p>
                        <div className="mb-6 flex items-baseline">
                            <span className="text-5xl font-extrabold">$29</span>
                            <span className="text-blue-200 ml-2">/ month</span>
                        </div>

                        <ul className="space-y-4 mb-8 text-sm font-medium text-blue-50">
                            <li className="flex items-center gap-3"><Check className="text-yellow-400 w-5 h-5"/> Unlimited AI Generations</li>
                            <li className="flex items-center gap-3"><Check className="text-yellow-400 w-5 h-5"/> Premium Models (Cohere Command-R+)</li>
                            <li className="flex items-center gap-3"><Check className="text-yellow-400 w-5 h-5"/> Advanced Analytics & Vault</li>
                            <li className="flex items-center gap-3"><Check className="text-yellow-400 w-5 h-5"/> Priority Support</li>
                        </ul>

                        {isPro ? (
                            <button 
                                disabled
                                className="w-full py-3 bg-white/20 text-white font-bold rounded-xl backdrop-blur-md"
                            >
                                Currently Active
                            </button>
                        ) : (
                            <button 
                                onClick={handleUpgrade}
                                disabled={isUpgrading}
                                className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {isUpgrading ? <><Loader2 className="w-5 h-5 animate-spin"/> Processing...</> : 'Upgrade to Pro'}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PricingView;
