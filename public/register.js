document.addEventListener('DOMContentLoaded', function() {
    // inisiasi semua yang digunakan di halaman register
    initializeThemeToggle();
    initializePasswordToggle();
    initializeFormValidation();
    initializeRegistrationForm();
});

// theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');

    if (themeToggle && html && icon) {
        // Check for saved theme preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        }

        // Toggle theme
        themeToggle.addEventListener('click', function() {
            html.classList.toggle('dark');
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
    }
}

// Password visibility toggle
function initializePasswordToggle() {
    const togglePasswordBtn = document.getElementById('togglePassword');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput && icon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    }
}

// Global variables for form validation
let isFormValid = false;
let passwordValidation = {
    length: false,
    uppercase: false,
    number: false,
    special: false
};


function showToast(message, type) {
    const toastContainer = document.getElementById('toastContainer');
    const toastContent = document.getElementById('toastContent');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    const toastCloseBtn = document.getElementById('toastCloseBtn');

    if (!toastContainer || !toastContent || !toastMessage || !toastIcon || !toastCloseBtn) {
        console.warn("Toast elements not found. Displaying message to console:", message);
        displayResponse({ message: message }, type === 'error');
        return;
    }

    toastMessage.textContent = message;
    toastContent.className = 'max-w-sm px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transform transition-all duration-300 ease-in-out';
    toastIcon.innerHTML = ''; // Reset icon

    if (type === 'success') {
        toastContent.classList.add('bg-green-500');
        toastIcon.innerHTML = '<i class="fa-solid fa-check-circle"></i>';
    } else if (type === 'error') {
        toastContent.classList.add('bg-red-500');
        toastIcon.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i>';
    } else if (type === 'info') {
        toastContent.classList.add('bg-blue-500');
        toastIcon.innerHTML = '<i class="fa-solid fa-info-circle"></i>';
    }

    toastContainer.classList.remove('hidden');
    // Mulai animasi masuk
    setTimeout(() => {
        toastContent.style.transform = 'translateX(0)';
        toastContent.style.opacity = '1';
    }, 10);

    // Auto-hide after 5 seconds
    const timeoutId = setTimeout(() => {
        hideToast();
    }, 5000);

    toastCloseBtn.onclick = () => {
        clearTimeout(timeoutId);
        hideToast();
    };
}

function hideToast() {
    const toastContent = document.getElementById('toastContent');
    const toastContainer = document.getElementById('toastContainer');
    if (toastContent && toastContainer) {
        toastContent.style.transform = 'translateX(100%)';
        toastContent.style.opacity = '0';
        setTimeout(() => {
            toastContainer.classList.add('hidden');
        }, 300);
    }
}


// Fungsi Validasi Form Pendaftaran 
function initializeFormValidation() {
    const passwordInput = document.getElementById('password');
    // Elemen pesan validasi password
    const passwordLengthMsg = document.getElementById('passwordLengthMsg');
    const passwordUppercaseMsg = document.getElementById('passwordUppercaseMsg');
    const passwordNumberMsg = document.getElementById('passwordNumberMsg');
    const passwordSpecialMsg = document.getElementById('passwordSpecialMsg');

    const validationMessagesExist = passwordLengthMsg && passwordUppercaseMsg && passwordNumberMsg && passwordSpecialMsg;

    function updateMessageStyle(element, isValid, message) {
        if (element) {
            element.textContent = isValid ? '' : message;
            element.style.color = isValid ? 'green' : 'red';
        }
    }

    function updatePasswordValidationMessages() {
        if (!passwordInput) return;

        // Cek panjang
        passwordValidation.length = passwordInput.value.length >= 8;
        updateMessageStyle(passwordLengthMsg, passwordValidation.length, "Password minimal 8 karakter");

        // Cek huruf kapital
        passwordValidation.uppercase = /[A-Z]/.test(passwordInput.value);
        updateMessageStyle(passwordUppercaseMsg, passwordValidation.uppercase, "Password harus mengandung setidaknya satu huruf kapital");

        // Cek angka
        passwordValidation.number = /[0-9]/.test(passwordInput.value);
        updateMessageStyle(passwordNumberMsg, passwordValidation.number, "Password harus mengandung setidaknya satu angka");

        // Cek karakter spesial
        passwordValidation.special = /[!@#$%^&*()]/.test(passwordInput.value);
        updateMessageStyle(passwordSpecialMsg, passwordValidation.special, "Password harus mengandung setidaknya satu karakter spesial (!@#$%^&*())");

        isFormValid = Object.values(passwordValidation).every(isValid => isValid);
    }

    if (passwordInput) {
        passwordInput.addEventListener('keyup', updatePasswordValidationMessages);
        updatePasswordValidationMessages(); // Inisialisasi tampilan pesan saat dimuat
    }

    // Validasi untuk "terms and conditions"
    const termsCheckbox = document.getElementById('termsCheckbox'); 
    if (termsCheckbox) { 
        termsCheckbox.addEventListener('change', function() {
        });
    } else {
        console.error("Element 'termsCheckbox' not found. Please ensure it has id='termsCheckbox' in your HTML.");
        // isFormValid akan tetap false jika termsCheckbox tidak ditemukan dan required
        isFormValid = false; // Set ke false secara eksplisit jika termsCheckbox tidak ada
    }
}

// Fungsi utama untuk menangani form pendaftaran
function initializeRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Mencegah default form submission

            const nama = document.getElementById('nickname').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const termsAccepted = document.getElementById('termsCheckbox').checked; // Ambil nilai checkbox

            // Panggil ini untuk update status isFormValid berdasarkan input saat ini
            initializeFormValidation();

            if (!isFormValid || !termsAccepted) {
                showToast("Harap isi semua bidang dan setujui syarat & ketentuan.", "error");
                return;
            }

            try {
                // Panggil endpoint signup langsung.
                // handleSignup() dari auth.js mengambil nilai dari input HTML index.html
                // Kita perlu mengirimkan nilai dari input di register.html
                const response = await fetch(`${BASE_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nama: nama, username: username, email: email, password: password })
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('Pendaftaran berhasil! Silakan login.', 'success');
                    registrationForm.reset(); // Reset form setelah sukses
                    // Redirect ke halaman login setelah beberapa detik
                    setTimeout(() => {
                        window.location.href = '../public/login.html'; // Sesuaikan path jika berbeda
                    }, 2000);
                } else {
                    let errorMessage = 'Pendaftaran gagal.';
                    // Jika backend mengembalikan detail error validasi dalam objek JSON
                    if (data && typeof data === 'object') {
                        Object.keys(data).forEach(key => {
                            errorMessage += `\n- ${key}: ${data[key]}`;
                        });
                    } else if (data) {
                        errorMessage += `\n- ${data}`; // Jika respons adalah string biasa
                    }
                    showToast(errorMessage, 'error');
                }
            } catch (error) {
                console.error('Error jaringan atau server:', error);
                showToast('Error jaringan atau server tidak merespons.', 'error');
            }
        });
    }
}