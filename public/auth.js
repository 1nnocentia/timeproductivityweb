// permintaan HTTP fetch akan mengarah ke localhost 8080
window.BASE_URL = 'http://localhost:8080/api';
window.jwtToken = localStorage.getItem('jwtToken') || null;
window.userId = localStorage.getItem('userId') || null;


window.displayResponse = function(data, isError = false) {
    const targetElement = document.getElementById('response'); // Coba temukan #response div
    if (targetElement) { // Jika ada #response, update di sana
        targetElement.textContent = JSON.stringify(data, null, 2);
        targetElement.className = `bg-gray-50 p-4 rounded-md border text-sm overflow-x-auto min-h-[100px] ${isError ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}`;
    } else { // Jika tidak ada #response (misal: di dashboard), fallback ke console atau alert
        console.warn("Element 'response' not found in current page. Logging API response to console:", data);
        if (isError) {
            console.error("API Error:", data);
            alert("Error: " + JSON.stringify(data.message || data)); 
        } else {
            console.log("API Success:", data);
        }
    }
}

// Helper untuk permintaan API yang memerlukan JWT
window.fetchProtected = async function(url, options = {}) {
    if (!window.jwtToken || !window.userId) {
        console.warn('Anda belum login atau sesi kadaluarsa. Silakan login kembali.');
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
        window.location.href = '../public/login.html';
        return null;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.jwtToken}`,
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });

        if (response.ok) {
            return response;
        } else {
            const errorData = await response.json().catch(() => response.text());
            console.error(`HTTP Error ${response.status} from ${url}:`, errorData);
            window.displayResponse(errorData, true); // Gunakan window.displayResponse
            
            if (response.status === 401 || response.status === 403) {
                alert('Akses ditolak atau sesi kadaluarsa. Silakan login kembali.');
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userId');
                window.jwtToken = null;
                window.userId = null;
                window.location.href = '../public/login.html';
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Network or unexpected error:', error);
        alert('Error jaringan atau server tidak merespons.');
        return null;
    }
}

// --- Fungsi Autentikasi Umum (Didefinisikan di window untuk akses global) ---

window.handleSignup = async function(nama, username, email, password) {
    try {
        const response = await fetch(`${window.BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, username, email, password })
        });
        const data = await response.json();
        return { response, data };
    } catch (error) {
        console.error('Error during signup fetch:', error);
        throw error;
    }
}

window.handleLogin = async function() {
    console.log("handleLogin called");
    const usernameOrEmailInput = document.getElementById('loginUsernameOrEmail');
    const passwordInput = document.getElementById('loginPassword');

    if (!usernameOrEmailInput || !passwordInput) {
        console.warn("Login input elements not found in this page.");
        window.displayResponse({ message: "Elemen input login tidak ditemukan." }, true);
        return;
    }

    const usernameOrEmail = usernameOrEmailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch(`${window.BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password })
        });

        const data = await response.json();
        if (response.ok) {
            window.jwtToken = data.token;
            window.userId = data.userId;
            localStorage.setItem('jwtToken', window.jwtToken);
            localStorage.setItem('userId', window.userId);
            window.displayResponse(data);
            
            console.log("Set jwtToken (inside handleLogin):", data.token);
            console.log("Set userId (inside handleLogin):", data.userId);
            window.displayResponse(data);
            // Jika login berhasil, redirect ke dashboard (index.html)
            window.location.href = '../public/index.html'; // Sesuaikan dengan path dashboard Anda
        } else {
            window.displayResponse(data, true);
        }
    } catch (error) {
        console.error('Error during login:', error);
        window.displayResponse({ message: 'Error jaringan atau server.' }, true);
    }
}

window.handleLogout = async function() {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/logout`, { method: 'POST' });
        if (response) {
            const data = await response.text();
            alert(data || 'Anda telah logout.'); // Notifikasi ke pengguna

            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userId');
            window.jwtToken = null;
            window.userId = null;

            window.location.href = '../public/landingpage.html'; // Redirect ke halaman landingpage
        }
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Gagal logout. Silakan coba lagi.');
    }
}

window.handleGetAllUsers = async function() {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/users`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting users:', error);
        window.displayResponse({ message: 'Error jaringan atau server.' }, true);
    }
}

window.handleUpdateUser = async function(userId, nama, username, email, password, profilePictureId) {
    const requestBody = {};
    if (nama) requestBody.nama = nama;
    if (username) requestBody.username = username;
    if (email) requestBody.email = email;
    if (password) requestBody.password = password;
    if (profilePictureId) requestBody.profilePictureId = profilePictureId;
    
    if (!userId) {
        window.displayResponse({ message: 'User ID diperlukan untuk update.' }, true);
        return;
    }

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(requestBody)
        });
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        window.displayResponse({ message: 'Error jaringan atau server.' }, true);
    }
}


// const responseDisplayElement = document.getElementById('response');

// // response API
// function displayResponse(data, isError = false) {
//     responseDisplay.textContent = JSON.stringify(data, null, 2);
//     responseDisplay.className = `bg-gray-50 p-4 rounded-md border text-sm overflow-x-auto min-h-[100px] ${isError ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}`;
// }


// // untuk request ke endpoint yang perlu JWT token
// async function fetchProtected(url, options = {}) {
//     if (!jwtToken) {
//         displayResponse({ message: 'You must be logged in to access this page.' }, true);
//         return null;
//     }

//     // mempersiapkan token
//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${jwtToken}`,
//         ...options.headers
//     };

//     try {
//         const response = await fetch(url, {...options, headers });
//         if (response.ok) {
//             return response;
//         } else {
//             const errorData = await response.json().catch(() => response.text());
//             console.error(`HTTP Error ${response.status} from ${url}:`, errorData);
//             displayResponse(errorData, true);
//             throw new Error(`HTTP Error: ${response.status}`);
//         }
//     } catch (error) {
//         console.error('Network or unexpected error:', error);
//         displayResponse({ message: 'Network Error or No Response' }, true);
//         return null;
//     }
// }

// // membuat fungsi untuk tiap endpoint
// // user

// //signup
// async function handleSignUp(){
//     const nama = document.getElementById('signupNama').value;
//     const username = document.getElementById('signupUsername').value;
//     const email = document.getElementById('signupEmail').value;
//     const password = document.getElementById('signupPassword').value;

//     try {
//         const response = await fetch(`${BASE_URL}/signup`, {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json' },
//             body: JSON.stringify({ nama, username, email, password })
//         });

//         const data = await response.json();
//         if (response.ok) {
//             displayResponse(data);
//         } else {
//             displayResponse(data, true);
//         }
//     } catch (error) {
//         console.error('Error during signup:', error);
//         displayResponse({ message: 'Network or Server Error.' }, true);
//     }
// }

// // login
// async function handleLogin() {
//     const usernameOrEmail = document.getElementById('loginUsernameOrEmail').value;
//     const password = document.getElementById('loginPassword').value;

//     try {
//         const response = await fetch(`${BASE_URL}/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ usernameOrEmail, password })
//         });

//         const data = await response.json();
//         if (response.ok) {
//             jwtToken = data.token;
//             currentUserId = data.userId;
//             localStorage.setItem('jwtToken', jwtToken);
//             localStorage.setItem('currentUserId', currentUserId);
//             displayResponse(data);
//         } else {
//             displayResponse(data, true);
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//         displayResponse({ message: 'Network or Server Error.' }, true);
//     }
// }

// //logout
// async function handleLogout() {
//     try {
//         const response = await fetchProtected(`${BASE_URL}/logout`, { method: 'POST' });
//         if (response) {
//             const data = await response.text();
//             jwtToken = null;
//             currentUserId = null;
//             localStorage.removeItem('jwtToken');
//             localStorage.removeItem('currentUserId');
//             displayResponse({ message: data || 'Logout berhasil.' });
//         }
//     } catch (error) {
//         console.error('Error during logout:', error);
//         displayResponse({ message: 'Error jaringan atau server.' }, true);
//     }
// }

// // ambil user
// async function handleGetAllUsers() {
//     try {
//         const response = await fetchProtected(`${BASE_URL}/users`);
//         if (response) {
//             const data = await response.json();
//             displayResponse(data);
//         }
//     } catch (error) {
//         console.error('Error getting users:', error);
//         displayResponse({ message: 'Network or Server Error.' }, true);
//     }
// }

// // ketika ada profile user yang berubah
// async function handleUpdateUser() {
//     const userId = document.getElementById('updateUserId').value;
//     const nama = document.getElementById('updateNama').value;
//     const username = document.getElementById('updateUsername').value;
//     const email = document.getElementById('updateEmail').value;
//     const password = document.getElementById('updatePassword').value;
//     const profilePictureId = document.getElementById('updateProfilePictureId').value;

//     const requestBody = {};
//     if (nama) requestBody.nama = nama;
//     if (username) requestBody.username = username;
//     if (email) requestBody.email = email;
//     if (password) requestBody.password = password;
//     if (profilePictureId) requestBody.profilePictureId = profilePictureId;
    
//     if (!userId) {
//         displayResponse({ message: 'User ID needed to update.' }, true);
//         return;
//     }

//     try {
//         const response = await fetchProtected(`${BASE_URL}/users/${userId}`, {
//             method: 'PUT',
//             body: JSON.stringify(requestBody)
//         });
//         if (response) {
//             const data = await response.json();
//             displayResponse(data);
//         }
//     } catch (error) {
//         console.error('Error updating user:', error);
//         displayResponse({ message: 'Network or Server Error.' }, true);
//     }
// }