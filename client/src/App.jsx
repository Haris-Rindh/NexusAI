import React, { useState, useEffect } from 'react';
import { useAuth, useUser, SignInButton } from "@clerk/clerk-react";
import { Sparkles, Menu, X, ArrowRight, Linkedin } from 'lucide-react';
import { Toaster } from 'react-hot-toast'; // <--- 1. IMPORT TOASTER

// COMPONENTS
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import GeneratorView from './GeneratorView';
import CarouselStudio from './CarouselStudio';
import TrendHunter from './TrendHunter';
import PollCreator from './PollCreator';
import AnalyticsView from './AnalyticsView';
import HistoryView from './HistoryView';
import SettingsView from './SettingsView';
import PricingView from './PricingView';
import axios from 'axios';

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sharedTopic, setSharedTopic] = useState('');

  // LinkedIn Prompt State
  const [showLinkedInPrompt, setShowLinkedInPrompt] = useState(false);
  const [hasSkippedLinkedIn, setHasSkippedLinkedIn] = useState(
    localStorage.getItem('hasSkippedLinkedIn') === 'true'
  );

  // Database User State (Limits/Sub)
  const [dbUser, setDbUser] = useState(null);

  const fetchDbUser = () => {
    if (user) {
      axios.get(`http://localhost:3000/api/user/${user.id}`).then(res => {
        if (res.data.success) setDbUser(res.data.data);
      }).catch(console.error);
    }
  };

  const hasLinkedIn = user?.externalAccounts?.some(acc => acc.provider === 'oauth_linkedin_oidc' || acc.provider === 'oauth_linkedin') || false;

  useEffect(() => {
    if (isSignedIn && user) {
      if (!hasSkippedLinkedIn) {
        if (!hasLinkedIn) {
          setShowLinkedInPrompt(true);
        }
      }
      fetchDbUser();
    }
  }, [isSignedIn, user, hasSkippedLinkedIn]);

  const handleConnectLinkedIn = async () => {
    try {
      if (!user) return;
      await user.createExternalAccount({ strategy: 'oauth_linkedin_oidc', redirectUrl: window.location.href });
    } catch (e) {
      console.error(e);
      toast.error("Failed to initiate LinkedIn connection.");
    }
  };

  const handleQuickStart = (topic) => {
    setSharedTopic(topic);
    setActiveTab('create');
  };

  const showDashboard = isSignedIn || isGuestMode;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* 2. ADD TOASTER HERE */}
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* --- LANDING PAGE --- */}
      {!showDashboard && (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-slate-900 relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40">
            <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-100">The Future of Content Creation</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-extrabold mb-8 tracking-tight leading-tight">
              Create Content <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">At Light Speed.</span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nexus AI is the all-in-one workspace to write, design, and schedule your social media presence automatically.
            </p>

            <div className="flex flex-col gap-4 items-center">
              <SignInButton mode="modal">
                <button className="px-10 py-5 bg-white text-slate-900 text-lg font-bold rounded-full shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all flex items-center gap-3">
                  Start Creating Free <ArrowRight className="w-5 h-5" />
                </button>
              </SignInButton>
              <button onClick={() => setIsGuestMode(true)} className="px-8 py-3 bg-transparent border-2 border-slate-600 text-slate-300 font-bold rounded-full hover:border-slate-400 hover:text-white transition-all">
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- APP DASHBOARD --- */}
      {showDashboard && (
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">

          {showLinkedInPrompt && (
            <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Linkedin className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Connect your LinkedIn Account</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Nexus AI needs permission to publish and schedule posts optimally on your behalf.
                </p>
                <div className="flex flex-col gap-3 relative z-10">
                  <button
                    onClick={handleConnectLinkedIn}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                  >
                    Connect LinkedIn
                  </button>
                  <button
                    onClick={() => {
                      setHasSkippedLinkedIn(true);
                      localStorage.setItem('hasSkippedLinkedIn', 'true');
                      setShowLinkedInPrompt(false);
                    }}
                    className="w-full py-4 bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all font-medium"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="hidden md:block h-full relative z-50 shadow-xl">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isGuestMode={isGuestMode} setIsGuestMode={setIsGuestMode} dbUser={dbUser} />
          </div>

          <div className="flex-1 overflow-y-auto relative flex flex-col">

            <div className="md:hidden bg-slate-900 p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
              <span className="font-bold text-lg text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
                Nexus AI
              </span>
              <div className="flex items-center gap-3">
                {dbUser && dbUser.planTier === 'Free' && !isGuestMode && (
                  <div className="bg-slate-800 text-xs text-blue-200 px-2 py-1 rounded font-bold border border-slate-700">
                    Credits: {dbUser.creditsRemaining}
                  </div>
                )}
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white hover:bg-slate-800 rounded-lg">
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {isMobileMenuOpen && (
              <div className="md:hidden fixed inset-0 z-50 bg-slate-900 pt-20 px-4">
                <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsMobileMenuOpen(false) }} isGuestMode={isGuestMode} setIsGuestMode={setIsGuestMode} dbUser={dbUser} />
              </div>
            )}

            <div className="flex-1">
              {activeTab === 'home' && <DashboardHome onQuickStart={handleQuickStart} setActiveTab={setActiveTab} />}
              {activeTab === 'create' && <div className="p-4 md:p-8 max-w-7xl mx-auto"><GeneratorView initialTopic={sharedTopic} isGuestMode={isGuestMode} onGenerateSuccess={fetchDbUser} hasLinkedIn={hasLinkedIn} /></div>}
              {activeTab === 'trends' && <div className="p-4 md:p-8"><TrendHunter onUseTrend={handleQuickStart} /></div>}
              {activeTab === 'carousels' && <div className="p-4 md:p-8"><CarouselStudio isGuestMode={isGuestMode} onGenerateSuccess={fetchDbUser} hasLinkedIn={hasLinkedIn} /></div>}
              {activeTab === 'polls' && <div className="p-4 md:p-8"><PollCreator isGuestMode={isGuestMode} /></div>}
              {activeTab === 'analyze' && <AnalyticsView />}
              {activeTab === 'history' && <HistoryView />}
              {activeTab === 'pricing' && <PricingView dbUser={dbUser} onUpgradeSuccess={fetchDbUser} />}
              {activeTab === 'settings' && <SettingsView hasLinkedIn={hasLinkedIn} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;