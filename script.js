// Sample Products Data (default fallback)
const defaultProducts = [
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
    },
    {
        id: 2,
        name: "Laptop Ultra 15",
        description: "Powerful laptop for professionals",
        price: 1499.99,
        image: "images/laptop.jpg",
        store: "TECH SHOP Official Store",
        stock: 12,
        colors: [
            { name: "Space Gray", hex: "#5A5A5A" },
            { name: "Silver", hex: "#C0C0C0" },
            { name: "Gold", hex: "#FFD700" }
        ],
        features: [
            "Intel Core i7 processor",
            "16GB RAM",
            "512GB SSD storage",
            "15.6-inch Retina display",
            "Long battery life (12 hours)"
        ]
    },
    {
        id: 3,
        name: "Wireless Headphones",
        description: "Premium noise-canceling headphones",
        price: 299.99,
        image: "images/headphones.jpg",
        store: "TECH SHOP Official Store",
        stock: 25,
        colors: [
            { name: "Black", hex: "#000000" },
            { name: "White", hex: "#FFFFFF" },
            { name: "Red", hex: "#FF0000" },
            { name: "Blue", hex: "#0000FF" }
        ],
        features: [
            "Active noise cancellation",
            "40-hour battery life",
            "Bluetooth 5.0",
            "Premium sound quality",
            "Comfortable over-ear design"
        ]
    },
    {
        id: 4,
        name: "Smart Watch Elite",
        description: "Feature-rich smartwatch with health tracking",
        price: 399.99,
        image: "images/smartwatch.jpg",
        store: "TECH SHOP Official Store",
        stock: 20,
        colors: [
            { name: "Black", hex: "#000000" },
            { name: "Silver", hex: "#C0C0C0" },
            { name: "Gold", hex: "#FFD700" },
            { name: "Rose Gold", hex: "#B76E79" }
        ],
        features: [
            "Heart rate monitoring",
            "GPS tracking",
            "Water resistant",
            "7-day battery life",
            "Fitness tracking apps"
        ]
    },
    {
        id: 5,
        name: "Tablet Pro 12",
        description: "High-performance tablet for work and play",
        price: 799.99,
        image: "images/tablet.jpg",
        store: "TECH SHOP Official Store",
        stock: 18,
        colors: [
            { name: "Space Gray", hex: "#5A5A5A" },
            { name: "Silver", hex: "#C0C0C0" }
        ],
        features: [
            "12.9-inch Liquid Retina display",
            "Apple M1 chip",
            "Face ID",
            "All-day battery life",
            "Support for Apple Pencil"
        ]
    },
    {
        id: 6,
        name: "Gaming Console X",
        description: "Next-gen gaming console",
        price: 499.99,
        image: "images/console.jpg",
        store: "TECH SHOP Official Store",
        stock: 10,
        colors: [
            { name: "Black", hex: "#000000" },
            { name: "White", hex: "#FFFFFF" }
        ],
        features: [
            "4K gaming at 120fps",
            "1TB SSD storage",
            "Ray tracing support",
            "Backward compatibility",
            "Wireless controller included"
        ]
    },
    {
        id: 7,
        name: "4K Camera",
        description: "Professional mirrorless camera",
        price: 1899.99,
        image: "images/camera.jpg",
        store: "TECH SHOP Official Store",
        stock: 8,
        colors: [
            { name: "Black", hex: "#000000" },
            { name: "Silver", hex: "#C0C0C0" }
        ],
        features: [
            "45MP full-frame sensor",
            "4K video recording",
            "Dual card slots",
            "Weather-sealed body",
            "In-body stabilization"
        ]
    },
    {
        id: 8,
        name: "Bluetooth Speaker",
        description: "Portable waterproof speaker",
        price: 149.99,
        image: "images/speaker.jpg",
        store: "TECH SHOP Official Store",
        stock: 30,
        colors: [
            { name: "Black", hex: "#000000" },
            { name: "Blue", hex: "#4169E1" },
            { name: "Red", hex: "#FF0000" },
            { name: "Green", hex: "#32CD32" }
        ],
        features: [
            "360-degree sound",
            "20-hour battery life",
            "Waterproof IPX7",
            "Portable design",
            "Deep bass technology"
        ]
    }
];

// Load products from localStorage or use defaults
let products = [];

function getProducts() {
    const managerProducts = localStorage.getItem('techShopProducts');
    if (managerProducts) {
        products = JSON.parse(managerProducts);
    } else {
        products = defaultProducts;
        // Save defaults to localStorage so manager can edit them
        localStorage.setItem('techShopProducts', JSON.stringify(products));
    }
    return products;
}

// Shopping Cart
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    getProducts(); // Load products from localStorage first
    loadProducts();
    loadCart();
});

// Listen for storage changes (when manager updates products)
window.addEventListener('storage', function(e) {
    if (e.key === 'techShopProducts') {
        getProducts();
        loadProducts();
    }
});

// Refresh products when page becomes visible (in case manager updated in another tab)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const oldProductsLength = products.length;
        getProducts();
        if (products.length !== oldProductsLength || JSON.stringify(products) !== JSON.stringify(getProducts())) {
            loadProducts();
        }
    }
});

// Load Products
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; // Clear existing products
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/280x200?text=${encodeURIComponent(product.name)}'">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button onclick="openProductModal(${product.id})">View Details</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCart();
    showNotification('Product added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCart();
        }
    }
}

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${encodeURIComponent(item.name)}'">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Toggle Cart
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('techShopCart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('techShopCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`Thank you for shopping at TECH SHOP!\n\nTotal Items: ${itemCount}\nTotal Amount: $${total.toFixed(2)}\n\nYour order will be processed soon!`);
    
    cart = [];
    saveCart();
    updateCart();
    toggleCart();
}

// Scroll to Products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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

// ============================================
// LOGIN MODAL FUNCTIONS
// ============================================

// Open Login Modal
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Login Modal
function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('login-modal');
    if (event.target === modal) {
        closeLoginModal();
    }
});

// Handle Login Form Submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulate login (in real app, this would be an API call)
    showNotification('Login Successful! Welcome back! 🎉');
    
    // Store user info (simplified - in real app use secure authentication)
    localStorage.setItem('user', JSON.stringify({
        email: email,
        loggedIn: true
    }));
    
    // Close modal and reset form
    closeLoginModal();
    document.getElementById('login-form').reset();
    
    // Update UI to show logged in state
    updateLoginState();
}

// Social Login
function socialLogin(provider) {
    showNotification(`${provider} login will be integrated soon! 🚀`);
}

// Open Signup Modal (placeholder)
function openSignupModal() {
    closeLoginModal();
    showNotification('Signup page coming soon! For now, use demo login. 📝');
}

// Update Login State
function updateLoginState() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.loggedIn) {
        // You can update the header to show user info
        console.log('User logged in:', user.email);
    }
}

// Check login state on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLoginState();
});

// ============================================
// PRODUCT DETAILS MODAL FUNCTIONS
// ============================================

let currentProduct = null;
let selectedColor = null;

// Open Product Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    selectedColor = product.colors[0]; // Default to first color
    
    // Update modal content
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-image').onerror = function() {
        this.src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`;
    };
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-product-store').textContent = product.store;
    document.getElementById('stock-info').textContent = `In Stock: ${product.stock} items`;
    
    // Load color options
    const colorOptions = document.getElementById('color-options');
    colorOptions.innerHTML = '';
    product.colors.forEach((color, index) => {
        const colorBtn = document.createElement('div');
        colorBtn.className = `color-option ${index === 0 ? 'active' : ''}`;
        colorBtn.style.backgroundColor = color.hex;
        colorBtn.title = color.name;
        colorBtn.onclick = () => selectColor(color, colorBtn);
        colorOptions.appendChild(colorBtn);
    });
    
    // Update selected color text
    document.getElementById('selected-color-text').textContent = `Color: ${selectedColor.name}`;
    
    // Load features
    const featuresList = document.getElementById('product-features-list');
    featuresList.innerHTML = '';
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Reset quantity
    document.getElementById('modal-quantity').value = 1;
    
    // Show modal
    const modal = document.getElementById('product-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Product Modal
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProduct = null;
    selectedColor = null;
}

// Select Color
function selectColor(color, element) {
    selectedColor = color;
    
    // Update UI
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('active');
    });
    element.classList.add('active');
    
    document.getElementById('selected-color-text').textContent = `Color: ${color.name}`;
}

// Increase Quantity
function increaseQuantity() {
    const input = document.getElementById('modal-quantity');
    const currentValue = parseInt(input.value);
    const maxValue = parseInt(input.max);
    
    if (currentValue < maxValue) {
        input.value = currentValue + 1;
    }
}

// Decrease Quantity
function decreaseQuantity() {
    const input = document.getElementById('modal-quantity');
    const currentValue = parseInt(input.value);
    const minValue = parseInt(input.min);
    
    if (currentValue > minValue) {
        input.value = currentValue - 1;
    }
}

// Add to Cart from Modal
function addToCartFromModal() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('modal-quantity').value);
    
    // Check if product with same color exists in cart
    const existingItem = cart.find(item => 
        item.id === currentProduct.id && item.color === selectedColor.name
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...currentProduct,
            color: selectedColor.name,
            colorHex: selectedColor.hex,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCart();
    showNotification(`Added ${quantity} ${currentProduct.name} (${selectedColor.name}) to cart! 🛒`);
    closeProductModal();
}

// Buy Now
function buyNow() {
    addToCartFromModal();
    setTimeout(() => {
        toggleCart();
    }, 500);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const productModal = document.getElementById('product-modal');
    if (event.target === productModal) {
        closeProductModal();
    }
});
