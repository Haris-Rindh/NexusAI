import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
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
import SettingsView from './SettingsView'; // Make sure you have this file from previous steps

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sharedTopic, setSharedTopic] = useState(''); 

  const handleQuickStart = (topic) => {
    setSharedTopic(topic);
    setActiveTab('create');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 2. ADD TOASTER HERE */}
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* --- LANDING PAGE --- */}
      <SignedOut>
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
               Create Content <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">At Light Speed.</span>
             </h1>
             
             <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
               Nexus AI is the all-in-one workspace to write, design, and schedule your social media presence automatically.
             </p>
             
             <SignInButton mode="modal">
               <button className="px-10 py-5 bg-white text-slate-900 text-lg font-bold rounded-full shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto">
                 Start Creating Free <ArrowRight className="w-5 h-5" />
               </button>
             </SignInButton>
           </div>
        </div>
      </SignedOut>

      {/* --- APP DASHBOARD --- */}
      <SignedIn>
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
          
          <div className="hidden md:block h-full relative z-50 shadow-xl">
             <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex-1 overflow-y-auto relative flex flex-col">
             
             <div className="md:hidden bg-slate-900 p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
                <span className="font-bold text-lg text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
                  Nexus AI
                </span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white hover:bg-slate-800 rounded-lg">
                  {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                </button>
             </div>

             {isMobileMenuOpen && (
               <div className="md:hidden fixed inset-0 z-50 bg-slate-900 pt-20 px-4">
                 <Sidebar activeTab={activeTab} setActiveTab={(t) => {setActiveTab(t); setIsMobileMenuOpen(false)}} />
               </div>
             )}

             <div className="flex-1">
               {activeTab === 'home' && <DashboardHome onQuickStart={handleQuickStart} setActiveTab={setActiveTab} />}
               {activeTab === 'create' && <div className="p-4 md:p-8 max-w-7xl mx-auto"><GeneratorView initialTopic={sharedTopic} /></div>}
               {activeTab === 'trends' && <div className="p-4 md:p-8"><TrendHunter onUseTrend={handleQuickStart}/></div>}
               {activeTab === 'carousels' && <div className="p-4 md:p-8"><CarouselStudio /></div>}
               {activeTab === 'polls' && <div className="p-4 md:p-8"><PollCreator /></div>}
               {activeTab === 'analyze' && <AnalyticsView />}
               {activeTab === 'history' && <HistoryView />}
               {activeTab === 'settings' && <SettingsView />}
             </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;