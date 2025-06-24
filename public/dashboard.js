// js/scriptDashboard.js

// Cek status login dari local storage saat script dimuat
console.log("Cek localStorage jwtToken =", localStorage.getItem('jwtToken'));
console.log("Cek localStorage userId =", localStorage.getItem('userId'));

if (!window.jwtToken || !window.userId) {
    console.warn("⚠️ Token tidak ditemukan. User dianggap belum login.");
} else {
    console.log("✅ Token ditemukan. User dianggap sudah login.");
}

// Data Konfigurasi untuk Prioritas (Gems)
const gemData = [
    {
        active: "/assets/Aset_Aplikasi_Non_critical.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#82E97B',
        description: 'Tugas dengan dampak rendah yang bisa dikerjakan nanti tanpa menimbulkan masalah.',
        name: 'Non Critical'
    },
    {
        active: "/assets/Aset_Aplikasi_Perventive.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#7BD6EB',
        description: 'Tugas rutin yang dilakukan untuk menghindari masalah lebih besar di masa depan.',
        name: 'Perventive'
    },
    {
        active: "/assets/Aset_Aplikasi_Urgent.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#DC7BEB',
        description: 'Tugas penting yang harus segera ditangani untuk mencegah gangguan.',
        name: 'Urgent'
    },
    {
        active: "/assets/Aset_Aplikasi_Emergency.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#EC7980',
        description: 'Masalah kritis yang harus segera diperbaiki untuk menjamin keamanan atau fungsi.',
        name: 'Emergency'
    }
];

// Variabel global untuk menyimpan level prioritas yang dipilih saat ini
let currentLevel = -1;

/**
 * Handler untuk mengatur level prioritas saat gem di-klik.
 * Fungsi ini dibuat global (window.setLevel) agar bisa dipanggil dari atribut onclick di HTML.
 * @param {number} level - Index level prioritas (0-3).
 */
window.setLevel = function(level) {
    if (currentLevel === level) {
        // Jika level yang sama di-klik lagi, reset pilihan
        currentLevel = -1;
        const info = document.getElementById("gem-info");
        const sliderFill = document.getElementById("slider-fill");
        
        for (let i = 0; i < gemData.length; i++) {
            const gemImage = document.getElementById(`gem-${i}`);
            if (gemImage) gemImage.src = gemData[i].inactive;
        }
        if (info) {
            info.innerText = "Pilih level prioritas";
            info.style.color = ''; // Reset warna teks
        }
        if (sliderFill) {
            sliderFill.style.width = `0%`;
            sliderFill.style.backgroundColor = 'transparent';
        }
        return;
    }

    currentLevel = level;
    const fillWidths = [0, 33, 66, 100]; // Posisi persentase untuk fill bar
    const sliderFill = document.getElementById("slider-fill");
    const info = document.getElementById("gem-info");

    // Update slider fill
    if (sliderFill) {
        sliderFill.style.width = `${fillWidths[level]}%`;
        sliderFill.style.backgroundColor = gemData[level].color;
    }

    // Update gambar gems (active/inactive)
    for (let i = 0; i < gemData.length; i++) {
        const gemImage = document.getElementById(`gem-${i}`);
        if (gemImage) {
            gemImage.src = (i === level) ? gemData[i].active : gemData[i].inactive;
        }
    }

    // Update deskripsi dan warna info
    if (info) {
        info.innerText = gemData[level].description;
        info.style.color = gemData[level].color;
    }
}


// --- FUNGSI-FUNGSI UNTUK FETCH DATA DASHBOARD ---

/**
 * Mengambil dan menampilkan nama pengguna di sapaan (greeting).
 */
async function fetchAndDisplayGreeting() {
    const greetingElement = document.getElementById('greetingText');
    if (!greetingElement) return;

    if (!window.userId) {
        greetingElement.textContent = 'Good Morning, User!';
        return;
    }

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}`);
        if (response) {
            const userData = await response.json();
            const displayName = userData.nama || userData.username;
            greetingElement.textContent = `Good Morning, ${displayName || 'User'}!`;
        }
    } catch (error) {
        console.error('Error fetching user data for greeting:', error);
        greetingElement.textContent = 'Good Morning, User!'; // Fallback
    }
}

/**
 * Mengambil dan menampilkan data streak pengguna.
 */
async function fetchAndDisplayStreak() {
    const streakDisplayElement = document.getElementById('currentStreakDisplay');
    if (!streakDisplayElement) return;

    if (!window.userId) {
        streakDisplayElement.innerText = 'Login untuk melihat streak';
        return;
    }

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}/streak`);
        if (response) {
            const data = await response.json();
            streakDisplayElement.innerText = `${data.currentStreak} Days`;
        }
    } catch (error) {
        console.error('Error fetching streak:', error);
        streakDisplayElement.innerText = 'Error';
    }
}

/**
 * Mengambil dan menampilkan progres berdasarkan prioritas.
 */
async function fetchAndDisplayPrioritasProgress() {
    if (!window.userId) {
        // Reset progress bar jika belum login
        gemData.forEach(prio => {
            const selectorClass = `progress-${prio.name.toLowerCase().replace(' ', '')}`;
            const textElement = document.querySelector(`.${selectorClass} .progress-text`);
            const barElement = document.querySelector(`.${selectorClass} .progress-bar`);
            if (textElement) textElement.textContent = `0/0 (0%)`;
            if (barElement) barElement.style.width = '0%';
        });
        return;
    }

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/prioritas`);
        if (response) {
            const prioritasList = await response.json();
            prioritasList.forEach(prioBackend => {
                const total = prioBackend.totalTasks;
                const completed = prioBackend.completedTasks;
                const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
                const selectorClass = `progress-${prioBackend.namaPrioritas.toLowerCase().replace(' ', '')}`;
                
                const textElement = document.querySelector(`.${selectorClass} .progress-text`);
                const barElement = document.querySelector(`.${selectorClass} .progress-bar`);

                if (textElement) textElement.textContent = `${completed}/${total} (${percent}%)`;
                if (barElement) barElement.style.width = `${percent}%`;
            });
        }
    } catch (error) {
        console.error('Error fetching prioritas progress:', error);
    }
}

/**
 * Mengambil dan menampilkan jadwal untuk hari ini.
 */
async function fetchAndDisplayTodaySchedule() {
    const container = document.getElementById('todaySchedule');
    if (!container) return;

    if (!window.userId) {
        container.innerHTML = '<div class="text-accent/50 text-center">Silakan login untuk melihat jadwal Anda.</div>';
        return;
    }

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal`);
        if (response) {
            const allDataJadwal = await response.json();
            const todayString = new Date().toISOString().split('T')[0];

            const dailySchedules = allDataJadwal.filter(item => {
                const itemDate = item.event?.tanggal || item.task?.tanggal;
                return itemDate === todayString;
            });

            dailySchedules.sort((a, b) => {
                const aTime = a.event?.jamMulai || a.task?.jamDeadline;
                const bTime = b.event?.jamMulai || b.task?.jamDeadline;
                return (aTime && bTime) ? aTime.localeCompare(bTime) : 0;
            });

            container.innerHTML = ''; // Kosongkan container
            if (dailySchedules.length === 0) {
                container.innerHTML = '<div class="text-accent/50 text-center">Tidak ada jadwal untuk hari ini.</div>';
            } else {
                dailySchedules.forEach(item => container.appendChild(createScheduleElement(item)));
            }
        }
    } catch (error) {
        console.error("Error fetching today's schedule:", error);
        container.innerHTML = '<div class="text-red-500 text-center">Gagal memuat jadwal.</div>';
    }
}

/**
 * Mengambil dan menampilkan aktivitas (event) yang sedang berlangsung saat ini.
 */
async function fetchAndDisplayOngoingActivities() {
    const container = document.getElementById('ongoingActivitiesContainer');
    if (!container) return;

    if (!window.userId) {
        container.innerHTML = '<div class="text-accent/50 text-center">Tidak ada aktivitas yang sedang berlangsung.</div>';
        return;
    }

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal`);
        if (response) {
            const allDataJadwal = await response.json();
            
            // Dapatkan waktu dan tanggal saat ini
            const now = new Date();
            const todayString = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const currentTime = now.toTimeString().split(' ')[0]; // Format: HH:MM:SS

            const ongoingEvents = allDataJadwal.filter(item => {
                // Pastikan item adalah 'event' dan memiliki data yang diperlukan
                if (!item.event || !item.event.tanggal || !item.event.jamMulai || !item.event.jamAkhir) {
                    return false;
                }

                // Cek apakah event berlangsung hari ini dan sedang dalam rentang waktu
                const isToday = item.event.tanggal === todayString;
                const isTimeCorrect = item.event.jamMulai <= currentTime && item.event.jamAkhir >= currentTime;

                return isToday && isTimeCorrect;
            });

            container.innerHTML = ''; // Kosongkan kontainer
            if (ongoingEvents.length === 0) {
                container.innerHTML = '<div class="text-accent/50 text-center">Tidak ada aktivitas yang sedang berlangsung.</div>';
            } else {
                ongoingEvents.forEach(item => container.appendChild(createScheduleElement(item)));
            }
        }
    } catch (error) {
        console.error("Error fetching ongoing activities:", error);
        container.innerHTML = '<div class="text-red-500 text-center">Gagal memuat aktivitas.</div>';
    }
}



// --- FUNGSI-FUNGSI HANDLER INTERAKSI PENGGUNA ---

/**
 * Menandai task sebagai selesai.
 * @param {string} jadwalId - ID dari data jadwal.
 * @param {string} taskId - ID dari task.
 */
async function handleMarkTaskDone(jadwalId, taskId) {
    if (!window.userId || !jadwalId || !taskId) {
        alert('Informasi task/user tidak lengkap.');
        return;
    }

    try {
        const taskResponse = await window.fetchProtected(`${window.BASE_URL}/tasks/${taskId}`);
        if (!taskResponse) return;
        
        const taskData = await taskResponse.json();
        const updatedTaskData = { ...taskData, status: 'SELESAI' };

        const response = await window.fetchProtected(`${window.BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedTaskData)
        });

        if (response) {
            alert(`Tugas berhasil ditandai selesai!`);
            // Refresh data di dashboard
            fetchAndDisplayTodaySchedule();
            fetchAndDisplayPrioritasProgress();
            recordUserInteraction(); // Catat interaksi untuk streak
        }
    } catch (error) {
        console.error('Error marking task done:', error);
        alert('Gagal menandai tugas selesai.');
    }
}

/**
 * Mencatat interaksi pengguna untuk memperbarui streak.
 */
async function recordUserInteraction() {
    if (!window.userId) return;

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}/record-interaction`, {
            method: 'POST'
        });
        if (response) {
            console.log("Interaksi streak dicatat!");
            fetchAndDisplayStreak(); // Refresh tampilan streak
        }
    } catch (error) {
        console.error('Error recording user interaction:', error);
    }
}


// --- FUNGSI-FUNGSI PEMBANTU (HELPERS) ---

/**
 * Membuat elemen HTML untuk satu item jadwal.
 * @param {object} item - Objek data jadwal dari backend.
 * @returns {HTMLElement} - Elemen div yang siap ditambahkan ke DOM.
 */
function createScheduleElement(item) {
    const flagColorHex = item.prioritas?.color || '#808080';
    const categoryColorHex = item.kategori?.color || '#CCCCCC';
    
    let timeDisplay = '';
    if (item.task) timeDisplay = item.task.jamDeadline;
    else if (item.event) timeDisplay = `${item.event.jamMulai} - ${item.event.jamAkhir}`;

    const isDone = item.task && item.task.status === 'SELESAI';

    const scheduleElement = document.createElement('div');
    scheduleElement.className = "bg-accent-950 flex-col border-[1px] p-3 rounded-[3px] border-accent/10";
    scheduleElement.innerHTML = `
        <div class="flex items-stretch">
            <div class="w-2 rounded-l-md mr-4" style="background-color: ${flagColorHex};"></div>
            <div class="w-full">
                <div class="flex justify-between items-center">
                    <span class="text-accent font-bold lg:text-xl text-lg">${item.judulJadwal}</span>
                    <button class="markDoneBtn bg-accent text-secondary rounded-full px-2 py-1 flex items-center gap-x-1" 
                            data-jadwal-id="${item.idJadwal}" 
                            data-task-id="${item.task?.id || ''}" 
                            data-is-task="${!!item.task}"
                            ${isDone ? 'disabled style="opacity:0.5;"' : ''}>
                        <i class="fa-solid fa-check text-sm"></i>
                        <span class="text-sm font-body">${isDone ? 'Done' : 'Mark Done'}</span>
                    </button>
                </div>
                <p class="lg:text-sm text-[12px]">${item.deskripsiJadwal}</p>
                <div class="flex gap-2 flex-wrap">
                    <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
                        <i class="fa-solid fa-clock text-accent"></i>
                        <span class="text-accent lg:text-sm text-[12px]">${timeDisplay}</span>
                    </div>
                    <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
                        <i class="fa-solid fa-calendar text-accent"></i>
                        <span class="text-accent lg:text-sm text-[12px]">${item.event?.tanggal || item.task?.tanggal || ''}</span>
                    </div>
                    <div class="inline-flex gap-x-2 items-center mt-2" style="background-color:${categoryColorHex}50; border-radius:9999px; padding:0.25rem 0.5rem;">
                        <span class="text-accent lg:text-sm text-[12px] font-semibold">${item.kategori?.namaKategori || ''}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Tambahkan event listener hanya untuk tombol 'Mark Done' pada task yang belum selesai
    const markBtn = scheduleElement.querySelector('.markDoneBtn');
    if (markBtn && markBtn.dataset.isTask === 'true' && !isDone) {
        markBtn.addEventListener('click', function() {
            handleMarkTaskDone(this.dataset.jadwalId, this.dataset.taskId);
        });
    }

    return scheduleElement;
}


// --- EVENT LISTENER UTAMA SAAT DOKUMEN SIAP ---

document.addEventListener('DOMContentLoaded', function() {
    
    // Inisialisasi Tema (Dark/Light Mode)
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const updateIcon = (isDark) => {
            const icon = themeToggle.querySelector('i');
            if(icon) icon.className = isDark ? 'fas fa-sun text-white' : 'fas fa-moon text-accent';
        };

        const applyTheme = (isDark) => {
            html.classList.toggle('dark', isDark);
            updateIcon(isDark);
        };
        
        applyTheme(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));

        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isDark = !html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            applyTheme(isDark);
        });
    }

    // Event Listener untuk Tombol Logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => window.handleLogout());
    }

    // --- Handler untuk Popup "Add New Quest" ---
    const openPopupBtn = document.getElementById('openPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const popupOverlay = document.getElementById('popupOverlay');

    if (openPopupBtn) openPopupBtn.addEventListener('click', () => popupOverlay.classList.remove('hidden'));
    if (closePopupBtn) closePopupBtn.addEventListener('click', () => popupOverlay.classList.add('hidden'));
    if (popupOverlay) popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) popupOverlay.classList.add('hidden');
    });

    // Handler untuk toggle input waktu (Task vs Event) di dalam popup
    const taskTypeRadio = document.getElementById('taskType');
    const eventTypeRadio = document.getElementById('eventType');
    const taskTimeInput = document.getElementById('taskTimeInput');
    const eventTimeInput = document.getElementById('eventTimeInput');

    function toggleTimeInputs() {
        const isTask = taskTypeRadio.checked;
        taskTimeInput.classList.toggle('hidden', !isTask);
        eventTimeInput.classList.toggle('hidden', isTask);
        document.getElementById('deadlineTime').required = isTask;
        document.getElementById('startTime').required = !isTask;
        document.getElementById('endTime').required = !isTask;
    }
    if (taskTypeRadio) taskTypeRadio.addEventListener('change', toggleTimeInputs);
    if (eventTypeRadio) eventTypeRadio.addEventListener('change', toggleTimeInputs);
    toggleTimeInputs(); // Panggil saat inisialisasi

    // Handler untuk form submit "Add New Quest"
    const scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (currentLevel === -1) {
                alert("Silakan pilih level prioritas terlebih dahulu.");
                return;
            }

            const formData = new FormData(scheduleForm);
            const type = formData.get('scheduleType');
            const title = formData.get('title');
            const desc = formData.get('activityDesc');
            const date = formData.get('activityDate');
            const categoryName = formData.get('category');
            const categoryColor = document.getElementById('categoryColorInput').value;
            
            let jamMulai = null, jamAkhir = null, jamDeadline = null, status = "TODO";
            if (type === 'task') {
                jamDeadline = formData.get('deadlineTime');
            } else {
                jamMulai = formData.get('startTime');
                jamAkhir = formData.get('endTime');
            }

            try {
                // Panggil fungsi createQuest dari schedule_db.js
                const questData = await window.createQuest(type, title, desc, date, jamMulai, jamAkhir, jamDeadline, status, categoryName, categoryColor, currentLevel, gemData);

                if (questData && questData.newDataJadwal) {
                    console.log("Quest berhasil dibuat, me-refresh tampilan...");
                    // Refresh data di dashboard
                    await fetchAndDisplayTodaySchedule();
                    await fetchAndDisplayPrioritasProgress();
                    
                    popupOverlay.classList.add('hidden'); // Tutup popup
                    scheduleForm.reset(); // Reset form
                    window.setLevel(currentLevel); // Reset UI slider (klik lagi untuk reset)
                } else {
                    alert("Gagal menambahkan Quest. Periksa console untuk detail.");
                }
            } catch (error) {
                console.error('Error saat submit form:', error);
                alert('Terjadi kesalahan saat memproses quest. Lihat console.');
            }
        });
    }

    // --- Panggilan Fungsi Inisialisasi ---
    // Inisialisasi data dashboard jika pengguna sudah login
    if (window.jwtToken && window.userId) {
        fetchAndDisplayGreeting();
        recordUserInteraction(); // Ini akan memanggil fetchAndDisplayStreak di dalamnya
        fetchAndDisplayPrioritasProgress();
        fetchAndDisplayTodaySchedule();
        fetchAndDisplayOngoingActivities();
    } else {
        // Tampilkan state default jika belum login
        fetchAndDisplayGreeting(); // Tampilkan sapaan default
        fetchAndDisplayStreak(); // Tampilkan pesan login
        fetchAndDisplayPrioritasProgress(); // Tampilkan progress 0%
        fetchAndDisplayTodaySchedule(); // Tampilkan pesan login
        fetchAndDisplayOngoingActivities();
    }
    
    // Inisialisasi UI Slider Prioritas
    const info = document.getElementById("gem-info");
    if (info) info.innerText = "Pilih level prioritas";

    // Refresh ongoing activities
    setInterval(fetchAndDisplayOngoingActivities, 6000);
});