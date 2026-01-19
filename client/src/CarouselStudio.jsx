import React, { useState, useRef } from 'react';
import { Plus, Trash2, Download, Save, Loader2, Sparkles, Layout, Palette, ArrowUp, ArrowDown, Type, Send, Clock, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import toast from 'react-hot-toast';

const API_URL = "http://localhost:3000";

const CarouselStudio = () => {
  const { user } = useUser();
  const [topic, setTopic] = useState("");
  const [slideCountInput, setSlideCountInput] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Editor State
  const [editorTab, setEditorTab] = useState("content"); 
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Schedule State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  // Design State
  const [globalTheme, setGlobalTheme] = useState({ bg: "bg-blue-600", text: "text-white", pattern: "none" });
  const [customColors, setCustomColors] = useState({ bg: "#2563eb", text: "#ffffff" });
  const [useCustomColor, setUseCustomColor] = useState(false);

  const [slides, setSlides] = useState([
    { id: 1, title: "Carousel Title", content: "Introduction slide." },
    { id: 2, title: "Point 1", content: "Explain your first point." },
    { id: 3, title: "Summary", content: "Call to action." }
  ]);
  
  const printRef = useRef();

  const themes = [
    { name: "Classic Blue", bg: "bg-blue-600", text: "text-white" },
    { name: "Midnight", bg: "bg-slate-900", text: "text-white" },
    { name: "Clean", bg: "bg-white", text: "text-slate-900" },
    { name: "Royal", bg: "bg-purple-700", text: "text-white" },
    { name: "Forest", bg: "bg-green-700", text: "text-white" },
    { name: "Sunset", bg: "bg-orange-500", text: "text-white" },
    { name: "Berry", bg: "bg-pink-600", text: "text-white" },
    { name: "Teal", bg: "bg-teal-600", text: "text-white" },
    { name: "Cyber", bg: "bg-black", text: "text-green-400" },
    { name: "Gold", bg: "bg-yellow-500", text: "text-black" },
    { name: "Slate", bg: "bg-slate-500", text: "text-white" },
    { name: "Red", bg: "bg-red-600", text: "text-white" },
  ];

  const patterns = [
    { id: 'none', label: 'None', style: {} },
    { id: 'dots', label: 'Dots', style: { backgroundImage: 'radial-gradient(#ffffff20 2px, transparent 2px)', backgroundSize: '20px 20px' } },
    { id: 'grid', label: 'Grid', style: { backgroundImage: 'linear-gradient(#ffffff10 1px, transparent 1px), linear-gradient(90deg, #ffffff10 1px, transparent 1px)', backgroundSize: '30px 30px' } },
    { id: 'stars', label: 'Stars', style: { backgroundImage: 'radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px', backgroundPosition: '0 0, 25px 25px' } },
    { id: 'lines', label: 'Lines', style: { backgroundImage: 'repeating-linear-gradient(45deg, #ffffff10 0, #ffffff10 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' } },
    { id: 'circle', label: 'Circles', style: { backgroundImage: 'radial-gradient(circle, #ffffff10 10%, transparent 10%)', backgroundSize: '40px 40px' } },
    { id: 'check', label: 'Checker', style: { backgroundImage: 'linear-gradient(45deg, #ffffff10 25%, transparent 25%), linear-gradient(-45deg, #ffffff10 25%, transparent 25%)', backgroundSize: '40px 40px' } },
    { id: 'noise', label: 'Noise', style: { backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.1%22/%3E%3C/svg%3E")' } },
  ];

  const handleAiGenerate = async () => {
    if (!topic) return toast.error("Enter a topic first");
    setIsGenerating(true);
    try {
      const res = await axios.post(`${API_URL}/api/generate-carousel`, { 
        topic,
        slideCount: parseInt(slideCountInput)
      });
      
      if (res.data && Array.isArray(res.data.data)) {
          setSlides(res.data.data);
          setActiveSlide(0);
          toast.success("Slides generated!");
      } else {
          toast.error("Invalid AI response");
      }
    } catch (e) {
      console.error(e);
      toast.error("AI Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const addSlide = () => {
    setSlides([...slides, { id: Date.now(), title: "New Slide", content: "Add content" }]);
    setActiveSlide(slides.length);
  };

  const removeSlide = (index) => {
    if (slides.length === 1) return;
    setSlides(slides.filter((_, i) => i !== index));
    setActiveSlide(prev => prev > 0 ? prev - 1 : 0);
  };

  const moveSlide = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + direction];
    newSlides[index + direction] = temp;
    setSlides(newSlides);
    setActiveSlide(index + direction);
  };

  const updateSlide = (key, value) => {
    const newSlides = [...slides];
    newSlides[activeSlide][key] = value;
    setSlides(newSlides);
  };

  const applyTheme = (theme) => {
    setUseCustomColor(false);
    setGlobalTheme(prev => ({ ...prev, bg: theme.bg, text: theme.text }));
  };

  const applyPattern = (patternId) => {
    setGlobalTheme(prev => ({ ...prev, pattern: patternId }));
  };

  // --- SAVE & SCHEDULE ---
  const handleSave = async (status = 'draft', date = null) => {
    setIsSaving(true);
    try {
      await axios.post(`${API_URL}/api/save`, {
        userId: user.id,
        topic: slides[0].title,
        type: 'carousel',
        status: status,
        scheduledAt: date,
        carouselData: slides.map(s => ({
          ...s,
          style: {
            bg: useCustomColor ? customColors.bg : globalTheme.bg,
            text: useCustomColor ? customColors.text : globalTheme.text,
            pattern: globalTheme.pattern
          }
        }))
      });
      setShowScheduleModal(false);
      if (status === 'published') toast.success("Carousel Published to LinkedIn!");
      else if (status === 'scheduled') toast.success("Carousel Scheduled!");
      else toast.success("Saved to Vault!");
    } catch (e) { toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    const element = printRef.current;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const slidesToPrint = element.children;

    for (let i = 0; i < slidesToPrint.length; i++) {
      const canvas = await html2canvas(slidesToPrint[i], { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, width, width); 
    }
    pdf.save('linkedin-carousel.pdf');
    setIsDownloading(false);
  };

  const currentStyle = {
    bgClass: useCustomColor ? '' : globalTheme.bg,
    bgColor: useCustomColor ? customColors.bg : '',
    textClass: useCustomColor ? '' : globalTheme.text,
    textColor: useCustomColor ? customColors.text : '',
    patternStyle: patterns.find(p => p.id === globalTheme.pattern)?.style || {}
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto gap-6 pb-20 font-sans">
      
      {/* 1. EDITOR PANEL */}
      <div className="w-full lg:w-1/3 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden order-2 lg:order-1 h-[600px]">
        
        {/* TABS */}
        <div className="flex border-b border-slate-100">
          <button onClick={() => setEditorTab('content')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${editorTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}><Type className="w-4 h-4"/> Content</button>
          <button onClick={() => setEditorTab('design')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${editorTab === 'design' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}><Palette className="w-4 h-4"/> Design</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {editorTab === 'content' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex justify-between"><span>Auto-Generate</span><span>Slides: {slideCountInput}</span></label>
                <div className="flex gap-2 mb-2">
                  <input className="flex-1 p-2 text-sm border rounded-lg" placeholder="Topic..." value={topic} onChange={(e) => setTopic(e.target.value)}/>
                  <input type="number" min="3" max="10" className="w-16 p-2 text-sm border rounded-lg text-center" value={slideCountInput} onChange={(e) => setSlideCountInput(e.target.value)}/>
                </div>
                <button onClick={handleAiGenerate} disabled={isGenerating} className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50">{isGenerating ? <Loader2 className="w-3 h-3 animate-spin mx-auto"/> : "Generate Content"}</button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Slide {activeSlide + 1}</label>
                  <div className="flex gap-1">
                    <button onClick={() => moveSlide(activeSlide, -1)} className="p-1 hover:bg-slate-100 rounded" title="Move Up"><ArrowUp className="w-4 h-4 text-slate-500"/></button>
                    <button onClick={() => moveSlide(activeSlide, 1)} className="p-1 hover:bg-slate-100 rounded" title="Move Down"><ArrowDown className="w-4 h-4 text-slate-500"/></button>
                  </div>
                </div>
                <input className="w-full p-3 border rounded-lg font-bold mb-3" value={slides[activeSlide]?.title || ""} onChange={(e) => updateSlide('title', e.target.value)} placeholder="Title"/>
                <textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={slides[activeSlide]?.content || ""} onChange={(e) => updateSlide('content', e.target.value)} placeholder="Content"/>
              </div>

              <div className="flex justify-between pt-2">
                 <button onClick={() => removeSlide(activeSlide)} className="text-red-500 text-xs font-bold flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded"><Trash2 className="w-3 h-3"/> Delete Slide</button>
                 <button onClick={addSlide} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded"><Plus className="w-3 h-3"/> Add Slide</button>
              </div>
            </div>
          )}

          {editorTab === 'design' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Themes</label>
                <div className="grid grid-cols-4 gap-2">
                  {themes.map((t, i) => (<button key={i} onClick={() => applyTheme(t)} className={`h-8 rounded-full border border-slate-200 ${t.bg}`} title={t.name}></button>))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Patterns</label>
                <div className="grid grid-cols-4 gap-2">
                  {patterns.map((p) => (<button key={p.id} onClick={() => applyPattern(p.id)} className={`h-10 rounded-lg border transition ${globalTheme.pattern === p.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200 hover:border-blue-300'}`} style={{ ...p.style, backgroundColor: '#f1f5f9' }} title={p.label}></button>))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. PREVIEW PANEL */}
      <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-4 lg:p-8 min-h-[500px] relative overflow-hidden order-1 lg:order-2">
        <div 
          className={`w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] shadow-2xl rounded-lg flex flex-col justify-center p-8 transition-colors duration-300 relative ${currentStyle.bgClass}`}
          style={{ backgroundColor: currentStyle.bgColor, color: currentStyle.textColor, ...currentStyle.patternStyle }}
        >
          <div className={`absolute top-8 left-8 text-sm font-bold opacity-50 ${currentStyle.textClass}`}>Haris Rindh.</div>
          <div className="relative z-10">
            <h1 className={`text-2xl lg:text-5xl font-bold mb-6 leading-tight ${currentStyle.textClass}`} style={{color: currentStyle.textColor}}>{slides[activeSlide]?.title}</h1>
            <p className={`text-sm lg:text-xl opacity-90 whitespace-pre-wrap leading-relaxed ${currentStyle.textClass}`} style={{color: currentStyle.textColor}}>{slides[activeSlide]?.content}</p>
          </div>
          <div className={`absolute bottom-8 right-8 text-sm font-bold opacity-50 ${currentStyle.textClass}`} style={{color: currentStyle.textColor}}>{activeSlide + 1} / {slides.length}</div>
        </div>
        <div className="absolute bottom-6 flex gap-2">
           {slides.map((_, idx) => (<button key={idx} onClick={() => setActiveTab(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === activeSlide ? 'bg-slate-800 w-6' : 'bg-slate-400'}`} />))}
        </div>
      </div>

      {/* 3. ACTIONS PANEL (UPDATED) */}
      <div className="w-full lg:w-1/6 flex flex-col gap-3 order-3">
         <button onClick={() => handleSave('published')} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 flex flex-col items-center justify-center gap-2">
           <Send className="w-6 h-6" /><span className="text-sm">Publish Now</span>
         </button>
         <button onClick={() => setShowScheduleModal(true)} className="w-full py-4 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 flex flex-col items-center justify-center gap-2">
           <Clock className="w-6 h-6" /><span className="text-sm">Schedule</span>
         </button>
         <button onClick={() => handleSave('draft')} disabled={isSaving} className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 flex flex-col items-center justify-center gap-1">
           {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Save className="w-4 h-4" /><span className="text-xs">Save Draft</span></>}
         </button>
         <button onClick={downloadPDF} disabled={isDownloading} className="w-full py-2 text-slate-500 hover:text-slate-900 font-bold flex items-center justify-center gap-2 text-xs">
           {isDownloading ? "..." : <><Download className="w-4 h-4" /> Download PDF</>}
         </button>
      </div>

      {/* HIDDEN PRINT AREA */}
      <div className="absolute top-0 left-[-9999px]" ref={printRef}>
        {slides.map((slide, idx) => (
          <div key={idx} className={`w-[1080px] h-[1080px] p-20 flex flex-col justify-center relative ${currentStyle.bgClass}`} style={{ backgroundColor: currentStyle.bgColor, color: currentStyle.textColor, ...currentStyle.patternStyle }}>
             <div className={`absolute top-16 left-16 text-4xl font-bold opacity-50 ${currentStyle.textClass}`} style={{color: currentStyle.textColor}}>Haris Rindh.</div>
             <h1 className={`text-[90px] font-bold mb-16 leading-tight ${currentStyle.textClass}`} style={{color: currentStyle.textColor}}>{slide.title}</h1>
             <p className={`text-[50px] opacity-90 leading-relaxed ${currentStyle.textClass}`} style={{color: currentStyle.textColor}}>{slide.content}</p>
             <div className={`absolute bottom-16 right-16 text-4xl font-bold opacity-50 ${currentStyle.textClass}`} style={{color: currentStyle.textColor}}>{idx + 1} / {slides.length}</div>
          </div>
        ))}
      </div>

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar className="text-blue-600"/> Pick Date</h3>
            <input type="datetime-local" className="w-full p-3 border rounded-lg mb-6" onChange={(e) => setScheduleDate(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-2 text-slate-500 font-bold">Cancel</button>
              <button onClick={() => handleSave('scheduled', scheduleDate)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselStudio;