import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Types & Interfaces ---
interface ConsultationMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- AI Service Logic ---
const getResearchConsultation = async (prompt: string) => {
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  
  if (!apiKey) {
    return "Welcome! I'm the Research Strategist. For direct project quotes or deep strategy, please message Uncle Blessing on WhatsApp at +2349033597562.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the Global Research Strategist for Uncle Blessing Research Institute. Your founder is Blessing Omiyale, a prestigious graduate of FUOYE. Your goal is to convert visitors into clients by showcasing expertise in: 1. Academic Project Writing, 2. Market Research, 3. Business Strategy, 4. Data Analysis. Always encourage a final consultation on WhatsApp at +2349033597562.",
      },
    });
    return response.text || "I processed your request but have no specific advice. Let's discuss on WhatsApp!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a connection issue. Please chat with Uncle Blessing directly on WhatsApp (+2349033597562) for priority service!";
  }
};

// --- Sub-Components ---
const BookCard: React.FC<{ title: string; subtitle: string; year: string }> = ({ title, subtitle, year }) => (
  <div className="group relative perspective-1000 h-80 w-56 mx-auto cursor-pointer">
    <div className="relative h-full w-full rounded-r-xl shadow-2xl transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(-25deg)_translateX(-10px)] bg-emerald-950 border-l-[12px] border-emerald-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30"></div>
      <div className="p-6 h-full flex flex-col justify-between relative z-10 border border-emerald-800/50">
        <div>
          <div className="h-px w-8 bg-amber-400/50 mb-4"></div>
          <h4 className="text-amber-200 font-serif text-sm font-bold uppercase tracking-tighter leading-tight mb-2">{title}</h4>
          <p className="text-emerald-300 text-[10px] uppercase tracking-widest font-black">{subtitle}</p>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-emerald-100/40 mb-1 uppercase">Lead Researcher</div>
          <div className="text-white font-serif font-black text-xs tracking-wider border-y border-emerald-800 py-2">BLESSING OMIYALE</div>
          <div className="text-[9px] text-amber-500/60 mt-4 italic">Published {year}</div>
        </div>
      </div>
      <div className="absolute top-0 right-0 h-full w-2 bg-gradient-to-r from-white/10 to-transparent"></div>
    </div>
    <div className="absolute -inset-2 bg-emerald-600/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

const Navigation: React.FC = () => {
  const whatsappUrl = "https://wa.me/2349033597562?text=Hello%20Uncle%20Blessing%20Research%20Institute,%20I'm%20ready%20to%20order%20help%20with%20my%20project.";

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center text-white">
              <i className="fas fa-book-open text-lg"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 leading-none tracking-tight">UNCLE BLESSING</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Research Institute</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-slate-600 hover:text-emerald-700 font-bold transition-colors text-xs uppercase tracking-widest">About</a>
            <a href="#publications" className="text-slate-600 hover:text-emerald-700 font-bold transition-colors text-xs uppercase tracking-widest">Publications</a>
            <a href="#services" className="text-slate-600 hover:text-emerald-700 font-bold transition-colors text-xs uppercase tracking-widest">Services</a>
            <a href="#reviews" className="text-slate-600 hover:text-emerald-700 font-bold transition-colors text-xs uppercase tracking-widest">Reviews</a>
          </div>

          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-100 text-sm"
          >
            Order Now
          </a>
        </div>
      </div>
    </nav>
  );
};

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ConsultationMessage[]>([
    { role: 'assistant', content: "Welcome to Uncle Blessing Research Institute. I'm your Research Strategist. How can I help you navigate your academic or business research today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ConsultationMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const response = await getResearchConsultation(input);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div id="consultation" className="bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden flex flex-col h-[500px] relative">
      <div className="bg-emerald-800 p-4 text-white flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center border border-emerald-400">
          <i className="fas fa-brain"></i>
        </div>
        <div>
          <h3 className="font-bold text-sm">Research Architect AI</h3>
          <p className="text-[10px] text-emerald-200">Expert Strategy • Online</p>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-emerald-50/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
              msg.role === 'user' 
                ? 'bg-emerald-700 text-white rounded-tr-none' 
                : 'bg-white border border-emerald-100 text-slate-700 rounded-tl-none shadow-sm'
            }`}>
              <p className="text-sm leading-snug">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-emerald-500 text-xs animate-pulse p-2">Strategizing...</div>}
      </div>
      <div className="p-3 bg-white border-t border-emerald-100">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can we help your project?"
            className="flex-1 border border-emerald-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
          <button type="submit" disabled={loading} className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center">
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const getWhatsappUrl = (service?: string) => {
    const base = "https://wa.me/2349033597562";
    const text = service 
      ? `Hello Uncle Blessing Research Institute, I want to order your help with: "${service}".`
      : "Hello Uncle Blessing Research Institute, I need help with my research project.";
    return `${base}?text=${encodeURIComponent(text)}`;
  };

  const publications = [
    { title: "Pan-African Economic Frontiers", subtitle: "Market Integration Study", year: "2023" },
    { title: "Sustainable Agri-Systems", subtitle: "Policy Impact Framework", year: "2022" },
    { title: "Global Data Ethics", subtitle: "Cross-Border Analysis", year: "2024" },
    { title: "Business Resilience 4.0", subtitle: "Strategy Innovation", year: "2023" }
  ];

  const services = [
    { title: "Academic Project Writing", description: "Complete help with Undergraduate, Masters, and PhD projects. Methodology & Data Analysis.", icon: "fa-book-open" },
    { title: "Market & Business Research", description: "Feasibility studies and customer behavior patterns to drive business growth.", icon: "fa-chart-pie" },
    { title: "Business Strategy", description: "Winning business plans and financial projections for funding and expansion.", icon: "fa-handshake" },
    { title: "Statistical Analysis", description: "SPSS, Stata, and Python analysis for raw data transformation.", icon: "fa-database" }
  ];

  const reviews = [
    { name: "Dr. Adebayo Moses", role: "UK PhD Candidate", text: "Blessing's research work is impeccable. He helped me structure my entire thesis methodology with ease.", stars: 5 },
    { name: "Sarah Jenkins", role: "Market Analyst", text: "The business plan provided by the institute was the reason we secured our $50k seed funding. 10/10 service.", stars: 5 },
    { name: "Obinna Okafor", role: "Postgrad Student", text: "Fast, reliable, and academically sound. He truly is the best at FUOYE and beyond!", stars: 5 }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <Navigation />

      <header className="relative py-20 bg-slate-50 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase mb-6">
                Premium Global Research Services
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif text-slate-900 mb-6 leading-tight">
                Global <br />
                <span className="text-emerald-700">Expertise in</span> <br />
                Research Writing
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-md font-light">
                Order elite project writing, data analysis, and market research led by Blessing Omiyale.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href={getWhatsappUrl()} className="px-8 py-4 bg-emerald-800 text-white rounded-2xl font-bold shadow-xl hover:bg-emerald-900 transition flex items-center gap-2">
                  Order Now <i className="fab fa-whatsapp"></i>
                </a>
                <a href="#publications" className="px-8 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition">
                  View Portfolio
                </a>
              </div>
            </div>
            <div className="relative group perspective-1000 hidden lg:block">
               <BookCard title="The Master Guide to Research" subtitle="Lead Institutional Study" year="2024" />
            </div>
          </div>
        </div>
      </header>

      <section id="publications" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Global Publications Portfolio</h2>
            <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Researched & Authored by Blessing Omiyale</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {publications.map((pub, idx) => (
              <BookCard key={idx} {...pub} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <h2 className="text-3xl font-serif font-bold mb-6">Blessing Omiyale</h2>
              <p className="text-emerald-400 font-bold text-xs uppercase mb-6 tracking-widest">Lead Researcher & FUOYE Scholar</p>
              <p className="text-slate-300 leading-relaxed mb-8">
                With a background in Agricultural Economics from the Federal University Oye-Ekiti, my mission is to deliver research that stands up to global scrutiny.
              </p>
              <div className="flex gap-8 border-t border-slate-800 pt-8">
                <div><div className="text-2xl font-bold text-white">500+</div><div className="text-[10px] text-slate-500 uppercase">Projects</div></div>
                <div><div className="text-2xl font-bold text-white">12+</div><div className="text-[10px] text-slate-500 uppercase">Countries</div></div>
                <div><div className="text-2xl font-bold text-white">100%</div><div className="text-[10px] text-slate-500 uppercase">Success</div></div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 tracking-tight">Why Order From Us?</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                We don't just write; we analyze. Every project is handled with precision, using the latest software and academic frameworks used in top universities globally.
              </p>
              <div className="space-y-4">
                 {["International Formatting", "Plagiarism-Free Content", "24/7 Scholar Support"].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                     <i className="fas fa-check-circle text-emerald-500"></i>
                     <span className="text-sm font-bold text-slate-700">{item}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-16 text-slate-900 tracking-tight">Expert Research Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-emerald-500 transition-all flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-700 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <i className={`fas ${s.icon} text-xl`}></i>
                </div>
                <h4 className="font-bold text-slate-900 mb-3">{s.title}</h4>
                <p className="text-slate-500 text-xs mb-8 flex-1 leading-relaxed">{s.description}</p>
                <a href={getWhatsappUrl(s.title)} className="w-full py-4 bg-slate-50 text-emerald-800 rounded-2xl text-[11px] font-black text-center hover:bg-emerald-800 hover:text-white transition-all uppercase tracking-widest">
                  Order Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">What Scholars Say</h2>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]">Verified Client Success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((rev, i) => (
              <div key={i} className="bg-emerald-900/40 p-10 rounded-[2.5rem] border border-emerald-800 hover:bg-emerald-900/60 transition-all group">
                <div className="flex gap-1 mb-6">
                  {[...Array(rev.stars)].map((_, s) => (
                    <i key={s} className="fas fa-star text-amber-400 text-[10px]"></i>
                  ))}
                </div>
                <p className="text-emerald-100 italic mb-8 text-sm leading-relaxed">"{rev.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-700">{rev.name[0]}</div>
                  <div>
                    <h5 className="font-bold text-sm">{rev.name}</h5>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AIConsultant />
            <div className="lg:pl-12">
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6 leading-tight">Instant Research <br/>Consultation</h2>
              <p className="text-slate-600 mb-8 leading-relaxed font-light text-lg">
                Not sure where to start? Use our AI Architect to brainstorm your thesis topic or get a quick analysis framework.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 p-5 rounded-3xl bg-emerald-50 border border-emerald-100">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><i className="fab fa-whatsapp text-xl"></i></div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Direct WhatsApp Order</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Chat with Blessing Omiyale for priority pricing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white text-center border-t border-slate-100">
        <p className="font-black text-slate-900 text-[11px] tracking-[0.3em] mb-2 uppercase">Uncle Blessing Research Institute</p>
        <p className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase mb-4">Excellence • Precision • Global Reach</p>
        <p className="text-slate-400 text-[9px] font-medium tracking-wide">© {new Date().getFullYear()} Blessing Omiyale. Lead Institutional Researcher.</p>
      </footer>
    </div>
  );
};

// --- Render ---
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
