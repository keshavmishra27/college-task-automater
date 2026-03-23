import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcaseMedical, FaStore, FaBullhorn, FaParking } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Medical Room',
      desc: 'Track student health records and get AI-powered disease pattern alerts.',
      icon: <FaBriefcaseMedical size={40} />,
      path: '/medical',
      color: 'var(--accent-primary)',
    },
    {
      title: 'Stationery Store',
      desc: 'Manage inventory with smart demand forecasting and automated proposals.',
      icon: <FaStore size={40} />,
      path: '/stationery',
      color: '#ff00ff',
    },
    {
      title: 'Voice Agency',
      desc: 'Multilingual AI announcement agent with scheduled multilingual text-to-speech.',
      icon: <FaBullhorn size={40} />,
      path: '/announcements',
      color: '#00ff00',
    },
    {
      title: 'Smart Parking',
      desc: 'Computer vision based car slot tracking and occupancy prediction.',
      icon: <FaParking size={40} />,
      path: '/parking',
      color: '#ffff00',
    },
  ];

  return (
    <div className="home-page" style={{ padding: '2rem 0' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '700', marginBottom: '1rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CAMPUS AI
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
          The intelligent operating system for the modern campus. Powered by advanced AI and computer vision.
        </p>
      </header>

      <div className="grid-dashboard" style={{ marginTop: '2rem' }}>
        {features.map((f, i) => (
          <div
            key={i}
            className="glass-card"
            style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
            onClick={() => navigate(f.path)}
          >
            <div style={{ color: f.color, marginBottom: '0.5rem' }}>{f.icon}</div>
            <h3 style={{ fontSize: '1.5rem' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            <div style={{ marginTop: 'auto', paddingTop: '1rem', fontWeight: '700', color: f.color }}>
              LAUNCH MODULE &rarr;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
