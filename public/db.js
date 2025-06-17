// Database utility functions for Clockin application

// API endpoints
const API_BASE_URL = 'http://localhost:8080/api';

// Database connection class
class DatabaseService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Generic HTTP request handler
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const requestOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, requestOptions);
            return {
                success: response.ok,
                status: response.status,
                data: response.ok ? await response.json() : await response.text()
            };
        } catch (error) {
            console.error('Request failed:', error);
            return {
                success: false,
                status: 0,
                error: error.message
            };
        }
    }

    // User registration
    async registerUser(userData) {
        return await this.makeRequest('/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // User login
    async loginUser(credentials) {
        return await this.makeRequest('/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    // Get user by ID
    async getUserById(userId, token) {
        return await this.makeRequest(`/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    // Update user profile
    async updateUser(userId, userData, token) {
        return await this.makeRequest(`/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    }

    // Get all users (admin function)
    async getAllUsers(token) {
        return await this.makeRequest('/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    // Delete user
    async deleteUser(userId, token) {
        return await this.makeRequest(`/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // Check user existence (for validation)
    async checkUserExists(username = '', email = '') {
        const params = new URLSearchParams();
        if (username) params.append('username', username);
        if (email) params.append('email', email);
        
        return await this.makeRequest(`/users/check?${params.toString()}`, {
            method: 'GET'
        });
    }

    // Password reset request
    async requestPasswordReset(email) {
        return await this.makeRequest('/forgot-password/request', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    // Password reset
    async resetPassword(token, newPassword) {
        return await this.makeRequest('/forgot-password/reset', {
            method: 'POST',
            body: JSON.stringify({ 
                token: token, 
                newPassword: newPassword 
            })
        });
    }

    // User streak functions
    async getUserStreak(userId, token) {
        return await this.makeRequest(`/users/${userId}/streak`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // Record user interaction
    async recordUserInteraction(userId, token) {
        return await this.makeRequest(`/users/${userId}/record-interaction`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // Get user notifications
    async getUserNotifications(userId, token) {
        return await this.makeRequest(`/users/${userId}/notifications`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // Get unread notifications
    async getUnreadNotifications(userId, token) {
        return await this.makeRequest(`/users/${userId}/notifications/unread`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // Mark notification as read
    async markNotificationAsRead(notificationId, token) {
        return await this.makeRequest(`/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // Test database connection
    async testConnection() {
        try {
            const result = await this.makeRequest('/users', {
                method: 'GET'
            });
            return result.success;
        } catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    }
}

// Form validation utilities
class FormValidator {
    // Validate email format
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    static validatePassword(password) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()]/.test(password),
            isValid: password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()]/.test(password)
        };
    }

    // Validate username
    static validateUsername(username) {
        return username && username.length >= 3 && username.length <= 50;
    }

    // Validate nickname
    static validateNickname(nickname) {
        return nickname && nickname.length >= 2 && nickname.length <= 100;
    }

    // Validate registration form
    static validateRegistrationForm(formData) {
        const errors = [];

        if (!this.validateNickname(formData.nama)) {
            errors.push('Nickname must be between 2 and 100 characters');
        }

        if (!this.validateUsername(formData.username)) {
            errors.push('Username must be between 3 and 50 characters');
        }

        if (!this.validateEmail(formData.email)) {
            errors.push('Please enter a valid email address');
        }

        const passwordValidation = this.validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            errors.push('Password must have at least 8 characters, 1 uppercase letter, 1 number, and 1 special character');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// User session management
class SessionManager {
    // Save user session
    static saveSession(token, userId, userData = null) {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userId', userId);
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    }

    // Get current session
    static getSession() {
        return {
            token: localStorage.getItem('jwtToken'),
            userId: localStorage.getItem('userId'),
            userData: JSON.parse(localStorage.getItem('userData') || 'null')
        };
    }

    // Clear session
    static clearSession() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userData');
    }

    // Check if user is logged in
    static isLoggedIn() {
        const session = this.getSession();
        return session.token && session.userId;
    }

    // Update user data in session
    static updateUserData(userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
    }
}

// Global database service instance
window.dbService = new DatabaseService();
window.FormValidator = FormValidator;
window.SessionManager = SessionManager;

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DatabaseService,
        FormValidator,
        SessionManager
    };
}