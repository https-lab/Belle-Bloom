// Shared logic for all pages
const products = [
    { id: 1, name: "Sunset Bikini", price: 150.00, image: "images/531656935_1515348793163631_5610616720065092706_n.jpg" },
    { id: 2, name: "Ocean One-Piece", price: 175.00, image: "images/538959568_740606258954873_5444914832697258513_n.jpg" },
    { id: 3, name: "Tropical Bloom", price: 160.00, image: "images/588451334_825893400238739_1850712796731024331_n.jpg" },
    { id: 4, name: "Azure Mist", price: 155.00, image: "images/629867701_1623156968712365_400154007585994404_n.jpg" },
    { id: 5, name: "Coral Reef", price: 180.00, image: "images/634735160_2006721606891205_3468616924370659347_n.jpg" },
    { id: 6, name: "Sandy Shores", price: 150.00, image: "images/638554003_26102417182749455_8967008940365294534_n.jpg" },
    { id: 7, name: "Palm Breeze", price: 165.00, image: "images/648487702_1578797589902258_3298333281201684643_n.jpg" },
    { id: 8, name: "Midnight Wave", price: 190.00, image: "images/652002735_913015018243470_1267099094356400398_n.jpg" },
    { id: 9, name: "Shell Glow", price: 155.00, image: "images/655137480_824870163967399_7162990340961065140_n.jpg" },
    { id: 10, name: "Island Vibe", price: 170.00, image: "images/669846745_1513836436915166_1200330021646259220_n.jpg" },
    { id: 11, name: "Tidal Dream", price: 160.00, image: "images/670361529_1266434368987922_1851916843251317474_n.jpg" },
    { id: 13, name: "Pearl Essence", price: 175.00, image: "images/670853954_1327108409317234_6135619200211850457_n.jpg" },
    { id: 14, name: "Aqua Marine", price: 155.00, image: "images/671216493_932603073005065_1891771795829181148_n.jpg" },
    { id: 15, name: "Golden Hour", price: 165.00, image: "images/671543235_987105527214332_99567756923640868_n.jpg" },
    { id: 16, name: "Lagoon Luxe", price: 200.00, image: "images/671694726_975672091509453_4461121154082553557_n.jpg" },
    { id: 17, name: "Surf Side", price: 150.00, image: "images/672335177_953883123682273_70911329293042049_n.jpg" },
    { id: 18, name: "Coastal Chic", price: 180.00, image: "images/672746985_2133787284129751_2224607298882234382_n.jpg" },
    { id: 19, name: "Driftwood", price: 150.00, image: "images/672994805_992852216428941_2925520266525694858_n.jpg" },
    { id: 20, name: "Belle Bloom Special", price: 200.00, image: "images/677942722_1335973365256813_1147932044238669859_n.jpg" }
];

// App State
let currentUser = JSON.parse(localStorage.getItem('belle_bloom_user')) || null;
let cart = JSON.parse(localStorage.getItem('belle_bloom_cart')) || [];
let orderHistory = JSON.parse(localStorage.getItem('belle_bloom_history')) || [];

// Shared DOM Elements (Check if they exist on current page)
const notificationContainer = document.getElementById('notification-container');
const cartCountEls = document.querySelectorAll('#cart-count');
const loginBtn = document.getElementById('login-btn');
const userMenu = document.getElementById('user-menu');
const welcomeMsg = document.getElementById('welcome-msg');
const burgerBtn = document.querySelector('.burger-btn');
const navEl = document.querySelector('.header-main nav');

let activePreviewProductId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateAuthState();
    updateCartUI();
    setupMobileMenu();
    setupProductPreviewModal();
    
    // Page specific initializations
    const path = window.location.pathname;
    if (path.includes('products.html')) renderProducts();
    if (path.includes('cart.html')) renderCart();
    if (path.includes('orders.html')) renderHistory();
    if (path.includes('login.html')) setupLoginForm();
    if (path.includes('thankyou.html')) renderLatestOrder();
});

// Authentication
function updateAuthState() {
    if (!loginBtn || !userMenu) return;
    
    if (currentUser && currentUser.email) {
        loginBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');
    } else {
        loginBtn.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

function login(email) {
    currentUser = { email };
    localStorage.setItem('belle_bloom_user', JSON.stringify(currentUser));
    updateAuthState();
    showNotification(`Login successful!`);
    setTimeout(() => window.location.href = 'index.html', 1000);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('belle_bloom_user');
    updateAuthState();
    showNotification('Logged out successfully.');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            // Email Validation: Must end with @gmail.com
            if (!email.toLowerCase().endsWith('@gmail.com')) {
                showNotification('Please use a valid @gmail.com address.', 'warning');
                return;
            }
            
            login(email);
        });
    }
}

// Cart Management
function updateCartUI() {
    if (!cartCountEls.length) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEls.forEach((el) => {
        el.innerText = totalItems;
    });
}

function addToCart(productId) {
    if (!currentUser) {
        showNotification('Please log in first to add products to your cart.', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('belle_bloom_cart', JSON.stringify(cart));
}

// Notifications
function showNotification(message, type = 'success') {
    if (!notificationContainer) return;
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Page Specific Rendering
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" role="button" tabindex="0" onclick="openProductPreview(${p.id})" onkeydown="handlePreviewKey(event, ${p.id})">
            <div class="product-info">
                <h3>${p.name}</h3>
                <span class="price">₱${p.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const totalEl = document.getElementById('total-price');

    if (!container) return;

    if (cart.length === 0) {
        container.classList.add('hidden');
        summary.classList.add('hidden');
        emptyMsg.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    summary.classList.remove('hidden');
    emptyMsg.classList.add('hidden');

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>₱${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-controls">
                <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.innerText = `₱${total.toFixed(2)}`;
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
            updateCartUI();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    updateCartUI();
    showNotification('Item removed from cart.');
}

function processCheckout() {
    if (cart.length === 0) return;

    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    orderHistory.unshift(order);
    localStorage.setItem('belle_bloom_history', JSON.stringify(orderHistory));
    
    cart = [];
    saveCart();
    updateCartUI();
    
    window.location.href = 'thankyou.html';
}

function renderLatestOrder() {
    const summaryContainer = document.getElementById('latest-order-summary');
    if (!summaryContainer || orderHistory.length === 0) return;

    const latestOrder = orderHistory[0];
    summaryContainer.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-details">
            <p class="summary-item"><span>Order Number:</span> <strong>#${latestOrder.id}</strong></p>
            <p class="summary-item"><span>Date:</span> <strong>${latestOrder.date}</strong></p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid rgba(62,39,35,0.05);">
            ${latestOrder.items.map(item => `
                <div class="summary-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₱${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid rgba(62,39,35,0.05);">
            <div class="summary-item" style="font-size: 1.1rem; font-weight: 600;">
                <span>Total Paid:</span>
                <span>₱${latestOrder.total.toFixed(2)}</span>
            </div>
        </div>
    `;
}

function renderHistory() {
    const list = document.getElementById('order-history-list');
    if (!list) return;

    if (!currentUser) {
        list.innerHTML = '<p style="text-align:center">Please log in to see your order history.</p>';
        return;
    }

    if (orderHistory.length === 0) {
        list.innerHTML = '<p style="text-align:center">You haven\'t placed any orders yet.</p>';
        return;
    }

    list.innerHTML = orderHistory.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span>Order #${order.id}</span>
                <span>${order.date}</span>
            </div>
            <div class="order-details">
                ${order.items.map(item => `
                    <p>${item.name} x ${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}</p>
                `).join('')}
                <hr style="margin:10px 0; border:0; border-top:1px solid #eee">
                <p><strong>Total: ₱${order.total.toFixed(2)}</strong></p>
            </div>
        </div>
    `).join('');
}

function setupMobileMenu() {
    if (!burgerBtn || !navEl) return;

    burgerBtn.addEventListener('click', () => {
        const isOpen = navEl.classList.toggle('nav-open');
        burgerBtn.classList.toggle('active', isOpen);
        burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navEl.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && window.innerWidth <= 768) {
            navEl.classList.remove('nav-open');
            burgerBtn.classList.remove('active');
            burgerBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

function setupProductPreviewModal() {
    if (document.getElementById('product-preview-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'product-preview-modal';
    modal.className = 'product-preview-modal hidden';
    modal.innerHTML = `
        <div class="preview-backdrop" onclick="closeProductPreview()"></div>
        <div class="preview-content" role="dialog" aria-modal="true" aria-label="Product preview">
            <button type="button" class="preview-close-btn" onclick="closeProductPreview()" aria-label="Close preview">&times;</button>
            <img id="preview-image" src="" alt="">
            <h3 id="preview-name"></h3>
            <p id="preview-price"></p>
            <div class="preview-qty-controls">
                <button type="button" class="qty-btn" onclick="updatePreviewQty(-1)">-</button>
                <span id="preview-qty-value">0</span>
                <button type="button" class="qty-btn" onclick="updatePreviewQty(1)">+</button>
            </div>
            <button type="button" class="add-to-cart-btn preview-add-btn" onclick="addActivePreviewToCart()">Add to Cart</button>
        </div>
    `;

    document.body.appendChild(modal);
}

function handlePreviewKey(event, productId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProductPreview(productId);
    }
}

function openProductPreview(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('product-preview-modal');
    if (!product || !modal) return;

    activePreviewProductId = productId;
    document.getElementById('preview-image').src = product.image;
    document.getElementById('preview-image').alt = product.name;
    document.getElementById('preview-name').innerText = product.name;
    document.getElementById('preview-price').innerText = `₱${product.price.toFixed(2)}`;

    const existingItem = cart.find(item => item.id === productId);
    document.getElementById('preview-qty-value').innerText = existingItem ? existingItem.quantity : 0;

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeProductPreview() {
    const modal = document.getElementById('product-preview-modal');
    if (!modal) return;

    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    activePreviewProductId = null;
}

function updatePreviewQty(delta) {
    if (!activePreviewProductId) return;

    const existingItem = cart.find(item => item.id === activePreviewProductId);
    if (!existingItem && delta < 0) return;

    if (existingItem) {
        updateQty(activePreviewProductId, delta);
    } else if (delta > 0) {
        addToCart(activePreviewProductId);
    }

    const updatedItem = cart.find(item => item.id === activePreviewProductId);
    document.getElementById('preview-qty-value').innerText = updatedItem ? updatedItem.quantity : 0;
}

function addActivePreviewToCart() {
    if (!activePreviewProductId) return;
    addToCart(activePreviewProductId);
    const updatedItem = cart.find(item => item.id === activePreviewProductId);
    document.getElementById('preview-qty-value').innerText = updatedItem ? updatedItem.quantity : 0;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeProductPreview();
});
