// public/achievements.js

document.addEventListener('DOMContentLoaded', function() {
    // Pastikan pengguna sudah login sebelum menjalankan fungsi apa pun
    if (!window.userId) {
        alert('You have to login first.');
        // Redirect ke halaman login jika belum
        window.location.href = '../public/login.html';
        return;
    }

    // Definisikan milestone achievements berdasarkan backend Anda
    // Backend Anda memiliki MILESTONES = {7, 30, 100, 365, 1000}
    const streakAchievements = [
        { id: 'streak-7', requiredStreak: 7 },
        { id: 'streak-30', requiredStreak: 30 },
        { id: 'streak-100', requiredStreak: 100 },
        { id: 'streak-365', requiredStreak: 365 },
        // Anda bisa tambahkan milestone 1000 jika ada cardnya di HTML
    ];

    /**
     * Fungsi utama untuk mengambil semua data yang diperlukan dan memperbarui UI.
     */
    async function initializeAchievementsPage() {
        try {
            // Jalankan pengambilan data secara paralel untuk efisiensi
            const [userData, streakData] = await Promise.all([
                fetchUserData(),
                fetchStreakData()
            ]);

            // Perbarui UI dengan data yang telah diambil
            updateProfileInfo(userData);
            updateStreakInfo(streakData);
            updateAchievementCards(streakData, streakAchievements);

        } catch (error) {
            console.error("Gagal menginisialisasi halaman pencapaian:", error);
            // Tampilkan pesan error kepada pengguna jika diperlukan
        }
    }

    /**
     * Mengambil data profil pengguna (nama, username).
     */
    async function fetchUserData() {
        const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}`);
        if (!response) throw new Error("Gagal mengambil data pengguna.");
        return await response.json();
    }

    /**
     * Mengambil data streak pengguna (current dan max streak).
     */
    async function fetchStreakData() {
        // Endpoint ini sesuai dengan getStreakByUserId di backend
        const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}/streak`);
        if (!response) throw new Error("Gagal mengambil data streak.");
        return await response.json();
    }

    /**
     * Memperbarui informasi profil di bagian atas halaman.
     * @param {object} userData - Data pengguna dari API.
     */
    function updateProfileInfo(userData) {
        const profileName = document.querySelector('.font-black.font-heading');
        const profileUsername = document.querySelector('.font-medium.font-body');
        if (profileName) profileName.textContent = userData.nama || 'User';
        if (profileUsername) profileUsername.textContent = userData.username || '';
    }

    /**
     * Memperbarui tampilan streak saat ini.
     * @param {object} streakData - Data streak dari API.
     */
    function updateStreakInfo(streakData) {
        const streakDisplay = document.querySelector('.text-accent.font-heading.text-2xl.font-black');
        if (streakDisplay) {
            streakDisplay.textContent = `${streakData.currentStreak || 0} Days`;
        }
    }

    /**
     * Memeriksa dan memperbarui status setiap kartu pencapaian.
     * @param {object} streakData - Data streak pengguna.
     * @param {Array} achievements - Array konfigurasi pencapaian.
     */
    function updateAchievementCards(streakData, achievements) {
        // Gunakan maxStreak karena pencapaian tidak boleh hilang meskipun streak saat ini reset.
        const maxStreak = streakData.maxStreak || 0;

        achievements.forEach(ach => {
            const cardElement = document.getElementById(`achievement-${ach.id}`);
            const statusElement = document.getElementById(`achievement-${ach.id}-status`);

            if (cardElement && statusElement) {
                // Periksa apakah max streak pengguna memenuhi syarat
                if (maxStreak >= ach.requiredStreak) {
                    // UNLOCKED
                    cardElement.classList.remove('opacity-50'); // Hapus efek terkunci
                    cardElement.classList.add('unlocked'); // Tambah kelas jika perlu styling khusus
                    statusElement.textContent = 'Unlocked';
                    statusElement.style.color = '#10B981'; // Warna hijau untuk unlocked
                    statusElement.style.fontWeight = 'bold';
                    statusElement.style.textAlign = 'center';
                } else {
                    // LOCKED
                    cardElement.classList.add('opacity-50');
                    statusElement.textContent = `Locked (${maxStreak}/${ach.requiredStreak} days)`;
                }
            }
        });

        // Di sini Anda bisa menambahkan logika untuk achievement non-streak
        // handleNonStreakAchievements(); 
    }

    // Panggil fungsi inisialisasi untuk memulai semuanya
    initializeAchievementsPage();
});