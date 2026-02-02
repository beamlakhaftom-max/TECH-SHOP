# TECH SHOP - Advanced Online Electronics Store

## 🚀 ADVANCED DEVELOPER FEATURES

This manager dashboard includes **enterprise-level features** for professional e-commerce management:

### ✨ Advanced Features Overview:
- **🌓 Dark Mode** - Toggle between light and dark themes
- **📊 Advanced Analytics** - Line charts, pie charts, and real-time data visualization
- **✅ Bulk Operations** - Select multiple products, bulk delete, bulk export
- **📥 CSV Export** - Export products to CSV for backup or analysis
- **🔍 Advanced Search** - Real-time search with multi-field filtering
- **🏷️ Smart Filters** - Filter by store, stock status, and categories
- **🔔 Toast Notifications** - Professional notification system for all actions
- **🎨 Modern UI/UX** - Glassmorphism, smooth animations, responsive design
- **📈 Real-Time Charts** - Sales trends, category distribution, stock levels
- **⚡ Performance** - Optimized rendering and smooth transitions

## 🔗 Manager & Customer Site Connection

**IMPORTANT:** The Manager Dashboard and Customer Website are **FULLY CONNECTED** via localStorage!

### How It Works:
1. **Manager adds/edits products** → Automatically saves to localStorage (`techShopProducts`)
2. **Customer website reads products** → Loads from same localStorage key
3. **Real-time sync** → Changes appear when you refresh the customer site

### To Test the Connection:
1. Open `manager.html` and login (credentials: `beamlakhaftom@gmail.com` / `Bamimanager@` or `admin` / `admin123`)
2. Add or edit a product in the manager dashboard
3. Click "🌐 View Store" button in top bar (or open `index.html` separately)
4. See your changes instantly!

### Connection Indicators:
- **Manager Dashboard**: Shows "🟢 Live" status in top bar
- **"View Store" Button**: Opens customer website in new tab
- **Stock Chart**: Shows real-time inventory levels
- **Session Timer**: Shows "⏱️ Session: Xh Xm" - remaining time before auto-logout

### 🔐 Session Management:
- **Auto-Login**: Your login is saved for 24 hours
- **Auto-Logout**: After 24 hours, you'll be automatically logged out
- **Session Timer**: Top bar shows remaining time (turns red when < 2 hours left)
- **Security**: Password saved locally (use only on trusted devices)

---

## How to Use

1. **Open the Customer Website**: Double-click on `index.html` to open it in your browser

2. **Open the Manager Dashboard**: Double-click on `manager.html` to manage products

3. **Manager Credentials**:
   - Email: `beamlakhaftom@gmail.com` / Password: `Bamimanager@`
   - OR Email: `admin` / Password: `admin123`

4. **Add Your Images**:
   - Put your logo image in the `images/` folder and name it `logo.jpg`
   - Upload product images through Manager Dashboard OR add them to `images/` folder

5. **Manage Stores & Products**:
   - **First**, add your store profiles in the "🏪 Stores" section
   - **Then**, add products and select which store they belong to
   - Changes appear automatically on the customer website

## Features

### Customer Website (index.html):
- ✅ Responsive design (works on mobile, tablet, and desktop)
- ✅ Shopping cart with add/remove functionality
- ✅ Product details modal with color selection
- ✅ Quantity adjustment
- ✅ Login modal with social login buttons
- ✅ Real-time product updates from manager
- ✅ Local storage (cart persists after page refresh)
- ✅ Smooth animations
- ✅ Modern gradient design

### Manager Dashboard (manager.html):
- ✅ **🌓 Dark Mode Toggle** - Switch between light/dark themes instantly
- ✅ **📊 Advanced Charts**:
  - Sales trend line chart (last 7 days)
  - Category distribution pie chart
  - Stock levels bar chart with color coding
- ✅ **✅ Bulk Operations**:
  - Select multiple products with checkboxes
  - Bulk delete selected products
  - Bulk export to CSV
  - Select all / clear selection
- ✅ **🔍 Advanced Search & Filters**:
  - Real-time search by name, ID, or store
  - Filter by store profiles
  - Filter by stock status (low/medium/high)
  - Reset filters button
- ✅ **📥 CSV Export**:
  - Export selected products to CSV
  - Auto-generated filename with date
  - Complete product data export
- ✅ **🔔 Toast Notifications**:
  - Success, error, warning, info types
  - Auto-dismiss after 5 seconds
  - Smooth slide-in animations
  - Click to dismiss manually
- ✅ Secure login system with multiple accounts
- ✅ 24-hour auto-login with session timer
- ✅ Dashboard with live statistics (products, orders, revenue)
- ✅ **Store Profiles Management**:
  - Add/Edit/Delete store profiles
  - Store details (name, email, phone, location, logo)
  - Track products per store
  - Product dropdown automatically populated
- ✅ **Product Management**:
  - Add/Edit/Delete products with live updates
  - Assign products to specific stores
  - Image upload (file or URL)
  - Color picker for product variants
  - Dynamic features list
- ✅ Real-time connection status indicator
- ✅ Smooth transitions and animations throughout

## 📖 How to Use Advanced Features

### Dark Mode:
1. Click the **🌙** button in the top bar
2. Theme preference is saved automatically
3. Works across all pages

### Bulk Operations:
1. Go to **Products** section
2. Check boxes next to products you want to manage
3. Use bulk actions bar that appears:
   - **📥 Export CSV** - Download selected products
   - **🗑️ Delete Selected** - Remove multiple products
   - **❌ Cancel** - Clear selection

### Advanced Search:
1. Navigate to **Products** section
2. Use the search panel:
   - **🔍 Search** - Type product name, ID, or store
   - **🏪 Store Filter** - Filter by specific store
   - **📊 Stock Status** - Filter by stock levels
3. Click **🔄 Reset** to clear all filters

### Export to CSV:
- **Selected Products**: Check products, click "Export CSV"
- **All Products**: Use bulk export feature
- File includes: ID, Name, Price, Stock, Store, Category, Colors, Features

### View Charts:
1. Go to **Dashboard** section
2. View three types of charts:
   - **📈 Sales Trend** - Line chart showing 7-day sales
   - **🎯 Category Distribution** - Pie chart of product categories
   - **📊 Stock Levels** - Bar chart with color-coded inventory

## File Structure

```
TECH SHOP/
├── index.html              (Customer Website)
├── styles.css              (Customer Website Styles - 1289 lines)
├── script.js               (Customer Website JavaScript - 617 lines)
├── manager.html            (Manager Dashboard - 453 lines)
├── manager-styles.css      (Manager Dashboard Styles - 1300+ lines)
├── manager-script.js       (Manager Dashboard JavaScript - 1450+ lines)
├── README.md               (This Documentation)
└── images/                 (Product & Logo Images)
    └── logo.jpg
```

## Technical Stack

### Frontend:
- **HTML5** - Semantic markup
- **CSS3** - CSS Variables, Flexbox, Grid, Animations
- **Vanilla JavaScript** - No frameworks, pure JS

### Features:
- **LocalStorage API** - Data persistence
- **Canvas API** - Chart rendering (line, pie, bar charts)
- **CSS Animations** - Smooth transitions and effects
- **CSS Variables** - Dynamic theming (light/dark mode)
- **Responsive Design** - Mobile-first approach

### Design Patterns:
- **Glassmorphism** - Modern translucent UI
- **Neumorphism** - Soft shadows and depth
- **Gradients** - Multi-color animated backgrounds

## localStorage Keys Used

Both websites share data through localStorage:
- `techShopProducts` - Product catalog (shared between manager & customer)
- `techShopStores` - Store profiles (manager only)
- `techShopCart` - Shopping cart data (customer only)
- `managerAuth` - Manager authentication status
- `managerEmail` - Manager email (auto-fill)
- `managerPassword` - Saved password (24h)
- `managerLoginTime` - Session timestamp
- `managerSavePassword` - User preference
- `darkMode` - Theme preference (manager)

## Contact Information to Update

In `index.html`, update the contact section with your real information:
- Email
- Phone number
- Address

---

## 🎯 Quick Start Guide

1. **For Managers**: Open `manager.html` → Login → Add products → Click "View Store" to see results
2. **For Customers**: Open `index.html` → Browse products → Add to cart → Checkout

**All changes made in Manager Dashboard appear instantly on Customer Website!** 🔄

Enjoy your TECH SHOP! 🚀
