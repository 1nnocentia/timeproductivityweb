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


        // Form submission
        const form = document.querySelector('form');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            // Perform form validation and submission logic here
        });
        // Example of form validation
        function validateForm() {
            const nickname = document.getElementById('nickname').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!nickname || !username || !email || !password) {
                alert('Please fill out all fields.');
                return false;
            }

            // Additional validation logic can be added here
            return true;
        }