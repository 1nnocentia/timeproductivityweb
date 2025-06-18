// permintaan HTTP fetch akan mengarah ke localhost 8080
const Base_URL = 'http://localhost:8080/api';
// ambil token JWT dan userId dari localStorage
let jwtToken = localStorage.getItem('jwtToken') || null;
let currentUserId = localStorage.getItem('currentUserId') || null;

const responseDisplay = document.getElementById('response');

// response API
function displayResponse(data, isError = false) {
    responseDisplay.textContent = JSON.stringify(data, null, 2);
    responseDisplay.className = `bg-gray-50 p-4 rounded-md border text-sm overflow-x-auto min-h-[100px] ${isError ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}`;
}


// untuk request ke endpoint yang perlu JWT token
async function fetchProtected(url, options = {}) {
    if (!jwtToken) {
        displayResponse({ message: 'You must be logged in to access this page.' }, true);
        return null;
    }

    // mempersiapkan token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        ...options.headers
    };

    try {
        const response = await fetch(url, {...options, headers });
        if (response.ok) {
            return response;
        } else {
            const errorData = await response.json().catch(() => response.text());
            console.error(`HTTP Error ${response.status} from ${url}:`, errorData);
            displayResponse(errorData, true);
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Network or unexpected error:', error);
        displayResponse({ message: 'Network Error or No Response' }, true);
        return null;
    }
}

// membuat fungsi untuk tiap endpoint
// user

//signup
async function handleSignUp(){
    const nama = document.getElementById('signupNama').value;
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            displayResponse(data);
        } else {
            displayResponse(data, true);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// login
async function handleLogin() {
    const usernameOrEmail = document.getElementById('loginUsernameOrEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password })
        });

        const data = await response.json();
        if (response.ok) {
            jwtToken = data.token;
            currentUserId = data.userId;
            localStorage.setItem('jwtToken', jwtToken);
            localStorage.setItem('currentUserId', currentUserId);
            displayResponse(data);
        } else {
            displayResponse(data, true);
        }
    } catch (error) {
        console.error('Error during login:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

//logout
async function handleLogout() {
    try {
        const response = await fetchProtected(`${BASE_URL}/logout`, { method: 'POST' });
        if (response) {
            const data = await response.text();
            jwtToken = null;
            currentUserId = null;
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('currentUserId');
            displayResponse({ message: data || 'Logout berhasil.' });
        }
    } catch (error) {
        console.error('Error during logout:', error);
        displayResponse({ message: 'Error jaringan atau server.' }, true);
    }
}

// ambil user
async function handleGetAllUsers() {
    try {
        const response = await fetchProtected(`${BASE_URL}/users`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting users:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// ketika ada profile user yang berubah
async function handleUpdateUser() {
    const userId = document.getElementById('updateUserId').value;
    const nama = document.getElementById('updateNama').value;
    const username = document.getElementById('updateUsername').value;
    const email = document.getElementById('updateEmail').value;
    const password = document.getElementById('updatePassword').value;
    const profilePictureId = document.getElementById('updateProfilePictureId').value;

    const requestBody = {};
    if (nama) requestBody.nama = nama;
    if (username) requestBody.username = username;
    if (email) requestBody.email = email;
    if (password) requestBody.password = password;
    if (profilePictureId) requestBody.profilePictureId = profilePictureId;
    
    if (!userId) {
        displayResponse({ message: 'User ID needed to update.' }, true);
        return;
    }

    try {
        const response = await fetchProtected(`${BASE_URL}/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(requestBody)
        });
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}