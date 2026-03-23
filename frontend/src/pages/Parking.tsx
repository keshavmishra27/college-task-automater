import React, { useState, useEffect } from 'react';
import api from '../api';
import ChartCard from '../components/ChartCard';
import toast from 'react-hot-toast';
import { FaCar, FaPlus, FaCheck, FaHistory } from 'react-icons/fa';

const Parking = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [carNumber, setCarNumber] = useState('');
  const [slotNumber, setSlotNumber] = useState(1);

  const fetchData = async () => {
    try {
      const [resRecords, resDashboard] = await Promise.all([
        api.get('/parking'),
        api.get('/parking/analytics'),
      ]);
      setRecords(resRecords.data);
      setStats(resDashboard.data.stats);
      setInsights(resDashboard.data.insights);
    } catch (err) {
      toast.error('Failed to fetch parking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/parking', { car_number: carNumber, slot_number: slotNumber });
      toast.success('Car registered');
      setCarNumber('');
      fetchData();
    } catch (err) {
      toast.error('Failed to register');
    }
  };

  const handleCheckout = async (id: number) => {
    try {
      await api.put(`/parking/${id}`, { status: 'free', time_out: new Date().toISOString() });
      toast.success('Checkout successful');
      fetchData();
    } catch (err) {
      toast.error('Failed to checkout');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Parking Dashboard...</div>;

  return (
    <div className="parking-page">
      <h2>Smart Parking Intelligence</h2>

      <div className="grid-dashboard" style={{ marginTop: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Register Entry</h3>
          <form onSubmit={handleEntry} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Car Number (e.g. MH12AB1234)" required value={carNumber} onChange={e => setCarNumber(e.target.value)} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select style={{ flex: 1 }} value={slotNumber} onChange={e => setSlotNumber(parseInt(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => <option key={s} value={s}>Slot #{s}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary"><FaPlus /> Check In</button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Current Occupancy</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => {
                const isOccupied = records.some(r => r.slot_number === s && r.status === 'occupied');
                return (
                  <div key={s} style={{ 
                    padding: '0.8rem', textAlign: 'center', borderRadius: '4px',
                    backgroundColor: isOccupied ? 'rgba(255, 77, 77, 0.2)' : 'rgba(0, 255, 0, 0.2)',
                    border: `1px solid ${isOccupied ? '#ff4d4d' : '#00ff00'}`,
                    color: isOccupied ? '#ff4d4d' : '#00ff00',
                    fontSize: '0.8rem', fontWeight: 'bold'
                  }}>
                    #{s}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {stats && (
          <>
            <ChartCard title="Hourly Occupancy" type="area" data={stats.hourly} dataKey="count" nameKey="hour" color="#ffff00" />
            <div className="glass-card">
              <h3 style={{ marginBottom: '1rem', color: '#ffff00' }}>AI Prediction Report</h3>
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                {insights || 'Predicting occupancy patterns...'}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}><FaHistory /> Parking History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#ffff00' }}>
              <th style={{ padding: '1rem' }}>Car Number</th>
              <th>Slot</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{r.car_number}</td>
                <td>#{r.slot_number}</td>
                <td>{new Date(r.time_in).toLocaleTimeString()}</td>
                <td>{r.time_out ? new Date(r.time_out).toLocaleTimeString() : '-'}</td>
                <td>
                  <span className={`status-badge status-${r.status === 'occupied' ? 'danger' : 'success'}`}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {r.status === 'occupied' && (
                    <button onClick={() => handleCheckout(r.id)} style={{ color: '#00ff00' }}>
                      <FaCheck /> Checkout
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Parking;
