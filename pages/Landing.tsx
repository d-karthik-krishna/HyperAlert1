
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ShieldAlert, Smartphone, Radio, MessageSquare, Building, Users, Briefcase, ArrowRight } from 'lucide-react';
import FlowSection from '../components/FlowSection';
import MetricsSection from '../components/MetricsSection';
import USPSection from '../components/USPSection';

// Icons for segments
const SegmentCard = ({ icon: Icon, title, desc }: any) => (
  <div className="group flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1">
    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-6 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3">{title}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const CostAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = [
    { title: "Data & API Costs", content: "Satellite feeds, weather API endpoints, and geospatial processing compute." },
    { title: "Infrastructure", content: "High-availability server clusters, CDN, and real-time database replication." },
    { title: "Delivery Channels", content: "SMS gateway fees (Twilio), WhatsApp Business API costs, and push notification services." },
  ];

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className={`border transition-all duration-300 rounded-2xl overflow-hidden ${openIndex === idx ? 'border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
          <button 
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {item.title}
            {openIndex === idx ? <ChevronUp size={20} className="text-indigo-500 dark:text-indigo-400" /> : <ChevronDown size={20} className="text-slate-400" />}
          </button>
          <div className={`px-5 pb-5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-all duration-300 ${openIndex === idx ? 'block opacity-100' : 'hidden opacity-0'}`}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

const Landing: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 font-sans text-slate-600 dark:text-slate-300 selection:bg-rose-100 selection:text-rose-900 dark:selection:bg-rose-900 dark:selection:text-rose-100 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-50 dark:bg-rose-900/20 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            Live Predictive System
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]">
            Disaster alerts for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
              your street
            </span>
             — not your city.
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Hyperlocal, predictive safety instructions delivered seconds before disaster strikes. Stop relying on broad, delayed warnings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/demo" className="group px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg shadow-xl shadow-slate-200 dark:shadow-slate-900/50 hover:shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-100 hover:-translate-y-1 transition-all flex items-center gap-3">
              Launch Simulator
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white dark:bg-transparent text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
              Partner with Us
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="why-us" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">The Old Way is Broken</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Current alert systems are built for cities, not people.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { title: "Too Broad", desc: "Getting a flash flood warning when you live on a hill causes alert fatigue.", icon: "📍" },
              { title: "Too Slow", desc: "Reactive SMS alerts often arrive after the disaster has already hit.", icon: "⏱️" },
              { title: "No Action Plan", desc: "Knowing there is a storm isn't enough. You need to know what to do.", icon: "❓" }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="p-8 md:p-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
            <h3 className="text-xl md:text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6 text-center">Feasibility & Impact</h3>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed text-center max-w-4xl mx-auto">
              Our system is highly feasible to build using readily available APIs, low-cost development, and a simple frontend–backend setup that can scale from small communities to larger regions, while also creating strong real-world impact by delivering hyperlocal alerts that improve safety, accelerate emergency response, enhance coordination, support data-driven decisions, and strengthen overall community preparedness.
            </p>
          </div>
        </div>
      </section>

      <FlowSection />
      <USPSection />
      
      {/* Customer Segments */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Who We Protect</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Tailored solutions for every stakeholder in the crisis management chain.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <SegmentCard icon={Users} title="Residents" desc="Families in high-risk micro-zones." />
            <SegmentCard icon={Briefcase} title="Commuters" desc="Real-time route risk avoidance." />
            <SegmentCard icon={Building} title="Housing Soc." desc="Automated gate & lift protocols." />
            <SegmentCard icon={ShieldAlert} title="Authorities" desc="Last-mile dissemination tools." />
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">Omnichannel Delivery</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 hover:opacity-100 transition-opacity duration-500 dark:text-slate-200">
            <div className="flex flex-col items-center gap-3 group"><div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:text-rose-500 transition-colors"><Smartphone size={32} strokeWidth={1.5} /></div> <span className="text-sm font-semibold">App</span></div>
            <div className="flex flex-col items-center gap-3 group"><div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:text-rose-500 transition-colors"><MessageSquare size={32} strokeWidth={1.5} /></div> <span className="text-sm font-semibold">SMS</span></div>
            <div className="flex flex-col items-center gap-3 group"><div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:text-rose-500 transition-colors"><div className="font-bold text-2xl">WA</div></div> <span className="text-sm font-semibold">WhatsApp</span></div>
            <div className="flex flex-col items-center gap-3 group"><div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:text-rose-500 transition-colors"><Radio size={32} strokeWidth={1.5} /></div> <span className="text-sm font-semibold">IoT</span></div>
          </div>
        </div>
      </section>

      <MetricsSection />

      {/* Business Section */}
      <section id="business" className="py-24 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Cost Structure */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Cost Structure</h3>
              <CostAccordion />
            </div>

            {/* Revenue Streams */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Revenue Model</h3>
              <div className="space-y-5">
                {[
                  { role: "Freemium User", detail: "Basic alerts (free) + Premium predictive analysis ($2/mo)", cost: "$0-2" },
                  { role: "API Licensing", detail: "For insurance & logistics companies", cost: "B2B" },
                  { role: "Sponsored Alerts", detail: "Local businesses sponsoring safe-zone maps", cost: "Ad" }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none flex justify-between items-center hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-pointer group">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-lg">{item.role}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.detail}</div>
                    </div>
                    <div className="font-bold text-xl text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.cost}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="py-24 bg-slate-900 dark:bg-black text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900"></div>
        <div className="relative z-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Ready to see the future of safety?</h2>
          <Link to="/demo" className="inline-flex items-center justify-center px-10 py-4 bg-rose-500 text-white rounded-full font-bold text-lg hover:bg-rose-600 hover:scale-105 transition-all shadow-lg shadow-rose-500/30">
            Launch Simulator
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
