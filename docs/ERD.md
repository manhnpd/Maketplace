# DesignHub Marketplace — Entity Relationship Diagrams

> Xem trực tiếp trong VS Code (cài extension **Markdown Preview Mermaid Support**) hoặc dán vào [mermaid.live](https://mermaid.live).

---

## 1. Conceptual ERD

Bản đồ khái niệm — chỉ thể hiện các thực thể và mối quan hệ giữa chúng, không chứa thuộc tính.

```mermaid
erDiagram
    USER ||--o{ ORDER : "đặt"
    USER ||--|| PROFILE : "có"

    CATEGORY ||--o{ PRODUCT : "chứa"
    DESIGNER ||--o{ PRODUCT : "tạo"

    PRODUCT ||--o{ ORDER_ITEM : "được mua"

    ORDER ||--|{ ORDER_ITEM : "gồm"

    PRICING_PLAN ||--|{ PRICING_FEATURE : "bao gồm"

    TESTIMONIAL
    SITE_STATS
```

### Mô tả quan hệ

| Thực thể | Quan hệ | Thực thể | Kiểu | Ghi chú |
|----------|---------|----------|------|---------|
| USER | đặt | ORDER | 1:N | Một user có nhiều đơn hàng |
| USER | có | PROFILE | 1:1 | Mỗi user có đúng 1 hồ sơ |
| CATEGORY | chứa | PRODUCT | 1:N | Một danh mục có nhiều sản phẩm |
| DESIGNER | tạo | PRODUCT | 1:N | Một designer tạo nhiều sản phẩm |
| ORDER | gồm | ORDER_ITEM | 1:N | Một đơn hàng có nhiều mục |
| PRODUCT | được mua | ORDER_ITEM | 1:N | Một sản phẩm xuất hiện trong nhiều mục |
| PRICING_PLAN | bao gồm | PRICING_FEATURE | 1:N | Một gói có nhiều tính năng |
| TESTIMONIAL | — | — | Độc lập | Đánh giá người dùng |
| SITE_STATS | — | — | Độc lập | Thống kê trang (1 hàng) |

---

## 2. Logical ERD

Mô hình logic — thể hiện thuộc tính chính, khóa chính (PK), khóa ngoại (FK), kiểu dữ liệu nghiệp vụ.

```mermaid
erDiagram
    PROFILE {
        uuid id PK "ID người dùng (trùng auth.users)"
        string name "Họ tên"
        string email "Email"
        string role "Vai trò: user / designer"
        datetime created_at "Ngày tạo"
    }

    CATEGORY {
        int id PK
        string name "Tên danh mục"
        string slug "Đường dẫn URL"
        string icon "Biểu tượng"
        int count "Số lượng SP"
    }

    DESIGNER {
        int id PK
        string name "Tên designer"
        string avatar "Ảnh đại diện"
        string role "Chức danh"
        int products "Số SP đã tạo"
        int sales "Số lượt bán"
        decimal rating "Đánh giá (0-5)"
    }

    PRODUCT {
        int id PK
        string name "Tên sản phẩm"
        int category_id FK "→ Category"
        int designer_id FK "→ Designer"
        string type "free / pro"
        string badge "Nhãn hiển thị"
        int downloads "Lượt tải"
        decimal rating "Đánh giá (0-5)"
        int price "Giá (VNĐ)"
        string price_display "Hiển thị giá"
        string description "Mô tả"
        int count "Số lượng item"
        string format "Định dạng file"
        string color "Màu nhãn"
        boolean is_new "Sản phẩm mới?"
        boolean is_featured "Nổi bật?"
        datetime created_at "Ngày tạo"
    }

    PRICING_PLAN {
        string id PK "free / pro / team"
        string name "Tên gói"
        string tagline "Khẩu hiệu"
        boolean popular "Gói phổ biến?"
        int monthly_price "Giá tháng (VNĐ)"
        int yearly_price "Giá năm (VNĐ)"
    }

    PRICING_FEATURE {
        int id PK
        string plan_id FK "→ PricingPlan"
        string text "Mô tả tính năng"
        boolean included "Được bao gồm?"
        boolean highlight "Nổi bật?"
    }

    ORDER {
        int id PK
        uuid user_id FK "→ User (nullable)"
        string customer_name "Tên KH"
        string customer_email "Email KH"
        string customer_phone "SĐT KH"
        string customer_address "Địa chỉ"
        string note "Ghi chú"
        string payment_method "PT thanh toán"
        string status "Trạng thái"
        int total "Tổng tiền (VNĐ)"
        datetime created_at "Ngày đặt"
    }

    ORDER_ITEM {
        int id PK
        int order_id FK "→ Order"
        int product_id FK "→ Product (nullable)"
        string product_name "Tên SP lúc mua"
        int quantity "Số lượng"
        int price "Đơn giá (VNĐ)"
    }

    TESTIMONIAL {
        int id PK
        string name "Tên người đánh giá"
        string avatar "Ảnh đại diện"
        string role "Chức danh"
        int stars "Số sao (1-5)"
        string text "Nội dung"
    }

    SITE_STATS {
        int id PK "Luôn = 1"
        int total_products "Tổng SP"
        int total_designers "Tổng designer"
        int total_downloads "Tổng lượt tải"
    }

    PROFILE ||--|| USER : "extends"
    CATEGORY ||--o{ PRODUCT : "has"
    DESIGNER ||--o{ PRODUCT : "creates"
    PRODUCT ||--o{ ORDER_ITEM : "included_in"
    ORDER ||--|{ ORDER_ITEM : "contains"
    PRICING_PLAN ||--|{ PRICING_FEATURE : "offers"
    USER ||--o{ ORDER : "places"
```

### Ghi chú mô hình logic

- **USER** được quản lý bởi Supabase Auth (`auth.users`), không có bảng riêng trong schema
- **PROFILE** mở rộng USER với trường `id` trùng với `auth.users.id` (quan hệ 1:1)
- **ORDER.user_id** nullable — cho phép khách vãng lai đặt hàng không cần đăng nhập
- **ORDER_ITEM.product_id** nullable — dùng `SET NULL` khi xóa SP, giữ lại tên SP trong `product_name` để lưu vết
- **ORDER_ITEM** snapshot giá (`price`) và tên (`product_name`) tại thời điểm mua, không phụ thuộc vào bảng products sau này

---

## 3. Physical ERD

Mô hình vật lý — chi tiết đầy đủ kiểu dữ liệu PostgreSQL, ràng buộc, giá trị mặc định, chính sách RLS.

```mermaid
erDiagram
    categories {
        serial id PK
        text name "NOT NULL"
        text icon "NOT NULL"
        integer count "DEFAULT 0"
        text slug "NOT NULL, UNIQUE"
    }

    designers {
        serial id PK
        text name "NOT NULL"
        text avatar "NOT NULL"
        text role "NOT NULL"
        integer products "DEFAULT 0"
        integer sales "DEFAULT 0"
        numeric_2_1 rating "DEFAULT 0"
    }

    products {
        serial id PK
        text name "NOT NULL"
        integer category_id FK "→ categories(id) ON DELETE SET NULL"
        integer designer_id FK "→ designers(id) ON DELETE SET NULL"
        text type "NOT NULL, CHECK(free|pro)"
        text badge "NOT NULL"
        integer downloads "DEFAULT 0"
        numeric_2_1 rating "DEFAULT 0"
        integer price "DEFAULT 0"
        text price_display "NOT NULL"
        text description ""
        integer count "DEFAULT 0"
        text format ""
        text color ""
        boolean is_new "DEFAULT false"
        boolean is_featured "DEFAULT false"
        timestamptz created_at "DEFAULT now()"
    }

    pricing_plans {
        text id PK "VD: free, pro, team"
        text name "NOT NULL"
        text tagline ""
        boolean popular "DEFAULT false"
        integer monthly_price "DEFAULT 0"
        integer yearly_price "DEFAULT 0"
    }

    pricing_features {
        serial id PK
        text plan_id FK "→ pricing_plans(id) ON DELETE CASCADE"
        text text "NOT NULL"
        boolean included "DEFAULT true"
        boolean highlight "DEFAULT false"
    }

    testimonials {
        serial id PK
        text name "NOT NULL"
        text avatar "NOT NULL"
        text role "NOT NULL"
        integer stars "DEFAULT 5, CHECK(1-5)"
        text text "NOT NULL"
    }

    site_stats {
        integer id PK "DEFAULT 1, CHECK(id=1)"
        integer total_products "DEFAULT 0"
        integer total_designers "DEFAULT 0"
        integer total_downloads "DEFAULT 0"
    }

    profiles {
        uuid id PK "FK → auth.users(id) ON DELETE CASCADE"
        text name "NOT NULL"
        text email "NOT NULL"
        text role "DEFAULT user, CHECK(user|designer)"
        timestamptz created_at "DEFAULT now()"
    }

    orders {
        serial id PK
        uuid user_id FK "→ auth.users(id) ON DELETE SET NULL"
        text customer_name "NOT NULL"
        text customer_email "NOT NULL"
        text customer_phone "NOT NULL"
        text customer_address ""
        text note ""
        text payment_method "NOT NULL, DEFAULT cod"
        text status "NOT NULL, DEFAULT pending"
        integer total "NOT NULL, DEFAULT 0"
        timestamptz created_at "DEFAULT now()"
    }

    order_items {
        serial id PK
        integer order_id FK "→ orders(id) ON DELETE CASCADE"
        integer product_id FK "→ products(id) ON DELETE SET NULL"
        text product_name "NOT NULL"
        integer quantity "NOT NULL, DEFAULT 1"
        integer price "NOT NULL, DEFAULT 0"
    }

    categories ||--o{ products : "category_id"
    designers ||--o{ products : "designer_id"
    pricing_plans ||--|{ pricing_features : "plan_id CASCADE"
    orders ||--|{ order_items : "order_id CASCADE"
    products ||--o{ order_items : "product_id"
```

### Chi tiết Physical

#### Kiểu dữ liệu

| Kiểu | Ý nghĩa | Dùng cho |
|------|----------|----------|
| `serial` | Tự tăng (integer) | PK của mọi bảng (trừ profiles, pricing_plans) |
| `uuid` | UUID v4 | profiles.id, orders.user_id (từ Supabase Auth) |
| `text` | Chuỗi không giới hạn | Hầu hết các trường chuỗi |
| `integer` | Số nguyên 4 byte | Giá (VNĐ), số lượng, đếm |
| `numeric(2,1)` | Số thập phân chính xác | rating (VD: 4.9) |
| `boolean` | Đúng/Sai | is_new, is_featured, popular, included... |
| `timestamptz` | Timestamp kèm timezone | created_at |

#### Ràng buộc CHECK

| Bảng | Trường | Ràng buộc |
|------|--------|-----------|
| `products` | type | `IN ('free', 'pro')` |
| `profiles` | role | `IN ('user', 'designer')` |
| `testimonials` | stars | `BETWEEN 1 AND 5` |
| `site_stats` | id | `= 1` (đảm bảo chỉ 1 hàng) |

#### Hành vi ON DELETE

| FK | Hành vi | Lý do |
|----|---------|-------|
| `products.category_id → categories(id)` | SET NULL | Xóa danh mục không xóa sản phẩm |
| `products.designer_id → designers(id)` | SET NULL | Xóa designer không xóa sản phẩm |
| `pricing_features.plan_id → pricing_plans(id)` | CASCADE | Xóa gói thì xóa luôn tính năng |
| `profiles.id → auth.users(id)` | CASCADE | Xóa user thì xóa hồ sơ |
| `orders.user_id → auth.users(id)` | SET NULL | Xóa user vẫn giữ đơn hàng (khách vãng lai) |
| `order_items.order_id → orders(id)` | CASCADE | Xóa đơn hàng thì xóa luôn mục |
| `order_items.product_id → products(id)` | SET NULL | Xóa sản phẩm vẫn giữ mục (lưu vết qua product_name) |

#### Row Level Security (RLS)

| Bảng | Chính sách |
|------|-----------|
| `products, categories, designers, pricing_plans, pricing_features, testimonials, site_stats` | Public read (anon + authenticated) |
| `profiles` | User chỉ đọc/sửa profile của mình (`auth.uid() = id`) |
| `orders` | User chỉ đọc đơn của mình; service_role toàn quyền |
| `order_items` | service_role toàn quyền |
