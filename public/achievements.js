document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.fetchProtected !== 'function' || typeof window.BASE_URL === 'undefined') {
        console.error("Critical dependency auth.js not loaded.");
        alert("Gagal memuat file penting. Silakan coba muat ulang halaman.");
        return;
    }
    
    // Periksa status login pengguna
    if (!window.userId) {
        alert('Anda harus login untuk melihat pencapaian.');
        window.location.href = './login.html';
        return;
    }

    // Definisikan milestone achievements berdasarkan backend Anda (StreakService.java)
    const streakAchievements = [
        { id: 'streak-7', requiredStreak: 7 },
        { id: 'streak-30', requiredStreak: 30 },
        { id: 'streak-100', requiredStreak: 100 },
        { id: 'streak-365', requiredStreak: 365 },
    ];

    /**
     * Fungsi utama untuk mengambil semua data yang diperlukan dan memperbarui UI.
     */
    async function initializeAchievementsPage() {
        try {
            // Tampilkan loading state
            document.getElementById('profileName').textContent = 'Loading...';

            // Jalankan semua pengambilan data secara paralel untuk efisiensi maksimum
            const [userData, streakData, allSchedules, weeklyTaskCounts] = await Promise.all([
                fetchUserData(),
                fetchStreakData(),
                fetchAllSchedules(), 
                fetchWeeklyTaskCounts()
            ]);

            // Perbarui UI dengan data yang telah diambil
            if (userData) updateProfileInfo(userData);
            if (streakData) {
                updateStreakInfo(streakData);
                updateStreakAchievementCards(streakData, streakAchievements);
            }
            // Kirim data yang relevan ke fungsi non-streak
            updateNonStreakAchievementCards(allSchedules, weeklyTaskCounts);

        } catch (error) {
            console.error("Gagal menginisialisasi halaman pencapaian:", error);
            // Anda bisa menampilkan pesan error kepada pengguna di sini
            document.getElementById('profileName').textContent = 'Gagal memuat data';
        }
    }

    /**
     * Mengambil data profil pengguna (nama, username).
     */
    async function fetchUserData() {
        try {
            const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}`);
            return response ? await response.json() : null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }

    /**
     * Mengambil data streak pengguna (current dan max streak).
     */
    async function fetchStreakData() {
        try {
            const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}/streak`);
            return response ? await response.json() : null;
        } catch(error) {
            console.error('Error fetching streak data:', error);
            return { currentStreak: 0, maxStreak: 0 };
        }
    }
    
    /**
     * Mengambil semua jadwal (untuk mengecek tugas pertama yang selesai).
     */
    async function fetchAllSchedules() {
        try {
            const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal`);
            return response ? await response.json() : [];
        } catch (error) {
            console.error('Error fetching all schedules:', error);
            return []; // Return empty array on error
        }
    }

    /**
     * Mengambil jumlah tugas yang dikelompokkan per minggu.
     */
    async function fetchWeeklyTaskCounts() {
        try {
            // Memanggil endpoint dari backend untuk menghitung tugas per minggu
            const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal/reports/tasks-by-period?periodType=WEEK`);
            return response ? await response.json() : [];
        } catch (error) {
            console.error('Error fetching weekly task counts:', error);
            return []; // Return empty array on error
        }
    }

    /**
     * Memperbarui informasi profil di bagian atas halaman.
     * @param {object} userData - Data pengguna dari API.
     */
    function updateProfileInfo(userData) {
        const profileNameEl = document.getElementById('profileName');
        const profileUsernameEl = document.getElementById('profileUsername');
        const profilePictureEl = document.getElementById('profilePicture');
        if (profileNameEl) profileNameEl.textContent = userData.nama || 'User';
        if (profileUsernameEl) profileUsernameEl.textContent = `@${userData.username}` || '';
        if (profilePictureEl && userData.profilePictureId) {
        const basePath = "../assets/"; 
        const imageName = userData.profilePictureId; 
        profilePictureEl.src = basePath + imageName;
    } 
    }

    /**
     * Memperbarui tampilan streak saat ini.
     * @param {object} streakData - Data streak dari API.
     */
    function updateStreakInfo(streakData) {
        const streakDisplayEl = document.getElementById('currentStreakDisplay');
        if (streakDisplayEl) {
            streakDisplayEl.textContent = `${streakData.currentStreak || 0} Days`;
        }
    }

    /**
     * Memeriksa dan memperbarui status kartu pencapaian berbasis streak.
     * @param {object} streakData - Data streak pengguna.
     * @param {Array} achievements - Array konfigurasi pencapaian.
     */
    function updateStreakAchievementCards(streakData, achievements) {
        const maxStreak = streakData ? streakData.maxStreak || 0 : 0;

        achievements.forEach(ach => {
            const cardElement = document.getElementById(`achievement-${ach.id}`);
            const statusElement = document.getElementById(`achievement-${ach.id}-status`);

            if (cardElement && statusElement) {
                if (maxStreak >= ach.requiredStreak) {
                    unlockCard(cardElement, statusElement, 'Unlocked');
                } else {
                    statusElement.textContent = `Locked (${maxStreak}/${ach.requiredStreak} days)`;
                }
            }
        });
    }
    
    /**
     * Memeriksa dan memperbarui pencapaian yang tidak terkait dengan streak.
     * @param {Array} allSchedules - Array semua jadwal dari pengguna.
     * @param {Array} weeklyTaskCounts - Array jumlah tugas per minggu dari API.
     */
    function updateNonStreakAchievementCards(allSchedules, weeklyTaskCounts) {
        // 1. Pencapaian "First Task"
        const hasCompletedTask = allSchedules.some(item => item.task && (item.task.status.toUpperCase() === 'SELESAI'));
        const firstTaskCard = document.getElementById('achievement-first-task');
        const firstTaskStatus = document.getElementById('achievement-first-task-status');

        if (firstTaskCard && firstTaskStatus) {
            if(hasCompletedTask){
                unlockCard(firstTaskCard, firstTaskStatus, 'Unlocked');
            }
        }

        // 2. Pencapaian "Productive Week"
        const isProductiveWeekAchieved = weeklyTaskCounts.some(week => week.count >= 5); // Angka 5 bisa disesuaikan
        const productiveWeekCard = document.getElementById('achievement-productive-week');
        const productiveWeekStatus = document.getElementById('achievement-productive-week-status');
        
        if (productiveWeekCard && productiveWeekStatus) {
            if (isProductiveWeekAchieved) {
                 unlockCard(productiveWeekCard, productiveWeekStatus, 'Unlocked');
            } else {
                 productiveWeekStatus.textContent = `Locked (Selesaikan 5 tugas dalam seminggu)`;
            }
        }
    }
    
    /**
     * Helper function untuk mengubah tampilan kartu menjadi "Unlocked".
     * @param {HTMLElement} cardElement - Elemen kartu utama.
     * @param {HTMLElement} statusElement - Elemen teks status di footer.
     * @param {string} text - Teks status (e.g., "Unlocked").
     */
    function unlockCard(cardElement, statusElement, text) {
        cardElement.classList.remove('opacity-50');
        cardElement.classList.add('unlocked');
        statusElement.textContent = text;
        statusElement.style.color = '#10B981'; // Warna hijau
        statusElement.style.fontWeight = 'bold';
        statusElement.style.textAlign = 'center';
    }
    
    // Tambahkan event listener untuk tombol logout jika ada
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton && typeof window.handleLogout === 'function') {
        logoutButton.addEventListener('click', window.handleLogout);
    }

    // Panggil fungsi inisialisasi untuk memulai semuanya
    initializeAchievementsPage();

    
});
