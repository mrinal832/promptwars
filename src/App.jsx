import React, { useState, useEffect } from 'react';
import { 
  Activity, Map, Clock, Zap, Bell, Maximize, 
  Search, ShieldAlert, ArrowRight, User, Navigation 
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pulse, setPulse] = useState(false);

  // Trigger pulse effect periodically
  useEffect(() => {
    const interval = setInterval(() => setPulse(prev => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {/* Background Glowing Effects */}
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>
      <div className="glow-orb glow-orb-3"></div>

      {/* Sidebar */}
      <aside className="sidebar fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="brand-logo">
          <Activity size={32} />
          <span>StadiumSync</span>
        </div>

        <ul className="nav-menu">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Activity size={20} />
            <span>Live Overview</span>
          </li>
          <li className={`nav-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            <Map size={20} />
            <span>Interactive Map</span>
          </li>
          <li className={`nav-item ${activeTab === 'wait_times' ? 'active' : ''}`} onClick={() => setActiveTab('wait_times')}>
            <Clock size={20} />
            <span>Wait Times</span>
          </li>
          <li className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <Bell size={20} />
            <span>Alerts & Comms</span>
          </li>
          <li className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <ShieldAlert size={20} />
            <span>Security Feed</span>
          </li>
        </ul>
      </aside>

      {/* Main Area */}
      <main className="main-content">
        <div className="top-bar fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="page-title">Grand Arena Control</h1>
          <div className="header-actions">
            <div className="icon-btn">
              <Search size={20} />
            </div>
            <div className="icon-btn">
              <Maximize size={20} />
            </div>
            <div className="icon-btn">
              <Bell size={20} />
              <span className="badge"></span>
            </div>
            <div className="user-profile">
              <div className="user-avatar">AD</div>
              <span style={{ fontSize: '0.9rem', fontWeight: 500, marginRight: '8px' }}>Admin</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          
          {/* Smart Suggestion Element */}
          <div className="card smart-card fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="smart-card-title"><Zap size={24} /> AI Insight</h2>
            <p className="smart-tip">Crowd density is spiking at <strong>Gate 4</strong> due to the halftime rush. Rerouting digital signage to recommend <strong>Gate 2</strong> (3 mins away, no wait).</p>
            <button className="btn-primary">
              <Navigation size={18} /> Take Action
            </button>
          </div>

          {/* Wait Times Panel */}
          <div className="card wait-times-card fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="card-header">
              <h2 className="card-title"><Clock size={20} /> Live Wait Times</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Updated just now</span>
            </div>
            
            <div className="wait-list">
              <div className="wait-item">
                <div className="wait-header">
                  <span className="wait-location">North Concourse Restroom</span>
                  <span className="wait-time high">12 min</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill high" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="wait-item">
                <div className="wait-header">
                  <span className="wait-location">Main Beer Garden</span>
                  <span className="wait-time med">7 min</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill med" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div className="wait-item">
                <div className="wait-header">
                  <span className="wait-location">Section 114 Snacks</span>
                  <span className="wait-time low">2 min</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill low" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div className="wait-item">
                <div className="wait-header">
                  <span className="wait-location">South Exit Gate</span>
                  <span className="wait-time low">0 min</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill low" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Heatmap */}
          <div className="card heatmap-card fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="card-header">
              <h2 className="card-title"><Map size={20} /> Interactive Crowd Heatmap</h2>
            </div>
            
            <div className="heatmap-container">
              <div className="heatmap-overlay"></div>
              
              {/* Render dynamic zones */}
              <div className="zone-dot zone-high" style={{ top: '35%', left: '70%' }}>
                <div className="zone-tooltip">Gate 4: Severe Congestion (89% Capacity)</div>
              </div>
              <div className="zone-dot zone-med" style={{ top: '60%', left: '40%' }}>
                <div className="zone-tooltip">Main Concourse: Moderate (55% Capacity)</div>
              </div>
              <div className="zone-dot zone-low" style={{ top: '80%', left: '20%' }}>
                <div className="zone-tooltip">Gate 2: Clear (12% Capacity)</div>
              </div>
              <div className="zone-dot zone-low" style={{ top: '25%', left: '30%' }}>
                <div className="zone-tooltip">VIP Lounge: Clear (20% Capacity)</div>
              </div>
              <div className="zone-dot zone-high" style={{ top: '50%', left: '50%' }}>
                <div className="zone-tooltip">Field Access: High (95% Capacity)</div>
              </div>
            </div>
          </div>

          {/* Event Coordination Timeline */}
          <div className="card timeline-card fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="card-header">
              <h2 className="card-title"><Bell size={20} /> Real-Time Coordination Feed</h2>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Send Alert</button>
            </div>
            
            <div className="notification-list">
              <div className="notification-item">
                <div className="notif-icon alert"><ShieldAlert size={18} /></div>
                <div className="notif-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 className="notif-title">Emergency Egress Route Activated</h3>
                    <span className="notif-time">2 mins ago</span>
                  </div>
                  <p className="notif-desc">Security has opened supplementary gates due to crowding near Section 202.</p>
                  <span className="gate-pill">Gate B Opened</span>
                </div>
              </div>

              <div className="notification-item">
                <div className="notif-icon promo"><Search size={18} /></div>
                <div className="notif-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 className="notif-title">Flash Upgrade Promotion</h3>
                    <span className="notif-time">15 mins ago</span>
                  </div>
                  <p className="notif-desc">Pushing notification to 400-level ticketholders for discounted club access.</p>
                </div>
              </div>

              <div className="notification-item">
                <div className="notif-icon info"><Activity size={18} /></div>
                <div className="notif-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 className="notif-title">Halftime Preparations Complete</h3>
                    <span className="notif-time">45 mins ago</span>
                  </div>
                  <p className="notif-desc">Custodial staff confirmed all primary restrooms are fully stocked and cleared.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
