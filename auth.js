// auth.js - Global authentication management

// Check if user is authenticated
function isAuthenticated() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Redirect to signin if not authenticated
function requireAuth(redirectUrl = null) {
    if (!isAuthenticated()) {
        const currentPage = redirectUrl || window.location.pathname.split('/').pop() || 'index.html';
        localStorage.setItem('intendedDestination', currentPage);
        window.location.href = `signin.html?redirect=${currentPage}`;
        return false;
    }
    return true;
}

// Sign out function
function signOut() {
    if (!confirm('Are you sure you want to sign out?')) return;
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    
    // Show toast if available
    if (typeof showToast === 'function') {
        showToast('Signed out successfully', 'success');
    }
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Update navigation based on auth status
function updateAuthNavigation() {
    const currentUser = getCurrentUser();
    
    // Update all account links
    const accountLinks = document.querySelectorAll('a[href="account.html"]');
    accountLinks.forEach(link => {
        if (currentUser) {
            link.title = `Hi, ${currentUser.firstName}`;
        } else {
            link.href = 'signin.html';
            link.title = 'Sign In';
        }
    });
    
    // Update cart count
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count, #cartCount');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate total items
    const totalItems = cart.reduce((sum, item) => {
        return sum + (parseInt(item.quantity) || 1);
    }, 0);
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
            if (totalItems > 0) {
                element.style.display = 'inline-block';
            } else {
                element.style.display = 'none';
            }
        }
    });
    
    // Return count for external use
    return totalItems;
}

// Protect page and show auth modal
function showAuthModal() {
    // Remove existing modal if any
    const existingOverlay = document.getElementById('authOverlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'authOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.85);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 15px;
        text-align: center;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: slideUp 0.3s;
    `;
    
    const currentPage = window.location.pathname.split('/').pop() || 'shop.html';
    
    modal.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 1rem;">🔒</div>
        <h2 style="color: #2c3e50; margin-bottom: 1rem; font-size: 1.8rem;">Welcome to Trendora! 🛍️</h2>
        <p style="color: #666; margin-bottom: 2rem; line-height: 1.6; font-size: 1.05rem;">
            Please sign in or create an account to access this page and start shopping amazing products.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <a href="signin.html?redirect=${currentPage}" style="
                padding: 1rem 2.5rem;
                background: #2c3e50;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s;
                display: inline-block;
            " onmouseover="this.style.background='#1a252f'" onmouseout="this.style.background='#2c3e50'">Sign In</a>
            <a href="signup.html?redirect=${currentPage}" style="
                padding: 1rem 2.5rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s;
                display: inline-block;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Sign Up</a>
        </div>
        <p style="color: #999; font-size: 0.9rem;">
            Already have an account? <a href="signin.html?redirect=${currentPage}" style="color: #667eea; text-decoration: none; font-weight: 600;">Sign in here</a>
        </p>
    `;
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    if (!document.getElementById('authModalStyles')) {
        style.id = 'authModalStyles';
        document.head.appendChild(style);
    }
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}

// Add to cart function (universal)
function addToCart(product) {
    // Ensure user is authenticated
    if (!isAuthenticated()) {
        showAuthModal();
        return false;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
        // Increase quantity
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
        // Add new item
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || null,
            category: product.category || 'Uncategorized',
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message if toast function exists
    if (typeof showToast === 'function') {
        showToast(`${product.name} added to cart!`, 'success');
    } else {
        console.log(`${product.name} added to cart!`);
    }
    
    return true;
}

// Remove from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Reload cart page if on cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
}

// Update cart item quantity
function updateCartQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = parseInt(newQuantity);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Reload cart page if on cart page
        if (window.location.pathname.includes('cart.html')) {
            loadCart();
        }
    }
}

// Get cart total
function getCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => {
        return total + (parseFloat(item.price) * parseInt(item.quantity || 1));
    }, 0);
}

// Clear cart
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Reload cart page if on cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthNavigation();
    
    // Auto-update cart count every 2 seconds
    setInterval(updateCartCount, 2000);
});

// Export functions for global access
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.requireAuth = requireAuth;
window.signOut = signOut;
window.updateAuthNavigation = updateAuthNavigation;
window.updateCartCount = updateCartCount;
window.showAuthModal = showAuthModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.getCartTotal = getCartTotal;
window.clearCart = clearCart;
