import React, { useState } from 'react';
import { 
  Users, Plus, Trash2, Edit3, ShieldCheck, Phone, MessageSquare, 
  ExternalLink, Check, Key, Search, UserCheck, UserX, AlertCircle, Save, X 
} from 'lucide-react';
import { storageService, StaffMember } from '../services/storageService';

interface StaffManagerProps {
  staffList: StaffMember[];
  lang?: 'ar' | 'en';
  onRefresh: () => void;
  triggerSaveNotification: (msg: string) => void;
}

export const StaffManager: React.FC<StaffManagerProps> = ({
  staffList,
  lang = 'ar',
  onRefresh,
  triggerSaveNotification
}) => {
  const isRtl = lang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState(isRtl ? 'مسؤول خدمة العملاء (Customer Service)' : 'Customer Service');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['support', 'orders']);

  const PERMISSION_OPTIONS = [
    { id: 'support', labelAr: 'محادثات وتذاكر الدعم الفني', labelEn: 'Customer Support Tickets' },
    { id: 'orders', labelAr: 'مراجعة وتأكيد الطلبات والسداد', labelEn: 'Orders & Payment Verification' },
    { id: 'cms', labelAr: 'إدارة المقالات والإعلانات والأسئلة', labelEn: 'CMS Blog & Announcements' },
    { id: 'analytics', labelAr: 'عرض تحليلات المنصة والتقارير', labelEn: 'View Platform Analytics' },
    { id: 'settings', labelAr: 'إعدادات المنظومة والمفاتيح', labelEn: 'System Settings & Keys' },
  ];

  const handleTogglePermission = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const handleStartEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setName(member.name);
    setRole(member.roleAr);
    setPhone(member.phone);
    setWhatsapp(member.whatsapp);
    setTelegram(member.telegram || '');
    setSelectedPermissions(member.permissions || ['support', 'orders']);
  };

  const handleCancelEdit = () => {
    setEditingStaff(null);
    setName('');
    setRole(isRtl ? 'مسؤول خدمة العملاء (Customer Service)' : 'Customer Service');
    setPhone('');
    setWhatsapp('');
    setTelegram('');
    setSelectedPermissions(['support', 'orders']);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert(isRtl ? 'يرجى إدخال اسم الموظف ورقم الهاتف' : 'Please provide staff name and phone');
      return;
    }

    const cleanPhone = phone.trim().replace(/[^\d]/g, '');
    const cleanWhatsapp = whatsapp.trim() || `https://wa.me/${cleanPhone.startsWith('2') ? cleanPhone : '2' + cleanPhone}`;

    const memberToSave: StaffMember = {
      id: editingStaff ? editingStaff.id : 'staff-' + Date.now(),
      name: name.trim(),
      roleAr: role,
      roleEn: role,
      phone: cleanPhone,
      whatsapp: cleanWhatsapp,
      telegram: telegram.trim() || undefined,
      permissions: selectedPermissions,
      isActive: editingStaff ? editingStaff.isActive : true,
      createdAt: editingStaff ? editingStaff.createdAt : new Date().toISOString()
    };

    storageService.saveStaffMember(memberToSave);
    onRefresh();
    handleCancelEdit();
    triggerSaveNotification(
      editingStaff 
        ? (isRtl ? 'تم تحديث بيانات موظف خدمة العملاء بنجاح!' : 'Staff details updated!') 
        : (isRtl ? 'تم إضافة عضو فريق خدمة العملاء وتوليد كود الدخول الخاص به (100100 + الهاتف)!' : 'New staff added with login passcode 100100!')
    );
  };

  const handleDelete = (id: string, memberName: string) => {
    if (window.confirm(isRtl ? `هل أنت متأكد من حذف الموظف (${memberName}) نهائياً؟` : `Delete staff member (${memberName})?`)) {
      storageService.deleteStaffMember(id);
      onRefresh();
      triggerSaveNotification(isRtl ? 'تم حذف العضو من فريق العمل.' : 'Staff member removed.');
    }
  };

  const filteredStaff = staffList.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.roleAr.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
          <Users className="w-4 h-4 text-blue-400" />
          <span>{isRtl ? 'مكون إدارة المشرفين وخدمة العملاء (StaffManager)' : 'Staff & Customer Support Manager'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          {isRtl ? 'إدارة أعضاء فريق خدمة العملاء وتحديد الصلاحيات' : 'Customer Service Team & Permissions'}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          {isRtl 
            ? 'قم بإضافة موظفي خدمة العملاء والدعم الفني، وتحديد أرقام هواتفهم وروابط التواصل. يدخل الموظفون المنظومة برقم هاتفهم وكود المشرف الرئيسي (100100).' 
            : 'Add support staff and assign custom operational permissions. Staff members log in using their phone number and admin passcode (100100).'}
        </p>

        {/* Login credentials rule badge */}
        <div className="pt-2 flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl w-fit">
          <Key className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{isRtl ? 'كود تسجيل دخول الموظفين المعتمد: [رقم الهاتف] + [كود المشرف: 100100]' : 'Staff Login Passcode: [Phone Number] + [Master Code: 100100]'}</span>
        </div>
      </div>

      {/* Add / Edit Staff Form */}
      <form onSubmit={handleSaveStaff} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            {editingStaff ? <Edit3 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-blue-400" />}
            <span>
              {editingStaff 
                ? (isRtl ? `تعديل بيانات الموظف: ${editingStaff.name}` : `Edit Staff: ${editingStaff.name}`) 
                : (isRtl ? 'إضافة موظف أو مشرف خدمة عملاء جديد' : 'Add New Support / Staff Member')}
            </span>
          </h3>

          {editingStaff && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:text-white"
            >
              {isRtl ? 'إلغاء التعديل' : 'Cancel Edit'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">{isRtl ? 'اسم الموظف / المشرف:' : 'Staff Full Name:'}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isRtl ? 'مثال: أ. محمود السعيد' : 'e.g. Mahmoud Al-Saeed'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">{isRtl ? 'الوظيفة / المسمى الوظيفي:' : 'Role / Title:'}</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value={isRtl ? 'مسؤول خدمة العملاء (Customer Service)' : 'Customer Service'}>{isRtl ? 'مسؤول خدمة العملاء (Customer Service)' : 'Customer Service'}</option>
              <option value={isRtl ? 'دعم فني وتقني (Technical Support)' : 'Technical Support'}>{isRtl ? 'دعم فني وتقني (Technical Support)' : 'Technical Support'}</option>
              <option value={isRtl ? 'مدير مبيعات وتأكيد طلبات' : 'Sales & Orders Manager'}>{isRtl ? 'مدير مبيعات وتأكيد طلبات' : 'Sales & Orders Manager'}</option>
              <option value={isRtl ? 'مشرف عام (Super Admin)' : 'Super Admin'}>{isRtl ? 'مشرف عام (Super Admin)' : 'Super Admin'}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">{isRtl ? 'رقم الهاتف (للتسجيل والدخول):' : 'Phone Number (For Login):'}</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط الواتساب (WhatsApp URL):' : 'WhatsApp Link:'}</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="https://wa.me/2010..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط التلجرام (Telegram Link):' : 'Telegram Link:'}</label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="https://t.me/username"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-blue-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Permissions Selection Grid */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 block">{isRtl ? 'صلاحيات الموظف في لوحة التحكم:' : 'Assigned Permissions:'}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {PERMISSION_OPTIONS.map((p) => {
              const isSelected = selectedPermissions.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleTogglePermission(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                    isSelected 
                      ? 'bg-blue-950/40 border-blue-500 text-white' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold">{isRtl ? p.labelAr : p.labelEn}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{editingStaff ? (isRtl ? 'حفظ التعديلات' : 'Update Staff') : (isRtl ? 'حفظ وإضافة الموظف' : 'Save & Add Staff')}</span>
          </button>
        </div>
      </form>

      {/* Staff List Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>{isRtl ? `أعضاء الفريق المسجلون (${staffList.length})` : `Registered Staff (${staffList.length})`}</span>
          </h3>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute top-3 right-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'بحث باسم الموظف أو الهاتف...' : 'Search staff by name or phone...'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pr-9 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Staff Members Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div key={member.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{member.name}</h4>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mt-1">
                        {member.roleAr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(member)}
                      className="text-slate-400 hover:text-blue-400 p-1.5 rounded-xl transition cursor-pointer"
                      title={isRtl ? 'تعديل البيانات' : 'Edit'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(member.id, member.name)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-xl transition cursor-pointer"
                      title={isRtl ? 'حذف الموظف' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">{isRtl ? 'الهاتف (كود الدخول):' : 'Phone:'}</span>
                    <span className="text-white font-bold">{member.phone}</span>
                  </div>

                  {member.whatsapp && (
                    <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 hover:underline">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'محادثة الواتساب' : 'WhatsApp Chat'}</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {member.telegram && (
                    <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-400 hover:underline">
                      <span>{isRtl ? 'رابط التلجرام' : 'Telegram Link'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">{isRtl ? 'الصلاحيات المتاحة:' : 'Permissions:'}</span>
                  <div className="flex flex-wrap gap-1">
                    {(member.permissions || []).map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'مُصرح ومُفعل' : 'Active & Authorized'}</span>
                </span>
                <span className="font-mono text-[10px]">{new Date(member.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
