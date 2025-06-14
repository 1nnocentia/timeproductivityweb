    // Theme toggle functionality
        document.addEventListener('DOMContentLoaded', function() {
            const themeToggle = document.getElementById('themeToggle');
            const html = document.documentElement;
            const icon = themeToggle.querySelector('i');

            // Check for saved theme preference
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                html.classList.add('dark');
                icon.classList.replace('fa-moon', 'fa-sun');
            }

            // Toggle theme
            themeToggle.addEventListener('click', function() {
                html.classList.toggle('dark');
                
                // Update icon
                if (html.classList.contains('dark')) {
                    icon.classList.replace('fa-moon', 'fa-sun');
                    localStorage.theme = 'dark';
                } else {
                    icon.classList.replace('fa-sun', 'fa-moon');
                    localStorage.theme = 'light';
                }
            });

            themeToggle.addEventListener('mouseleave', function() {
                icon.classList.remove(html.classList.contains('dark') ? 'fa-moon' : 'fa-sun');
                icon.classList.add(html.classList.contains('dark') ? 'fa-sun' : 'fa-moon');
            });
        });
    