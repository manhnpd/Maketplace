import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Star, AlertTriangle } from 'lucide-react';
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../../../services/adminService';
import { getCategories } from '../../../services/productService';
import { useToastContext } from '../../../contexts/ToastContext';
import './AdminProducts.css';

const PRODUCTS_PER_PAGE = 10;

const EMPTY_FORM = {
  name: '',
  categoryId: '',
  type: 'free',
  price: '',
  description: '',
  format: '',
  count: '',
  color: '',
};

function formatPrice(price) {
  if (!price && price !== 0) return '0d';
  return price.toLocaleString('vi-VN') + 'd';
}

export default function AdminProducts() {
  const { showToast } = useToastContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: PRODUCTS_PER_PAGE,
        offset: (page - 1) * PRODUCTS_PER_PAGE,
      };
      const res = await adminGetProducts(params);
      setProducts(res.data || []);
      setTotal(res.total || 0);
    } catch {
      showToast('❌', 'Khong the tai danh sach san pham');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (modalOpen && categories.length === 0) {
      getCategories()
        .then(res => setCategories(res.data || []))
        .catch(() => {});
    }
  }, [modalOpen, categories.length]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      categoryId: product.categoryId || product.category_id || '',
      type: product.type || 'free',
      price: product.price ?? '',
      description: product.description || '',
      format: product.format || '',
      count: product.count ?? '',
      color: product.color || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('❌', 'Vui long nhap ten san pham');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: form.type === 'free' ? 0 : Number(form.price) || 0,
        count: Number(form.count) || 0,
      };

      if (editingId) {
        await adminUpdateProduct(editingId, payload);
        showToast('✅', 'Cap nhat san pham thanh cong');
      } else {
        await adminCreateProduct(payload);
        showToast('✅', 'Tao san pham thanh cong');
      }

      closeModal();
      fetchProducts();
    } catch {
      showToast('❌', editingId ? 'Cap nhat that bai. Vui long thu lai' : 'Tao that bai. Vui long thu lai');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (product) => {
    setDeleteTarget(product);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(deleteTarget.id);
      showToast('✅', 'Xoa san pham thanh cong');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      showToast('❌', 'Xoa that bai. Vui long thu lai');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));

  return (
    <div className="admin-products">
      {/* Header */}
      <div className="admin-products-header">
        <div>
          <h1 className="admin-products-title">Quan ly san pham</h1>
          <span className="admin-products-count">{total} san pham</span>
        </div>
        <button className="admin-products-add-btn" onClick={openAddModal}>
          <Plus size={18} />
          Them san pham
        </button>
      </div>

      {/* Table */}
      <div className="admin-products-card">
        {loading ? (
          <div className="admin-loading">Dang tai du lieu...</div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📦</div>
            <p>Chua co san pham nao</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ten</th>
                    <th>Danh muc</th>
                    <th>Loai</th>
                    <th>Gia</th>
                    <th>Downloads</th>
                    <th>Rating</th>
                    <th>Hanh dong</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="admin-products-id">#{product.id}</td>
                      <td className="admin-products-name">{product.name}</td>
                      <td>{product.category || '-'}</td>
                      <td>
                        <span className={`admin-products-type admin-products-type--${product.type === 'free' ? 'free' : 'pro'}`}>
                          {product.type === 'free' ? 'Free' : 'Pro'}
                        </span>
                      </td>
                      <td className="admin-products-price">
                        {product.type === 'free' || product.price === 0 ? 'Mien phi' : formatPrice(product.price)}
                      </td>
                      <td>{product.downloads ?? 0}</td>
                      <td>
                        <div className="admin-products-rating">
                          <Star size={14} />
                          <span>{product.rating ?? '0'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-products-actions">
                          <button
                            className="admin-products-edit-btn"
                            onClick={() => openEditModal(product)}
                            title="Chinh sua"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="admin-products-delete-btn"
                            onClick={() => confirmDelete(product)}
                            title="Xoa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="admin-products-modal-overlay" onClick={closeModal}>
          <div className="admin-products-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-products-modal-header">
              <h2 className="admin-products-modal-title">
                {editingId ? 'Chinh sua san pham' : 'Them san pham moi'}
              </h2>
              <button className="admin-products-modal-close" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-products-modal-body">
                <div className="admin-products-field">
                  <label>Ten san pham *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleFormChange('name', e.target.value)}
                    placeholder="Nhap ten san pham"
                  />
                </div>

                <div className="admin-products-field-row">
                  <div className="admin-products-field">
                    <label>Danh muc</label>
                    <select
                      value={form.categoryId}
                      onChange={e => handleFormChange('categoryId', e.target.value)}
                    >
                      <option value="">-- Chon danh muc --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-products-field">
                    <label>Loai</label>
                    <select
                      value={form.type}
                      onChange={e => handleFormChange('type', e.target.value)}
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>
                </div>

                <div className="admin-products-field-row">
                  <div className="admin-products-field">
                    <label>Gia (d)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={e => handleFormChange('price', e.target.value)}
                      placeholder="0"
                      disabled={form.type === 'free'}
                    />
                  </div>

                  <div className="admin-products-field">
                    <label>So luong</label>
                    <input
                      type="number"
                      min="0"
                      value={form.count}
                      onChange={e => handleFormChange('count', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="admin-products-field">
                  <label>Mo ta</label>
                  <textarea
                    value={form.description}
                    onChange={e => handleFormChange('description', e.target.value)}
                    placeholder="Mo ta san pham"
                  />
                </div>

                <div className="admin-products-field-row">
                  <div className="admin-products-field">
                    <label>Dinh dang</label>
                    <input
                      type="text"
                      value={form.format}
                      onChange={e => handleFormChange('format', e.target.value)}
                      placeholder="VD: SVG, PNG, Figma"
                    />
                  </div>

                  <div className="admin-products-field">
                    <label>Mau sac</label>
                    <input
                      type="text"
                      value={form.color}
                      onChange={e => handleFormChange('color', e.target.value)}
                      placeholder="VD: Da sac, Trang den"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-products-modal-footer">
                <button type="button" className="admin-products-modal-cancel" onClick={closeModal}>
                  Huy
                </button>
                <button type="submit" className="admin-products-modal-submit" disabled={submitting}>
                  {submitting ? 'Dang luu...' : editingId ? 'Cap nhat' : 'Tao moi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="admin-products-confirm-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-products-confirm" onClick={e => e.stopPropagation()}>
            <div className="admin-products-confirm-icon">
              <AlertTriangle size={28} />
            </div>
            <h3>Xac nhan xoa</h3>
            <p>
              Ban co chac chan muon xoa san pham
              <strong> "{deleteTarget.name}" </strong>?
              Hanh dong nay khong the hoan tac.
            </p>
            <div className="admin-products-confirm-actions">
              <button
                className="admin-products-confirm-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Huy
              </button>
              <button
                className="admin-products-confirm-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Dang xoa...' : 'Xoa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
