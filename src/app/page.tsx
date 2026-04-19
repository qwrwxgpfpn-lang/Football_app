import React from 'react';

export default function Home() {
  const matches = [
    { id: 1, time: 'Today 19:00', teamA: 'Reign FC', teamB: 'Power Strikers', status: '4 Spots Left' },
    { id: 2, time: 'Today 20:30', teamA: 'Urban Legends', teamB: 'Draft Kings', status: 'Full' },
    { id: 3, time: 'Tomorrow 18:00', teamA: 'Midfield Maestro', teamB: 'Goal Getters', status: '2 Spots Left' },
    { id: 4, time: 'Tomorrow 19:30', teamA: 'Pitch Burners', teamB: 'Shadow Squad', status: '5 Spots Left' },
  ];

  return (
    <main>
      <section className="hero">
        <div className="container animate-fade-in">
          <h1 className="hero-title">
            Own The <span className="gradient-text">Pitch</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate 5-a-side booking platform. Book matches, track stats, and join the local league elite.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary">Book a Pitch</button>
            <button className="btn-primary" style={{ background: 'transparent', color: '#fff', border: '1px solid #fff' }}>
              View Leagues
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem' }}>Upcoming <span className="gradient-text">Matches</span></h2>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>Join a game or organize your own squad.</p>
            </div>
            <a href="#" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>See All Matches &rarr;</a>
          </div>

          <div className="booking-grid">
            {matches.map((match) => (
              <div key={match.id} className="glass-card match-card">
                <span className="match-time">{match.time}</span>
                <div className="match-teams">
                  <div className="match-team">
                    <span>{match.teamA}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>HOME</span>
                  </div>
                  <div style={{ margin: '0.5rem 0', opacity: 0.2, fontSize: '0.9rem', fontWeight: 'bold' }}>VS</div>
                  <div className="match-team">
                    <span>{match.teamB}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>AWAY</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`match-status ${match.status === 'Full' ? 'status-full' : ''}`} 
                        style={{ color: match.status === 'Full' ? '#ff4444' : 'var(--accent)' }}>
                    {match.status}
                  </span>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} disabled={match.status === 'Full'}>
                    {match.status === 'Full' ? 'Closed' : 'Join Game'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--pitch-green-dark)' }}>
        <div className="container">
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Ready to <span className="gradient-text">Dominate?</span></h2>
            <p style={{ maxWidth: '700px', margin: '0 auto 2rem', opacity: 0.8 }}>
              Join over 10,000+ players managing their amateur football careers with Football 5 A Side. 
              The most advanced booking and tracking engine for the beautiful game.
            </p>
            <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '1.5rem 3rem' }}>Create Your Team</button>
          </div>
        </div>
      </section>

      <footer className="section" style={{ borderTop: '1px solid var(--card-border)', padding: '4rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5 }}>
          <span>© 2024 Football 5 A Side. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
