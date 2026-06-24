import { useState, useMemo, type FormEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Plus, Upload, Download, Edit3, Trash2, X, Settings, Trophy, FileSpreadsheet, Award, Users } from 'lucide-react';
import type { Question, Student, QuestionForm, StudentForm, TeacherDashboardProps } from '../types';
import Button from './Button';

const TeacherDashboard = ({ 
  students,
  setStudents,
  questions,
  setQuestions,
  leaderboard,
  rollSettings,
  setRollSettings,
  onTriggerRoll
}: TeacherDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'roll' | 'questions' | 'students' | 'metrics'>('roll');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showQModal, setShowQModal] = useState(false);
  const [showSModal, setShowSModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  const initialQForm: QuestionForm = {
    id: null,
    topic: 'Keys',
    difficulty: 'Medium',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  };
  const [qForm, setQForm] = useState<QuestionForm>(initialQForm);

  const handleSaveQuestion = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!qForm.question || qForm.options.some(o => !o) || !qForm.correctAnswer) {
      alert('Please fill out the question text, all four options, and define the correct option.');
      return;
    }
    if (editingQuestion) {
      const updatedQuestion: Question = { ...qForm, id: editingQuestion.id };
      setQuestions(questions.map(q => q.id === editingQuestion.id ? updatedQuestion : q));
    } else {
      const newQuestion: Question = { ...qForm, id: Date.now() };
      setQuestions([...questions, newQuestion]);
    }
    setShowQModal(false);
    setEditingQuestion(null);
    setQForm(initialQForm);
  };

  const startEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQForm({ ...q, id: q.id });
    setShowQModal(true);
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleExportQuestions = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'dbms_mcqs.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportQuestions = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed)) {
        const isValid = parsed.every(q => q.question && Array.isArray(q.options) && q.correctAnswer);
        if (isValid) {
          setQuestions([...questions, ...parsed.map((q, i) => ({ ...q, id: Date.now() + i }))]);
          alert(`Successfully imported ${parsed.length} questions!`);
          setImportJsonText('');
          setShowImportArea(false);
        } else {
          alert('Invalid questions format. Ensure every item has a question string, an options array, and a correctAnswer.');
        }
      } else {
        alert('JSON must be a valid array of question objects.');
      }
    } catch (err) {
      if (err instanceof Error) {
        alert('Error parsing JSON string: ' + err.message);
      } else {
        alert('Error parsing JSON string.');
      }
    }
  };

  const initialSForm: StudentForm = { id: null, rollNo: '', name: '', class: 'CS101', section: 'A', isPresent: true };
  const [sForm, setSForm] = useState<StudentForm>(initialSForm);

  const handleSaveStudent = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sForm.rollNo || !sForm.name) {
      alert('Please enter a valid Roll Number and Student Name.');
      return;
    }
    const parsedRoll = parseInt(sForm.rollNo, 10);
    const updatedStudent: Student = editingStudent
      ? { ...editingStudent, rollNo: parsedRoll, name: sForm.name, class: sForm.class, section: sForm.section, isPresent: sForm.isPresent }
      : { id: Date.now(), rollNo: parsedRoll, name: sForm.name, class: sForm.class, section: sForm.section, isPresent: sForm.isPresent };

    const duplicate = students.find(s => s.rollNo === parsedRoll && s.id !== updatedStudent.id);
    if (duplicate) {
      alert(`Roll Number ${parsedRoll} is already assigned to ${duplicate.name}!`);
      return;
    }

    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s));
    } else {
      setStudents([...students, updatedStudent]);
    }
    setShowSModal(false);
    setEditingStudent(null);
    setSForm(initialSForm);
  };

  const startEditStudent = (s: Student) => {
    setEditingStudent(s);
    setSForm({ ...s, rollNo: s.rollNo.toString() });
    setShowSModal(true);
  };

  const handleDeleteStudent = (id: number) => {
    if (confirm('Delete student from class roster?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const toggleAttendance = (id: number) => {
    setStudents(students.map(s => s.id === id ? { ...s, isPresent: !s.isPresent } : s));
  };

  const stats = useMemo(() => {
    if (leaderboard.length === 0) return { avgScore: 0, avgAccuracy: 0, totalRuns: 0 };
    const totalScore = leaderboard.reduce((acc, curr) => acc + curr.score, 0);
    const totalAcc = leaderboard.reduce((acc, curr) => acc + curr.accuracy, 0);
    return {
      avgScore: (totalScore / leaderboard.length).toFixed(1),
      avgAccuracy: (totalAcc / leaderboard.length).toFixed(1),
      totalRuns: leaderboard.length
    };
  }, [leaderboard]);

  const handleExportResultsCSV = () => {
    if (leaderboard.length === 0) {
      alert('No results recorded to export yet.');
      return;
    }
    let csvContent = 'data:text/csv;charset=utf-8,Rank,Roll No,Student Name,Score,Accuracy %,Date\n';
    leaderboard.forEach((r, idx) => {
      csvContent += `${idx + 1},${r.rollNo},"${r.name}",${r.score},${r.accuracy}%,"${new Date(r.date).toLocaleString()}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dbms_class_performance.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="w-full max-w-6xl bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-slate-800 p-4 md:p-8 shadow-2xl relative"
    >
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-2">
            <Settings className="w-8 h-8 text-cyan-400" /> TEACHER CONTROL PANEL
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Live configuration & management of your student assessments</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveTab('roll')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'roll' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'}`}
          >
            🎰 Lucky Roller
          </button>
          <button 
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'questions' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'}`}
          >
            📚 Question Bank ({questions.length})
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'}`}
          >
            👥 Class Roster ({students.length})
          </button>
          <button 
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'metrics' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'}`}
          >
            📊 Analytics & Results
          </button>
        </div>
      </div>

      {activeTab === 'roll' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-400 w-5 h-5" /> Magic Roll Settings
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-400 font-medium text-sm mb-2">Target Roll Range (Start - End)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      min="1"
                      value={rollSettings.minRange}
                      onChange={(e) => setRollSettings({ ...rollSettings, minRange: parseInt(e.target.value) || 1 })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center w-24 focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-slate-500">to</span>
                    <input 
                      type="number"
                      min="1"
                      value={rollSettings.maxRange}
                      onChange={(e) => setRollSettings({ ...rollSettings, maxRange: parseInt(e.target.value) || 100 })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center w-24 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <input 
                    type="checkbox" 
                    id="onlyPresent"
                    checked={rollSettings.onlyPresent}
                    onChange={(e) => setRollSettings({ ...rollSettings, onlyPresent: e.target.checked })}
                    className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                  />
                  <label htmlFor="onlyPresent" className="text-slate-300 font-medium text-sm cursor-pointer select-none">
                    Exclude absent students ({students.filter(s => !s.isPresent).length} marked absent)
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <Button 
                onClick={onTriggerRoll} 
                className="w-full py-4 text-lg hover:scale-[1.02] shadow-[0_0_30px_rgba(34,211,238,0.4)] animate-pulse"
              >
                <Play className="w-6 h-6 text-slate-950 fill-slate-950" /> Initiate Lucky Roll Ceremony
              </Button>
            </div>
          </div>

          <div className="bg-slate-800/20 border border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-300 mb-4">Quick Roster Overview</h3>
            <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {students.map(s => {
                const inRange = s.rollNo >= rollSettings.minRange && s.rollNo <= rollSettings.maxRange;
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleAttendance(s.id)}
                    className={`p-2 rounded-lg text-xs font-black transition-all border text-center relative ${
                      !s.isPresent 
                        ? 'bg-red-950/40 border-red-900 text-red-500' 
                        : inRange 
                          ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 font-mono shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                    title={`${s.name} - ${s.isPresent ? 'Present' : 'Absent'}`}
                  >
                    {s.rollNo}
                    <span className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full ${s.isPresent ? 'bg-green-500' : 'bg-red-500'}`} />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-4 text-right">Click a slot to toggle Attendance</p>
          </div>
        </motion.div>
      )}

      {activeTab === 'questions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => { setQForm(initialQForm); setEditingQuestion(null); setShowQModal(true); }}>
                <Plus className="w-4 h-4" /> Add DBMS MCQ
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowImportArea(!showImportArea)}>
                <Upload className="w-4 h-4" /> Import JSON
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportQuestions}>
                <Download className="w-4 h-4" /> Export JSON
              </Button>
            </div>
            <div className="text-slate-400 text-sm font-semibold">
              Total Questions in pool: <span className="text-cyan-400 font-mono font-bold">{questions.length}</span>
            </div>
          </div>

          {showImportArea && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-950 shadow-inner space-y-4">
              <label className="block text-sm text-slate-400 font-bold">Paste JSON Array of Questions:</label>
              <textarea 
                value={importJsonText}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setImportJsonText(e.target.value)}
                placeholder='[{"topic": "SQL", "difficulty": "Easy", "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "..."}]'
                rows={5}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary" onClick={() => setShowImportArea(false)}>Cancel</Button>
                <Button size="sm" variant="success" onClick={handleImportQuestions}>Validate & Save</Button>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="bg-slate-800/30 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-cyan-400 font-mono font-bold">Q{idx + 1}</span>
                    <span className="text-xs bg-indigo-950 text-indigo-400 px-2.5 py-0.5 rounded-full font-bold">{q.topic}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      q.difficulty === 'Easy' ? 'bg-green-950 text-green-400' : q.difficulty === 'Medium' ? 'bg-yellow-950 text-yellow-400' : 'bg-rose-950 text-rose-400'
                    }`}>{q.difficulty}</span>
                  </div>
                  <h4 className="text-white font-bold text-lg pt-1">{q.question}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-sm text-slate-400">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className={`px-3 py-1 rounded border ${opt === q.correctAnswer ? 'bg-green-950/40 border-green-800 text-green-300' : 'bg-slate-900/40 border-slate-800'}`}>
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1">
                  <button onClick={() => startEditQuestion(q)} className="p-2 hover:bg-cyan-950/50 rounded-lg text-cyan-400 transition-colors" title="Edit Question">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 hover:bg-rose-950/50 rounded-lg text-rose-400 transition-colors" title="Delete Question">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'students' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <Button size="sm" onClick={() => { setSForm(initialSForm); setEditingStudent(null); setShowSModal(true); }}>
              <Plus className="w-4 h-4" /> Add Student
            </Button>
            <div className="text-sm text-slate-400 font-medium">
              Present: <span className="text-green-400 font-bold">{students.filter(s => s.isPresent).length}</span> | Absent: <span className="text-rose-400 font-bold">{students.filter(s => !s.isPresent).length}</span>
            </div>
          </div>

          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                    <th className="p-4 pl-6">Roll No</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Class / Section</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-850/30 transition-colors">
                      <td className="p-4 pl-6 font-mono font-black text-cyan-400">{student.rollNo}</td>
                      <td className="p-4 font-bold text-white">{student.name}</td>
                      <td className="p-4 text-slate-400 text-sm">{student.class} - {student.section}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => toggleAttendance(student.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                            student.isPresent 
                              ? 'bg-green-950 text-green-400 border-green-800' 
                              : 'bg-red-950 text-red-400 border-red-900'
                          }`}
                        >
                          {student.isPresent ? 'Present' : 'Absent'}
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => startEditStudent(student)} className="p-2 hover:bg-cyan-950/50 rounded-lg text-cyan-400 transition-colors" title="Edit Student">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteStudent(student.id)} className="p-2 hover:bg-rose-950/50 rounded-lg text-rose-400 transition-colors" title="Delete Student">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'metrics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-slate-400 text-sm font-medium">Class Average Score</div>
              <div className="text-4xl font-black text-white mt-1">{stats.avgScore} <span className="text-xs text-slate-500">/ 30</span></div>
            </div>
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-center">
              <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-slate-400 text-sm font-medium">Average Accuracy</div>
              <div className="text-4xl font-black text-green-400 mt-1">{stats.avgAccuracy}%</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-slate-400 text-sm font-medium">Completed Runs</div>
              <div className="text-4xl font-black text-white mt-1">{stats.totalRuns}</div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white">Individual Run Results Log</h3>
            <Button size="sm" variant="success" onClick={handleExportResultsCSV}>
              <FileSpreadsheet className="w-4 h-4" /> Export CSV Grading Sheet
            </Button>
          </div>

          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="max-h-[350px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                    <th className="p-4 pl-6">Roll</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-center">Accuracy</th>
                    <th className="p-4 pr-6 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leaderboard.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/30 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-cyan-400">{r.rollNo}</td>
                      <td className="p-4 font-bold text-white">{r.name}</td>
                      <td className="p-4 text-center text-yellow-400 font-extrabold">{r.score}</td>
                      <td className="p-4 text-center font-bold text-green-400">{r.accuracy}%</td>
                      <td className="p-4 pr-6 text-right text-xs text-slate-500">{new Date(r.date).toLocaleString()}</td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-slate-500">No student assessment sessions recorded yet. Run the game above!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {showQModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-white">{editingQuestion ? 'Edit MCQ Question' : 'Create New DBMS MCQ'}</h3>
              <button onClick={() => setShowQModal(false)} className="p-1 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSaveQuestion} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Topic</label>
                  <select 
                    value={qForm.topic} 
                    onChange={(e) => setQForm({ ...qForm, topic: e.target.value })}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:outline-none"
                  >
                    <option value="Keys">Keys</option>
                    <option value="Normal Forms">Normal Forms</option>
                    <option value="SQL">SQL</option>
                    <option value="Transactions">Transactions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Difficulty</label>
                  <select 
                    value={qForm.difficulty} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setQForm({ ...qForm, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:outline-none"
                  >
                    <option value="Easy">Easy (+1 Pt)</option>
                    <option value="Medium">Medium (+2 Pts)</option>
                    <option value="Hard">Hard (+3 Pts)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Question Description</label>
                <textarea 
                  value={qForm.question} 
                  onChange={(e) => setQForm({ ...qForm, question: e.target.value })}
                  placeholder="Which normal form eliminates multi-valued dependencies?"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:outline-none h-20"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400 font-medium">Options</label>
                {qForm.options.map((o, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">{String.fromCharCode(65 + idx)}:</span>
                    <input 
                      type="text"
                      value={o}
                      onChange={(e) => {
                        const newOptions = [...qForm.options];
                        newOptions[idx] = e.target.value;
                        setQForm({ ...qForm, options: newOptions });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white w-full focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Correct Answer Match</label>
                <select 
                  value={qForm.correctAnswer} 
                  onChange={(e) => setQForm({ ...qForm, correctAnswer: e.target.value })}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:outline-none"
                >
                  <option value="">-- Select Correct Option --</option>
                  {qForm.options.filter(o => o).map((o, idx) => (
                    <option key={idx} value={o}>{String.fromCharCode(65 + idx)}: {o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Explanation / Solution Guide</label>
                <input 
                  type="text"
                  value={qForm.explanation} 
                  onChange={(e) => setQForm({ ...qForm, explanation: e.target.value })}
                  placeholder="BCNF eliminates multi-valued dependencies."
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button size="sm" variant="secondary" onClick={() => setShowQModal(false)}>Cancel</Button>
                <Button size="sm" variant="success" type="submit">Commit Changes</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showSModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-white">{editingStudent ? 'Edit Student Details' : 'Enroll New Student'}</h3>
              <button onClick={() => setShowSModal(false)} className="p-1 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSaveStudent} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Roll Number</label>
                <input 
                  type="number"
                  value={sForm.rollNo} 
                  onChange={(e) => setSForm({ ...sForm, rollNo: e.target.value })}
                  placeholder="e.g. 51"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <input 
                  type="text"
                  value={sForm.name} 
                  onChange={(e) => setSForm({ ...sForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Class / Course</label>
                  <input 
                    type="text"
                    value={sForm.class} 
                    onChange={(e) => setSForm({ ...sForm, class: e.target.value })}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Section</label>
                  <input 
                    type="text"
                    value={sForm.section} 
                    onChange={(e) => setSForm({ ...sForm, section: e.target.value })}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button size="sm" variant="secondary" onClick={() => setShowSModal(false)}>Cancel</Button>
                <Button size="sm" variant="success" type="submit">Commit Details</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TeacherDashboard;
