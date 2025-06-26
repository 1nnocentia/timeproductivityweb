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
    
    // Set initial theme - default to light mode if no preference
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark');
        updateIcon(true);
        console.log('Initial theme: dark');
    } else {
        html.classList.remove('dark');
        updateIcon(false);
        console.log('Initial theme: light');
    }
    
    // Update toggle button icon
    function updateIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (isDark) {
                icon.className = 'fa-solid fa-sun text-white dark:text-white';
            } else {
                icon.className = 'fa-solid fa-moon text-gray-600 dark:text-white';
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
        e.stopPropagation();
        console.log('Theme toggle button clicked');
        toggleTheme();
    });
    
    // Global toggle function
    window.toggleDarkMode = toggleTheme;
    
    // Force light mode function (for debugging)
    window.forceLightMode = function() {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateIcon(false);
        console.log('Forced to light mode');
    };
    
    // Force dark mode function (for debugging)
    window.forceDarkMode = function() {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateIcon(true);
        console.log('Forced to dark mode');
    };
});