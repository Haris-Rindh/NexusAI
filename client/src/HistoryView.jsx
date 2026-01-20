import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import { Search, Filter, Calendar, ExternalLink, Edit3, Trash2, X, Save, CheckCircle, AlertCircle, FileText, Send, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from './config';

const HistoryView = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTopic, setEditTopic] = useState("");

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/history/${user.id}`);
      setPosts(res.data.data);
    } catch (e) { 
      toast.error("Failed to load history");
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent opening edit modal if clicking delete
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${API_URL}/api/history/${id}`);
      setPosts(posts.filter(p => p._id !== id));
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openEditModal = (post) => {
    setCurrentPost(post);
    setEditTopic(post.topic);
    setEditContent(post.content || "");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!currentPost) return;
    
    try {
      await axios.post(`${API_URL}/api/save`, {
        postId: currentPost._id, // Send ID to update instead of create
        userId: user.id,
        topic: editTopic,
        content: editContent,
        status: currentPost.status,
        type: currentPost.type,
        carouselData: currentPost.carouselData,
        pollData: currentPost.pollData
      });
      
      // Update local list
      setPosts(posts.map(p => p._id === currentPost._id ? { ...p, topic: editTopic, content: editContent } : p));
      setIsEditing(false);
      toast.success("Changes saved!");
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const filteredPosts = posts.filter(p => filter === 'all' ? true : p.status === filter);

  // --- CALCULATE REAL FACTS ---
  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;

  return (
    <div className="max-w-7xl mx-auto p-8 font-sans">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Content Vault</h1>
        <p className="text-slate-500 mt-1">Manage, edit, and delete your content.</p>
      </div>

      {/* --- STATS DASHBOARD (REAL FACTS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Created</div>
            <div className="text-2xl font-bold text-slate-900">{totalPosts}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Published</div>
            <div className="text-2xl font-bold text-slate-900">{publishedCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Scheduled</div>
            <div className="text-2xl font-bold text-slate-900">{scheduledCount}</div>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div className="flex gap-2">
           {['all', 'published', 'scheduled', 'draft'].map(f => (
             <button 
               key={f} 
               onClick={() => setFilter(f)}
               className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                 filter === f 
                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                   : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
          placeholder="Search your vault..."
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="flex justify-center mb-4 text-slate-300"><AlertCircle className="w-10 h-10"/></div>
            <p className="text-slate-400 font-medium">No content found here.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition group flex flex-col md:flex-row gap-6 items-start md:items-center relative">
              
              {/* DATE BADGE */}
              <div className="flex items-center gap-4 min-w-[150px]">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                  {new Date(post.createdAt).getDate()}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {new Date(post.createdAt).getFullYear()}
                  </div>
                </div>
              </div>

              {/* CONTENT PREVIEW */}
              <div className="flex-1 cursor-pointer" onClick={() => openEditModal(post)}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    post.status === 'published' ? 'bg-green-100 text-green-700' : 
                    post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {post.status}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">{post.type}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{post.topic}</h3>
                <p className="text-slate-500 text-sm line-clamp-1">
                  {post.content ? post.content.substring(0, 100) : "Visual Content (Carousel/Poll)"}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(post)}
                  className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                  title="Edit"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => handleDelete(post._id, e)}
                  className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600"/> Edit Content
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Topic Title</label>
                <input 
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 ring-blue-500 outline-none"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                />
              </div>
              
              {/* Show different inputs based on content type */}
              {currentPost?.type === 'text' || !currentPost?.type ? (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Post Body</label>
                  <textarea 
                    className="w-full p-4 border border-slate-200 rounded-xl h-64 text-sm leading-relaxed focus:ring-2 ring-blue-500 outline-none resize-none font-medium text-slate-700"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500">
                  <p>Visual content (Carousels/Polls) cannot be text-edited here yet.</p>
                  <p className="text-xs mt-2">Edit the title above.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HistoryView;