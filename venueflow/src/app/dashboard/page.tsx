"use client"
import { useState, useEffect } from 'react';
import { Map, Clock, Zap, MapPin, Navigation, Bell, Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';

export default function AttendeeDashboard() {
  const { zones: liveZones } = useSocket();
  const [zones, setZones] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [route, setRoute] = useState<any[]>([]);

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

  const findRoute = async () => {
    const start = zones.find(z => z.type === 'gate')?.id;
    const end = zones.find(z => z.type === 'seating' && z.name.includes('104'))?.id;
    
    if (!start || !end) return;

    const res = await fetch('/api/routing', {
      method: 'POST',
      body: JSON.stringify({ startId: start, endId: end })
    });
    const data = await res.json();
    setRoute(data.path || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const foodZones = zones.filter(z => z.type === 'food').sort((a,b) => a.currentDensity - b.currentDensity);
  const restroomZones = zones.filter(z => z.type === 'restroom').sort((a,b) => a.currentDensity - b.currentDensity);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-lg mx-auto">
      {/* App Bar */}
      <header className="flex items-center justify-between mb-8">
        <Link 
          href="/" 
          className="p-2 glass-panel hover:bg-white/10 rounded-full focus:ring-2 focus:ring-brand-cyan outline-none"
          aria-label="Go back to home"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2" aria-hidden="true">
          <Activity className="text-brand-cyan" size={24} />
          <span className="font-bold text-lg">VenueFlow</span>
        </div>
        <div 
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center font-bold"
          role="img" 
          aria-label="User Profile: AF"
        >
          AF
        </div>
      </header>

      {/* Smart Assistant Card */}
      <section 
        className="glass-panel p-6 mb-6 border-brand-purple/50 bg-brand-purple/10"
        aria-labelledby="assistant-title"
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-brand-cyan" size={20} aria-hidden="true" />
          <h2 id="assistant-title" className="font-semibold text-lg">Smart Matchday Assistant</h2>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Welcome to the stadium! Your seat is in <strong className="text-white">Section 104</strong>. 
          Half-time is in 15 mins. Avoid the rush!
        </p>
        <button 
          onClick={findRoute}
          className="w-full py-3 bg-brand-purple hover:bg-purple-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors focus:ring-2 focus:ring-white outline-none active:scale-95"
          aria-label="Find best path to my seat in Section 104"
        >
          <Navigation size={18} aria-hidden="true" /> Find Fastest Route
        </button>

        {route.length > 0 && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10" aria-live="polite">
            <h4 className="text-xs font-bold uppercase text-brand-cyan mb-2">Recommended Path</h4>
            <nav aria-label="Route steps">
              <ol className="flex flex-wrap items-center gap-2 text-sm list-none p-0">
                {route.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <span className="text-white">{p.name}</span>
                    {i < route.length - 1 && <span className="text-gray-600" aria-hidden="true">→</span>}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}
      </section>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <section className="mb-6 space-y-3" aria-labelledby="alerts-title">
          <h3 id="alerts-title" className="font-semibold flex items-center gap-2">
            <Bell size={18} aria-hidden="true"/> Live Venue Alerts
          </h3>
          <div role="feed" aria-busy="false">
            {alerts.map((alert: any) => (
              <motion.article 
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border mb-3 ${alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/50' : 'bg-brand-orange/10 border-brand-orange/50'}`}
              >
                <h4 className={`font-bold text-sm ${alert.severity === 'critical' ? 'text-red-400' : 'text-brand-orange'}`}>{alert.title}</h4>
                <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* Quick Look Wait Times */}
      <section aria-labelledby="wait-times-title">
        <h3 id="wait-times-title" className="font-semibold mt-8 mb-4 flex items-center gap-2">
          <Clock size={18} aria-hidden="true"/> Best Options Near You
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Food */}
          <article className="glass-panel p-4" aria-labelledby="food-fastest">
            <span id="food-fastest" className="text-xs text-gray-400 font-medium uppercase tracking-wider">Fastest Food</span>
            <div className="mt-2">
              <div className="font-bold text-sm truncate">{foodZones[0]?.name || 'Loading...'}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-lg font-bold ${foodZones[0]?.currentDensity > 70 ? 'text-red-400' : 'text-green-400'}`}>
                  {foodZones[0]?.waitTimes?.[0]?.estimatedWaitMinutes || 0} min
                </span>
                <span className="text-xs text-gray-500">Wait</span>
              </div>
            </div>
          </article>
          {/* Restroom */}
          <article className="glass-panel p-4" aria-labelledby="restroom-nearest">
            <span id="restroom-nearest" className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nearest Restroom</span>
            <div className="mt-2">
              <div className="font-bold text-sm truncate">{restroomZones[0]?.name || 'Loading...'}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-lg font-bold ${restroomZones[0]?.currentDensity > 70 ? 'text-red-400' : 'text-green-400'}`}>
                  {restroomZones[0]?.waitTimes?.[0]?.estimatedWaitMinutes || 0} min
                </span>
                <span className="text-xs text-gray-500">Wait</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Mini Map Preview */}
      <section className="glass-panel overflow-hidden border-brand-cyan/20" aria-labelledby="map-title">
        <div className="bg-gray-800/50 p-4 border-b border-white/5 flex justify-between items-center">
          <span id="map-title" className="font-semibold flex items-center gap-2"><Map size={18} aria-hidden="true"/> Live Venue Map</span>
          <button className="text-xs text-brand-cyan font-semibold hover:underline focus:bg-white/10 p-1 rounded">Expand Map</button>
        </div>
        <div 
          className="h-48 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center relative"
          role="img"
          aria-label="Venue map showing crowd density"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          {/* Mock Zone Indicators */}
          {zones.map((z: any) => {
            if (!z.coordinates) return null;
            const pos = JSON.parse(z.coordinates);
            let color = 'bg-green-500';
            let label = 'Normal crowds';
            if (z.currentDensity > 60) { color = 'bg-yellow-500'; label = 'Moderate crowds'; }
            if (z.currentDensity > 85) { color = 'bg-red-500'; label = 'High congestion'; }

            return (
              <motion.button 
                key={z.id}
                className={`absolute w-5 h-5 rounded-full ${color} shadow-[0_0_10px_currentColor] cursor-pointer border-2 border-white/20`}
                style={{ top: `${pos.y}%`, left: `${pos.x}%`, transform: 'translate(-50%, -50%)' }}
                whileHover={{ scale: 1.5 }}
                aria-label={`${z.name}: ${z.currentDensity}% full. ${label}`}
              />
            )
          })}
        </div>
      </section>

    </div>
  );
}
