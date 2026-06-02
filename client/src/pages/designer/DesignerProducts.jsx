import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Star, AlertTriangle } from 'lucide-react';
import {
  designerGetProducts,
  designerCreateProduct,
  designerUpdateProduct,
  designerDeleteProduct,
  getCategories,
} from '../../services/api';
import './DesignerProducts.css';

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
  if (!price && price !== 0) return '0đ';
  return price.toLocaleString('vi-VN') + 'đ';
}

export default function DesignerProducts({ showToast }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await designerGetProducts();
      setProducts(res.data || []);
      setTotal(res.total || 0);
    } catch {
      showToast('❌', 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, []);

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
      categoryId: product.categoryId || '',
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
      showToast('❌', 'Vui lòng nhập tên sản phẩm');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        type: form.type,
        price: form.type === 'free' ? 0 : Number(form.price) || 0,
        description: form.description.trim(),
        format: form.format.trim(),
        count: Number(form.count) || 0,
        color: form.color.trim() || '#22C55E',
      };

      if (editingId) {
        await designerUpdateProduct(editingId, payload);
        showToast('✅', 'Cập nhật sản phẩm thành công');
      } else {
        await designerCreateProduct(payload);
        showToast('✅', 'Tạo sản phẩm thành công');
      }

      closeModal();
      fetchProducts();
    } catch {
      showToast('❌', editingId ? 'Cập nhật thất bại' : 'Tạo sản phẩm thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await designerDeleteProduct(deleteTarget.id);
      showToast('✅', 'Đã xóa sản phẩm');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      showToast('❌', 'Xóa thất bại. Vui lòng thử lại');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const pagedProducts = products.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  return (
    <div className="designer-products-page">
      <div className="designer-products-header">
        <div>
          <h1 className="designer-products-title">Quản lý sản phẩm</h1>
          <span className="designer-products-count">{total} sản phẩm</span>
        </div>
        <button className="designer-products-add-btn" onClick={openAddModal}>
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </div>

      <div className="designer-products-card">
        {loading ? (
          <div className="designer-loading">Đang tải dữ liệu...</div>
        ) : products.length === 0 ? (
          <div className="designer-empty">
            <div className="designer-empty-icon">📦</div>
            <p>Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu!</p>
          </div>
        ) : (
          <>
            <div className="designer-table-wrapper">
              <table className="designer-table">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Loại</th>
                    <th>Giá</th>
                    <th>Lượt tải</th>
                    <th>Đánh giá</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedProducts.map(product => (
                    <tr key={product.id}>
                      <td className="designer-product-name">{product.name}</td>
                      <td>{product.category || '-'}</td>
                      <td>
                        <span className={`designer-product-type designer-product-type--${product.type === 'free' ? 'free' : 'pro'}`}>
                          {product.type === 'free' ? 'Free' : 'Pro'}
                        </span>
                      </td>
                      <td className="designer-product-price">
                        {product.type === 'free' || product.price === 0 ? 'Miễn phí' : formatPrice(product.price)}
                      </td>
                      <td>{product.downloads ?? 0}</td>
                      <td>
                        <div className="designer-product-rating">
                          <Star size={14} />
                          <span>{product.rating ?? '0'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="designer-products-actions">
                          <button className="designer-products-edit-btn" onClick={() => openEditModal(product)} title="Chỉnh sửa">
                            <Pencil size={16} />
                          </button>
                          <button className="designer-products-delete-btn" onClick={() => setDeleteTarget(product)} title="Xóa">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button className="admin-pagination-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>&laquo;</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`admin-pagination-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="admin-pagination-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>&raquo;</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="designer-products-modal-overlay" onClick={closeModal}>
          <div className="designer-products-modal" onClick={e => e.stopPropagation()}>
            <div className="designer-products-modal-header">
              <h2>{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button className="designer-products-modal-close" onClick={closeModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="designer-products-modal-body">
                <div className="dp-field">
                  <label>Tên sản phẩm *</label>
                  <input type="text" value={form.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="Nhập tên sản phẩm" />
                </div>
                <div className="dp-field-row">
                  <div className="dp-field">
                    <label>Danh mục</label>
                    <select value={form.categoryId} onChange={e => handleFormChange('categoryId', e.target.value)}>
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="dp-field">
                    <label>Loại</label>
                    <select value={form.type} onChange={e => handleFormChange('type', e.target.value)}>
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>
                </div>
                <div className="dp-field-row">
                  <div className="dp-field">
                    <label>Giá (đ)</label>
                    <input type="number" min="0" value={form.price} onChange={e => handleFormChange('price', e.target.value)} placeholder="0" disabled={form.type === 'free'} />
                  </div>
                  <div className="dp-field">
                    <label>Số lượng</label>
                    <input type="number" min="0" value={form.count} onChange={e => handleFormChange('count', e.target.value)} placeholder="0" />
                  </div>
                </div>
                <div className="dp-field">
                  <label>Mô tả</label>
                  <textarea value={form.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Mô tả sản phẩm" rows={3} />
                </div>
                <div className="dp-field-row">
                  <div className="dp-field">
                    <label>Định dạng</label>
                    <input type="text" value={form.format} onChange={e => handleFormChange('format', e.target.value)} placeholder="VD: SVG, PNG, Figma" />
                  </div>
                  <div className="dp-field">
                    <label>Màu sắc</label>
                    <input type="text" value={form.color} onChange={e => handleFormChange('color', e.target.value)} placeholder="VD: Đa sắc, Trắng đen" />
                  </div>
                </div>
              </div>
              <div className="designer-products-modal-footer">
                <button type="button" className="dp-btn-cancel" onClick={closeModal}>Hủy</button>
                <button type="submit" className="dp-btn-submit" disabled={submitting}>
                  {submitting ? '⏳ Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="designer-products-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="designer-products-confirm" onClick={e => e.stopPropagation()}>
            <div className="designer-products-confirm-icon"><AlertTriangle size={28} /></div>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deleteTarget.name}"</strong>? Hành động này không thể hoàn tác.</p>
            <div className="designer-products-confirm-actions">
              <button className="dp-btn-cancel" onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button className="dp-btn-delete" onClick={handleDelete} disabled={deleting}>
                {deleting ? '⏳ Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
