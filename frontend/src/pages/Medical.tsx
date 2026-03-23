import React, { useState, useEffect } from 'react';
import api from '../api';
import VoiceButton from '../components/VoiceButton';
import ChartCard from '../components/ChartCard';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaEdit, FaPhone, FaTaxi } from 'react-icons/fa';

const Medical = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    branch: '',
    year: 1,
    issue: '',
    severity: 'low',
    treatment_status: 'pending',
    parent_contact: '',
  });

  const fetchData = async () => {
    try {
      const [resRecords, resDashboard] = await Promise.all([
        api.get('/medical'),
        api.get('/medical/analytics'),
      ]);
      setRecords(resRecords.data);
      setStats(resDashboard.data.stats);
      setInsights(resDashboard.data.insights);
    } catch (err) {
      toast.error('Failed to fetch medical data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/medical', formData);
      toast.success('Record added successfully');
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to add record');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/medical/${id}`);
      toast.success('Record deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  const handleVoiceResult = async (text: string) => {
    try {
      const res = await api.post('/medical/voice', null, { params: { command: text } });
      // In a real app, we'd parse the structured 'data' from the LLM response
      // For now, let's just show the raw logic
      toast.success('AI parsed: ' + text);
    } catch (err) {
      toast.error('Voice parsing failed');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Medical Dashboard...</div>;

  return (
    <div className="medical-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Medical Room Management</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <VoiceButton onResult={handleVoiceResult} />
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Record
          </button>
        </div>
      </div>

      <div className="grid-dashboard">
        {stats && (
          <>
            <ChartCard title="Diseases Frequency" type="bar" data={stats.by_issue} dataKey="count" />
            <ChartCard title="Visit Trends" type="line" data={stats.daily_visits} dataKey="count" nameKey="date" />
            <div className="glass-card">
              <h3 style={{ marginBottom: '1rem' }}>AI Insights & Predictions</h3>
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                {insights || 'Analyzing patterns...'}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--accent-primary)' }}>
              <th style={{ padding: '1rem' }}>Student</th>
              <th>Branch/Year</th>
              <th>Issue</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{r.student_name}</td>
                <td>{r.branch} - Year {r.year}</td>
                <td>{r.issue}</td>
                <td>
                  <span className={`status-badge status-${r.severity === 'high' || r.severity === 'critical' ? 'danger' : 'pending'}`}>
                    {r.severity}
                  </span>
                </td>
                <td>{r.treatment_status}</td>
                <td style={{ display: 'flex', gap: '0.5rem', padding: '1rem' }}>
                  <button onClick={() => toast('Calling parent...')} title="Call Parent"><FaPhone /></button>
                  <button onClick={() => window.open(`https://www.google.com/maps/search/cabs+near+me`)} title="Search Cabs"><FaTaxi /></button>
                  <button onClick={() => handleDelete(r.id)} style={{ color: '#ff4d4d' }} title="Delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '500px', backgroundColor: '#12121a' }}>
            <h3>New Medical Record</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" placeholder="Student Name" required onChange={e => setFormData({...formData, student_name: e.target.value})} className="form-input" />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" placeholder="Branch" required style={{ flex: 1 }} onChange={e => setFormData({...formData, branch: e.target.value})} />
                <input type="number" placeholder="Year" required style={{ width: '80px' }} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
              </div>
              <input type="text" placeholder="Issue / Symptoms" required onChange={e => setFormData({...formData, issue: e.target.value})} />
              <select onChange={e => setFormData({...formData, severity: e.target.value})}>
                <option value="low">Low Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="high">High Severity</option>
                <option value="critical">Critical</option>
              </select>
              <input type="text" placeholder="Parent Contact" onChange={e => setFormData({...formData, parent_contact: e.target.value})} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Record</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'white' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medical;
