"use client"
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Activity, Bell, AlertTriangle, Settings, RefreshCw, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSocket } from '@/hooks/useSocket';

export default function AdminDashboard() {
  const { zones: liveZones } = useSocket();
  const [zones, setZones] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (liveZones.length > 0) {
      setZones(liveZones);
    }
  }, [liveZones]);

  const fetchData = async () => {
    try {
      if (zones.length === 0) {
        const zRes = await fetch('/api/zones');
        const zData = await zRes.json();
        setZones(zData);
      }

      const aRes = await fetch('/api/alerts');
      const aData = await aRes.json();
      setAlerts(aData);
    } catch(e) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerSimulation = async (action: string) => {
    setLoadingAction(true);
    await fetch('/api/admin/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    await fetchData();
    setLoadingAction(false);
  };

  const chartData = zones.map(z => ({ name: z.name, wait: z.waitTimes?.[0]?.estimatedWaitMinutes || 0 })).slice(0, 5);

  return (
    <div className="min-h-screen flex text-sm">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-y-0 border-l-0 rounded-none flex flex-col p-6 sticky top-0 h-screen hidden md:flex">
        <Link href="/" className="flex items-center gap-2 mb-10 text-brand-cyan hover:opacity-80">
          <Activity size={24} />
          <span className="font-bold text-lg">VenueOps</span>
        </Link>
        <nav className="space-y-4 flex-1 text-gray-300">
          <a href="#" className="flex items-center gap-3 text-white font-semibold"><LayoutDashboard size={18}/> Live Dashboard</a>
          <a href="#" className="flex items-center gap-3 hover:text-white transition-colors"><BarChart2 size={18}/> Analytics</a>
          <a href="#" className="flex items-center gap-3 hover:text-white transition-colors"><Users size={18}/> Staff Coord</a>
          <a href="#" className="flex items-center gap-3 hover:text-white transition-colors"><Bell size={18}/> Alerts & Comms</a>
          <a href="#" className="flex items-center gap-3 hover:text-white transition-colors"><AlertTriangle size={18}/> Incidents</a>
        </nav>
        <div className="pt-6 border-t border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-brand-purple flex items-center justify-center font-bold">A</div>
          <span>Administrator</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto w-full">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Venue Live Operations</h1>
            <p className="text-gray-400">Matchday Event: Grand Finals</p>
          </div>
          <div className="flex gap-4">
            <button className="glass-panel p-2 hover:bg-white/5"><Settings size={20}/></button>
            <button className="glass-panel p-2 hover:bg-white/5"><Bell size={20}/></button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Heatmap Section */}
          <div className="lg:col-span-2 glass-panel p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2"><Activity size={18}/> Live Crowd Heatmap</h2>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded text-green-400 border border-green-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live
              </span>
            </div>
            
            <div className="flex-1 min-h-[300px] bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center relative rounded-lg overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>
              
              {zones.map((z: any) => {
                if (!z.coordinates) return null;
                const pos = JSON.parse(z.coordinates);
                let color = 'bg-green-500/80';
                let shadow = 'shadow-[0_0_20px_#22c55e]';
                let size = 'w-16 h-16';
                if (z.currentDensity > 60) { color = 'bg-yellow-500/80'; shadow = 'shadow-[0_0_30px_#eab308]'; size = 'w-20 h-20'; }
                if (z.currentDensity > 85) { color = 'bg-red-500/80'; shadow = 'shadow-[0_0_40px_#ef4444]'; size = 'w-24 h-24'; }

                return (
                  <motion.div 
                    key={z.id}
                    className={`absolute rounded-full ${color} ${shadow} flex items-center justify-center backdrop-blur-md border border-white/20`}
                    style={{ top: `${pos.y}%`, left: `${pos.x}%`, transform: 'translate(-50%, -50%)' }}
                    title={`${z.name}\nDensity: ${z.currentDensity}%`}
                  >
                    <span className="text-[10px] font-bold text-white max-w-full truncate px-1 text-center leading-tight">
                      {z.name}<br/>{z.currentDensity}%
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Simulators & Alerts */}
          <div className="space-y-6">
            
            {/* Action Simulator */}
            <div className="glass-panel p-6 border-brand-cyan/30 bg-brand-cyan/5">
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-4"><RefreshCw size={18}/> Demo Simulator</h2>
              <p className="text-xs text-gray-400 mb-4">Inject real-time events to see system reaction.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => triggerSimulation('gate_overload')}
                  disabled={loadingAction}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-100 py-2 rounded font-medium transition-colors"
                >
                  Simulate Gate Overload
                </button>
                <button 
                  onClick={() => triggerSimulation('food_stall_closure')}
                  disabled={loadingAction}
                  className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-100 py-2 rounded font-medium transition-colors"
                >
                  Simulate Stall Closure
                </button>
                <button 
                  onClick={() => triggerSimulation('clear_all')}
                  disabled={loadingAction}
                  className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-100 py-2 rounded font-medium transition-colors"
                >
                  Resolve Incidents & Clear
                </button>
              </div>
            </div>

            {/* Active System Alerts */}
            <div className="glass-panel p-6 max-h-[300px] overflow-y-auto">
              <h2 className="font-semibold text-lg mb-4">Operations Log</h2>
              <div className="space-y-4">
                {alerts.length === 0 ? <p className="text-gray-500 text-sm">No active alerts.</p> : alerts.map((alert: any) => (
                  <div key={alert.id} className="border-l-2 pl-3 pb-2 border-brand-orange relative">
                    <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-brand-orange"></span>
                    <h4 className="font-bold text-sm">{alert.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
                    <span className="text-[10px] text-gray-500 mt-1 block">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
          
          {/* Bottom Analytics Row */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
              <h3 className="font-semibold mb-4">Wait Times Overview (Mins)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '8px'}} />
                    <Bar dataKey="wait" fill="var(--color-brand-cyan)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-panel p-6 flex flex-col justify-center">
               <h3 className="font-semibold mb-4 text-center">Current Venue Utilization</h3>
               <div className="flex items-center justify-center gap-12">
                  <div className="text-center">
                    <div className="text-4xl font-black text-brand-cyan mb-1">68%</div>
                    <div className="text-sm text-gray-400">Total Capacity</div>
                  </div>
                  <div className="w-[1px] h-16 bg-white/10"></div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-brand-purple mb-1">12m</div>
                    <div className="text-sm text-gray-400">Avg Wait Time</div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
