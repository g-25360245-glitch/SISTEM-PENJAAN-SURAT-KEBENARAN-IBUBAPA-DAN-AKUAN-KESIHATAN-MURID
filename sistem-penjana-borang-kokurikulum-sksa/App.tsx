
import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Calendar, MapPin, Building2, Download, Trophy, UserCog, User, Plus, Trash2 } from 'lucide-react';
import { ProgramData, initialProgramData, initialStudent } from './types';
import { generateBorangPDF, preloadLogo } from './services/pdfGenerator';

export default function App() {
  const [formData, setFormData] = useState<ProgramData>(initialProgramData);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    preloadLogo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      students: prev.students.map(student => 
        student.id === id ? { ...student, [name]: value } : student
      )
    }));
  };

  const addStudent = () => {
    setFormData(prev => ({
      ...prev,
      students: [...prev.students, { ...initialStudent, id: Date.now().toString() }]
    }));
  };

  const removeStudent = (id: string) => {
    if (formData.students.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      students: prev.students.filter(student => student.id !== id)
    }));
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const { students, ...programInfo } = formData;
      for (const student of students) {
        if (student.studentName) {
          await generateBorangPDF(student, programInfo);
        }
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <header className="bg-indigo-600 p-8 text-white text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="https://i.postimg.cc/25B49VqL/Untitled-design-(11).png" 
              alt="Logo Sekolah" 
              className="h-28 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight uppercase">
            SISTEM PENJANAAN SURAT KEBENARAN IBUBAPA DAN AKUAN KESIHATAN MURID
          </h1>
          <p className="text-indigo-100 mt-2">SK Sungai Abong • JBA 5095</p>
        </header>

        <main className="p-6 md:p-10 space-y-8">
          {/* Student Info Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="text-indigo-600 w-5 h-5" />
                <h2 className="text-lg font-bold text-slate-800">Maklumat Murid</h2>
              </div>
            </div>

            <div className="space-y-8">
              {formData.students.map((student, index) => (
                <div key={student.id} className="relative p-5 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">MURID #{index + 1}</span>
                    {formData.students.length > 1 && (
                      <button 
                        onClick={() => removeStudent(student.id)}
                        className="text-rose-500 hover:text-rose-600 p-1 transition-colors"
                        title="Buang Murid"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-slate-700">Nama Pelajar</label>
                      <input 
                        name="studentName" 
                        value={student.studentName} 
                        onChange={(e) => handleStudentChange(student.id, e)} 
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all uppercase" 
                        placeholder="NAMA PENUH MURID" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">Tahun / Kelas</label>
                        <input 
                          name="studentClass" 
                          value={student.studentClass} 
                          onChange={(e) => handleStudentChange(student.id, e)} 
                          className="p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                          placeholder="Contoh: 6 CERDIK" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">No. KP / Sijil Lahir</label>
                        <input 
                          name="studentIC" 
                          value={student.studentIC} 
                          onChange={(e) => handleStudentChange(student.id, e)} 
                          className="p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                          placeholder="000000-00-0000" 
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-slate-700">Jantina</label>
                      <select 
                        name="studentGender" 
                        value={student.studentGender} 
                        onChange={(e) => handleStudentChange(student.id, e)} 
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      >
                        <option value="">Pilih Jantina</option>
                        <option value="LELAKI">LELAKI</option>
                        <option value="PEREMPUAN">PEREMPUAN</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-2">
                <button 
                  onClick={addStudent}
                  className="flex items-center gap-2 text-sm font-bold bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 active:scale-95"
                >
                  <Plus size={18} /> Tambah Murid
                </button>
              </div>
            </div>
          </section>

          {/* Program Info Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <UserCog className="text-indigo-600 w-5 h-5" />
              <h2 className="text-lg font-bold text-slate-800">Maklumat Template Program</h2>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                   Nama Program / Aktiviti
                </label>
                <input 
                  name="programName" 
                  value={formData.programName} 
                  onChange={handleChange} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all uppercase" 
                  placeholder="CONTOH: KEJOHANAN OLAHRAGA TAHUNAN" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-500" /> Tarikh Mula
                  </label>
                  <input 
                    type="date"
                    name="programDateStart" 
                    value={formData.programDateStart} 
                    onChange={handleChange} 
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none cursor-pointer" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-500" /> Tarikh Akhir (Opsional)
                  </label>
                  <input 
                    type="date"
                    name="programDateEnd" 
                    value={formData.programDateEnd} 
                    onChange={handleChange} 
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none cursor-pointer" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-500" /> Tempat Aktiviti
                </label>
                <input 
                  name="programPlace" 
                  value={formData.programPlace} 
                  onChange={handleChange} 
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none uppercase" 
                  placeholder="CONTOH: KOMPLEKS SUKAN MUAR" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Trophy size={16} className="text-indigo-500" /> Peringkat Aktiviti
                </label>
                <select 
                  name="programLevel" 
                  value={formData.programLevel} 
                  onChange={handleChange} 
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                >
                  <option value="Peringkat Sekolah">Peringkat Sekolah</option>
                  <option value="Peringkat Daerah">Peringkat Daerah</option>
                  <option value="Peringkat Negeri">Peringkat Negeri</option>
                  <option value="Peringkat Kebangsaan">Peringkat Kebangsaan</option>
                  <option value="Peringkat Antarabangsa">Peringkat Antarabangsa</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Building2 size={16} className="text-indigo-500" /> Anjuran
                  </label>
                  <input 
                    name="programOrganizer" 
                    value={formData.programOrganizer} 
                    onChange={handleChange} 
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none uppercase" 
                    placeholder="CONTOH: PEJABAT PENDIDIKAN DAERAH MUAR"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Building2 size={16} className="text-indigo-500" /> Kelolaan
                  </label>
                  <input 
                    name="programManagedBy" 
                    value={formData.programManagedBy} 
                    onChange={handleChange} 
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none uppercase" 
                    placeholder="CONTOH: PEJABAT PENDIDIKAN DAERAH MUAR"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
            <div className="text-amber-600 font-bold text-lg mt-0.5">!</div>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Nota:</strong> Maklumat Ibu Bapa akan dijana sebagai garisan kosong (................) supaya diisi manual. Maklumat Murid dan Program yang diisi di atas akan dimasukkan terus ke dalam PDF mengikut format template yang ditetapkan.
            </p>
          </div>

          <button 
            onClick={handleDownload}
            disabled={!formData.programName || formData.students.every(s => !s.studentName) || isGenerating}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-indigo-200 ${
              !formData.programName || formData.students.every(s => !s.studentName) || isGenerating 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-0.5'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">Sedang Menjana {formData.students.filter(s => s.studentName).length} PDF...</span>
            ) : (
              <>
                <Download size={24} /> Jana & Muat Turun PDF ({formData.students.filter(s => s.studentName).length})
              </>
            )}
          </button>
        </main>
      </div>

      <footer className="mt-8 text-slate-400 text-sm flex flex-col items-center gap-1">
        <p>HAK MILIK UNIT KOKURIKULUM SKSA 2026</p>
        <p className="text-xs">MODERATOR: ACAP GARANG & BOBO KACAK</p>
      </footer>
    </div>
  );
}
