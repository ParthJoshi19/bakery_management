// JavaScript functionality for Baba Bakery

// Cart functionality
let cart = [];

// Function to add item to cart
function addToCart(itemName, price, quantity) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: itemName,
            price: price,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    showNotification(`${quantity} x ${itemName} added to cart!`);
}

// Function to update cart display (placeholder)
function updateCartDisplay() {
    console.log('Cart updated:', cart);
    // This can be expanded to show cart count in header
}

// Function to show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: rgb(179, 84, 55);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Add event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart button functionality
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantityInput = document.getElementById('quantity');
            const quantity = parseInt(quantityInput.value) || 1;
            const itemName = document.querySelector('.product-title').textContent;
            const priceText = document.querySelector('.product-price').textContent;
            const price = parseInt(priceText.replace('₹', ''));
            
            addToCart(itemName, price, quantity);
        });
    }
    
    // Order now button functionality
    const orderNowBtn = document.querySelector('.order-now-btn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function() {
            const quantityInput = document.getElementById('quantity');
            const quantity = parseInt(quantityInput.value) || 1;
            const itemName = document.querySelector('.product-title').textContent;
            const priceText = document.querySelector('.product-price').textContent;
            const price = parseInt(priceText.replace('₹', ''));
            const total = price * quantity;
            
            // Add to cart first
            addToCart(itemName, price, quantity);
            
            // Show order confirmation
            setTimeout(() => {
                alert(`Order placed for ${quantity} x ${itemName}\nTotal: ₹${total}\n\nThank you for your order! We'll contact you soon.`);
            }, 500);
        });
    }
    
    // Quantity input validation
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            let value = parseInt(this.value);
            
            if (value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
                showNotification(`Maximum quantity available is ${max}`);
            }
        });
    }
});

// Function to get cart contents (can be used by other parts of the app)
function getCart() {
    return cart;
}

// Function to clear cart
function clearCart() {
    cart = [];
    updateCartDisplay();
}

// Function to calculate cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// User management
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('bakeryUsers')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateUserInterface();
    
    // Add event listeners for forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    clearForms();
}

function switchModal(fromModal, toModal) {
    closeModal(fromModal);
    openModal(toModal);
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        clearForms();
    }
}

// Form handlers
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { email: user.email, name: user.name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('loginModal');
        updateUserInterface();
        showMessage('Login successful!', 'success');
    } else {
        showMessage('Invalid email or password!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showMessage('Email already exists!', 'error');
        return;
    }
    
    // Add new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('bakeryUsers', JSON.stringify(users));
    
    // Auto login
    currentUser = { email, name };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModal('registerModal');
    updateUserInterface();
    showMessage('Registration successful!', 'success');
}

// User interface updates
function updateUserInterface() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const profileIcon = document.querySelector('.profile-icon');
    const userGreeting = document.querySelector('.user-greeting');
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (currentUser) {
        // Hide login/register buttons
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        
        // Show user info
        userGreeting.style.display = 'block';
        userGreeting.textContent = `Hello, ${currentUser.name}!`;
        profileIcon.style.display = 'block';
        logoutBtn.style.display = 'block';
    } else {
        // Show login/register buttons
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        
        // Hide user info
        userGreeting.style.display = 'none';
        profileIcon.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showMessage('Logged out successfully!', 'success');
}

function toggleProfile() {
    if (currentUser) {
        alert(`Profile: ${currentUser.name}\nEmail: ${currentUser.email}`);
    }
}

// Utility functions
function clearForms() {
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}

function showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 2000;
        ${type === 'success' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}