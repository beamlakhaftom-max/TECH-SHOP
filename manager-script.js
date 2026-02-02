// Manager Dashboard JavaScript

// Manager credentials
const MANAGER_CREDENTIALS = [
    {
        email: 'admin',
        password: 'admin123'
    },
    {
        email: 'beamlakhaftom@gmail.com',
        password: 'Bamimanager@'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // Check if session has expired (24 hours)
    checkSessionExpiry();
    
    // Pre-fill login form if credentials were saved
    prefillLoginForm();
    
    // Load products from localStorage if manager is logged in
    if (checkManagerAuth()) {
        loadManagerDashboard();
        updateSessionInfo(); // Show session expiry info
        setInterval(updateSessionInfo, 60000); // Update every minute
    }
});

// Update current time
function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleString();
    }
}

// Manager Login
function managerLogin(event) {
    event.preventDefault();
    
    const managerId = document.getElementById('manager-id').value;
    const password = document.getElementById('manager-password').value;
    const savePassword = document.getElementById('save-password').checked;
    
    // Check credentials against all allowed managers
    const validManager = MANAGER_CREDENTIALS.find(
        cred => cred.email === managerId && cred.password === password
    );
    
    if (validManager) {
        // Store auth token with timestamp
        const loginTime = new Date().getTime();
        localStorage.setItem('managerAuth', 'true');
        localStorage.setItem('managerEmail', managerId);
        localStorage.setItem('managerLoginTime', loginTime.toString());
        
        // Only save password if checkbox is checked
        if (savePassword) {
            localStorage.setItem('managerPassword', password);
            localStorage.setItem('managerSavePassword', 'true');
        } else {
            // Remove saved password if unchecked
            localStorage.removeItem('managerPassword');
            localStorage.setItem('managerSavePassword', 'false');
        }
        
        // Hide login, show dashboard
        document.getElementById('manager-login').style.display = 'none';
        document.getElementById('manager-dashboard').classList.add('active');
        
        loadManagerDashboard();
        showNotification('Login successful! Welcome Manager 🎉');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

// Check Manager Auth
function checkManagerAuth() {
    return localStorage.getItem('managerAuth') === 'true';
}

// Check Session Expiry (24 hours = 86400000 milliseconds)
function checkSessionExpiry() {
    const loginTime = localStorage.getItem('managerLoginTime');
    const isAuthenticated = localStorage.getItem('managerAuth') === 'true';
    
    if (isAuthenticated && loginTime) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - parseInt(loginTime);
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (timeDifference >= oneDayInMs) {
            // Session expired, force logout
            clearManagerSession();
            showNotification('Session expired. Please login again.', 'error');
        } else {
            // Show remaining time in console for debugging
            const remainingHours = Math.floor((oneDayInMs - timeDifference) / (60 * 60 * 1000));
            console.log(`Session valid for ${remainingHours} more hours`);
        }
    }
}

// Pre-fill Login Form with Saved Credentials
function prefillLoginForm() {
    const savedEmail = localStorage.getItem('managerEmail');
    const savedPassword = localStorage.getItem('managerPassword');
    const savePasswordEnabled = localStorage.getItem('managerSavePassword') === 'true';
    
    const emailField = document.getElementById('manager-id');
    const passwordField = document.getElementById('manager-password');
    const savePasswordCheckbox = document.getElementById('save-password');
    
    if (emailField && savedEmail) {
        emailField.value = savedEmail;
    }
    
    if (passwordField && savedPassword && savePasswordEnabled) {
        passwordField.value = savedPassword;
    }
    
    if (savePasswordCheckbox) {
        savePasswordCheckbox.checked = savePasswordEnabled || true;
    }
}

// Update Session Info Display
function updateSessionInfo() {
    const loginTime = localStorage.getItem('managerLoginTime');
    const managerName = document.querySelector('.manager-name');
    const sessionTimer = document.getElementById('session-timer');
    
    if (loginTime) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - parseInt(loginTime);
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const remainingMs = oneDayInMs - timeDifference;
        
        if (remainingMs > 0) {
            const remainingHours = Math.floor(remainingMs / (60 * 60 * 1000));
            const remainingMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
            
            // Update manager name
            if (managerName) {
                const email = localStorage.getItem('managerEmail') || 'Admin';
                const displayName = email.includes('@') ? email.split('@')[0] : email;
                managerName.textContent = `👤 ${displayName}`;
            }
            
            // Update session timer
            if (sessionTimer) {
                sessionTimer.textContent = `⏱️ Session: ${remainingHours}h ${remainingMinutes}m`;
                sessionTimer.title = `Your session will expire in ${remainingHours} hours and ${remainingMinutes} minutes. You will need to login again.`;
                
                // Add warning class if less than 2 hours remaining
                if (remainingHours < 2) {
                    sessionTimer.classList.add('warning');
                } else {
                    sessionTimer.classList.remove('warning');
                }
            }
        }
    }
}

// Clear Manager Session
function clearManagerSession() {
    localStorage.removeItem('managerAuth');
    localStorage.removeItem('managerEmail');
    localStorage.removeItem('managerLoginTime');
    localStorage.removeItem('managerPassword');
    localStorage.removeItem('managerSavePassword');
}

// Manager Logout
function managerLogout() {
    if (confirm('Are you sure you want to logout?')) {
        clearManagerSession();
        document.getElementById('manager-dashboard').classList.remove('active');
        document.getElementById('manager-login').style.display = 'flex';
        showNotification('Logged out successfully');
    }
}

// Load Manager Dashboard
function loadManagerDashboard() {
    loadDashboardStats();
    loadStoresTable();
    loadProductsTable();
    loadRecentActivity();
    loadStockChart();
    initializeColorInputs();
    initializeFeatureInputs();
    loadStoreDropdown(); // Load stores for product form
}

// Show Section
function showSection(sectionName) {
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'stores': 'Store Profiles',
        'products': 'Products',
        'add-product': 'Add Product',
        'orders': 'Orders',
        'settings': 'Settings'
    };
    document.getElementById('page-title').textContent = titles[sectionName] || sectionName;
    
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    // Show section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('section-' + sectionName).classList.add('active');
    
    // Reset form when showing add product
    if (sectionName === 'add-product') {
        resetProductForm();
    }
}

// Load Dashboard Stats
function loadDashboardStats() {
    const products = getProducts();
    const orders = getOrders();
    
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-orders').textContent = orders.length;
    
    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    document.getElementById('total-revenue').textContent = '$' + revenue.toFixed(2);
}

// Load Products Table
function loadProductsTable() {
    const products = getProducts();
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">No products yet. Add your first product!</td></tr>';
        return;
    }
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.className = selectedProducts.has(product.id) ? 'selected' : '';
        tr.innerHTML = `
            <td>
                <input type="checkbox" 
                       class="product-checkbox product-row-checkbox" 
                       data-product-id="${product.id}"
                       ${selectedProducts.has(product.id) ? 'checked' : ''}
                       onchange="toggleProductSelection(${product.id})">
            </td>
            <td><img src="${product.image}" class="product-img-small" onerror="this.src='https://via.placeholder.com/60x60'" alt="${product.name}"></td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <span class="badge ${product.stock < 20 ? 'stock-status low' : product.stock < 50 ? 'stock-status medium' : 'stock-status high'}">
                    ${product.stock}
                </span>
            </td>
            <td>${product.store || 'N/A'}</td>
            <td>
                <div class="color-dots">
                    ${product.colors.map(c => `<div class="color-dot" style="background: ${c.hex}" title="${c.name}"></div>`).join('')}
                </div>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="editProduct(${product.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">🗑️ Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Update select all checkbox
    const selectAll = document.getElementById('select-all-products');
    if (selectAll) {
        selectAll.checked = products.length > 0 && selectedProducts.size === products.length;
    }
}

// Load Recent Activity
function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    const products = getProducts();
    
    if (products.length === 0) {
        activityList.innerHTML = '<div class="activity-item">No activity yet</div>';
        return;
    }
    
    activityList.innerHTML = `
        <div class="activity-item">
            <strong>Products Loaded:</strong> ${products.length} products are available
        </div>
        <div class="activity-item">
            <strong>System Status:</strong> All systems operational ✅
        </div>
    `;
}

// Get Products from localStorage
function getProducts() {
    const products = localStorage.getItem('techShopProducts');
    return products ? JSON.parse(products) : getDefaultProducts();
}

// Get Default Products
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: "Smartphone Pro X",
            description: "Latest flagship smartphone with advanced features",
            price: 999.99,
            image: "images/smartphone.jpg",
            store: "TECH SHOP Official Store",
            stock: 15,
            colors: [
                { name: "Midnight Black", hex: "#000000" },
                { name: "Silver", hex: "#C0C0C0" },
                { name: "Rose Gold", hex: "#B76E79" },
                { name: "Blue", hex: "#4169E1" }
            ],
            features: [
                "6.7-inch OLED display",
                "5G connectivity",
                "Triple camera system",
                "Face ID and Touch ID",
                "Water resistant IP68"
            ]
        }
    ];
}

// Save Products
function saveProducts(products) {
    // Save products to shared localStorage that customer site reads from
    localStorage.setItem('techShopProducts', JSON.stringify(products));
}

// Get Orders
function getOrders() {
    const orders = localStorage.getItem('techShopOrders');
    return orders ? JSON.parse(orders) : [];
}

// ============ STORE MANAGEMENT ============

// Get Stores
function getStores() {
    const stores = localStorage.getItem('techShopStores');
    if (stores) {
        return JSON.parse(stores);
    }
    // Default stores
    const defaultStores = [
        {
            id: 1,
            name: 'TECH SHOP Official Store',
            email: 'official@techshop.com',
            phone: '+1 (555) 123-4567',
            location: 'Silicon Valley, CA',
            description: 'Official TECH SHOP store offering premium electronics',
            logo: ''
        }
    ];
    saveStores(defaultStores);
    return defaultStores;
}

// Save Stores
function saveStores(stores) {
    localStorage.setItem('techShopStores', JSON.stringify(stores));
}

// Load Stores Table
function loadStoresTable() {
    const stores = getStores();
    const tbody = document.getElementById('stores-table-body');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (stores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No stores yet. Add your first store!</td></tr>';
        return;
    }
    
    stores.forEach(store => {
        // Count products for this store
        const products = getProducts();
        const productCount = products.filter(p => p.store === store.name).length;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                ${store.logo ? 
                    `<img src="${store.logo}" class="product-img-small" style="border-radius: 50%;" onerror="this.src='https://via.placeholder.com/60x60?text=Store'">` : 
                    `<div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">🏪</div>`
                }
            </td>
            <td><strong>${store.name}</strong></td>
            <td>${store.email || '-'}</td>
            <td>${store.phone || '-'}</td>
            <td>${store.location || '-'}</td>
            <td><span class="badge">${productCount} products</span></td>
            <td>
                <button onclick="editStore(${store.id})" class="btn-edit">✏️ Edit</button>
                <button onclick="deleteStore(${store.id})" class="btn-delete">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Show Add Store Form
function showAddStoreForm() {
    const formContainer = document.getElementById('store-form-container');
    formContainer.classList.remove('store-form-container-hidden');
    document.getElementById('store-form-title').textContent = 'Add New Store';
    document.getElementById('store-form').reset();
    document.getElementById('edit-store-id').value = '';
}

// Cancel Store Form
function cancelStoreForm() {
    const formContainer = document.getElementById('store-form-container');
    formContainer.classList.add('store-form-container-hidden');
    document.getElementById('store-form').reset();
}

// Save Store
function saveStore(event) {
    event.preventDefault();
    
    const stores = getStores();
    const editId = document.getElementById('edit-store-id').value;
    
    const storeName = document.getElementById('store-name').value.trim();
    const storeEmail = document.getElementById('store-email').value.trim();
    const storePhone = document.getElementById('store-phone').value.trim();
    const storeLocation = document.getElementById('store-location').value.trim();
    const storeDescription = document.getElementById('store-description').value.trim();
    const storeLogo = document.getElementById('store-logo').value.trim();
    
    if (editId) {
        // Update existing store
        const index = stores.findIndex(s => s.id === parseInt(editId));
        if (index !== -1) {
            const oldName = stores[index].name;
            stores[index] = {
                ...stores[index],
                name: storeName,
                email: storeEmail,
                phone: storePhone,
                location: storeLocation,
                description: storeDescription,
                logo: storeLogo
            };
            
            // Update products with old store name
            if (oldName !== storeName) {
                const products = getProducts();
                products.forEach(product => {
                    if (product.store === oldName) {
                        product.store = storeName;
                    }
                });
                saveProducts(products);
            }
            
            showNotification('Store updated successfully! ✅');
        }
    } else {
        // Add new store
        const newId = stores.length > 0 ? Math.max(...stores.map(s => s.id)) + 1 : 1;
        const newStore = {
            id: newId,
            name: storeName,
            email: storeEmail,
            phone: storePhone,
            location: storeLocation,
            description: storeDescription,
            logo: storeLogo
        };
        stores.push(newStore);
        showNotification('Store added successfully! ✅');
    }
    
    saveStores(stores);
    loadStoresTable();
    loadStoreDropdown(); // Refresh dropdown in product form
    cancelStoreForm();
}

// Edit Store
function editStore(storeId) {
    const stores = getStores();
    const store = stores.find(s => s.id === storeId);
    
    if (store) {
        const formContainer = document.getElementById('store-form-container');
        formContainer.classList.remove('store-form-container-hidden');
        document.getElementById('store-form-title').textContent = 'Edit Store';
        document.getElementById('edit-store-id').value = store.id;
        document.getElementById('store-name').value = store.name;
        document.getElementById('store-email').value = store.email || '';
        document.getElementById('store-phone').value = store.phone || '';
        document.getElementById('store-location').value = store.location || '';
        document.getElementById('store-description').value = store.description || '';
        document.getElementById('store-logo').value = store.logo || '';
        
        // Scroll to form
        document.getElementById('store-form-container').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete Store
function deleteStore(storeId) {
    const stores = getStores();
    const store = stores.find(s => s.id === storeId);
    
    if (!store) return;
    
    // Check if store has products
    const products = getProducts();
    const storeProducts = products.filter(p => p.store === store.name);
    
    if (storeProducts.length > 0) {
        if (!confirm(`This store has ${storeProducts.length} products. Deleting it will remove the store reference from these products. Continue?`)) {
            return;
        }
        // Reset store name for products
        products.forEach(product => {
            if (product.store === store.name) {
                product.store = '';
            }
        });
        saveProducts(products);
    } else {
        if (!confirm(`Are you sure you want to delete "${store.name}"?`)) {
            return;
        }
    }
    
    const index = stores.findIndex(s => s.id === storeId);
    if (index !== -1) {
        stores.splice(index, 1);
        saveStores(stores);
        loadStoresTable();
        loadStoreDropdown();
        showNotification('Store deleted successfully! 🗑️');
    }
}

// Load Store Dropdown in Product Form
function loadStoreDropdown() {
    const select = document.getElementById('product-store');
    if (!select) return;
    
    const stores = getStores();
    const currentValue = select.value;
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">-- Select Store --</option>';
    
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.name;
        option.textContent = store.name;
        select.appendChild(option);
    });
    
    // Restore previous selection if it exists
    if (currentValue) {
        select.value = currentValue;
    }
}

// ============ END STORE MANAGEMENT ============

// Initialize Color Inputs
function initializeColorInputs() {
    const colorsList = document.getElementById('colors-list');
    colorsList.innerHTML = '';
    addColorInput(); // Add one default
}

// Add Color Input
function addColorInput(colorName = '', colorHex = '') {
    const colorsList = document.getElementById('colors-list');
    const div = document.createElement('div');
    div.className = 'color-input-group';
    div.innerHTML = `
        <input type="text" placeholder="Color Name (e.g., Black)" value="${colorName}" class="color-name-input">
        <input type="color" value="${colorHex || '#000000'}" class="color-hex-input">
        <button type="button" onclick="removeColorInput(this)" class="btn-remove">❌</button>
    `;
    colorsList.appendChild(div);
}

// Remove Color Input
function removeColorInput(button) {
    button.closest('.color-input-group').remove();
}

// Initialize Feature Inputs
function initializeFeatureInputs() {
    const featuresList = document.getElementById('features-list');
    featuresList.innerHTML = '';
    addFeatureInput(); // Add one default
}

// Add Feature Input
function addFeatureInput(featureText = '') {
    const featuresList = document.getElementById('features-list');
    const div = document.createElement('div');
    div.className = 'feature-input-group';
    div.innerHTML = `
        <input type="text" placeholder="Product feature" value="${featureText}" class="feature-input">
        <button type="button" onclick="removeFeatureInput(this)" class="btn-remove">❌</button>
    `;
    featuresList.appendChild(div);
}

// Remove Feature Input
function removeFeatureInput(button) {
    button.closest('.feature-input-group').remove();
}

// Preview Image
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
            document.querySelector('.upload-placeholder').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Save Product
function saveProduct(event) {
    event.preventDefault();
    
    const products = getProducts();
    const editId = document.getElementById('edit-product-id').value;
    
    // Get form data
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const stock = parseInt(document.getElementById('product-stock').value);
    const store = document.getElementById('product-store').value;
    
    // Get image
    const imageUrl = document.getElementById('product-image-url').value;
    const imagePreview = document.getElementById('image-preview');
    const image = imageUrl || (imagePreview.style.display !== 'none' ? imagePreview.src : 'images/default.jpg');
    
    // Get colors
    const colorInputs = document.querySelectorAll('.color-input-group');
    const colors = [];
    colorInputs.forEach(input => {
        const colorName = input.querySelector('.color-name-input').value;
        const colorHex = input.querySelector('.color-hex-input').value;
        if (colorName) {
            colors.push({ name: colorName, hex: colorHex });
        }
    });
    
    // Get features
    const featureInputs = document.querySelectorAll('.feature-input');
    const features = [];
    featureInputs.forEach(input => {
        if (input.value.trim()) {
            features.push(input.value.trim());
        }
    });
    
    if (editId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(editId));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                description,
                stock,
                store,
                image,
                colors,
                features
            };
            showToast('Product Updated', `${name} has been updated successfully`, 'success');
        }
    } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            name,
            price,
            description,
            stock,
            store,
            image,
            colors,
            features
        };
        products.push(newProduct);
        showToast('Product Added', `${name} has been added successfully`, 'success');
    }
    
    saveProducts(products);
    loadProductsTable();
    loadDashboardStats();
    loadStockChart(); // Refresh stock chart
    loadSalesTrendChart();
    loadCategoryPieChart();
    loadStoreFilterDropdown();
    
    // Close the form and reset
    closeProductForm();
    
    // Smooth scroll to products table
    setTimeout(() => {
        document.querySelector('.products-table-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 300);
}

// Edit Product
// ================================
// PRODUCT FORM TOGGLE & MANAGEMENT
// ================================

// Toggle Product Form (Show/Hide)
function toggleProductForm() {
    const formContainer = document.getElementById('product-form-container');
    const toggleBtn = document.getElementById('toggle-form-btn');
    
    if (formContainer.classList.contains('product-form-collapsed')) {
        // Show form
        formContainer.classList.remove('product-form-collapsed');
        formContainer.classList.add('product-form-expanded');
        toggleBtn.innerHTML = '❌ Close Form';
        toggleBtn.classList.add('btn-danger');
        
        // Reset form for new product
        resetProductForm();
        loadStoreDropdown();
        
        // Scroll to form smoothly
        setTimeout(() => {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        // Hide form
        closeProductForm();
    }
}

// Close Product Form
function closeProductForm() {
    const formContainer = document.getElementById('product-form-container');
    const toggleBtn = document.getElementById('toggle-form-btn');
    
    formContainer.classList.remove('product-form-expanded');
    formContainer.classList.add('product-form-collapsed');
    toggleBtn.innerHTML = '➕ Add New Product';
    toggleBtn.classList.remove('btn-danger');
    
    // Reset form
    resetProductForm();
}

// Cancel Product Form
function cancelProductForm() {
    if (confirm('Are you sure? Any unsaved changes will be lost.')) {
        closeProductForm();
    }
}

// Edit Product - Fixed Version
function editProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Error', 'Product not found', 'error');
        return;
    }
    
    // Open the form if collapsed
    const formContainer = document.getElementById('product-form-container');
    const toggleBtn = document.getElementById('toggle-form-btn');
    
    if (formContainer.classList.contains('product-form-collapsed')) {
        formContainer.classList.remove('product-form-collapsed');
        formContainer.classList.add('product-form-expanded');
        toggleBtn.innerHTML = '❌ Close Form';
        toggleBtn.classList.add('btn-danger');
    }
    
    // Load store dropdown first
    loadStoreDropdown();
    
    // Fill form with product data
    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-store').value = product.store || '';
    document.getElementById('product-image-url').value = product.image || '';
    
    // Show image preview
    const preview = document.getElementById('image-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    if (product.image) {
        preview.src = product.image;
        preview.classList.remove('image-preview-hidden');
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
    }
    
    // Fill colors
    const colorsList = document.getElementById('colors-list');
    colorsList.innerHTML = '';
    if (product.colors && product.colors.length > 0) {
        product.colors.forEach(color => {
            addColorInput(color.name, color.hex);
        });
    } else {
        addColorInput(); // Add one empty color input
    }
    
    // Fill features
    const featuresList = document.getElementById('features-list');
    featuresList.innerHTML = '';
    if (product.features && product.features.length > 0) {
        product.features.forEach(feature => {
            addFeatureInput(feature);
        });
    } else {
        addFeatureInput(); // Add one empty feature input
    }
    
    // Change form title
    document.getElementById('product-form-title').innerHTML = '✏️ Edit Product';
    
    // Scroll to form smoothly
    setTimeout(() => {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    showToast('Edit Mode', `Editing: ${product.name}`, 'info');
}

// Delete Product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const products = getProducts();
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
        const productName = products[index].name;
        products.splice(index, 1);
        saveProducts(products);
        loadProductsTable();
        loadDashboardStats();
        loadStockChart(); // Refresh stock chart
        loadSalesTrendChart();
        loadCategoryPieChart();
        showToast('Product Deleted', `${productName} has been removed`, 'success');
    }
}

// Reset Product Form
// Reset Product Form
function resetProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('edit-product-id').value = '';
    document.getElementById('product-form-title').innerHTML = '✨ Add New Product';
    
    const preview = document.getElementById('image-preview');
    preview.classList.add('image-preview-hidden');
    
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
    
    // Clear and reset color/feature inputs
    initializeColorInputs();
    initializeFeatureInputs();
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : 'linear-gradient(135deg, #667eea, #764ba2)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Open Customer Site
function openCustomerSite() {
    const indexPath = window.location.href.replace('manager.html', 'index.html');
    window.open(indexPath, '_blank');
}

// Load Stock Chart
function loadStockChart() {
    const products = getProducts();
    const canvas = document.getElementById('stock-chart');
    const legend = document.getElementById('stock-legend');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    if (products.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No products to display', width / 2, height / 2);
        return;
    }
    
    // Chart colors
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe',
        '#fa709a', '#fee140', '#30cfd0', '#a8edea', '#ff6a88'
    ];
    
    // Calculate max stock for scaling
    const maxStock = Math.max(...products.map(p => p.stock || 0), 10);
    const barWidth = (width - 100) / products.length;
    const padding = 60;
    const chartHeight = height - padding * 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
        
        // Y-axis labels
        const value = Math.round(maxStock - (maxStock / 5) * i);
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(value, 45, y + 4);
    }
    
    // Draw bars
    products.forEach((product, index) => {
        const stock = product.stock || 0;
        const barHeight = (stock / maxStock) * chartHeight;
        const x = 60 + index * barWidth;
        const y = height - padding - barHeight;
        
        const color = colors[index % colors.length];
        
        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, height - padding);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '80');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 10, barHeight);
        
        // Draw bar border
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth - 10, barHeight);
        
        // Draw stock value on top of bar
        ctx.fillStyle = '#2B124C';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(stock, x + (barWidth - 10) / 2, y - 8);
        
        // Draw product name (truncated)
        ctx.fillStyle = '#666';
        ctx.font = '11px sans-serif';
        ctx.save();
        ctx.translate(x + (barWidth - 10) / 2, height - 35);
        ctx.rotate(-Math.PI / 4);
        const truncatedName = product.name.length > 12 ? product.name.substring(0, 12) + '...' : product.name;
        ctx.fillText(truncatedName, 0, 0);
        ctx.restore();
    });
    
    // X-axis label
    ctx.fillStyle = '#2B124C';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Products', width / 2, height - 10);
    
    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Stock Quantity', 0, 0);
    ctx.restore();
    
    // Generate legend
    legend.innerHTML = '';
    products.forEach((product, index) => {
        const color = colors[index % colors.length];
        const stock = product.stock || 0;
        
        let stockClass = 'high';
        let stockText = 'In Stock';
        if (stock === 0) {
            stockClass = 'low';
            stockText = 'Out of Stock';
        } else if (stock < 5) {
            stockClass = 'low';
            stockText = 'Low Stock';
        } else if (stock < 10) {
            stockClass = 'medium';
            stockText = 'Medium';
        }
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background: ${color}"></div>
            <div class="legend-info">
                <span class="legend-name">${product.name}</span>
                <span class="legend-stock">
                    ${stock} units
                    <span class="stock-status ${stockClass}">${stockText}</span>
                </span>
            </div>
        `;
        legend.appendChild(legendItem);
    });
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
// ================================
// ADVANCED FEATURES
// ================================

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
    showToast('Theme Changed', `Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'success');
}

// Load Dark Mode Preference
function loadDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        if (document.getElementById('theme-icon')) {
            document.getElementById('theme-icon').textContent = '☀️';
        }
    }
}

// Initialize dark mode on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDarkModePreference();
});

// Toast Notification System
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close" onclick="this.parentElement.remove()">✖</div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }
    }, 5000);
}

// Bulk Selection Management
let selectedProducts = new Set();

function toggleSelectAll() {
    const checkbox = document.getElementById('select-all-products');
    const checkboxes = document.querySelectorAll('.product-row-checkbox');
    
    checkboxes.forEach(cb => {
        cb.checked = checkbox.checked;
        const productId = parseInt(cb.dataset.productId);
        if (checkbox.checked) {
            selectedProducts.add(productId);
        } else {
            selectedProducts.delete(productId);
        }
    });
    
    updateBulkActionsBar();
}

function toggleProductSelection(productId) {
    if (selectedProducts.has(productId)) {
        selectedProducts.delete(productId);
    } else {
        selectedProducts.add(productId);
    }
    updateBulkActionsBar();
}

function updateBulkActionsBar() {
    const bar = document.getElementById('bulk-actions-bar');
    const count = document.getElementById('selected-count');
    
    if (selectedProducts.size > 0) {
        bar.classList.remove('hidden');
        count.textContent = selectedProducts.size;
    } else {
        bar.classList.add('hidden');
    }
}

function clearSelection() {
    selectedProducts.clear();
    document.getElementById('select-all-products').checked = false;
    document.querySelectorAll('.product-row-checkbox').forEach(cb => cb.checked = false);
    updateBulkActionsBar();
}

function bulkDeleteProducts() {
    if (selectedProducts.size === 0) {
        showToast('No Selection', 'Please select products to delete', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedProducts.size} product(s)?`)) {
        const products = getProducts();
        const updatedProducts = products.filter(p => !selectedProducts.has(p.id));
        saveProducts(updatedProducts);
        
        showToast('Success', `${selectedProducts.size} product(s) deleted successfully`, 'success');
        selectedProducts.clear();
        loadProductsTable();
        updateDashboardStats();
    }
}

// CSV Export Functionality
function exportSelectedProducts() {
    const products = getProducts();
    const selected = products.filter(p => selectedProducts.has(p.id));
    
    if (selected.length === 0) {
        showToast('No Selection', 'Please select products to export', 'warning');
        return;
    }
    
    exportToCSV(selected);
}

function exportAllProducts() {
    const products = getProducts();
    exportToCSV(products);
}

function exportToCSV(products) {
    if (products.length === 0) {
        showToast('No Data', 'No products to export', 'warning');
        return;
    }
    
    // CSV Header
    let csv = 'ID,Name,Price,Stock,Store,Category,Colors,Features\n';
    
    // CSV Rows
    products.forEach(product => {
        const colors = product.colors ? product.colors.join(';') : '';
        const features = product.features ? product.features.join(';') : '';
        csv += `${product.id},"${product.name}",${product.price},${product.stock},"${product.store || ''}","${product.category || ''}","${colors}","${features}"\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techshop-products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToast('Export Success', `${products.length} product(s) exported to CSV`, 'success');
}

// Advanced Search and Filtering
function filterProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const storeFilter = document.getElementById('store-filter').value;
    const stockFilter = document.getElementById('stock-filter').value;
    
    const rows = document.querySelectorAll('#products-table-body tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td:nth-child(4)')?.textContent.toLowerCase() || '';
        const id = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
        const store = row.querySelector('td:nth-child(7)')?.textContent || '';
        const stock = parseInt(row.querySelector('td:nth-child(6)')?.textContent) || 0;
        
        let matchesSearch = name.includes(searchTerm) || id.includes(searchTerm) || store.toLowerCase().includes(searchTerm);
        let matchesStore = !storeFilter || store === storeFilter;
        let matchesStock = true;
        
        if (stockFilter === 'low') {
            matchesStock = stock < 20;
        } else if (stockFilter === 'medium') {
            matchesStock = stock >= 20 && stock <= 50;
        } else if (stockFilter === 'high') {
            matchesStock = stock > 50;
        }
        
        if (matchesSearch && matchesStore && matchesStock) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function resetFilters() {
    document.getElementById('product-search').value = '';
    document.getElementById('store-filter').value = '';
    document.getElementById('stock-filter').value = '';
    filterProducts();
    showToast('Filters Reset', 'All filters have been cleared', 'info');
}

// Load store dropdown for filters
function loadStoreFilterDropdown() {
    const stores = getStores();
    const select = document.getElementById('store-filter');
    if (!select) return;
    
    select.innerHTML = '<option value="">All Stores</option>';
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.name;
        option.textContent = store.name;
        select.appendChild(option);
    });
}

// Advanced Charts using Canvas API

// Sales Trend Line Chart (Last 7 Days)
function loadSalesTrendChart() {
    const canvas = document.getElementById('sales-trend-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Sample data for last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const sales = [45, 62, 58, 75, 90, 85, 95]; // Sample sales data
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxSales = Math.max(...sales);
    const xStep = chartWidth / (days.length - 1);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        // Y-axis labels
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') || '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxSales - (maxSales / 5) * i), padding - 10, y + 4);
    }
    
    // Draw line chart with gradient fill
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    
    sales.forEach((sale, i) => {
        const x = padding + xStep * i;
        const y = canvas.height - padding - (sale / maxSales) * chartHeight;
        if (i === 0) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    // Fill area under line
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.4)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    sales.forEach((sale, i) => {
        const x = padding + xStep * i;
        const y = canvas.height - padding - (sale / maxSales) * chartHeight;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw data points
    sales.forEach((sale, i) => {
        const x = padding + xStep * i;
        const y = canvas.height - padding - (sale / maxSales) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#667eea';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // X-axis labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') || '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    days.forEach((day, i) => {
        const x = padding + xStep * i;
        ctx.fillText(day, x, canvas.height - padding + 20);
    });
}

// Category Pie Chart
function loadCategoryPieChart() {
    const canvas = document.getElementById('category-pie-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const products = getProducts();
    const categories = {};
    
    // Count products by category (using first word of name as category)
    products.forEach(product => {
        const category = product.name.split(' ')[0] || 'Other';
        categories[category] = (categories[category] || 0) + 1;
    });
    
    const categoryNames = Object.keys(categories);
    const categoryValues = Object.values(categories);
    const total = categoryValues.reduce((a, b) => a + b, 0);
    
    if (total === 0) return;
    
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    let currentAngle = -Math.PI / 2;
    
    // Draw pie slices
    categoryValues.forEach((value, i) => {
        const sliceAngle = (value / total) * Math.PI * 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--card-bg') || 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw labels
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const percentage = Math.round((value / total) * 100);
        ctx.fillText(`${percentage}%`, labelX, labelY);
        
        currentAngle += sliceAngle;
    });
    
    // Draw legend below
    const legendY = canvas.height - 10;
    const legendItemWidth = canvas.width / categoryNames.length;
    
    categoryNames.forEach((name, i) => {
        const x = legendItemWidth * i + legendItemWidth / 2;
        
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(x - 20, legendY - 8, 15, 15);
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#2B124C';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, x + 10, legendY);
    });
}

// Update load dashboard to include new charts
const originalLoadManagerDashboard = loadManagerDashboard;
loadManagerDashboard = function() {
    originalLoadManagerDashboard();
    loadStoreFilterDropdown();
    loadSalesTrendChart();
    loadCategoryPieChart();
};

// Add event listener for window resize to redraw charts
window.addEventListener('resize', function() {
    if (checkManagerAuth()) {
        loadSalesTrendChart();
        loadCategoryPieChart();
    }
});