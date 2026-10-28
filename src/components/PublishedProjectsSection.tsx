import React, { useState } from 'react';
import { ExternalLink, Video, Plus, Trash2, Save, Image as ImageIcon, FileText, Calendar, X, Star } from 'lucide-react';
import { PublishedProject, storageService } from '../services/storageService';

interface Props {
  projects: PublishedProject[];
  lang: 'ar' | 'en';
  isAdmin: boolean;
  onRefresh: () => void;
}

export const PublishedProjectsSection: React.FC<Props> = ({ projects, lang, isAdmin, onRefresh }) => {
  const isRtl = lang === 'ar';
  const [editing, setEditing] = useState<Partial<PublishedProject> | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const saveProject = () => {
    if (!editing || (!editing.titleAr && !editing.titleEn)) return;
    const project: PublishedProject = {
      id: editing.id || 'proj-' + Math.random().toString(36).substr(2, 9),
      titleAr: editing.titleAr || editing.titleEn || '',
      titleEn: editing.titleEn || editing.titleAr || '',
      descriptionAr: editing.descriptionAr || '',
      descriptionEn: editing.descriptionEn || '',
      websiteUrl: editing.websiteUrl || '',
      imageUrl: editing.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      videoUrl: editing.videoUrl,
      createdAt: editing.createdAt || new Date().toISOString()
    };
    storageService.savePublishedProject(project);
    setEditing(null);
    setShowAddForm(false);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا المشروع من المعرض؟' : 'Are you sure you want to delete this project?')) {
      storageService.deletePublishedProject(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {isAdmin && (
        <div className="space-y-4">
          {!showAddForm ? (
            <button 
              onClick={() => { setEditing({}); setShowAddForm(true); }}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>{isRtl ? 'نشر مشروع جديد في المعرض' : 'Publish New Project to Portfolio'}</span>
            </button>
          ) : (
            <div className="rounded-3xl border border-blue-500/30 bg-slate-900/90 p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-400" />
                  <span>{isRtl ? 'إضافة بيانات المشروع الجديد' : 'Add Project Details'}</span>
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'العنوان بالعربية' : 'Title (Arabic)'}</label>
                    <input 
                      type="text"
                      value={editing?.titleAr || ''} 
                      onChange={e => setEditing({...editing, titleAr: e.target.value})} 
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'العنوان بالإنجليزية' : 'Title (English)'}</label>
                    <input 
                      type="text"
                      value={editing?.titleEn || ''} 
                      onChange={e => setEditing({...editing, titleEn: e.target.value})} 
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط الموقع (Live URL)' : 'Website URL'}</label>
                    <input 
                      type="url"
                      value={editing?.websiteUrl || ''} 
                      onChange={e => setEditing({...editing, websiteUrl: e.target.value})} 
                      placeholder="https://..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-blue-400 focus:border-blue-500 outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط صورة المعاينة' : 'Preview Image URL'}</label>
                    <input 
                      type="url"
                      value={editing?.imageUrl || ''} 
                      onChange={e => setEditing({...editing, imageUrl: e.target.value})} 
                      placeholder="https://..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط الفيديو (اختياري)' : 'Video URL (Optional)'}</label>
                    <input 
                      type="url"
                      value={editing?.videoUrl || ''} 
                      onChange={e => setEditing({...editing, videoUrl: e.target.value})} 
                      placeholder="YouTube link..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'وصف المشروع بالعربية' : 'Description (Arabic)'}</label>
                    <textarea 
                      rows={2}
                      value={editing?.descriptionAr || ''} 
                      onChange={e => setEditing({...editing, descriptionAr: e.target.value})} 
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={saveProject} 
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl text-base font-bold shadow-xl shadow-emerald-900/20 transition active:scale-[0.98]"
              >
                <Save className="w-5 h-5" />
                <span>{isRtl ? 'حفظ ونشر المشروع في المعرض' : 'Save & Publish Project'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length === 0 ? (
          <div className="col-span-full py-20 text-center rounded-3xl border border-slate-800 bg-slate-900/40">
            <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-500">{isRtl ? 'لا توجد مشاريع منشورة حالياً' : 'No published projects yet'}</h4>
          </div>
        ) : (
          projects.map((project) => (
            <div 
              key={project.id} 
              className="group relative flex flex-col rounded-[2.5rem] border border-slate-800 bg-slate-900/60 transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
            >
              {/* Image Container with Overlay */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={project.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'} 
                  alt={isRtl ? project.titleAr : project.titleEn} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                {/* Floating Date Badge */}
                <div className="absolute top-4 right-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5 flex items-center gap-2 text-[10px] font-bold text-white">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  <span>{new Date(project.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short' })}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {isRtl ? project.titleAr : project.titleEn}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 font-medium">
                    {isRtl ? project.descriptionAr : project.descriptionEn}
                  </p>
                  
                  {/* Rating Display */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{project.rating || 5.0}</span>
                    <span className="text-slate-500 font-normal">({project.reviewsCount || 0})</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex gap-4">
                    <a 
                      href={project.websiteUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600/10 border border-blue-500/20 px-4 py-2 text-xs font-bold text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'الموقع' : 'Visit Site'}</span>
                    </a>
                    
                    {project.videoUrl && (
                      <a 
                        href={project.videoUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600/10 border border-rose-500/20 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'فيديو' : 'Video'}</span>
                      </a>
                    )}
                  </div>

                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(project.id)} 
                      className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                      title={isRtl ? 'حذف من المعرض' : 'Delete from portfolio'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
