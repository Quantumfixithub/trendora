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
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthNavigation();
});






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
}

// Protect page and show auth modal
function showAuthModal() {
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
    
    modal.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 1rem;">🔒</div>
        <h2 style="color: #2c3e50; margin-bottom: 1rem; font-size: 1.8rem;">Welcome to Trendora! 🛍️</h2>
        <p style="color: #666; margin-bottom: 2rem; line-height: 1.6; font-size: 1.05rem;">
            Please sign in or create an account to access this page and start shopping amazing products.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 1.5rem;">
            <a href="signin.html?redirect=${window.location.pathname.split('/').pop()}" style="
                padding: 1rem 2.5rem;
                background: #2c3e50;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s;
                display: inline-block;
            " onmouseover="this.style.background='#1a252f'" onmouseout="this.style.background='#2c3e50'">Sign In</a>
            <a href="signup.html?redirect=${window.location.pathname.split('/').pop()}" style="
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
            Already have an account? <a href="signin.html" style="color: #667eea; text-decoration: none; font-weight: 600;">Sign in here</a>
        </p>
    `;
    
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
    document.head.appendChild(style);
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthNavigation();
});
