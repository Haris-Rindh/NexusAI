import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Sparkles, Copy, Loader2, Send, Clock, Calendar, Image as ImageIcon, X, Check, Lightbulb, Edit2 } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import toast from 'react-hot-toast';

const API_URL = "http://localhost:3000";

const GeneratorView = ({ initialTopic }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  
  // --- STATE ---
  const [topic, setTopic] = useState(initialTopic || '');
  const [options, setOptions] = useState({ tone: 'Professional', length: 'Medium' });
  const [suggestions, setSuggestions] = useState([]); 
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); 
  const [scheduleDate, setScheduleDate] = useState("");
  const [copiedId, setCopiedId] = useState(null); 
  const [suggesting, setSuggesting] = useState(false);
  
  // EDITING STATE
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const fileInputRef = useRef(null);
  const [uploadingPostId, setUploadingPostId] = useState(null);

  useEffect(() => { if (initialTopic) setTopic(initialTopic); }, [initialTopic]);

  const handleSuggestTopic = async () => {
    setSuggesting(true);
    try {
      const res = await axios.get(`${API_URL}/api/suggest-topic`);
      setTopic(res.data.topic);
      toast.success("Topic inspired!");
    } catch (e) { toast.error("Failed to inspire"); } 
    finally { setSuggesting(false); }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic!");
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await axios.post(`${API_URL}/api/generate`, { userId: user.id, topic, options });
      setSuggestions(res.data.data);
      toast.success("Ideas generated!");
    } catch (e) { toast.error("Generation failed"); } 
    finally { setLoading(false); }
  };

  // --- EDITING FUNCTIONS ---
  const startEditing = (post) => {
    setEditingId(post.id);
    setEditedContent(post.content);
  };

  const saveEdit = (postId) => {
    const updated = suggestions.map(p => p.id === postId ? { ...p, content: editedContent } : p);
    setSuggestions(updated);
    setEditingId(null);
    toast.success("Changes applied");
  };

  // --- MANUAL IMAGE UPLOAD ---
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && uploadingPostId) {
      if (file.size > 2 * 1024 * 1024) return toast.error("Image too large (Max 2MB)");
      try {
        const base64 = await convertToBase64(file);
        setSuggestions(prev => prev.map(p => p.id === uploadingPostId ? { ...p, image: base64 } : p));
        toast.success("Image attached");
      } catch (err) { toast.error("Upload failed"); }
    }
    setUploadingPostId(null);
    e.target.value = null;
  };

  const triggerFileUpload = (postId) => {
    setUploadingPostId(postId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleRemoveImage = (postId) => {
    const updatedSuggestions = suggestions.map(p => 
      p.id === postId ? { ...p, image: null } : p
    );
    setSuggestions(updatedSuggestions);
  };

  const handleSave = async (post, status = 'draft', date = null) => {
    try {
      await axios.post(`${API_URL}/api/save`, {
        userId: user.id, topic: topic || "Untitled", 
        content: post.content, // Saves the edited content
        image: post.image, status, scheduledAt: date
      });
      setShowScheduleModal(false);
      toast.success(status === 'published' ? "Published!" : "Scheduled!");
    } catch (e) { toast.error("Save failed"); }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-2rem)] font-sans max-w-5xl mx-auto">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* INPUT AREA - Full Width Now */}
      <div className="w-full mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
             <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900"><Sparkles className="text-blue-600"/> New Post</h1>
             <button onClick={handleSuggestTopic} disabled={suggesting} className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition">
               {suggesting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Lightbulb className="w-3 h-3"/>} Inspire Me
             </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select className="p-3 border rounded-xl bg-slate-50 text-slate-900" value={options.tone} onChange={e=>setOptions({...options, tone: e.target.value})}>
              <option>Professional</option><option>Viral/Hook</option><option>Storytelling</option><option>Controversial</option>
            </select>
            <select className="p-3 border rounded-xl bg-slate-50 text-slate-900" value={options.length} onChange={e=>setOptions({...options, length: e.target.value})}>
              <option>Medium (LinkedIn)</option><option>Short (Tweet)</option><option>Long (Article)</option>
            </select>
          </div>

          <textarea 
            className="w-full p-4 border rounded-xl h-32 text-lg focus:ring-2 ring-blue-500 outline-none resize-none text-slate-900 placeholder:text-slate-300"
            placeholder="What's on your mind?"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />

          <button onClick={handleGenerate} disabled={loading} className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <><Sparkles className="w-5 h-5"/> Generate 3 Variations</>}
          </button>
        </div>
      </div>

      {/* RESULTS GRID - Full Width */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {suggestions.map((post) => (
          <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-700 truncate">{post.title}</span>
              <div className="flex gap-2">
                <button onClick={() => {setUploadingPostId(post.id); fileInputRef.current.click();}} className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                  <ImageIcon className="w-3 h-3"/>
                </button>
                {/* EDIT TOGGLE */}
                <button 
                  onClick={() => editingId === post.id ? saveEdit(post.id) : startEditing(post)}
                  className={`text-xs font-bold flex items-center gap-1 px-3 py-1 rounded transition ${editingId === post.id ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {editingId === post.id ? <Check className="w-3 h-3"/> : <Edit2 className="w-3 h-3"/>}
                </button>
              </div>
            </div>

            {post.image && (
              <div className="mb-4 rounded-lg overflow-hidden shadow-sm border border-slate-100 relative group h-40 flex-shrink-0">
                <img src={post.image} alt="Upload" className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleRemoveImage(post.id)}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* EDITABLE CONTENT AREA */}
            <div className="flex-grow">
              {editingId === post.id ? (
                <textarea 
                  className="w-full h-48 p-3 border rounded-lg bg-slate-50 text-sm leading-relaxed outline-none focus:border-blue-500 resize-none"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              ) : (
                <div className="text-sm text-slate-600 whitespace-pre-wrap mb-4 leading-relaxed font-medium h-48 overflow-y-auto scrollbar-thin">
                  {post.content}
                  <button 
                    onClick={() => handleCopy(post.content, post.id)}
                    className="absolute top-[70px] right-6 p-1.5 text-slate-400 hover:text-blue-600 bg-white/80 rounded-lg transition border border-slate-100 shadow-sm"
                    title="Copy text"
                  >
                    {copiedId === post.id ? <Check className="w-3 h-3 text-green-500"/> : <Copy className="w-3 h-3"/>}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-auto pt-4 border-t border-slate-50">
               <button onClick={() => handleSave(post, 'published')} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex justify-center gap-2 transition"><Send className="w-4 h-4" /> Publish</button>
               <button onClick={() => {setSelectedPost(post); setShowScheduleModal(true)}} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 flex justify-center gap-2 transition"><Clock className="w-4 h-4" /> Schedule</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar className="text-blue-600"/> Pick Date</h3>
            <input type="datetime-local" className="w-full p-3 border rounded-lg mb-6" onChange={(e) => setScheduleDate(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-2 text-slate-500 font-bold">Cancel</button>
              <button onClick={() => handleSave(selectedPost, 'scheduled', scheduleDate)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratorView;