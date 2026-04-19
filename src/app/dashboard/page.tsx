import React from 'react';

export default function Dashboard() {
  const userStats = [
    { label: 'Matches', value: '24' },
    { label: 'Goals', value: '12' },
    { label: 'Win Rate', value: '68%' },
    { label: 'MVP', value: '4' },
  ];

  const upcomingGames = [
    { id: 1, time: 'Today, 19:00', pitch: 'Pitch 4 - Power League', team: 'Reign FC' },
    { id: 2, time: 'Wed, 20:30', pitch: 'Pitch 1 - Goals HQ', team: 'Staff Pick' },
  ];

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', display: 'flex', background: '#050505' }}>
      {/* Sidebar Navigation (Desktop) */}
      <aside className="sidebar" style={{ width: '260px', borderRight: '1px solid var(--card-border)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>FOOTBALL 5 A SIDE</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="#" className="nav-link active">Dashboard</a>
          <a href="#" className="nav-link">My Matches</a>
          <a href="#" className="nav-link">Leagues</a>
          <a href="#" className="nav-link">Team Chat</a>
          <a href="#" className="nav-link">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Welcome Back, <span className="gradient-text">Robin</span></h1>
            <p style={{ opacity: 0.6 }}>Ready for your next match at 19:00?</p>
          </div>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem' }}>Lvl 12 Stalker</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)' }}></div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="booking-grid" style={{ marginBottom: '3rem' }}>
          {userStats.map((stat, i) => (
            <div key={i} className="glass-card" style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }}>{stat.label}</span>
              <span style={{ fontSize: '2rem', fontWeight: '800' }}>{stat.value}</span>
            </div>
          ))}
        </section>

        {/* Dashboard Content Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          {/* Upcoming Matches */}
          <section>
            <h3 style={{ marginBottom: '1.5rem' }}>Upcoming <span className="gradient-text">Bookings</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingGames.map((game) => (
                <div key={game.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>{game.time}</span>
                    <h4 style={{ margin: '0.25rem 0' }}>{game.pitch}</h4>
                    <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>Team: {game.team}</span>
                  </div>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>View Details</button>
                </div>
              ))}
              <button className="btn-primary" style={{ marginTop: '1rem', background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                + Book New Pitch
              </button>
            </div>
          </section>

          {/* Leaderboard Snippet */}
          <section>
            <h3 style={{ marginBottom: '1.5rem' }}>League <span className="gradient-text">Standing</span></h3>
            <div className="glass-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3].map((pos) => (
                  <div key={pos} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: pos !== 3 ? '1px solid rgba(255,255,255,0.1)' : 'none', paddingBottom: '0.5rem' }}>
                    <span style={{ opacity: pos === 1 ? 1 : 0.5 }}>{pos}. {pos === 1 ? 'Reign FC' : pos === 2 ? 'Strikers' : 'Draft Kings'}</span>
                    <span style={{ fontWeight: 'bold' }}>{30 - pos * 3} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--card-border)', padding: '1rem', justifyContent: 'space-around', zIndex: 100 }}>
        <span>🏠</span>
        <span>⚽</span>
        <span>🏆</span>
        <span>⚙️</span>
      </div>

      <style jsx>{`
        .nav-link {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: rgba(255,255,255,0.6);
          transition: 0.2s;
        }
        .nav-link:hover, .nav-link.active {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }
        .nav-link.active {
          border-left: 3px solid var(--accent);
        }
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .mobile-nav { display: flex !important; }
          header { flex-direction: column; align-items: flex-start !important; gap: 1.5rem; }
          div[style*="gridTemplateColumns: 1.5fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
