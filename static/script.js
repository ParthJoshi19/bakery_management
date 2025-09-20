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