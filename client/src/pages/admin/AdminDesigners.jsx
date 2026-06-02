import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Check, X } from 'lucide-react';
import { adminGetApplications, adminUpdateApplication } from '../../services/api';
import './AdminDesigners.css';

const FILTER_TABS = [
  { key: 'all', label: 'Tat ca' },
  { key: 'pending', label: 'Cho duyet' },
  { key: 'approved', label: 'Da duyet' },
  { key: 'rejected', label: 'Da tu choi' },
];

const STATUS_LABELS = {
  pending: 'Cho duyet',
  approved: 'Da duyet',
  rejected: 'Da tu choi',
};

const ITEMS_PER_PAGE = 10;

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminDesigners({ showToast }) {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [notes, setNotes] = useState({});

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
      };
      if (filter !== 'all') params.status = filter;
      const res = await adminGetApplications(params);
      setApplications(res.data || []);
      setTotal(res.total || 0);
    } catch {
      showToast('❌', 'Khong the tai danh sach ung vien');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const data = { status };
      const note = notes[id];
      if (note?.trim()) data.note = note.trim();
      await adminUpdateApplication(id, data);
      showToast('✅', `${status === 'approved' ? 'Duyet' : 'Tu choi'} ung vien thanh cong`);
      setNotes(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      fetchApplications();
    } catch {
      showToast('❌', 'Cap nhat that bai. Vui long thu lai');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNoteChange = (id, value) => {
    setNotes(prev => ({ ...prev, [id]: value }));
  };

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  return (
    <div className="admin-designers">
      <div className="admin-designers-header">
        <div>
          <h1 className="admin-designers-title">Ung vien Designer</h1>
          <span className="admin-designers-count">{total} ung vien</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-designers-filters">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            className={`admin-designers-filter ${filter === tab.key ? 'active' : ''}`}
            onClick={() => { setFilter(tab.key); setPage(1); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Application Cards */}
      {loading ? (
        <div className="admin-loading">Dang tai du lieu...</div>
      ) : applications.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">👥</div>
          <p>Khong co ung vien nao</p>
        </div>
      ) : (
        <>
          <div className="admin-designers-list">
            {applications.map(app => (
              <div key={app.id} className="admin-designer-card">
                {/* Top row: info + status */}
                <div className="admin-designer-card-top">
                  <div className="admin-designer-info">
                    <div className="admin-designer-avatar">
                      {getInitials(app.name)}
                    </div>
                    <div className="admin-designer-meta">
                      <div className="admin-designer-name">{app.name || 'Khong ten'}</div>
                      <div className="admin-designer-contact">
                        {app.email && <span>{app.email}</span>}
                        {app.phone && <span>{app.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`admin-status admin-status--${app.status}`}>
                    {STATUS_LABELS[app.status] || app.status}
                  </span>
                </div>

                {/* Bio */}
                {app.bio && (
                  <p className="admin-designer-bio">{app.bio}</p>
                )}

                {/* Specialties tags */}
                {app.specialties && app.specialties.length > 0 && (
                  <div className="admin-designer-tags">
                    {app.specialties.map((spec, i) => (
                      <span key={i} className="admin-designer-tag">{spec}</span>
                    ))}
                  </div>
                )}

                {/* Portfolio */}
                {app.portfolioUrl && (
                  <a
                    className="admin-designer-portfolio"
                    href={app.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={14} />
                    {app.portfolioUrl}
                  </a>
                )}

                {/* Actions */}
                <div className="admin-designer-actions">
                  <div className="admin-designer-note-row">
                    <input
                      className="admin-designer-note-input"
                      placeholder="Ghi chu (tuy chon)..."
                      value={notes[app.id] || ''}
                      onChange={e => handleNoteChange(app.id, e.target.value)}
                    />
                  </div>
                  <button
                    className="admin-btn-approve"
                    disabled={updatingId === app.id}
                    onClick={() => handleUpdateStatus(app.id, 'approved')}
                  >
                    <Check size={16} /> Duyet
                  </button>
                  <button
                    className="admin-btn-reject"
                    disabled={updatingId === app.id}
                    onClick={() => handleUpdateStatus(app.id, 'rejected')}
                  >
                    <X size={16} /> Tu choi
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button
                className="admin-pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                &laquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`admin-pagination-btn ${page === p ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="admin-pagination-btn"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
