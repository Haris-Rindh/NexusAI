import React, { useState } from 'react';
import { User, CreditCard, Bell, Shield, Save, CheckCircle, Check, Zap, Star, Briefcase } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import toast from 'react-hot-toast';

const SettingsView = () => {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('billing'); // Default to billing to show plans immediately
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [skills, setSkills] = useState("React, Node.js, UI/UX");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Profile updated!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpgrade = (plan) => {
    toast.loading(`Redirecting to Stripe for ${plan}...`, { duration: 2000 });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans text-slate-900">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT: NAVIGATION */}
        <div className="w-full md:w-64 space-y-2 flex-shrink-0">
          {[
            { id: 'profile', label: 'My Persona', icon: User },
            { id: 'billing', label: 'Plans & Billing', icon: CreditCard },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT: CONTENT */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm min-h-[600px]">
          
          {/* 1. PERSONA SETTINGS */}
          {activeSection === 'profile' && (
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
                <img src={user?.imageUrl} alt="Profile" className="w-16 h-16 rounded-full border-4 border-blue-50" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{user?.fullName}</h2>
                  <p className="text-sm text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Job Title</label>
                <input 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 ring-blue-500 outline-none"
                />
                <p className="text-xs text-slate-400 mt-2">The AI uses this to customize your content tone.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Core Skills</label>
                <input 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 ring-blue-500 outline-none"
                />
              </div>

              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition flex items-center gap-2"
              >
                {saved ? <CheckCircle className="w-4 h-4 text-green-400"/> : <Save className="w-4 h-4"/>}
                {saved ? "Saved Changes" : "Save Profile"}
              </button>
            </div>
          )}

          {/* 2. BILLING - 3 PLANS */}
          {activeSection === 'billing' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Choose your plan</h2>
                <p className="text-slate-500 mt-1">Unlock the full power of Nexus AI with a plan that fits you.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                
                {/* PLAN 1: STARTER */}
                <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition relative flex flex-col">
                  <div className="mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-3"><Zap className="w-5 h-5"/></div>
                    <h3 className="font-bold text-lg text-slate-900">Starter</h3>
                    <div className="mt-2"><span className="text-3xl font-bold">$0</span><span className="text-slate-500">/mo</span></div>
                    <p className="text-xs text-slate-500 mt-1">Perfect for trying out the platform.</p>
                  </div>
                  <button className="w-full py-2 bg-slate-100 text-slate-500 font-bold rounded-lg mb-6 cursor-default">Current Plan</button>
                  <ul className="space-y-3 text-sm text-slate-600 flex-1">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0"/> 5 Credits / Day</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0"/> Basic AI Models</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0"/> Standard Support</li>
                  </ul>
                </div>

                {/* PLAN 2: PRO (Highlighted) */}
                <div className="border-2 border-blue-600 rounded-2xl p-6 shadow-xl relative bg-blue-50/10 flex flex-col transform md:-translate-y-4">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg tracking-wider">POPULAR</div>
                  <div className="mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3"><Star className="w-5 h-5"/></div>
                    <h3 className="font-bold text-lg text-blue-900">Pro Creator</h3>
                    <div className="mt-2"><span className="text-3xl font-bold text-blue-700">$29</span><span className="text-slate-500">/mo</span></div>
                    <p className="text-xs text-slate-500 mt-1">For serious content creators.</p>
                  </div>
                  <button onClick={() => handleUpgrade("Pro Plan")} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition mb-6 shadow-lg shadow-blue-500/30">Upgrade to Pro</button>
                  <ul className="space-y-3 text-sm text-slate-700 flex-1">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-600 flex-shrink-0"/> <strong>Unlimited</strong> Credits</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-600 flex-shrink-0"/> Advanced AI (Gemini 2.0)</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-600 flex-shrink-0"/> Carousel Studio Access</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-600 flex-shrink-0"/> Analytics Dashboard</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-600 flex-shrink-0"/> Priority Support</li>
                  </ul>
                </div>

                {/* PLAN 3: AGENCY */}
                <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition relative flex flex-col">
                  <div className="mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-3"><Briefcase className="w-5 h-5"/></div>
                    <h3 className="font-bold text-lg text-slate-900">Agency</h3>
                    <div className="mt-2"><span className="text-3xl font-bold">$99</span><span className="text-slate-500">/mo</span></div>
                    <p className="text-xs text-slate-500 mt-1">For teams and organizations.</p>
                  </div>
                  <button onClick={() => handleUpgrade("Agency Plan")} className="w-full py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 mb-6">Contact Sales</button>
                  <ul className="space-y-3 text-sm text-slate-600 flex-1">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0"/> Everything in Pro</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0"/> 5 Team Seats</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0"/> API Access</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0"/> Custom Branding</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0"/> Dedicated Manager</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* 3. NOTIFICATIONS & SECURITY (Placeholders) */}
          {(activeSection === 'notifications' || activeSection === 'security') && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[400px]">
              <Shield className="w-16 h-16 mb-6 opacity-10" />
              <h3 className="text-lg font-bold text-slate-600 mb-2">Managed by Clerk</h3>
              <p className="max-w-xs text-center mb-6">Security, sessions, and multi-factor authentication are handled securely by our auth provider.</p>
              <button className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                Open Clerk Settings <ExternalLinkIcon className="w-3 h-3"/>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Simple Icon component for the placeholder area
const ExternalLinkIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

export default SettingsView;