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
