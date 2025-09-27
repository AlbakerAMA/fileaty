// Check if user is logged in and update UI accordingly
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const authLink = document.getElementById('auth-link');
    
    if (token) {
        // User is logged in
        if (authLink) {
            authLink.innerHTML = '<a href="/dashboard.html">Dashboard</a>';
        }
    }
});