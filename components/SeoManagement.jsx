import React, { useState } from 'react';
import { Save, Globe, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function SeoManagement({ seoSettings, onSave, isRtl, t }) {
  const [formData, setFormData] = useState(seoSettings);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
          <Globe className="w-3.5 h-3.5" />
          <span>{isRtl ? 'إدارة محركات البحث (SEO)' : 'SEO Management'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">
          {isRtl ? 'إعدادات ميتا تاج والظهور الاجتماعي' : 'Meta Tags & Social Sharing'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Fields */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white" rows={3} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2"><ImageIcon className="w-4 h-4"/>OG Image URL</label>
              <input type="text" value={formData.ogImage} onChange={(e) => setFormData({...formData, ogImage: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2"><ImageIcon className="w-4 h-4"/>Twitter Image URL</label>
              <input type="text" value={formData.twitterImage} onChange={(e) => setFormData({...formData, twitterImage: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white" />
            </div>
          </div>
          <button onClick={() => onSave(formData)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500 transition">
            <Save className="w-4 h-4"/> {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>

        {/* Live Preview Container */}
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{isRtl ? 'معاينة بحث جوجل' : 'Google Search Preview'}</h3>
            <div className="p-4 rounded-xl bg-white text-left font-sans">
              <div className="text-blue-800 text-lg hover:underline cursor-pointer">{formData.title || 'Page Title'}</div>
              <div className="text-green-700 text-sm">lernweb.com</div>
              <div className="text-slate-600 text-sm">{formData.description || 'Page description will appear here...'}</div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{isRtl ? 'معاينة بطاقة التواصل الاجتماعي (OG)' : 'Social Media Preview (OG)'}</h3>
            <div className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">
              <img src={formData.ogImage || 'https://via.placeholder.com/600x315'} alt="Preview" className="w-full h-40 object-cover" />
              <div className="p-4 space-y-1">
                <div className="text-white font-bold">{formData.title || 'Page Title'}</div>
                <div className="text-slate-400 text-sm line-clamp-2">{formData.description || 'Page description...'}</div>
                <div className="text-slate-500 text-xs uppercase font-bold mt-2">lernweb.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
