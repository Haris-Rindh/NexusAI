import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, ArrowRight, Loader2, Globe } from 'lucide-react';

const TrendHunter = ({ onUseTrend }) => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/trends');
      setTrends(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-600" /> 
          Industry Pulse
        </h1>
        <p className="text-slate-500 mt-2">Top trending topics for professionals. Click one to generate content.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {trends.map((trend) => (
            <div key={trend.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition group cursor-pointer" 
              onClick={() => onUseTrend(trend.topic)}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {trend.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <TrendingUp className="w-3 h-3" /> {trend.volume}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition">
                {trend.topic}
              </h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">
                {trend.summary}
              </p>

              <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition flex items-center justify-center gap-2">
                Write About This <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendHunter;