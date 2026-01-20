import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Plus, X, BarChart2, Smile, Save, Loader2, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from "@clerk/clerk-react";
import { API_URL } from './config';

const PollCreator = () => {
    const { user } = useUser();
    const [question, setQuestion] = useState("What is your biggest challenge right now?");
    const [options, setOptions] = useState(["Finding Clients", "Time Management", "Technical Skills"]);
    const [duration, setDuration] = useState("1 week");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const addOption = () => {
        if (options.length < 4) setOptions([...options, "New Option"]);
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleEmojiClick = (emojiObject) => {
        setQuestion(prev => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    // --- NEW: SAVE FUNCTION ---
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await axios.post(`${API_URL}/api/save`, {
                userId: user.id,
                topic: question, // Use question as the "Topic" title in history
                type: 'poll',
                status: 'scheduled', // Polls usually imply scheduling
                pollData: {
                    question,
                    options,
                    duration
                }
            });
            alert("Poll scheduled successfully!");
            toast.success("Poll scheduled for next week!");
        } catch (e) {
            console.error(e);
            alert("Failed to save poll.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pb-8 flex flex-col md:flex-row gap-8 font-sans text-slate-900">

            {/* LEFT: EDITOR */}
            <div className="w-full md:w-1/2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                    <BarChart2 className="text-blue-600" /> Design Your Poll
                </h2>

                {/* Question Input */}
                <div className="mb-6 relative">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Your Question</label>
                    <div className="relative">
                        <textarea
                            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none pr-10 text-lg"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            maxLength={140}
                        />
                        {/* Emoji Button */}
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="absolute bottom-3 right-3 text-slate-400 hover:text-yellow-500 transition"
                        >
                            <Smile className="w-6 h-6" />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute top-full right-0 z-50 mt-2 shadow-xl">
                                <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} />
                            </div>
                        )}
                    </div>
                    <div className="text-right text-xs text-slate-400 mt-1">{question.length}/140</div>
                </div>

                {/* Options Inputs */}
                <div className="space-y-3 mb-8">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Poll Options (Min 2, Max 4)</label>
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <input
                                className="flex-1 p-3 border rounded-lg focus:border-blue-500 outline-none transition"
                                value={opt}
                                onChange={(e) => updateOption(idx, e.target.value)}
                                placeholder={`Option ${idx + 1}`}
                                maxLength={30}
                            />
                            {options.length > 2 && (
                                <button onClick={() => removeOption(idx)} className="text-slate-400 hover:text-red-500">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    {options.length < 4 && (
                        <button onClick={addOption} className="text-sm text-blue-600 font-bold flex items-center gap-1 hover:underline mt-2">
                            <Plus className="w-4 h-4" /> Add Option
                        </button>
                    )}
                </div>

                {/* Duration Select */}
                <div className="mb-8">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Poll Duration</label>
                    <select
                        className="w-full p-3 border rounded-lg bg-white focus:border-blue-500 outline-none"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    >
                        <option>1 day</option>
                        <option>3 days</option>
                        <option>1 week</option>
                        <option>2 weeks</option>
                    </select>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : <><Clock className="w-5 h-5" /> Save & Schedule Poll</>}
                </button>
            </div>

            {/* RIGHT: LINKEDIN PREVIEW */}
            <div className="w-full md:w-1/2 flex items-start justify-center pt-8">
                <div className="bg-white border border-slate-300 rounded-xl w-full max-w-md shadow-sm overflow-hidden">
                    {/* Fake User Header */}
                    <div className="p-4 flex gap-3 border-b border-slate-100">
                        <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                            <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">{user?.fullName || "Haris Rindh"}</div>
                            <div className="text-xs text-slate-500">Full Stack Developer • Now</div>
                        </div>
                    </div>

                    {/* Poll Content */}
                    <div className="p-4">
                        <p className="mb-4 text-slate-800 whitespace-pre-wrap text-sm leading-relaxed">{question}</p>

                        {/* The Poll Box */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            {options.map((opt, idx) => (
                                <div key={idx} className="p-3 border-b border-slate-100 hover:bg-blue-50 cursor-pointer transition group">
                                    <div className="font-bold text-sm text-blue-600 group-hover:text-blue-800">{opt}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 flex justify-between text-xs text-slate-500 font-medium">
                            <span>0 votes • {duration} left</span>
                        </div>
                    </div>

                    {/* Fake Actions */}
                    <div className="bg-slate-50 p-3 flex justify-around border-t border-slate-200 text-slate-500 text-sm font-bold">
                        <span className="cursor-pointer hover:text-blue-600">Like</span>
                        <span className="cursor-pointer hover:text-blue-600">Comment</span>
                        <span className="cursor-pointer hover:text-blue-600">Repost</span>
                        <span className="cursor-pointer hover:text-blue-600">Send</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PollCreator;