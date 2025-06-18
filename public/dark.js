document.addEventListener('DOMContentLoaded', function() {
    // Simple Dark Mode Toggle for Tailwind CSS
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }
    
    // Check for saved theme or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark');
        updateIcon(true);
    } else {
        html.classList.remove('dark');
        updateIcon(false);
    }
    
    // Update toggle button icon
    function updateIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (isDark) {
                icon.className = 'fas fa-sun text-white';
            } else {
                icon.className = 'fas fa-moon text-gray-600';
            }
        }
    }
    
    // Toggle function
    function toggleTheme() {
        const isDark = html.classList.contains('dark');
        
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            updateIcon(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            updateIcon(true);
        }
        
        console.log('Theme toggled to:', isDark ? 'light' : 'dark');
    }
    
    // Add click event to toggle button
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });
    
    // Global toggle function
    window.toggleDarkMode = toggleTheme;
});