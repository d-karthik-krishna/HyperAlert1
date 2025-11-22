
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Camera, Send, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { DisasterType, Severity } from '../types';

const DISASTER_TYPES: DisasterType[] = ['Fire', 'Flood', 'Earthquake', 'Storm', 'Biohazard', 'Heatwave'];
const SEVERITIES: Severity[] = ['Critical', 'High', 'Moderate', 'Info'];

const Report: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [type, setType] = useState<DisasterType>('Fire');
  const [severity, setSeverity] = useState<Severity>('High');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !description) return;

    setIsSubmitting(true);
    
    // Simulate API Network Request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);

    // Redirect after showing success state
    setTimeout(() => {
      navigate('/demo');
    }, 2000);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        });
    }
  };

  if (isSuccess) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="text-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                    <CheckCircle size={48} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Report Received</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Emergency services have been notified.</p>
                <button onClick={() => navigate('/demo')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <button 
            onClick={() => navigate('/')} 
            className="mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="bg-rose-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <AlertTriangle size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">Report Incident</h1>
                </div>
                <p className="text-rose-100 opacity-90">
                    Submit a new emergency report. This will be verified by our AI systems instantly.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                
                {/* Type & Severity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Incident Type</label>
                        <div className="relative">
                            <select 
                                value={type}
                                onChange={(e) => setType(e.target.value as DisasterType)}
                                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none appearance-none font-semibold cursor-pointer"
                            >
                                {DISASTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Severity Level</label>
                        <div className="grid grid-cols-2 gap-2">
                            {SEVERITIES.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSeverity(s)}
                                    className={`p-2 rounded-lg text-sm font-bold border-2 transition-all ${
                                        severity === s 
                                        ? s === 'Critical' ? 'bg-red-50 border-red-500 text-red-600 dark:bg-red-900/20 dark:border-red-500 dark:text-red-400'
                                        : 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300'
                                        : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Location</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter address or coordinates"
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none font-medium"
                                required
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={handleGetLocation}
                            className="px-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            GPS
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Description</label>
                    <textarea 
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the situation..."
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none font-medium resize-none"
                        required
                    />
                </div>

                {/* Photo Upload (Dummy) */}
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <Camera size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Click to upload evidence (Optional)</p>
                </div>

                {/* Submit */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-500/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                    {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
                </button>

            </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
