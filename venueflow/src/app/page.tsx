import Link from 'next/link';
import { Activity, LayoutDashboard, User } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl glass-panel p-12 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-cyan"></div>
        
        <div className="flex justify-center mb-6">
          <Activity className="text-brand-cyan w-16 h-16" />
        </div>
        
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-white">VenueFlow AI</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
          The next-generation smart stadium experience platform. Reduce wait times, navigate crowds, and enjoy the event effortlessly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
          
          <Link href="/dashboard" className="group">
            <div className="glass-panel p-8 flex flex-col items-center gap-4 hover:border-brand-cyan transition-colors hover:-translate-y-1 duration-300">
              <div className="bg-brand-cyan/10 p-4 rounded-full text-brand-cyan group-hover:scale-110 transition-transform">
                <User size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Fan Experience</h3>
                <p className="text-sm text-gray-400">Navigate the venue, check wait times, and get live route updates.</p>
              </div>
              <span className="mt-2 text-brand-cyan flex items-center font-semibold text-sm">Enter App &rarr;</span>
            </div>
          </Link>

          <Link href="/admin" className="group">
            <div className="glass-panel p-8 flex flex-col items-center gap-4 hover:border-brand-purple transition-colors hover:-translate-y-1 duration-300">
              <div className="bg-brand-purple/10 p-4 rounded-full text-brand-purple group-hover:scale-110 transition-transform">
                <LayoutDashboard size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Venue Operations</h3>
                <p className="text-sm text-gray-400">Monitor crowd heatmaps, manage incidents, and broadcast alerts.</p>
              </div>
              <span className="mt-2 text-brand-purple flex items-center font-semibold text-sm">Ops Login &rarr;</span>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
