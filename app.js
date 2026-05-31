/* ========================================
   DesignHub Marketplace — JavaScript
   ======================================== */

// ===== DATA =====
const PRODUCTS = [
    { id: 1, name: "Essential UI Icons", category: "Icon Packs", type: "free", badge: "free", downloads: 4852, rating: 4.9, price: "Miễn phí", description: "Bộ 200+ icon cơ bản cho mọi dự án web & mobile. Định dạng SVG, 24x24px, stroke 1.5px.", count: 200, format: "SVG", color: "#22C55E" },
    { id: 2, name: "Pro Interface Kit", category: "UI Kits", type: "pro", badge: "pro", downloads: 3241, rating: 4.8, price: "99.000₫", description: "Bộ UI Kit chuyên nghiệp với 500+ component cho dashboard, admin panel và landing page.", count: 500, format: "Figma, SVG", color: "#3B82F6" },
    { id: 3, name: "E-Commerce Template", category: "Templates", type: "pro", badge: "new", downloads: 2156, rating: 4.7, price: "149.000₫", description: "Template cửa hàng trực tuyến hoàn chỉnh với giỏ hàng, thanh toán và quản lý sản phẩm.", count: 45, format: "HTML, Figma", color: "#8B5CF6" },
    { id: 4, name: "Flat Design Icons", category: "Icon Packs", type: "free", badge: "free", downloads: 6734, rating: 4.9, price: "Miễn phí", description: "Bộ icon flat design tối giản, phù hợp cho ứng dụng hiện đại.", count: 150, format: "SVG, PNG", color: "#F59E0B" },
    { id: 5, name: "Crypto Dashboard", category: "Templates", type: "pro", badge: "pro", downloads: 1876, rating: 4.6, price: "199.000₫", description: "Dashboard theo dõi cryptocurrency với biểu đồ real-time và portfolio management.", count: 30, format: "React, Figma", color: "#EF4444" },
    { id: 6, name: "Social Media Kit", category: "UI Kits", type: "free", badge: "new", downloads: 3789, rating: 4.8, price: "Miễn phí", description: "Template thiết kế bài đăng mạng xã hội cho Instagram, Facebook, Twitter.", count: 80, format: "Figma, PSD", color: "#EC4899" },
    { id: 7, name: "Travel App UI", category: "UI Kits", type: "pro", badge: "pro", downloads: 1234, rating: 4.5, price: "129.000₫", description: "Giao diện ứng dụng du lịch với bản đồ, đặt phòng và review.", count: 60, format: "Figma", color: "#06B6D4" },
    { id: 8, name: "Illustration Pack", category: "Illustrations", type: "free", badge: "free", downloads: 5621, rating: 4.9, price: "Miễn phí", description: "Bộ illustration minh họa phong cách hiện đại cho landing page và marketing.", count: 40, format: "SVG, PNG", color: "#22C55E" },
    { id: 9, name: "Dark Mode Icons", category: "Icon Packs", type: "pro", badge: "new", downloads: 2890, rating: 4.7, price: "79.000₫", description: "Bộ icon tối ưu cho dark mode với 2 variant: line & filled.", count: 300, format: "SVG", color: "#6366F1" },
    { id: 10, name: "Blog Template", category: "Templates", type: "free", badge: "free", downloads: 4123, rating: 4.6, price: "Miễn phí", description: "Template blog cá nhân với responsive design và SEO optimization.", count: 15, format: "HTML", color: "#F97316" },
    { id: 11, name: "Fitness App Kit", category: "UI Kits", type: "pro", badge: "pro", downloads: 987, rating: 4.4, price: "159.000₫", description: "UI Kit cho ứng dụng thể hình với theo dõi workout, dinh dưỡng và progress.", count: 70, format: "Figma", color: "#10B981" },
    { id: 12, name: "Arrow Collection", category: "Icon Packs", type: "free", badge: "free", downloads: 3456, rating: 4.8, price: "Miễn phí", description: "Bộ mũi tên đa dạng cho navigation, flow chart và diagram.", count: 95, format: "SVG", color: "#64748B" },
];

const CATEGORIES = [
    { name: "Icon Packs", icon: "🎨", count: 739 },
    { name: "UI Kits", icon: "📐", count: 637 },
    { name: "Templates", icon: "📄", count: 179 },
    { name: "Illustrations", icon: "🖼️", count: 158 },
    { name: "Fonts", icon: "🔤", count: 104 },
    { name: "3D Assets", icon: "🧊", count: 95 },
    { name: "Mockups", icon: "📦", count: 86 },
    { name: "Presentations", icon: "📊", count: 65 },
    { name: "Social Media", icon: "📱", count: 64 },
    { name: "Print", icon: "🖨️", count: 59 },
    { name: "Textures", icon: "🎯", count: 44 },
    { name: "Themes", icon: "🎭", count: 43 },
];

// ===== SVG ICON GENERATORS =====
function generateRandomIcon(color) {
    const icons = [
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`,
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="16" y2="12"/></svg>`,
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>`,
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>`,
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
        `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    ];
    return icons[Math.floor(Math.random() * icons.length)];
}

function generateProductPreview(product) {
    let html = '<div class="product-preview-icons">';
    for (let i = 0; i < 10; i++) {
        html += `<div class="product-icon-placeholder">${generateRandomIcon(product.color)}</div>`;
    }
    html += '</div>';
    return html;
}

// ===== RENDER FUNCTIONS =====
function renderProducts(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let filtered = PRODUCTS;
    if (filter === 'free') filtered = PRODUCTS.filter(p => p.type === 'free');
    else if (filter === 'pro') filtered = PRODUCTS.filter(p => p.type === 'pro');
    else if (filter === 'new') filtered = PRODUCTS.filter(p => p.badge === 'new');

    grid.innerHTML = filtered.map(product => `
        <div class="product-card fade-in" data-id="${product.id}" onclick="openProductModal(${product.id})">
            <div class="product-preview">
                ${generateProductPreview(product)}
                <span class="product-badge badge-${product.badge}">
                    ${product.badge === 'free' ? '✓ Free' : product.badge === 'pro' ? '⭐ Pro' : '🆕 New'}
                </span>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category} · ${product.count} items</div>
                <div class="product-meta">
                    <span class="product-price ${product.type === 'free' ? 'free' : ''}">${product.price}</span>
                    <span class="product-downloads">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ${product.downloads.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    `).join('');

    // Trigger fade-in
    requestAnimationFrame(() => {
        grid.querySelectorAll('.fade-in').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 80);
        });
    });
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = CATEGORIES.map(cat => `
        <div class="category-card fade-in">
            <div class="category-icon">${cat.icon}</div>
            <div class="category-name">${cat.name}</div>
            <div class="category-count">${cat.count} sản phẩm</div>
        </div>
    `).join('');

    requestAnimationFrame(() => {
        grid.querySelectorAll('.fade-in').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 60);
        });
    });
}

// ===== MODAL FUNCTIONS =====
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const content = document.getElementById('productModalContent');
    content.innerHTML = `
        <div class="pm-preview">
            <div class="pm-preview-icons">
                ${Array.from({length: 10}, () => `<div class="product-icon-placeholder">${generateRandomIcon(product.color)}</div>`).join('')}
            </div>
        </div>
        <h2 class="pm-title">${product.name}</h2>
        <div class="pm-category">${product.category}</div>
        <p class="pm-desc">${product.description}</p>
        <div class="pm-details">
            <div class="pm-detail">
                <div class="pm-detail-value">${product.count}</div>
                <div class="pm-detail-label">Số lượng</div>
            </div>
            <div class="pm-detail">
                <div class="pm-detail-value">${product.format}</div>
                <div class="pm-detail-label">Định dạng</div>
            </div>
            <div class="pm-detail">
                <div class="pm-detail-value">${product.downloads.toLocaleString()}</div>
                <div class="pm-detail-label">Lượt tải</div>
            </div>
        </div>
        <div class="pm-actions">
            <button class="btn btn-primary btn-lg" onclick="handleDownload('${product.name}', '${product.type}')">
                ${product.type === 'free' ? '⬇️ Tải miễn phí' : '🛒 Mua ngay — ' + product.price}
            </button>
            <button class="btn btn-outline btn-lg" onclick="closeModal('productModal')">Đóng</button>
        </div>
    `;

    openModal('productModal');
}

function handleDownload(name, type) {
    closeModal('productModal');
    if (type === 'free') {
        showToast('✅', `Đã tải "${name}" thành công!`);
    } else {
        showToast('💎', `Vui lòng nâng cấp gói Pro để tải "${name}"`);
    }
}

function showToast(icon, message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                return;
            }
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
        };

        update();
    });
}

// ===== INTERSECTION OBSERVER FOR FADE-IN =====
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.step-card, .pricing-card, .testimonial-card, .designers-banner').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===== PRICING TOGGLE =====
function setupPricingToggle() {
    const toggle = document.getElementById('pricingToggle');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const yearlyLabel = document.getElementById('yearlyLabel');

    if (!toggle) return;

    toggle.addEventListener('change', () => {
        const isYearly = toggle.checked;
        monthlyLabel.classList.toggle('active', !isYearly);
        yearlyLabel.classList.toggle('active', isYearly);

        document.querySelectorAll('.price-amount').forEach(el => {
            const monthly = el.dataset.monthly;
            const yearly = el.dataset.yearly;
            if (monthly && yearly) {
                const value = isYearly ? yearly : monthly;
                el.textContent = parseInt(value).toLocaleString('vi-VN');
            }
        });
    });

    // Init
    monthlyLabel.classList.add('active');
}

// ===== HEADER SCROLL =====
function setupHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    });
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mobileNav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// ===== FILTER TABS =====
function setupFilterTabs() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProducts(tab.dataset.filter);
        });
    });
}

// ===== SEARCH =====
function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        if (!query) {
            renderProducts('all');
            return;
        }

        const filtered = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );

        grid.innerHTML = filtered.map(product => `
            <div class="product-card fade-in visible" data-id="${product.id}" onclick="openProductModal(${product.id})">
                <div class="product-preview">
                    ${generateProductPreview(product)}
                    <span class="product-badge badge-${product.badge}">
                        ${product.badge === 'free' ? '✓ Free' : product.badge === 'pro' ? '⭐ Pro' : '🆕 New'}
                    </span>
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${product.category} · ${product.count} items</div>
                    <div class="product-meta">
                        <span class="product-price ${product.type === 'free' ? 'free' : ''}">${product.price}</span>
                        <span class="product-downloads">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            ${product.downloads.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== MODAL EVENTS =====
function setupModals() {
    // Login
    document.getElementById('loginBtn')?.addEventListener('click', () => openModal('loginModal'));
    document.getElementById('loginModalClose')?.addEventListener('click', () => closeModal('loginModal'));

    // Register
    document.getElementById('registerBtn')?.addEventListener('click', () => openModal('registerModal'));
    document.getElementById('registerModalClose')?.addEventListener('click', () => closeModal('registerModal'));

    // Product
    document.getElementById('productModalClose')?.addEventListener('click', () => closeModal('productModal'));

    // Switch between modals
    document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('loginModal');
        setTimeout(() => openModal('registerModal'), 200);
    });

    document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('registerModal');
        setTimeout(() => openModal('loginModal'), 200);
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
        }
    });

    // Form submissions
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal('loginModal');
        showToast('👋', 'Đăng nhập thành công! Chào mừng bạn trở lại.');
    });

    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal('registerModal');
        showToast('🎉', 'Đăng ký thành công! Kiểm tra email để xác nhận.');
    });
}

// ===== LOAD MORE =====
function setupLoadMore() {
    document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
        showToast('📦', 'Đang tải thêm sản phẩm...');
    });
}

// ===== CATEGORY CARD CLICK =====
function setupCategoryClicks() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('.category-name')?.textContent;
            showToast('🔍', `Đang hiển thị danh mục: ${name}`);
        });
    });
}

// ===== ACTIVE NAV ON SCROLL =====
function setupActiveNav() {
    const sections = document.querySelectorAll('section[id], .hero[id]');
    const navLinks = document.querySelectorAll('.nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Render
    renderProducts();
    renderCategories();

    // Setup
    setupHeaderScroll();
    setupMobileMenu();
    setupFilterTabs();
    setupSearch();
    setupSmoothScroll();
    setupModals();
    setupLoadMore();
    setupPricingToggle();
    setupActiveNav();

    // Animations
    animateCounters();

    // Delayed setup
    setTimeout(() => {
        setupScrollAnimations();
        setupCategoryClicks();
    }, 500);
});
