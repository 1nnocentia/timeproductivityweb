// js/script.js

// global variable
// const BASE_URL = 'http://localhost:8080/api';
// let jwtToken = localStorage.getItem('jwtToken') || null;
// let currentUserId = localStorage.getItem('currentUserId') || null;
// const responseDisplay = document.getElementById('response');

// function displayResponse(data, isError = false) {
//     if (responseDisplay) { // Pastikan elemen ada
//         responseDisplay.textContent = JSON.stringify(data, null, 2);
//         responseDisplay.className = `bg-gray-50 p-4 rounded-md border text-sm overflow-x-auto min-h-[100px] ${isError ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}`;
//     } else {
//         console.warn("Element 'response' not found. Logging API response to console instead:", data);
//         console.log(data); // Fallback ke console log
//     }
// }

// // fetch API
// async function fetchProtected(url, options = {}) {
//     if (!jwtToken || !currentUserId) { // Pastikan user ID juga ada
//         displayResponse({ message: 'Please Login' }, true);
//         window.location.href = '../public/login.html'; // Redirect ke halaman login jika tidak login
//         return null;
//     }

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${jwtToken}`,
//         ...options.headers
//     };

//     try {
//         const response = await fetch(url, { ...options, headers });

//         if (response.ok) {
//             return response;
//         } else {
//             const errorData = await response.json().catch(() => response.text());
//             console.error(`HTTP Error ${response.status} from ${url}:`, errorData);
//             displayResponse(errorData, true);
            
//             // Redirect ke login jika 401/403
//             if (response.status === 401 || response.status === 403) {
//                 localStorage.removeItem('jwtToken');
//                 localStorage.removeItem('currentUserId');
//                 jwtToken = null;
//                 currentUserId = null;
//                 window.location.href = '../public/login.html';
//             }
//             throw new Error(`HTTP Error: ${response.status}`);
//         }
//     } catch (error) {
//         console.error('Network or unexpected error:', error);
//         displayResponse({ message: 'Network Error or Server Response Not found' }, true);
//         return null;
//     }
// }
console.log("Cek localStorage jwtToken =", localStorage.getItem('jwtToken'));
console.log("Cek localStorage userId =", localStorage.getItem('userId'));

if (!window.jwtToken || !window.userId) {
    console.warn("⚠️ Token tidak ditemukan. User dianggap belum login.");
} else {
    console.log("✅ Token ditemukan. User dianggap sudah login.");
}

const gemData = [
    {
        active: "/assets/Aset_Aplikasi_Non_critical.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#82E97B',
        description: 'Tasks with low impact that can be done later without causing problems.',
        name: 'Non Critical'
    },

    {
        active: "/assets/Aset_Aplikasi_Perventive.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#7BD6EB',
        description: 'Regular tasks done to avoid bigger issues in the future.',
        name: 'Perventive'
    },
    
    {
        active: "/assets/Aset_Aplikasi_Urgent.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#DC7BEB',
        description: 'Important tasks that should be handled soon to prevent disruption.',
        name: 'Urgent'
    },

    {
        active: "/assets/Aset_Aplikasi_Emergency.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#EC7980',
        description: 'Critical issues that must be fixed immediately to ensure safety or function.',
        name: 'Emergency'
    }
];

let currentLevel = -1;



// Fungsi untuk mendapatkan nama
async function fetchAndDisplayGreeting() {
    const greetingElement = document.getElementById('greetingText');
    if (!greetingElement) {
        console.warn("Element 'greetingText' not found.");
        return;
    }

    if (!window.userId) {
        greetingElement.textContent = 'Good Morning, User!';
        return;
    }

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}`);
        if (response) {
            const userData = await response.json();
            
            const displayName = userData.nama || userData.username;

            if (userData && displayName) {
                greetingElement.textContent = `Good Morning, ${displayName}!`;
            } else {
                // Fallback terakhir jika tidak ada nama atau username
                greetingElement.textContent = 'Good Morning, User!';
            }
        }
    } catch (error) {
        console.error('Error fetching user data for greeting:', error);
        // Fallback jika terjadi error
        greetingElement.textContent = 'Good Morning, User!';
    }
}

// Fungsi untuk mendapatkan data streak dari backend dan menampilkan di UI
async function fetchAndDisplayStreak() {
    const streakDisplayElement = document.getElementById('currentStreakDisplay');
    if (!streakDisplayElement) {
        console.warn("Element 'currentStreakDisplay' not found.");
        return;
    }
    // Menggunakan window.currentUserId dari auth.js
    if (!window.userId) { 
        streakDisplayElement.innerText = 'Login untuk melihat streak';
        return;
    }
    try {
        // Menggunakan window.fetchProtected dari auth.js
        const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}/streak`);
        if (response) {
            const data = await response.json();
            if (data && data.currentStreak !== undefined) {
                streakDisplayElement.innerText = `${data.currentStreak} Days`;
            } else {
                streakDisplayElement.innerText = '0 Days'; // Jika belum ada streak atau data tidak lengkap
            }
        }
    } catch (error) {
        console.error('Error fetching streak:', error);
        streakDisplayElement.innerText = 'Error';
    }
}

// Fungsi untuk mendapatkan data prioritas progres dari backend dan menampilkan di UI
async function fetchAndDisplayPrioritasProgress() {
    // Menggunakan window.currentUserId dari auth.js
    if (!window.userId) {
        // Inisialisasi progress bar ke 0/0 jika belum login
        gemData.forEach(prio => {
            const selectorClass = `progress-${prio.name.toLowerCase().replace(' ', '')}`; // progress-emergency, progress-urgent, etc.
            const textElement = document.querySelector(`.${selectorClass} .progress-text`);
            const barElement = document.querySelector(`.${selectorClass} .progress-bar`);
            const barContainerElement = document.querySelector(`.${selectorClass} div[class*='bg-gem_']`); 

            if (textElement) textElement.textContent = `0/0 (0%)`; // Tampilan awal jika belum login
            if (barElement) barElement.style.width = '0%';
            if (barContainerElement && prio.color) { // Set initial background color of the container
                barContainerElement.style.backgroundColor = `${prio.color}20`; // Opacity in hex
            }
        });
        return;
    }

    try {
        // Menggunakan window.fetchProtected dari auth.js
        const response = await window.fetchProtected(`${window.BASE_URL}/prioritas`); // Mengambil semua prioritas dengan progress
        if (response) {
            const prioritasList = await response.json();
            
            prioritasList.forEach(prioBackend => {
                const total = prioBackend.totalTasks;
                const completed = prioBackend.completedTasks;
                const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

                // Temukan elemen HTML berdasarkan nama prioritas (misal: "Emergency" -> "progress-emergency")
                const selectorClass = `progress-${prioBackend.namaPrioritas.toLowerCase().replace(' ', '')}`;
                const textElement = document.querySelector(`.${selectorClass} .progress-text`);
                const barElement = document.querySelector(`.${selectorClass} .progress-bar`);
                const barBackgroundElement = document.querySelector(`.${selectorClass} div[class*='bg-gem_']`); 
                const imageElement = document.querySelector(`.${selectorClass} img`);

                if (textElement) textElement.textContent = `${completed}/${total} (${percent}%)`;
                
                // Update bar width
                if (barElement) {
                    barElement.style.width = `${percent}%`;
                    if (prioBackend.color) { // Jika backend mengembalikan warna
                        barElement.style.backgroundColor = prioBackend.color; // Set warna bar
                    }
                }
                // Update background container of the bar (e.g., bg-gem_red/20)
                if (barBackgroundElement && prioBackend.color) {
                    // Hapus kelas Tailwind yang hardcoded untuk warna background lama
                    barBackgroundElement.classList.remove('bg-gem_red/20', 'bg-gem_purple/20', 'bg-gem_blue/20', 'bg-gem_green/20');
                    // Terapkan warna baru dengan opasitas
                    barBackgroundElement.style.backgroundColor = `${prioBackend.color}20`; 
                }
                if (imageElement && prioBackend.namaPrioritas) {
                    const priorityNameNormalized = prioBackend.namaPrioritas.toLowerCase().replace(' ', '_');
                    imageElement.src = `/assets/Aset_Aplikasi_${priorityNameNormalized}.png`; // Asumsi nama file gambar sesuai
                }
            });
        }
    } catch (error) {
        console.error('Error fetching prioritas progress:', error);
    }
}

// Fungsi untuk mendapatkan dan menampilkan jadwal hari ini
async function fetchAndDisplayTodaySchedule() {
    const todayScheduleContainer = document.getElementById('todaySchedule');
    if (!todayScheduleContainer) {
        console.warn("Element 'todaySchedule' not found.");
        return;
    }
    if (!window.userId) {
        todayScheduleContainer.innerHTML = '<div class="text-accent/50 text-center">Silakan login untuk melihat jadwal Anda.</div>';
        return;
    }

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal`); // Mengambil semua data jadwal
        if (response) {
            const allDataJadwal = await response.json();
            
            const today = new Date();
            const todayString = today.toISOString().split('T')[0]; // Format "YYYY-MM-DD"

            // Filter jadwal untuk hari ini, dan pastikan event/task yang terkait dimuat
            const dailySchedules = allDataJadwal.filter(item => {
                let itemDate = null;
                // Asumsi backend mengembalikan event/task objek penuh atau setidaknya properti tanggal
                if (item.event && item.event.tanggal) {
                    itemDate = item.event.tanggal;
                } else if (item.task && item.task.tanggal) {
                    itemDate = item.task.tanggal;
                }
                return itemDate === todayString;
            });

            // Urutkan berdasarkan waktu terdekat
            dailySchedules.sort((a, b) => {
                let aTime = null;
                if (a.event && a.event.jamMulai) aTime = a.event.jamMulai;
                else if (a.task && a.task.jamDeadline) aTime = a.task.jamDeadline;

                let bTime = null;
                if (b.event && b.event.jamMulai) bTime = b.event.jamMulai;
                else if (b.task && b.task.jamDeadline) bTime = b.task.jamDeadline;

                if (!aTime || !bTime) return 0;
                return aTime.localeCompare(bTime);
            });

            todayScheduleContainer.innerHTML = ''; // Kosongkan container

            if (dailySchedules.length === 0) {
                todayScheduleContainer.innerHTML = '<div class="text-accent/50 text-center">Tidak ada jadwal untuk hari ini.</div>';
            } else {
                dailySchedules.forEach(item => {
                    // Dapatkan warna bendera dari prioritas (menggunakan prioritas.color dari backend)
                    let flagColorHex = item.prioritas ? item.prioritas.color : '#808080';

                    // Dapatkan warna kategori (menggunakan kategori.color dari backend)
                    let categoryColorHex = item.kategori ? item.kategori.color : '#CCCCCC';

                    let timeDisplay = '';
                    if (item.task) { // Ini adalah task
                        timeDisplay = item.task.jamDeadline;
                    } else if (item.event) { // Ini adalah event
                        timeDisplay = `${item.event.jamMulai} - ${item.event.jamAkhir}`;
                    }

                    const newSchedule = document.createElement('div');
                    newSchedule.className = "bg-accent-950 flex-col border-[1px] p-3 rounded-[3px] border-accent/10";
                    newSchedule.innerHTML = `
                        <div class="flex items-stretch">
                            <div class="w-2 rounded-l-md mr-4" style="background-color: ${flagColorHex};"></div>
                            <div class="w-full">
                                <div class="flex justify-between items-center">
                                    <span class="text-accent font-bold lg:text-xl text-lg">${item.judulJadwal}</span>
                                    <button class="markDoneBtn bg-accent text-secondary rounded-full px-2 py-1 flex items-center gap-x-1" 
                                            data-jadwal-id="${item.idJadwal}" data-task-id="${item.task ? item.task.id : ''}" data-is-task="${item.task ? 'true' : 'false'}"
                                            ${(item.task && item.task.status === 'SELESAI') ? 'disabled style="opacity:0.5;"' : ''}>
                                        <i class="fa-solid fa-check text-sm"></i>
                                        <span class="text-sm font-body">${(item.task && item.task.status === 'SELESAI') ? 'Done' : 'Mark Done'}</span>
                                    </button>
                                </div>
                                <p class="lg:text-sm text-[12px]">${item.deskripsiJadwal}</p>
                                <div class="flex gap-2">
                                    <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
                                        <i class="fa-solid fa-clock text-accent"></i>
                                        <span class="text-accent lg:text-sm text-[12px] ">${timeDisplay}</span>
                                    </div>
                                    <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
                                        <i class="fa-solid fa-calendar text-accent"></i>
                                        <span class="text-accent lg:text-sm text-[12px] ">${item.event ? item.event.tanggal : (item.task ? item.task.tanggal : '')}</span>
                                    </div>
                                    <div class="inline-flex gap-x-2 items-center mt-2" style="background-color:${categoryColorHex}50; border-radius:9999px; padding:0.25rem 0.5rem;">
                                        <span class="text-accent lg:text-sm text-[12px] font-semibold">${item.kategori ? item.kategori.namaKategori : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    todayScheduleContainer.appendChild(newSchedule);

                    // Tambahkan event listener untuk Mark Done
                    const markBtn = newSchedule.querySelector('.markDoneBtn');
                    if (markBtn && markBtn.dataset.isTask === 'true' && markBtn.dataset.jadwalId && markBtn.dataset.taskId) {
                        if (!((item.task && item.task.status === 'SELESAI'))) { // Hanya tambahkan jika belum selesai
                            markBtn.addEventListener('click', async function() {
                                const jadwalId = this.dataset.jadwalId;
                                const taskId = this.dataset.taskId;
                                await handleMarkTaskDone(jadwalId, taskId);
                            });
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error fetching today\'s schedule:', error);
        todayScheduleContainer.innerHTML = '<div class="text-red-500 text-center">Gagal memuat jadwal.</div>';
    }
}

// Fungsi untuk menandai Task Selesai
async function handleMarkTaskDone(jadwalId, taskId) {
    if (!window.userId || !jadwalId || !taskId) {
        alert('Informasi task/user tidak lengkap untuk menandai selesai.');
        return;
    }

    try {
        const taskResponse = await window.fetchProtected(`${window.BASE_URL}/tasks/${taskId}`);
        if (!taskResponse) return;
        const taskData = await taskResponse.json();

        const updatedTaskData = { ...taskData, status: 'SELESAI' }; // Update status task

        const response = await window.fetchProtected(`${window.BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedTaskData)
        });

        if (response) {
            alert(`Task ID ${taskId} ditandai selesai!`);
            fetchAndDisplayTodaySchedule(); // Refresh jadwal
            fetchAndDisplayPrioritasProgress(); // Refresh progress
            recordUserInteraction(); // Catat interaksi streak
        }
    } catch (error) {
        console.error('Error marking task done:', error);
        alert('Gagal menandai task selesai.');
    }
}

// Fungsi untuk mencatat interaksi streak
async function recordUserInteraction() {
    if (!window.userId) {
        console.warn('User ID tidak ditemukan. Streak tidak dicatat.');
        return;
    }
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}/record-interaction`, {
            method: 'POST'
        });
        if (response) {
            const data = await response.json();
            console.log("Interaksi streak dicatat!", data);
            fetchAndDisplayStreak(); // Refresh tampilan streak
        }
    } catch (error) {
        console.error('Error recording user interaction:', error);
    }
}


// --- FUNGSI API untuk Create/Get Data Jadwal (Dipindahkan dari schedule_db.js) ---
async function getKategoriByName(name) {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/kategori`);
        if (response) {
            const allKategoris = await response.json();
            return allKategoris.find(k => k.namaKategori.toLowerCase() === name.toLowerCase());
        }
        return null;
    } catch (error) {
        console.error("Error fetching kategori by name:", error);
        return null;
    }
}

async function createKategoriBackend(namaKategori, color) {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/kategori`, {
            method: 'POST',
            body: JSON.stringify({ namaKategori, color })
        });
        if (response) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Error creating kategori backend:", error);
        return null;
    }
}

async function getPrioritasByName(name) {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/prioritas`);
        if (response) {
            const allPrioritas = await response.json();
            return allPrioritas.find(p => p.namaPrioritas.toLowerCase() === name.toLowerCase());
        }
        return null;
    } catch (error) {
        console.error("Error fetching prioritas by name:", error);
        return null;
    }
}

async function createPrioritasBackend(namaPrioritas, color) {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/prioritas`, {
            method: 'POST',
            body: JSON.stringify({ namaPrioritas, color })
        });
        if (response) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Error creating prioritas backend:", error);
        return null;
    }
}

async function createEventBackend(tanggal, jamMulai, jamAkhir) {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/events`, {
            method: 'POST',
            body: JSON.stringify({ tanggal, jamMulai, jamAkhir })
        });
        if (response) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error creating event backend:', error);
        return null;
    }
}

async function createTaskBackend(tanggal, jamDeadline, status) {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/tasks`, {
            method: 'POST',
            body: JSON.stringify({ tanggal, jamDeadline, status })
        });
        if (response) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error creating task backend:', error);
        return null;
    }
}

async function createDataJadwalBackend(judulJadwal, deskripsiJadwal, eventId, taskId, kategoriId, prioritasId) {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal`, {
            method: 'POST',
            body: JSON.stringify({
                judulJadwal,
                deskripsiJadwal,
                eventId,
                taskId,
                kategoriId,
                prioritasId
            })
        });
        if (response) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error creating Data Jadwal backend:', error);
        return null;
    }
}

// Fungsi `createQuest` yang dipanggil dari `scheduleForm.addEventListener`
async function createQuest(type, title, desc, date, jamMulai, jamAkhir, jamDeadline, status, categoryName, categoryColor, currentLevel, gemData) {
    let kategoriId = null;
    let prioritasId = null;
    let eventId = null;
    let taskId = null;

    try {
        let existingKategori = await getKategoriByName(categoryName);
        if (existingKategori) {
            kategoriId = existingKategori.id;
        } else {
            const newKategori = await createKategoriBackend(categoryName, categoryColor);
            if (newKategori) kategoriId = newKategori.id;
        }

        const priorityName = gemData[currentLevel].name; // Menggunakan 'name' dari gemData
        let existingPrioritas = await getPrioritasByName(priorityName);
        if (existingPrioritas) {
            prioritasId = existingPrioritas.id;
        } else if (currentLevel !== -1) {
            const newPrioritas = await createPrioritasBackend(priorityName, gemData[currentLevel].color);
            if (newPrioritas) prioritasId = newPrioritas.id;
        }

        if (type === 'event') {
            const newEvent = await createEventBackend(date, jamMulai, jamAkhir);
            if (newEvent) eventId = newEvent.id;
        } else if (type === 'task') {
            const newTask = await createTaskBackend(date, jamDeadline, status);
            if (newTask) taskId = newTask.id;
        }

        if (((type === 'event' && eventId) || (type === 'task' && taskId)) && kategoriId && prioritasId) {
            const newDataJadwal = await createDataJadwalBackend(title, desc, eventId, taskId, kategoriId, prioritasId);
            if (newDataJadwal) {
                // Catat interaksi streak setiap kali quest berhasil dibuat
                await recordUserInteraction(); // Panggil fungsi untuk mencatat streak

                return { newDataJadwal }; 
            }
        }
        return null;
    } catch (error) {
        console.error('Error in createQuest logic:', error);
        throw error;
    }
}


// --- DOMContentLoaded Event Listener ---
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi awal UI

    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            html.classList.add('dark');
            updateIcon(true);
        } else {
            html.classList.remove('dark');
            updateIcon(false);
        }
        function updateIcon(isDark) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (isDark) {
                    icon.className = 'fas fa-sun text-white'; // Sesuaikan kelas Tailwind jika perlu
                } else {
                    icon.className = 'fas fa-moon text-accent'; // Sesuaikan kelas Tailwind jika perlu
                }
            }
        }
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
        }
        themeToggle.addEventListener('click', function(e) { e.preventDefault(); toggleTheme(); });
    }

    // Ambil tombol logout
    const logoutButton = document.getElementById('logoutButton'); 
    if (logoutButton) {
        // Tambahkan event listener untuk tombol logout
        logoutButton.addEventListener('click', async function() {
            // Panggil handleLogout dari auth.js (yang sudah global)
            await handleLogout();
        });
    } else {
        console.warn("Logout button not found.");
    }


    const openPopupBtn = document.getElementById('openPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const popupOverlay = document.getElementById('popupOverlay');

    if (openPopupBtn) {
        openPopupBtn.addEventListener('click', function() { if (popupOverlay) popupOverlay.classList.remove('hidden'); });
    }
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function() { if (popupOverlay) popupOverlay.classList.add('hidden'); });
    }
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) { if (e.target === popupOverlay) { popupOverlay.classList.add('hidden'); } });
    }

    const taskTypeRadio = document.getElementById('taskType');
    const eventTypeRadio = document.getElementById('eventType');
    const taskTimeInput = document.getElementById('taskTimeInput');
    const eventTimeInput = document.getElementById('eventTimeInput');
    const deadlineTimeInput = document.getElementById('deadlineTime');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');

    function toggleTimeInputs() {
        if (taskTypeRadio && eventTypeRadio && taskTimeInput && eventTimeInput && deadlineTimeInput && startTimeInput && endTimeInput) {
            if (taskTypeRadio.checked) {
                taskTimeInput.classList.remove('hidden');
                eventTimeInput.classList.add('hidden');
                deadlineTimeInput.required = true;
                startTimeInput.required = false;
                endTimeInput.required = false;
            } else {
                taskTimeInput.classList.add('hidden');
                eventTimeInput.classList.remove('hidden');
                deadlineTimeInput.required = false;
                startTimeInput.required = true;
                endTimeInput.required = true;
            }
        } else {
            console.warn("One or more time input elements for toggleTimeInputs not found.");
        }
    }
    toggleTimeInputs();
    if (taskTypeRadio) taskTypeRadio.addEventListener('change', toggleTimeInputs);
    if (eventTypeRadio) eventTypeRadio.addEventListener('change', toggleTimeInputs);

    const info = document.getElementById("gem-info");
    if (info) { info.innerText = "Pilih level prioritas"; } else { console.warn("Element with ID 'gem-info' not found."); }
    for (let i = 0; i < gemData.length; i++) {
        const gemImage = document.getElementById(`gem-${i}`);
        if (gemImage) { gemImage.src = gemData[i].inactive; } else { console.warn(`Element with ID 'gem-${i}' not found.`); }
    }
    const sliderFill = document.getElementById("slider-fill");
    if (sliderFill) { sliderFill.style.width = `0%`; sliderFill.style.backgroundColor = 'transparent'; } else { console.warn("Element with ID 'slider-fill' not found."); }
    currentLevel = -1;
    
    const moreButtons = document.querySelectorAll('.moreButton');
    moreButtons.forEach(button => { button.addEventListener('click', function (e) { e.preventDefault(); alert('Coming Soon!'); }); });

    // FORM SUBMIT (Popup "Add New Quest")
    const scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', async function(e){
            e.preventDefault();

            const type = document.querySelector('input[name="scheduleType"]:checked').value;
            const title = document.getElementById('activityTitle').value;
            const desc = document.getElementById('activityDescription').value;
            const date = document.getElementById('activityDate').value;
            const categoryName = document.getElementById('categoryInput').value;
            const categoryColor = document.getElementById('categoryColorInput').value;
            let jamMulai = null, jamAkhir = null, jamDeadline = null, status = "TODO";
            
            if (type === 'task') {
                jamDeadline = document.getElementById('deadlineTime').value;
            } else {
                jamMulai = document.getElementById('startTime').value;
                jamAkhir = document.getElementById('endTime').value;
            }

            try {
                // Panggil createQuest untuk mengirim data ke backend.
                // Fungsi ini akan membuat Task/Event, Kategori, Prioritas, lalu DataJadwal.
                const questData = await createQuest(type, title, desc, date, jamMulai, jamAkhir, jamDeadline, status, categoryName, categoryColor, currentLevel, gemData);

                // Cek apakah backend mengembalikan data yang valid.
                if (questData && questData.newDataJadwal) {
                    console.log("Quest berhasil dibuat, me-refresh tampilan...");
                    
                    // Panggil fungsi untuk memperbarui tampilan jadwal hari ini.
                    await fetchAndDisplayTodaySchedule();
                    
                    // Panggil juga fungsi untuk update progress bar.
                    await fetchAndDisplayPrioritasProgress();

                    // Tutup popup setelah berhasil
                    const popupOverlay = document.getElementById('popupOverlay');
                    if (popupOverlay) popupOverlay.classList.add('hidden');
                    
                } else {
                    alert("Gagal menambahkan Quest. Periksa console untuk detail.");
                }

            } catch (error) {
                console.error('Error saat submit form:', error);
                alert('Terjadi kesalahan kritis saat memproses quest. Lihat console.');
            }

            // Reset form & UI tidak peduli berhasil atau gagal
            scheduleForm.reset();
            // ... kode reset slider prioritas Anda ...
        });
    }


    // Calendar/Date Grid (dari scriptDashboard.js asli)
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let selectedDate = new Date();
    
    function renderCalendar(year, month) {
        // Placeholder for calendar rendering logic
    }

    let selectedYear = new Date().getFullYear();
    let selectedMonth = new Date().getMonth();

    function showYearView() {
        const yearView = document.getElementById('year-view');
        const monthView = document.getElementById('month-view');
        const dateGrid = document.getElementById('dateGrid');
        if (yearView) yearView.classList.remove('hidden');
        if (monthView) monthView.classList.add('hidden');
        if (dateGrid) dateGrid.classList.add('hidden');
    }

    function showMonthsForYear(year) {
        selectedYear = year;
        updateCalendarTitle();
        const yearView = document.getElementById('year-view');
        const monthView = document.getElementById('month-view');
        const dateGrid = document.getElementById('dateGrid');
        if (yearView) yearView.classList.add('hidden');
        if (monthView) monthView.classList.remove('hidden');
        if (dateGrid) dateGrid.classList.add('hidden');
    }

    function showMonthDates(monthIdx) {
        selectedMonth = monthIdx;
        updateCalendarTitle();
        const monthView = document.getElementById('month-view');
        const dateGrid = document.getElementById('dateGrid');
        if (monthView) monthView.classList.add('hidden');
        if (dateGrid) dateGrid.classList.remove('hidden');
        renderDateGrid(selectedYear, selectedMonth);
    }

    function updateCalendarTitle() {
        const calendarTitle = document.getElementById('calendar-title');
        if (calendarTitle) {
            calendarTitle.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
        }
    }

    function renderDateGrid(year, month) {
        // Your actual calendar rendering logic goes here
    }

    if (document.getElementById('calendar-title')) {
        updateCalendarTitle();
    }


    // --- Panggilan Fungsi Inisialisasi Data dari Backend ---
    // Panggil saat DOMContentLoaded untuk memuat data awal
    // Menggunakan window.jwtToken dan window.currentUserId dari auth.js
    if (window.jwtToken && window.userId) { 
        recordUserInteraction();
        fetchAndDisplayStreak();
        fetchAndDisplayPrioritasProgress();
        fetchAndDisplayTodaySchedule();
    } else {
        // Jika belum login, tampilkan pesan atau redirect
        const streakDisplayElement = document.getElementById('currentStreakDisplay');
        if (streakDisplayElement) {
            streakDisplayElement.innerText = 'Login First';
        }
        const todayScheduleContainer = document.getElementById('todaySchedule');
        if (todayScheduleContainer) {
            todayScheduleContainer.innerHTML = '<div class="text-accent/50 text-center">Login for tracking your schedule</div>';
        }
        // Atur progress bar ke 0% jika belum login
        gemData.forEach(prio => {
            const selectorClass = `progress-${prio.name.toLowerCase().replace(' ', '')}`;
            const textElement = document.querySelector(`.${selectorClass} .progress-text`);
            const barElement = document.querySelector(`.${selectorClass} .progress-bar`);
            if (textElement) textElement.textContent = `0/0`;
            if (barElement) barElement.style.width = '0%';
        });
    }
});

// window.setLevel = function(level) {
//     if (currentLevel === level) {
//         return;
//     }

//     const fillWidths = [5, 35, 70, 100];
//     const sliderFill = document.getElementById("slider-fill");
//     if (sliderFill) {
//         sliderFill.style.width = `${fillWidths[level]}%`;
//         sliderFill.style.backgroundColor = gemData[level].color;
//     }

//     for (let i = 0; i < gemData.length; i++) {
//         const gemImage = document.getElementById(`gem-${i}`);
//         if (gemImage) {
//             if (i === level) {
//                 gemImage.src = gemData[i].active;
//             } else {
//                 gemImage.src = gemData[i].inactive;
//             }
//         }
//     }

//     const info = document.getElementById("gem-info");
//     if (info) {
//         info.innerText = `${gemData[level].description}`;
//         info.style.color = gemData[level].color;
//     }
    
//     currentLevel = level;
// }

// // --- FUNGSI API untuk Data Dashboard (Dipanggil dari DOMContentLoaded) ---

// // Fungsi untuk mendapatkan data streak dari backend dan menampilkan di UI
// async function fetchAndDisplayStreak() {
//     const streakDisplayElement = document.getElementById('currentStreakDisplay');
//     if (!streakDisplayElement) {
//         console.warn("Element 'currentStreakDisplay' not found.");
//         return;
//     }
//     // Menggunakan window.currentUserId dari auth.js
//     if (!window.currentUserId) { 
//         streakDisplayElement.innerText = 'Login untuk melihat streak';
//         return;
//     }
//     try {
//         // Menggunakan window.fetchProtected dari auth.js
//         const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.currentUserId}/streak`);
//         if (response) {
//             const data = await response.json();
//             if (data && data.currentStreak !== undefined) {
//                 streakDisplayElement.innerText = `${data.currentStreak} Days`;
//             } else {
//                 streakDisplayElement.innerText = '0 Days'; // Jika belum ada streak atau data tidak lengkap
//             }
//         }
//     } catch (error) {
//         console.error('Error fetching streak:', error);
//         streakDisplayElement.innerText = 'Error';
//     }
// }

// // Fungsi untuk mendapatkan data prioritas progres dari backend dan menampilkan di UI
// async function fetchAndDisplayPrioritasProgress() {
//     const prioritasProgressList = document.getElementById('prioritas-progress-list'); // Ini adalah div parent
//     if (!prioritasProgressList) {
//         console.warn("Element 'prioritas-progress-list' not found.");
//         return;
//     }
//     // Menggunakan window.currentUserId dari auth.js
//     if (!window.currentUserId) {
//         // Inisialisasi progress bar ke 0/0 jika belum login
//         gemData.forEach(prio => {
//             const selectorClass = `progress-${prio.name.toLowerCase().replace(' ', '')}`; // progress-emergency, progress-urgent, etc.
//             const textElement = document.querySelector(`.${selectorClass} .progress-text`);
//             const barElement = document.querySelector(`.${selectorClass} .progress-bar`);
//             const barContainerElement = document.querySelector(`.${selectorClass} div[class*='bg-gem_']`); 

//             if (textElement) textElement.textContent = `0/0`;
//             if (barElement) barElement.style.width = '0%';
//             if (barContainerElement && prio.color) { // Set initial background color of the container
//                 barContainerElement.style.backgroundColor = `${prio.color}20`; // Opacity in hex
//             }
//         });
//         return;
//     }

//     try {
//         // Menggunakan window.fetchProtected dari auth.js
//         const response = await window.fetchProtected(`${window.BASE_URL}/prioritas`); // Mengambil semua prioritas dengan progress
//         if (response) {
//             const prioritasList = await response.json();
            
//             prioritasList.forEach(prioBackend => {
//                 const total = prioBackend.totalTasks;
//                 const completed = prioBackend.completedTasks;
//                 const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

//                 // Temukan elemen HTML berdasarkan nama prioritas (misal: "Emergency" -> "progress-emergency")
//                 const selectorClass = `progress-${prioBackend.namaPrioritas.toLowerCase().replace(' ', '')}`;
//                 const textElement = document.querySelector(`.${selectorClass} .progress-text`);
//                 const barElement = document.querySelector(`.${selectorClass} .progress-bar`);
//                 const barBackgroundElement = document.querySelector(`.${selectorClass} div[class*='bg-gem_']`); 
//                 const imageElement = document.querySelector(`.${selectorClass} img`);


//                 // Update text
//                 if (textElement) textElement.textContent = `${completed}/${total}`;
//                 // Update bar width
//                 if (barElement) {
//                     barElement.style.width = `${percent}%`;
//                     if (prioBackend.color) { // Jika backend mengembalikan warna
//                         barElement.style.backgroundColor = prioBackend.color; // Set warna bar
//                     }
//                 }
//                 // Update background container of the bar (e.g., bg-gem_red/20)
//                 if (barBackgroundElement && prioBackend.color) {
//                     // Hapus kelas Tailwind yang hardcoded untuk warna background lama
//                     barBackgroundElement.classList.remove('bg-gem_red/20', 'bg-gem_purple/20', 'bg-gem_blue/20', 'bg-gem_green/20');
//                     // Terapkan warna baru dengan opasitas
//                     barBackgroundElement.style.backgroundColor = `${prioBackend.color}20`; 
//                 }
//                 // Update gambar prioritas (opsional, jika Anda ingin gambar berubah dinamis)
//                 if (imageElement && prioBackend.namaPrioritas) {
//                     const priorityNameNormalized = prioBackend.namaPrioritas.toLowerCase().replace(' ', '_');
//                     imageElement.src = `/assets/Aset_Aplikasi_${priorityNameNormalized}.png`; // Asumsi nama file gambar sesuai
//                 }
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching prioritas progress:', error);
//     }
// }

// // Fungsi untuk mendapatkan dan menampilkan jadwal hari ini
// async function fetchAndDisplayTodaySchedule() {
//     const todayScheduleContainer = document.getElementById('todaySchedule');
//     if (!todayScheduleContainer) {
//         console.warn("Element 'todaySchedule' not found.");
//         return;
//     }
//     if (!window.currentUserId) {
//         todayScheduleContainer.innerHTML = '<div class="text-accent/50 text-center">Silakan login untuk melihat jadwal Anda.</div>';
//         return;
//     }

//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal`); // Mengambil semua data jadwal
//         if (response) {
//             const allDataJadwal = await response.json();
            
//             const today = new Date();
//             const todayString = today.toISOString().split('T')[0]; // Format "YYYY-MM-DD"

//             // Filter jadwal untuk hari ini, dan pastikan event/task yang terkait dimuat
//             const dailySchedules = allDataJadwal.filter(item => {
//                 let itemDate = null;
//                 // Asumsi backend mengembalikan event/task objek penuh atau setidaknya properti tanggal
//                 if (item.event && item.event.tanggal) {
//                     itemDate = item.event.tanggal;
//                 } else if (item.task && item.task.tanggal) {
//                     itemDate = item.task.tanggal;
//                 }
//                 return itemDate === todayString;
//             });

//             // Urutkan berdasarkan waktu terdekat
//             dailySchedules.sort((a, b) => {
//                 let aTime = null;
//                 if (a.event && a.event.jamMulai) aTime = a.event.jamMulai;
//                 else if (a.task && a.task.jamDeadline) aTime = a.task.jamDeadline;

//                 let bTime = null;
//                 if (b.event && b.event.jamMulai) bTime = b.event.jamMulai;
//                 else if (b.task && b.task.jamDeadline) bTime = b.task.jamDeadline;

//                 if (!aTime || !bTime) return 0;
//                 return aTime.localeCompare(bTime);
//             });

//             todayScheduleContainer.innerHTML = ''; // Kosongkan container

//             if (dailySchedules.length === 0) {
//                 todayScheduleContainer.innerHTML = '<div class="text-accent/50 text-center">Tidak ada jadwal untuk hari ini.</div>';
//             } else {
//                 dailySchedules.forEach(item => {
//                     // Dapatkan warna bendera dari prioritas (menggunakan prioritas.color dari backend)
//                     let flagColorHex = item.prioritas ? item.prioritas.color : '#808080';

//                     // Dapatkan warna kategori (menggunakan kategori.color dari backend)
//                     let categoryColorHex = item.kategori ? item.kategori.color : '#CCCCCC';

//                     let timeDisplay = '';
//                     if (item.task) { // Ini adalah task
//                         timeDisplay = item.task.jamDeadline;
//                     } else if (item.event) { // Ini adalah event
//                         timeDisplay = `${item.event.jamMulai} - ${item.event.jamAkhir}`;
//                     }

//                     const newSchedule = document.createElement('div');
//                     newSchedule.className = "bg-accent-950 flex-col border-[1px] p-3 rounded-[3px] border-accent/10";
//                     newSchedule.innerHTML = `
//                         <div class="flex items-stretch">
//                             <div class="w-2 rounded-l-md mr-4" style="background-color: ${flagColorHex};"></div>
//                             <div class="w-full">
//                                 <div class="flex justify-between items-center">
//                                     <span class="text-accent font-bold lg:text-xl text-lg">${item.judulJadwal}</span>
//                                     <button class="markDoneBtn bg-accent text-secondary rounded-full px-2 py-1 flex items-center gap-x-1" 
//                                             data-jadwal-id="${item.idJadwal}" data-task-id="${item.task ? item.task.id : ''}" data-is-task="${item.task ? 'true' : 'false'}"
//                                             ${(item.task && item.task.status === 'SELESAI') ? 'disabled style="opacity:0.5;"' : ''}>
//                                         <i class="fa-solid fa-check text-sm"></i>
//                                         <span class="text-sm font-body">${(item.task && item.task.status === 'SELESAI') ? 'Done' : 'Mark Done'}</span>
//                                     </button>
//                                 </div>
//                                 <p class="lg:text-sm text-[12px]">${item.deskripsiJadwal}</p>
//                                 <div class="flex gap-2">
//                                     <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
//                                         <i class="fa-solid fa-clock text-accent"></i>
//                                         <span class="text-accent lg:text-sm text-[12px] ">${timeDisplay}</span>
//                                     </div>
//                                     <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
//                                         <i class="fa-solid fa-calendar text-accent"></i>
//                                         <span class="text-accent lg:text-sm text-[12px] ">${item.event ? item.event.tanggal : (item.task ? item.task.tanggal : '')}</span>
//                                     </div>
//                                     <div class="inline-flex gap-x-2 items-center mt-2" style="background-color:${categoryColorHex}50; border-radius:9999px; padding:0.25rem 0.5rem;">
//                                         <span class="text-accent lg:text-sm text-[12px] font-semibold">${item.kategori ? item.kategori.namaKategori : ''}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     `;
//                     todayScheduleContainer.appendChild(newSchedule);

//                     // Tambahkan event listener untuk Mark Done
//                     const markBtn = newSchedule.querySelector('.markDoneBtn');
//                     if (markBtn && markBtn.dataset.isTask === 'true' && markBtn.dataset.jadwalId && markBtn.dataset.taskId) {
//                         if (!((item.task && item.task.status === 'SELESAI'))) { // Hanya tambahkan jika belum selesai
//                             markBtn.addEventListener('click', async function() {
//                                 const jadwalId = this.dataset.jadwalId;
//                                 const taskId = this.dataset.taskId;
//                                 await handleMarkTaskDone(jadwalId, taskId);
//                             });
//                         }
//                     }
//                 });
//             }
//         }
//     } catch (error) {
//         console.error('Error fetching today\'s schedule:', error);
//         todayScheduleContainer.innerHTML = '<div class="text-red-500 text-center">Gagal memuat jadwal.</div>';
//     }
// }

// // Fungsi untuk menandai Task Selesai
// async function handleMarkTaskDone(jadwalId, taskId) {
//     if (!window.currentUserId || !jadwalId || !taskId) {
//         alert('Informasi task/user tidak lengkap untuk menandai selesai.');
//         return;
//     }

//     try {
//         const taskResponse = await window.fetchProtected(`${window.BASE_URL}/tasks/${taskId}`);
//         if (!taskResponse) return;
//         const taskData = await taskResponse.json();

//         const updatedTaskData = { ...taskData, status: 'SELESAI' }; // Update status task

//         const response = await window.fetchProtected(`${window.BASE_URL}/tasks/${taskId}`, {
//             method: 'PUT',
//             body: JSON.stringify(updatedTaskData)
//         });

//         if (response) {
//             alert(`Task ID ${taskId} ditandai selesai!`);
//             fetchAndDisplayTodaySchedule(); // Refresh jadwal
//             fetchAndDisplayPrioritasProgress(); // Refresh progress
//             recordUserInteraction(); // Catat interaksi streak
//         }
//     } catch (error) {
//         console.error('Error marking task done:', error);
//         alert('Gagal menandai task selesai.');
//     }
// }

// // Fungsi untuk mencatat interaksi streak
// async function recordUserInteraction() {
//     if (!window.currentUserId) {
//         console.warn('User ID tidak ditemukan. Streak tidak dicatat.');
//         return;
//     }
//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.currentUserId}/record-interaction`, {
//             method: 'POST'
//         });
//         if (response) {
//             const data = await response.json();
//             console.log("Interaksi streak dicatat!", data);
//             fetchAndDisplayStreak(); // Refresh tampilan streak
//         }
//     } catch (error) {
//         console.error('Error recording user interaction:', error);
//     }
// }


// // --- FUNGSI API untuk Create/Get Data Jadwal (Dipindahkan dari schedule_db.js) ---
// async function getKategoriByName(name) {
//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/kategori`);
//         if (response) {
//             const allKategoris = await response.json();
//             return allKategoris.find(k => k.namaKategori.toLowerCase() === name.toLowerCase());
//         }
//         return null;
//     } catch (error) {
//         console.error("Error fetching kategori by name:", error);
//         return null;
//     }
// }

// async function createKategoriBackend(namaKategori, color) {
//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/kategori`, {
//             method: 'POST',
//             body: JSON.stringify({ namaKategori, color })
//         });
//         if (response) {
//             return await response.json();
//         }
//         return null;
//     } catch (error) {
//         console.error("Error creating kategori backend:", error);
//         return null;
//     }
// }

// async function getPrioritasByName(name) {
//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/prioritas`);
//         if (response) {
//             const allPrioritas = await response.json();
//             return allPrioritas.find(p => p.namaPrioritas.toLowerCase() === name.toLowerCase());
//         }
//         return null;
//     } catch (error) {
//         console.error("Error fetching prioritas by name:", error);
//         return null;
//     }
// }

// async function createPrioritasBackend(namaPrioritas, color) {
//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/prioritas`, {
//             method: 'POST',
//             body: JSON.stringify({ namaPrioritas, color })
//         });
//         if (response) {
//             return await response.json();
//         }
//         return null;
//     } catch (error) {
//         console.error("Error creating prioritas backend:", error);
//         return null;
//     }
// }

// async function createEventBackend(tanggal, jamMulai, jamAkhir) {
//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/events`, {
//             method: 'POST',
//             body: JSON.stringify({ tanggal, jamMulai, jamAkhir })
//         });
//         if (response) {
//             return await response.json();
//         }
//         return null;
//     } catch (error) {
//         console.error('Error creating event backend:', error);
//         return null;
//     }
// }

// async function createTaskBackend(tanggal, jamDeadline, status) {
//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/tasks`, {
//             method: 'POST',
//             body: JSON.stringify({ tanggal, jamDeadline, status })
//         });
//         if (response) {
//             return await response.json();
//         }
//         return null;
//     } catch (error) {
//         console.error('Error creating task backend:', error);
//         return null;
//     }
// }

// async function createDataJadwalBackend(judulJadwal, deskripsiJadwal, eventId, taskId, kategoriId, prioritasId) {
//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal`, {
//             method: 'POST',
//             body: JSON.stringify({
//                 judulJadwal,
//                 deskripsiJadwal,
//                 eventId,
//                 taskId,
//                 kategoriId,
//                 prioritasId
//             })
//         });
//         if (response) {
//             return await response.json();
//         }
//         return null;
//     } catch (error) {
//         console.error('Error creating Data Jadwal backend:', error);
//         return null;
//     }
// }

// // Fungsi `createQuest` yang dipanggil dari `scheduleForm.addEventListener`
// async function createQuest(type, title, desc, date, jamMulai, jamAkhir, jamDeadline, status, categoryName, categoryColor, currentLevel, gemData) {
//     let kategoriId = null;
//     let prioritasId = null;
//     let eventId = null;
//     let taskId = null;

//     try {
//         let existingKategori = await getKategoriByName(categoryName);
//         if (existingKategori) {
//             kategoriId = existingKategori.id;
//         } else {
//             const newKategori = await createKategoriBackend(categoryName, categoryColor);
//             if (newKategori) kategoriId = newKategori.id;
//         }

//         const priorityName = gemData[currentLevel].name; // Menggunakan 'name' dari gemData
//         let existingPrioritas = await getPrioritasByName(priorityName);
//         if (existingPrioritas) {
//             prioritasId = existingPrioritas.id;
//         } else if (currentLevel !== -1) {
//             const newPrioritas = await createPrioritasBackend(priorityName, gemData[currentLevel].color);
//             if (newPrioritas) prioritasId = newPrioritas.id;
//         }

//         if (type === 'event') {
//             const newEvent = await createEventBackend(date, jamMulai, jamAkhir);
//             if (newEvent) eventId = newEvent.id;
//         } else if (type === 'task') {
//             const newTask = await createTaskBackend(date, jamDeadline, status);
//             if (newTask) taskId = newTask.id;
//         }

//         if (((type === 'event' && eventId) || (type === 'task' && taskId)) && kategoriId && prioritasId) {
//             const newDataJadwal = await createDataJadwalBackend(title, desc, eventId, taskId, kategoriId, prioritasId);
//             if (newDataJadwal) {
//                 // Catat interaksi streak setiap kali quest berhasil dibuat
//                 await recordUserInteraction(); // Panggil fungsi untuk mencatat streak

//                 return { newDataJadwal }; 
//             }
//         }
//         return null;
//     } catch (error) {
//         console.error('Error in createQuest logic:', error);
//         throw error;
//     }
// }


// // --- DOMContentLoaded Event Listener ---
// document.addEventListener('DOMContentLoaded', function() {
//     // Inisialisasi awal UI
//     const themeToggle = document.getElementById('themeToggle');
//     const html = document.documentElement;
//     if (themeToggle) {
//         const savedTheme = localStorage.getItem('theme');
//         const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//         if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
//             html.classList.add('dark');
//             updateIcon(true);
//         } else {
//             html.classList.remove('dark');
//             updateIcon(false);
//         }
//         function updateIcon(isDark) {
//             const icon = themeToggle.querySelector('i');
//             if (icon) {
//                 if (isDark) {
//                     icon.className = 'fas fa-sun text-white'; // Sesuaikan kelas Tailwind jika perlu
//                 } else {
//                     icon.className = 'fas fa-moon text-accent'; // Sesuaikan kelas Tailwind jika perlu
//                 }
//             }
//         }
//         function toggleTheme() {
//             const isDark = html.classList.contains('dark');
//             if (isDark) {
//                 html.classList.remove('dark');
//                 localStorage.setItem('theme', 'light');
//                 updateIcon(false);
//             } else {
//                 html.classList.add('dark');
//                 localStorage.setItem('theme', 'dark');
//                 updateIcon(true);
//             }
//         }
//         themeToggle.addEventListener('click', function(e) { e.preventDefault(); toggleTheme(); });
//     }

//     // Ambil tombol logout
//     const logoutButton = document.getElementById('logoutButton'); 
//     if (logoutButton) {
//         // Tambahkan event listener untuk tombol logout
//         logoutButton.addEventListener('click', async function() {
//             // Panggil handleLogout dari auth.js (yang sudah global)
//             await handleLogout();
//         });
//     } else {
//         console.warn("Logout button not found.");
//     }


//     const openPopupBtn = document.getElementById('openPopup');
//     const closePopupBtn = document.getElementById('closePopup');
//     const popupOverlay = document.getElementById('popupOverlay');

//     if (openPopupBtn) {
//         openPopupBtn.addEventListener('click', function() { if (popupOverlay) popupOverlay.classList.remove('hidden'); });
//     }
//     if (closePopupBtn) {
//         closePopupBtn.addEventListener('click', function() { if (popupOverlay) popupOverlay.classList.add('hidden'); });
//     }
//     if (popupOverlay) {
//         popupOverlay.addEventListener('click', function(e) { if (e.target === popupOverlay) { popupOverlay.classList.add('hidden'); } });
//     }

//     const taskTypeRadio = document.getElementById('taskType');
//     const eventTypeRadio = document.getElementById('eventType');
//     const taskTimeInput = document.getElementById('taskTimeInput');
//     const eventTimeInput = document.getElementById('eventTimeInput');
//     const deadlineTimeInput = document.getElementById('deadlineTime');
//     const startTimeInput = document.getElementById('startTime');
//     const endTimeInput = document.getElementById('endTime');

//     function toggleTimeInputs() {
//         if (taskTypeRadio && eventTypeRadio && taskTimeInput && eventTimeInput && deadlineTimeInput && startTimeInput && endTimeInput) {
//             if (taskTypeRadio.checked) {
//                 taskTimeInput.classList.remove('hidden');
//                 eventTimeInput.classList.add('hidden');
//                 deadlineTimeInput.required = true;
//                 startTimeInput.required = false;
//                 endTimeInput.required = false;
//             } else {
//                 taskTimeInput.classList.add('hidden');
//                 eventTimeInput.classList.remove('hidden');
//                 deadlineTimeInput.required = false;
//                 startTimeInput.required = true;
//                 endTimeInput.required = true;
//             }
//         } else {
//             console.warn("One or more time input elements for toggleTimeInputs not found.");
//         }
//     }
//     toggleTimeInputs();
//     if (taskTypeRadio) taskTypeRadio.addEventListener('change', toggleTimeInputs);
//     if (eventTypeRadio) eventTypeRadio.addEventListener('change', toggleTimeInputs);

//     const info = document.getElementById("gem-info");
//     if (info) { info.innerText = "Pilih level prioritas"; } else { console.warn("Element with ID 'gem-info' not found."); }
//     for (let i = 0; i < gemData.length; i++) {
//         const gemImage = document.getElementById(`gem-${i}`);
//         if (gemImage) { gemImage.src = gemData[i].inactive; } else { console.warn(`Element with ID 'gem-${i}' not found.`); }
//     }
//     const sliderFill = document.getElementById("slider-fill");
//     if (sliderFill) { sliderFill.style.width = `0%`; sliderFill.style.backgroundColor = 'transparent'; } else { console.warn("Element with ID 'slider-fill' not found."); }
//     currentLevel = -1;
    
//     const moreButtons = document.querySelectorAll('.moreButton');
//     moreButtons.forEach(button => { button.addEventListener('click', function (e) { e.preventDefault(); alert('Coming Soon!'); }); });

//     // FORM SUBMIT (Popup "Add New Quest")
//     const scheduleForm = document.getElementById('scheduleForm');
//     const todaySchedule = document.getElementById('todaySchedule');
//     const categoryColorInput = document.getElementById('categoryColorInput');
//     const activityTitle = document.getElementById('activityTitle');
//     const activityDescription = document.getElementById('activityDescription');
//     const activityDate = document.getElementById('activityDate');
//     const categoryInput = document.getElementById('categoryInput');

//     if (scheduleForm && todaySchedule && categoryColorInput && activityTitle && activityDescription && activityDate && categoryInput) {
//         scheduleForm.addEventListener('submit', async function(e){
//             e.preventDefault();

//             const type = document.querySelector('input[name="scheduleType"]:checked').value;
//             const title = activityTitle.value;
//             const desc = activityDescription.value;
//             const date = activityDate.value;
//             const categoryName = categoryInput.value;
//             const categoryColor = categoryColorInput.value;
//             let jamMulai = null;
//             let jamAkhir = null;
//             let jamDeadline = null;
//             let status = null;

//             if (type === 'task') {
//                 jamDeadline = deadlineTimeInput.value;
//                 status = "TODO";
//             } else {
//                 jamMulai = startTimeInput.value;
//                 jamAkhir = endTimeInput.value;
//             }

//             try {
//                 // Panggil fungsi createQuest (yang seharusnya ada di schedule_db.js)
//                 const questData = await window.createQuest(type, title, desc, date, jamMulai, jamAkhir, jamDeadline, status, categoryName, categoryColor, currentLevel, gemData);
                
//                 if(questData) {
//                     window.displayResponse({ message: "Quest berhasil ditambahkan!", data: questData.newDataJadwal }, false);
                    
//                     // Refresh tampilan data di dashboard setelah Quest dibuat
//                     fetchAndDisplayTodaySchedule();
//                     fetchAndDisplayPrioritasProgress();
//                 } else {
//                     window.displayResponse({ message: "Gagal menambahkan Quest (operasi backend)." }, true);
//                 }

//             } catch (error) {
//                 console.error('Error in form submit/create quest:', error);
//                 window.displayResponse({ message: 'Terjadi kesalahan saat memproses quest.' }, true);
//             }

//             // Reset form & UI
//             scheduleForm.reset();
//             if (popupOverlay) popupOverlay.classList.add('hidden');
//             for (let i = 0; i < gemData.length; i++) {
//                 const gemImage = document.getElementById(`gem-${i}`);
//                 if (gemImage) gemImage.src = gemData[i].inactive;
//             }
//             if (sliderFill) {
//                 sliderFill.style.width = `0%`;
//                 sliderFill.style.backgroundColor = 'transparent';
//             }
//             currentLevel = -1;
//             const infoElement = document.getElementById("gem-info");
//             if (infoElement) infoElement.innerText = "";
//         });
//     } else {
//         console.warn("One or more schedule form elements not found. Schedule form will not be initialized.");
//     }


//     // Calendar/Date Grid (dari scriptDashboard.js asli)
//     const monthNames = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//     let selectedDate = new Date();
    
//     function renderCalendar(year, month) {
//         // Placeholder for calendar rendering logic
//     }

//     let selectedYear = new Date().getFullYear();
//     let selectedMonth = new Date().getMonth();

//     function showYearView() {
//         const yearView = document.getElementById('year-view');
//         const monthView = document.getElementById('month-view');
//         const dateGrid = document.getElementById('dateGrid');
//         if (yearView) yearView.classList.remove('hidden');
//         if (monthView) monthView.classList.add('hidden');
//         if (dateGrid) dateGrid.classList.add('hidden');
//     }

//     function showMonthsForYear(year) {
//         selectedYear = year;
//         updateCalendarTitle();
//         const yearView = document.getElementById('year-view');
//         const monthView = document.getElementById('month-view');
//         const dateGrid = document.getElementById('dateGrid');
//         if (yearView) yearView.classList.add('hidden');
//         if (monthView) monthView.classList.remove('hidden');
//         if (dateGrid) dateGrid.classList.add('hidden');
//     }

//     function showMonthDates(monthIdx) {
//         selectedMonth = monthIdx;
//         updateCalendarTitle();
//         const monthView = document.getElementById('month-view');
//         const dateGrid = document.getElementById('dateGrid');
//         if (monthView) monthView.classList.add('hidden');
//         if (dateGrid) dateGrid.classList.remove('hidden');
//         renderDateGrid(selectedYear, selectedMonth);
//     }

//     function updateCalendarTitle() {
//         const calendarTitle = document.getElementById('calendar-title');
//         if (calendarTitle) {
//             calendarTitle.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
//         }
//     }

//     function renderDateGrid(year, month) {
//         // Your actual calendar rendering logic goes here
//     }

//     if (document.getElementById('calendar-title')) {
//         updateCalendarTitle();
//     }


//     // --- Panggilan Fungsi Inisialisasi Data dari Backend ---
//     // Panggil saat DOMContentLoaded untuk memuat data awal
//     // Menggunakan window.jwtToken dan window.currentUserId dari auth.js
//     if (window.jwtToken && window.currentUserId) { 
//         fetchAndDisplayStreak();
//         fetchAndDisplayPrioritasProgress();
//         fetchAndDisplayTodaySchedule();
//     } else {
//         // Jika belum login, tampilkan pesan atau redirect
//         const streakDisplayElement = document.getElementById('currentStreakDisplay');
//         if (streakDisplayElement) {
//             streakDisplayElement.innerText = 'Login First';
//         }
//         const todayScheduleContainer = document.getElementById('todaySchedule');
//         if (todayScheduleContainer) {
//             todayScheduleContainer.innerHTML = '<div class="text-accent/50 text-center">Login for tracking your schedule</div>';
//         }
//         // Atur progress bar ke 0% jika belum login
//         gemData.forEach(prio => {
//             const selectorClass = `progress-${prio.name.toLowerCase().replace(' ', '')}`;
//             const textElement = document.querySelector(`.${selectorClass} .progress-text`);
//             const barElement = document.querySelector(`.${selectorClass} .progress-bar`);
//             if (textElement) textElement.textContent = `0/0`;
//             if (barElement) barElement.style.width = '0%';
//         });
//     }
// });


// let currentLevel = -1;
// // let schedules = []; // {title, desc, level, done, ...}

// function setLevel(level) {
//     // if same level, do nothing
//     if (currentLevel === level) {
//         return;
//     }

//     // update fill bar
//     const fillWidths = [5, 35, 70, 100];
//     const sliderFill = document.getElementById("slider-fill");
//     if (sliderFill) { // pake validasi untuk menghindari error
//         sliderFill.style.width = `${fillWidths[level]}%`;
//         sliderFill.style.backgroundColor = gemData[level].color;
//     }

//     // update gems nya
//     for (let i = 0; i < gemData.length; i++) {
//     const gemImage = document.getElementById(`gem-${i}`);
//         if (gemImage) { 
//             if (i === level) {
//                 gemImage.src = gemData[i].active;
//             } else {
//                 gemImage.src = gemData[i].inactive;
//             }
//         }
//     }

//     // update dskripsi prioritasnya
//     const info = document.getElementById("gem-info");
//     if (info) {
//         info.innerText = `${gemData[level].description}`;
//         info.style.color = gemData[level].color;
//     }
    
//     currentLevel = level;
// }

// // ambil dan tampilkan data streak
// async function fetchAndDisplayStreak() {
//     if (!currentUserId) {
//         document.getElementById('currentStreakDisplay').innerText = 'N/A';
//         return;
//     }
//     try {
//         const response = await fetchProtected(`${BASE_URL}/users/${currentUserId}/streak`);
//         if (response) {
//             const data = await response.json();
//             if (data) {
//                 document.getElementById('currentStreakDisplay').innerText = `${data.currentStreak} Days`;
//             } else {
//                 document.getElementById('currentStreakDisplay').innerText = '0 Days'; // Jika belum ada streak
//             }
//         }
//     } catch (error) {
//         console.error('Error fetching streak:', error);
//         document.getElementById('currentStreakDisplay').innerText = 'Error';
//     }
// }

// // get dan tampilkan progress prioritas
// async function fetchAndDisplayPrioritasProgress() {
//     if (!currentUserId) {
//         // Set semua ke 0% jika belum login
//         gemData.forEach(prio => {
//             const textElement = document.querySelector(`.progress-${prio.name.toLowerCase().replace(' ', '')} .progress-text`);
//             const barElement = document.querySelector(`.progress-${prio.name.toLowerCase().replace(' ', '')} .progress-bar`);
//             if (textElement) textElement.textContent = '0%';
//             if (barElement) barElement.style.width = '0%';
//         });
//         return;
//     }
//     try {
//         const response = await fetchProtected(`${BASE_URL}/prioritas`); // Mengambil semua prioritas dengan progress
//         if (response) {
//             const prioritasList = await response.json();
//             prioritasList.forEach(prioBackend => {
//                 const total = prioBackend.totalTasks;
//                 const completed = prioBackend.completedTasks;
//                 const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

//                 const selectorClass = `progress-${prioBackend.namaPrioritas.toLowerCase().replace(' ', '')}`;
//                 const textElement = document.querySelector(`.${selectorClass} .progress-text`);
//                 const barElement = document.querySelector(`.${selectorClass} .progress-bar`);
                
//                 if (textElement) textElement.textContent = `${completed}/${total}`;
//                 if (barElement) barElement.style.width = `${percent}%`;
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching prioritas progress:', error);
//     }
// }

// // mengambil dan menampilkan jadwal hari ini
// async function fetchAndDisplayTodaySchedule() {
//     const todayScheduleContainer = document.getElementById('todaySchedule');
//     if (!todayScheduleContainer) {
//         console.warn("Element 'todaySchedule' not found.");
//         return;
//     }
//     if (!currentUserId) {
//         todayScheduleContainer.innerHTML = '<div class="text-accent/50 text-center">Silakan login untuk melihat jadwal Anda.</div>';
//         return;
//     }

//     try {
//         const response = await fetchProtected(`${BASE_URL}/data-jadwal`); // Mengambil semua jadwal
//         if (response) {
//             const allDataJadwal = await response.json();
            
//             // Filter jadwal untuk hari ini (asumsi tanggal di backend adalah yyyy-MM-dd)
//             const today = new Date();
//             const todayString = today.toISOString().split('T')[0]; // Format yyyy-MM-dd

//             const dailySchedules = allDataJadwal.filter(item => {
//                 // Perlu mengakses tanggal dari Event atau Task yang terkait
//                 let itemDate = null;
//                 if (item.eventId && item.event && item.event.tanggal) {
//                     itemDate = item.event.tanggal;
//                 } else if (item.taskId && item.task && item.task.tanggal) {
//                     itemDate = item.task.tanggal;
//                 }
//                 return itemDate === todayString;
//             });

//             // Urutkan berdasarkan waktu terdekat
//             dailySchedules.sort((a, b) => {
//                 let aTime = null;
//                 if (a.eventId && a.event && a.event.jamMulai) aTime = a.event.jamMulai;
//                 else if (a.taskId && a.task && a.task.jamDeadline) aTime = a.task.jamDeadline;

//                 let bTime = null;
//                 if (b.eventId && b.event && b.event.jamMulai) bTime = b.event.jamMulai;
//                 else if (b.taskId && b.task && b.task.jamDeadline) bTime = b.task.jamDeadline;

//                 if (!aTime || !bTime) return 0; // Handle cases where time might be missing
//                 return aTime.localeCompare(bTime);
//             });

//             todayScheduleContainer.innerHTML = ''; // Kosongkan sebelum render

//             if (dailySchedules.length === 0) {
//                 todayScheduleContainer.innerHTML = '<div class="text-accent/50 text-center">Tidak ada jadwal untuk hari ini.</div>';
//             } else {
//                 dailySchedules.forEach(item => {
//                     // Mendapatkan warna bendera dari prioritas (membutuhkan prioritasId)
//                     let flagColorHex = '#808080'; // Default abu-abu
//                     if (item.prioritasId && item.prioritas && item.prioritas.color) {
//                         flagColorHex = item.prioritas.color;
//                     }

//                     // Mendapatkan warna kategori (membutuhkan kategoriId)
//                     let categoryColorHex = '#CCCCCC'; // Default abu-abu terang
//                     if (item.kategoriId && item.kategori && item.kategori.color) {
//                         categoryColorHex = item.kategori.color;
//                     }

//                     let timeDisplay = '';
//                     if (item.taskId && item.task) {
//                         timeDisplay = item.task.jamDeadline;
//                     } else if (item.eventId && item.event) {
//                         timeDisplay = `${item.event.jamMulai} - ${item.event.jamAkhir}`;
//                     }

//                     const newSchedule = document.createElement('div');
//                     newSchedule.className = "bg-accent-950 flex-col border-[1px] p-3 rounded-[3px] border-accent/10";
//                     newSchedule.innerHTML = `
//                         <div class="flex items-stretch">
//                             <div class="w-2 rounded-l-md mr-4" style="background-color: ${flagColorHex};"></div>
//                             <div class="w-full">
//                                 <div class="flex justify-between items-center">
//                                     <span class="text-accent font-bold lg:text-xl text-lg">${item.judulJadwal}</span>
//                                     <!-- Tombol Mark Done, akan memerlukan ID DataJadwal dan endpoint PUT untuk update status Task -->
//                                     <button class="markDoneBtn bg-accent text-secondary rounded-full px-2 py-1 flex items-center gap-x-1" 
//                                             data-jadwal-id="${item.idJadwal}" data-task-id="${item.taskId || ''}" data-is-task="${item.taskId ? 'true' : 'false'}"
//                                             ${(item.taskId && item.task && item.task.status === 'SELESAI') ? 'disabled style="opacity:0.5;"' : ''}>
//                                         <i class="fa-solid fa-check text-sm"></i>
//                                         <span class="text-sm font-body">${(item.taskId && item.task && item.task.status === 'SELESAI') ? 'Done' : 'Mark Done'}</span>
//                                     </button>
//                                 </div>
//                                 <p class="lg:text-sm text-[12px]">${item.deskripsiJadwal}</p>
//                                 <div class="flex gap-2">
//                                     <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
//                                         <i class="fa-solid fa-clock text-accent"></i>
//                                         <span class="text-accent lg:text-sm text-[12px] ">${timeDisplay}</span>
//                                     </div>
//                                     <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
//                                         <i class="fa-solid fa-calendar text-accent"></i>
//                                         <span class="text-accent lg:text-sm text-[12px] ">${item.eventId && item.event ? item.event.tanggal : (item.taskId && item.task ? item.task.tanggal : '')}</span>
//                                     </div>
//                                     <div class="inline-flex gap-x-2 items-center mt-2" style="background-color:${categoryColorHex}50; border-radius:9999px; padding:0.25rem 0.5rem;">
//                                         <span class="text-accent lg:text-sm text-[12px] font-semibold">${item.kategori ? item.kategori.namaKategori : ''}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     `;
//                     todayScheduleContainer.appendChild(newSchedule);

//                     // Tambahkan event listener untuk Mark Done
//                     const markBtn = newSchedule.querySelector('.markDoneBtn');
//                     if (markBtn && markBtn.dataset.isTask === 'true' && markBtn.dataset.jadwalId && markBtn.dataset.taskId) {
//                         if (!((item.taskId && item.task && item.task.status === 'SELESAI'))) { // Hanya tambahkan jika belum selesai
//                             markBtn.addEventListener('click', async function() {
//                                 const jadwalId = this.dataset.jadwalId;
//                                 const taskId = this.dataset.taskId;
//                                 await handleMarkTaskDone(jadwalId, taskId);
//                             });
//                         }
//                     }
//                 });
//             }
//         }
//     } catch (error) {
//         console.error('Error fetching today\'s schedule:', error);
//         todayScheduleContainer.innerHTML = '<div class="text-red-500 text-center">Gagal memuat jadwal.</div>';
//     }
// }

// // menandai task (kalau selesai)
// async function handleMarkTaskDone(jadwalId, taskId) {
//     if (!currentUserId || !jadwalId || !taskId) {
//         displayResponse({ message: 'Informasi task/user tidak lengkap untuk menandai selesai.' }, true);
//         return;
//     }

//     try {
//         // Ambil task yang ada
//         const taskResponse = await fetchProtected(`${BASE_URL}/tasks/${taskId}`);
//         if (!taskResponse) return;
//         const taskData = await taskResponse.json();

//         // Update status task menjadi SELESAI (atau COMPLETED)
//         const updatedTaskData = { ...taskData, status: 'SELESAI' }; // Sesuaikan dengan status backend

//         const response = await fetchProtected(`${BASE_URL}/tasks/${taskId}`, {
//             method: 'PUT',
//             body: JSON.stringify(updatedTaskData)
//         });

//         if (response) {
//             displayResponse({ message: `Task ID ${taskId} ditandai selesai!`, task: await response.json() }, false);
//             // Refresh jadwal dan progres setelah task selesai
//             fetchAndDisplayTodaySchedule();
//             fetchAndDisplayPrioritasProgress();
//             // Catat interaksi streak
//             if (window.currentUserId) {
//                 await recordUserInteraction(); // Panggil fungsi untuk mencatat streak
//             }
//         }
//     } catch (error) {
//         console.error('Error marking task done:', error);
//         displayResponse({ message: 'Gagal menandai task selesai.' }, true);
//     }
// }



// document.addEventListener('DOMContentLoaded', function() {

//     // Darkmode
//     const themeToggle = document.getElementById('themeToggle');
//     const html = document.documentElement;
    
//     if (themeToggle) { // Pastikan themeToggle ada
//         const savedTheme = localStorage.getItem('theme');
//         const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
//         if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
//             html.classList.add('dark');
//             updateIcon(true);
//         } else {
//             html.classList.remove('dark');
//             updateIcon(false);
//         }
        
//         function updateIcon(isDark) {
//             const icon = themeToggle.querySelector('i');
//             if (icon) {
//                 if (isDark) {
//                     icon.className = 'fas fa-sun text-white'; 
//                 } else {
//                     icon.className = 'fas fa-moon text-accent'; 
//                 }
//             }
//         }
        
//         function toggleTheme() {
//             const isDark = html.classList.contains('dark');
//             if (isDark) {
//                 html.classList.remove('dark');
//                 localStorage.setItem('theme', 'light');
//                 updateIcon(false);
//             } else {
//                 html.classList.add('dark');
//                 localStorage.setItem('theme', 'dark');
//                 updateIcon(true);
//             }
//         }
        
//         themeToggle.addEventListener('click', function(e) {
//             e.preventDefault();
//             toggleTheme();
//         });
//     } else {
//         console.warn("Theme toggle button not found.");
//     }
    
//     const openPopupBtn = document.getElementById('openPopup');
//     const closePopupBtn = document.getElementById('closePopup');
//     const popupOverlay = document.getElementById('popupOverlay');

//     if (openPopupBtn) {
//         openPopupBtn.addEventListener('click', function() {
//             if (popupOverlay) popupOverlay.classList.remove('hidden');
//         });
//     }
//     if (closePopupBtn) {
//         closePopupBtn.addEventListener('click', function() {
//             if (popupOverlay) popupOverlay.classList.add('hidden');
//         });
//     }
//     if (popupOverlay) {
//         popupOverlay.addEventListener('click', function(e) {
//             if (e.target === popupOverlay) { 
//                 popupOverlay.classList.add('hidden');
//             }
//         });
//     }

//     // EVENT OR TASK : TIME OPTION
//     const taskTypeRadio = document.getElementById('taskType');
//     const eventTypeRadio = document.getElementById('eventType');
//     const taskTimeInput = document.getElementById('taskTimeInput');
//     const eventTimeInput = document.getElementById('eventTimeInput');
//     const deadlineTimeInput = document.getElementById('deadlineTime');
//     const startTimeInput = document.getElementById('startTime');
//     const endTimeInput = document.getElementById('endTime');

//     function toggleTimeInputs() {
//         if (taskTypeRadio && eventTypeRadio && taskTimeInput && eventTimeInput && deadlineTimeInput && startTimeInput && endTimeInput) {
//             if (taskTypeRadio.checked) {
//                 taskTimeInput.classList.remove('hidden');
//                 eventTimeInput.classList.add('hidden');
//                 deadlineTimeInput.required = true;
//                 startTimeInput.required = false;
//                 endTimeInput.required = false;
//             } else {
//                 taskTimeInput.classList.add('hidden');
//                 eventTimeInput.classList.remove('hidden');
//                 deadlineTimeInput.required = false;
//                 startTimeInput.required = true;
//                 endTimeInput.required = true;
//             }
//         } else {
//             console.warn("One or more time input elements for toggleTimeInputs not found.");
//         }
//     }

//     toggleTimeInputs();
//     if (taskTypeRadio) taskTypeRadio.addEventListener('change', toggleTimeInputs);
//     if (eventTypeRadio) eventTypeRadio.addEventListener('change', toggleTimeInputs);

//     const info = document.getElementById("gem-info");
//     if (info) {
//         info.innerText = "Pilih level prioritas";
//     } else {
//         console.warn("Element with ID 'gem-info' not found.");
//     }

//     for (let i = 0; i < gemData.length; i++) {
//         const gemImage = document.getElementById(`gem-${i}`);
//         if (gemImage) {
//             gemImage.src = gemData[i].inactive;
//         } else {
//              console.warn(`Element with ID 'gem-${i}' not found.`);
//         }
//     }

//     const sliderFill = document.getElementById("slider-fill");
//         if (sliderFill) {
//             sliderFill.style.width = `0%`;
//             sliderFill.style.backgroundColor = 'transparent';
//         } else {
//             console.warn("Element with ID 'slider-fill' not found.");
//         }
//     currentLevel = -1;
    
//     const moreButtons = document.querySelectorAll('.moreButton');
//     moreButtons.forEach(button => {
//         button.addEventListener('click', function (e) {
//         e.preventDefault();
//         alert('Coming Soon!');
//         });
//     });

//     // FORM SUBMIT (Popup "Add New Quest")
//     const scheduleForm = document.getElementById('scheduleForm');
//     const todaySchedule = document.getElementById('todaySchedule'); // Kontainer untuk jadwal harian
//     const categoryColorInput = document.getElementById('categoryColorInput');
//     const activityTitle = document.getElementById('activityTitle');
//     const activityDescription = document.getElementById('activityDescription');
//     const activityDate = document.getElementById('activityDate');
//     const categoryInput = document.getElementById('categoryInput');

//     if (scheduleForm && todaySchedule && categoryColorInput && activityTitle && activityDescription && activityDate && categoryInput) {
//         scheduleForm.addEventListener('submit', async function(e){
//             e.preventDefault();

//             const type = document.querySelector('input[name="scheduleType"]:checked').value;
//             const title = activityTitle.value;
//             const desc = activityDescription.value;
//             const date = activityDate.value;
//             const categoryName = categoryInput.value;
//             const categoryColor = categoryColorInput.value;
//             let jamMulai = null;
//             let jamAkhir = null;
//             let jamDeadline = null;
//             let status = null;

//             if (type === 'task') {
//                 jamDeadline = deadlineTimeInput.value;
//                 status = "TODO";
//             } else {
//                 jamMulai = startTimeInput.value;
//                 jamAkhir = endTimeInput.value;
//             }

//             try {
//                 const questData = await createQuest(type, title, desc, date, jamMulai, jamAkhir, jamDeadline, status, categoryName, categoryColor, currentLevel, gemData);
                
//                 if(questData) {
//                     if (typeof window.displayResponse === 'function') {
//                         window.displayResponse({ message: "Quest berhasil ditambahkan!", data: questData.newDataJadwal }, false);
//                     } else {
//                         console.log("Quest berhasil ditambahkan!", questData.newDataJadwal);
//                     }
                    
//                     // Refresh jadwal dan progres setelah quest berhasil ditambahkan
//                     fetchAndDisplayTodaySchedule();
//                     fetchAndDisplayPrioritasProgress();
//                 } else {
//                     if (typeof window.displayResponse === 'function') {
//                         window.displayResponse({ message: "Gagal menambahkan Quest (operasi backend)." }, true);
//                     } else {
//                         console.error("Gagal menambahkan Quest (operasi backend).");
//                     }
//                 }

//             } catch (error) {
//                 console.error('Error in form submit/create quest:', error);
//                 if (typeof window.displayResponse === 'function') {
//                     window.displayResponse({ message: 'Terjadi kesalahan saat memproses quest.' }, true);
//                 } else {
//                     console.error('Terjadi kesalahan saat memproses quest.');
//                 }
//             }

//             // Reset form & UI
//             scheduleForm.reset();
//             if (popupOverlay) popupOverlay.classList.add('hidden');
//             for (let i = 0; i < gemData.length; i++) {
//                 const gemImage = document.getElementById(`gem-${i}`);
//                 if (gemImage) gemImage.src = gemData[i].inactive;
//             }
//             if (sliderFill) {
//                 sliderFill.style.width = `0%`;
//                 sliderFill.style.backgroundColor = 'transparent';
//             }
//             currentLevel = -1;
//             const infoElement = document.getElementById("gem-info");
//             if (infoElement) infoElement.innerText = "";
//         });
//     } else {
//         console.warn("One or more schedule form elements not found. Schedule form will not be initialized.");
//     }


//     // Calendar/Date Grid (dari scriptDashboard.js asli)
//     const monthNames = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//     let selectedDate = new Date();
    
//     function renderCalendar(year, month) {
//         // Placeholder for calendar rendering logic
//     }

//     let selectedYear = new Date().getFullYear();
//     let selectedMonth = new Date().getMonth();

//     function showYearView() {
//         const yearView = document.getElementById('year-view');
//         const monthView = document.getElementById('month-view');
//         const dateGrid = document.getElementById('dateGrid');
//         if (yearView) yearView.classList.remove('hidden');
//         if (monthView) monthView.classList.add('hidden');
//         if (dateGrid) dateGrid.classList.add('hidden');
//     }

//     function showMonthsForYear(year) {
//         selectedYear = year;
//         updateCalendarTitle();
//         const yearView = document.getElementById('year-view');
//         const monthView = document.getElementById('month-view');
//         const dateGrid = document.getElementById('dateGrid');
//         if (yearView) yearView.classList.add('hidden');
//         if (monthView) monthView.classList.remove('hidden');
//         if (dateGrid) dateGrid.classList.add('hidden');
//     }

//     function showMonthDates(monthIdx) {
//         selectedMonth = monthIdx;
//         updateCalendarTitle();
//         const monthView = document.getElementById('month-view');
//         const dateGrid = document.getElementById('dateGrid');
//         if (monthView) monthView.classList.add('hidden');
//         if (dateGrid) dateGrid.classList.remove('hidden');
//         renderDateGrid(selectedYear, selectedMonth);
//     }

//     function updateCalendarTitle() {
//         const calendarTitle = document.getElementById('calendar-title');
//         if (calendarTitle) {
//             calendarTitle.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
//         }
//     }

//     function renderDateGrid(year, month) {
//         // Your actual calendar rendering logic goes here
//     }

//     if (document.getElementById('calendar-title')) {
//         updateCalendarTitle();
//     }


//     // --- Panggilan Fungsi Inisialisasi Data dari Backend ---
//     // Panggil saat DOMContentLoaded untuk memuat data awal
//     if (window.jwtToken && window.currentUserId) { // Hanya panggil jika user sudah login
//         fetchAndDisplayStreak();
//         fetchAndDisplayPrioritasProgress();
//         fetchAndDisplayTodaySchedule();
//     } else {
//         // Jika belum login, tampilkan pesan atau redirect
//         document.getElementById('currentStreakDisplay').innerText = 'Login First';
//         document.getElementById('todaySchedule').innerHTML = '<div class="text-accent/50 text-center">Login for tracking your schedule</div>';
//         // Atur progress bar ke 0% jika belum login
//         gemData.forEach(prio => {
//             const textElement = document.querySelector(`.progress-${prio.name.toLowerCase().replace(' ', '')} .progress-text`);
//             const barElement = document.querySelector(`.progress-${prio.name.toLowerCase().replace(' ', '')} .progress-bar`);
//             if (textElement) textElement.textContent = '0%';
//             if (barElement) barElement.style.width = '0%';
//         });
//     }
// });




    // COLOR OPTION BG 
    // const colorPickerBtn = document.getElementById('colorPickerBtn');
    // const colorOptions = document.getElementById('colorOptions');

    // initial color
    // if (colorPickerBtn) {
    //     colorPickerBtn.style.backgroundColor = '#E29B9C';
    // }

    // Tampilkan atau sembunyikan dropdown warna saat diklik
    // if (colorPickerBtn) {
    //     colorPickerBtn.addEventListener('click', function (e) {
    //         e.stopPropagation();
    //         if (colorOptions) {
    //             colorOptions.classList.toggle('hidden');
    //         }
    //     });
    // }

    // if (colorOptions) {
    //     colorOptions.addEventListener('click', function (e) {
    //         if (e.target.dataset.color) {
    //             const selectedColor = e.target.dataset.color;
    //             if (colorPickerBtn) {
    //                 colorPickerBtn.style.backgroundColor = selectedColor;
    //             }
    //             if (colorOptions) {
    //                 colorOptions.classList.add('hidden');
    //             }
    //         }
    //     });
    // }

    // document.addEventListener('click', function () {
    //     if (colorOptions) {
    //         colorOptions.classList.add('hidden');
    //     }
    // });

    // PRIORITY CUSTOM
    //  awal load, belum ada level yang dipilih
//     const info = document.getElementById("gem-info");
//     if (info) {
//         info.innerText = "";
//     }

//     // pastikan dlu semua gems nya inactive
//     for (let i = 0; i < gemData.length; i++) {
//         const gemImage = document.getElementById(`gem-${i}`);
//         if (gemImage) {
//             gemImage.src = gemData[i].inactive;
//         }
//     }

//     // pastikan juga slidernya tidak ada yang terisi
//     const sliderFill = document.getElementById("slider-fill");
//         if (sliderFill) {
//             sliderFill.style.width = `0%`;
//             sliderFill.style.backgroundColor = 'transparent';
//         }

    
//     // BUTTON MORE
//     const moreButtons = document.querySelectorAll('.moreButton');

//     moreButtons.forEach(button => {
//         button.addEventListener('click', function (e) {
//         e.preventDefault();
//         alert('Coming Soon!');
//         });
//     });

//     // FORM SUBMIT
//     const scheduleForm = document.getElementById('scheduleForm');
//     const todaySchedule = document.getElementById('todaySchedule');

//     scheduleForm.addEventListener('submit', function(e){
//         e.preventDefault();

//         // Ambil data dari form
//         const type = document.querySelector('input[name="scheduleType"]:checked').value;
//         const title = document.getElementById('activityTitle').value;
//         const desc = document.getElementById('activityDescription').value;
//         const date = document.getElementById('activityDate').value;
//         const category = document.getElementById('categoryInput').value;
//         const color = document.getElementById('categoryColorInput').value;
        
//         // Ambil waktu berdasarkan jenisnya
//         let time = '';
//         if (type === 'task') {
//             time = document.getElementById('deadlineTime').value;
//         } else {
//             const start = document.getElementById('startTime').value;
//             const end = document.getElementById('endTime').value;
//             time = `${start} - ${end}`;
//         }

//         // simpan ke array
//         schedules.push({
//             title,
//             desc,
//             date,
//             category,
//             color,
//             time,
//             type,
//             level: currentLevel,
//             done: false
//         });

//         renderScheduleList();
//         updateProgress();

//         // Pilih warna bendera berdasarkan prioritas
//         let flagColor = 'bg-gem_green';
//         if (currentLevel === 1) flagColor = 'bg-gem_blue';
//         if (currentLevel === 2) flagColor = 'bg-gem_purple';
//         if (currentLevel === 3) flagColor = 'bg-gem_red';

//         // Style Schedule baru 
//         const newSchedule = document.createElement('div');
//         newSchedule.className = "bg-white flex-col border-[1px] p-3 rounded-[3px] border-accent/10";
//         const scheduleIdx = schedules.length - 1;
//         newSchedule.innerHTML = `
//             <div class="flex items-stretch">
//                 <div class="w-2 ${flagColor} rounded-l-md mr-4"></div>
//                 <div class="w-full">
//                     <div class="flex items-center justify-between">
//                         <span class="text-accent font-bold lg:text-xl text-lg">${title}</span>
//                         <button class="markDoneBtn bg-accent text-secondary rounded-full px-2 py-1 flex items-center gap-x-1" data-idx="${scheduleIdx}">
//                             <i class="fa-solid fa-check text-sm"></i>
//                             <span class="text-sm font-body">Marks Done</span>  
//                         </button>
//                     </div>
//                     <p class="lg:text-sm text-[12px]">${desc}</p>
//                     <div class="flex gap-2">
//                         <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
//                             <i class="fa-solid fa-clock text-accent"></i>
//                             <span class="text-accent lg:text-sm text-[12px] ">${time}</span>
//                         </div>

//                         <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
//                             <i class="fa-solid fa-calendar text-accent"></i>
//                             <span class="text-accent lg:text-sm text-[12px] ">${date}</span>
//                         </div>

//                         <div class="inline-flex gap-x-2 items-center mt-2" style="background-color:${color}50; border-radius:9999px; padding:0.25rem 0.5rem;">
//                             <span class="text-accent lg:text-sm text-[12px] font-semibold">${category}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;

//         // Tambahkan ke todaySchedule
//         // todaySchedule.appendChild(newSchedule);

//         // Tambahkan event listener untuk tombol Marks Done
//         const markBtn = newSchedule.querySelector('.markDoneBtn');
//         if (markBtn) {
//             markBtn.addEventListener('click', function() {
//                 const idx = parseInt(this.dataset.idx);
//                 schedules[idx].done = true;
//                 this.disabled = true;
//                 this.classList.add('opacity-50');
//                 updateProgress();
//             });
//         }

//         // Reset form & tutup popup
//         scheduleForm.reset();
//         document.getElementById('popupOverlay').classList.add('hidden');
//         // Reset priority slider
//         for (let i = 0; i < gemData.length; i++) {
//             const gemImage = document.getElementById(`gem-${i}`);
//             if (gemImage) gemImage.src = gemData[i].inactive;
//         }
//         const sliderFill = document.getElementById("slider-fill");
//         if (sliderFill) {
//             sliderFill.style.width = `0%`;
//             sliderFill.style.backgroundColor = 'transparent';
//         }

//         currentLevel = -1;
//         document.getElementById("gem-info").innerText = "";
//     });
    
    
// });


// function openModal() {
//     document.getElementById('addActivityModal').classList.remove('hidden');
// }

// function closeModal() {
//     document.getElementById('addActivityModal').classList.add('hidden');
// }

// function openQuestModal() {
//   document.getElementById('addQuestModal').classList.remove('hidden');
// }

// function closeQuestModal() {
//   document.getElementById('addQuestModal').classList.add('hidden');
// }


// // function toggleTimeInput(type) {
// //   const taskInput = document.getElementById('taskTimeInput');
// //   const eventInput = document.getElementById('eventTimeInput');
// //   if (taskType === 'event') {
// //     taskInput.classList.add('hidden');
// //     eventInput.classList.remove('hidden');
// //   } else {
// //     taskInput.classList.remove('hidden');
// //     eventInput.classList.add('hidden');
// //   }
// // }

// // SCHEDULE PUNYAA

// // Show modal
// document.getElementById('addCategoryBtn').onclick = function() {
//   document.getElementById('addCategoryModal').classList.remove('hidden');
// };

// // Hide modal
// function closeCategoryModal() {
//   document.getElementById('addCategoryModal').classList.add('hidden');
// }

// // Add category
// function addCategory(event) {
//   event.preventDefault();
//   const name = document.getElementById('categoryNameInput').value;
//   const color = document.getElementById('categoryColorInput').value;
//   if (name.trim() === "") return;

//   // Create category box
//   const box = document.createElement('div');
//   box.className = "relative flex items-center px-3 py-1 rounded-lg text-white text-sm font-semibold";
//   box.style.backgroundColor = color;

//   // Category name
//   const span = document.createElement('span');
//   span.textContent = name;

//   // Delete button
//   const delBtn = document.createElement('button');
//   delBtn.innerHTML = '&times;';
//   delBtn.className = "ml-2 text-white text-lg font-bold hover:text-red-400 focus:outline-none";
//   delBtn.onclick = function() {
//     box.remove();
//   };

//   box.appendChild(span);
//   box.appendChild(delBtn);

//   document.getElementById('categoryList').appendChild(box);

//   // Reset and close modal
//   document.getElementById('categoryForm').reset();
//   closeCategoryModal();
// }

// // Example: June 2025 has 5 weeks
// const monthNames = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// function showMonth(monthIdx) {
//   // Hide month cards
//   document.getElementById('monthCards').classList.add('hidden');
//   // Show date grid
//   const dateGrid = document.getElementById('dateGrid');
//   dateGrid.classList.remove('hidden');

//   // Set year
//   const year = 2025;
//   const firstDay = new Date(year, monthIdx, 1).getDay();
//   const lastDate = new Date(year, monthIdx + 1, 0).getDate();

//   // Build grid header
//   let html = `
//     <div class="flex justify-between items-center mb-4">
//       <span class="text-xl font-bold text-accent-500">${monthNames[monthIdx]} ${year}</span>
//       <button onclick="backToMonths()" class="text-accent-500 underline text-sm">Back to months</button>
//     </div>
//     <div class="grid grid-cols-7 text-center text-base font-semibold text-gray-500 mb-2">
//       <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
//     </div>
//     <div class="grid grid-cols-7 gap-y-6 text-lg font-bold">
//   `;

//   // Fill blanks before first day
//   for (let i = 0; i < firstDay; i++) {
//     html += `<div></div>`;
//   }

//   // Fill days
//   for (let d = 1; d <= lastDate; d++) {
//     html += `<div class="rounded-lg bg-gray-100 py-6 hover:bg-accent-100 transition cursor-pointer">${d}</div>`;
//   }

//   html += '</div>';
//   dateGrid.innerHTML = html;
// }

// function backToMonths() {
//   document.getElementById('dateGrid').classList.add('hidden');
//   document.getElementById('monthCards').classList.remove('hidden');
// }

// // Initial render
// renderCalendar(selectedDate.getFullYear(), selectedDate.getMonth());

// let selectedYear = 2025;
// let selectedMonth = 5; // 0 = January

// function showYearView() {
//   document.getElementById('year-view').classList.remove('hidden');
//   document.getElementById('month-view').classList.add('hidden');
//   document.getElementById('dateGrid').classList.add('hidden');
// }

// function showMonthsForYear(year) {
//   selectedYear = year;
//   updateCalendarTitle();
//   document.getElementById('year-view').classList.add('hidden');
//   document.getElementById('month-view').classList.remove('hidden');
//   document.getElementById('dateGrid').classList.add('hidden');
// }

// function showMonthDates(monthIdx) {
//   selectedMonth = monthIdx;
//   updateCalendarTitle();
//   document.getElementById('month-view').classList.add('hidden');
//   document.getElementById('dateGrid').classList.remove('hidden');
//   renderDateGrid(selectedYear, selectedMonth);
// }

// function updateCalendarTitle() {
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
//   document.getElementById('calendar-title').textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
// }

// // Example renderDateGrid function (implement as you wish)
// function renderDateGrid(year, month) {
//   // ...generate your date grid for the selected year and month...
// }

// // Initialize title on page load
// updateCalendarTitle();

// function updateProgress() {
//     // Priority: 0=Non Critical, 1=Perventive, 2=Urgent, 3=Emergency
//     const priorities = [
//         { id: 3, bar: 'bg-gem_red', selector: 'progress-emergency' },
//         { id: 2, bar: 'bg-gem_purple', selector: 'progress-urgent' },
//         { id: 1, bar: 'bg-gem_blue', selector: 'progress-perventive' },
//         { id: 0, bar: 'bg-gem_green', selector: 'progress-noncritical' }
//     ];
//     priorities.forEach(prio => {
//         const total = schedules.filter(s => s.level === prio.id).length;
//         const done = schedules.filter(s => s.level === prio.id && s.done).length;
//         const percent = total === 0 ? 0 : Math.round((done / total) * 100);

//         // Update bar width
//         const bar = document.querySelector(`.${prio.selector} .progress-bar`);
//         if (bar) bar.style.width = percent + '%';

//         // Update text
//         const text = document.querySelector(`.${prio.selector} .progress-text`);
//         if (text) text.textContent = percent + '%';
//     });
// }

// function renderScheduleList() {
//     // Urutkan berdasarkan tanggal dan waktu terdekat
//     schedules.sort((a, b) => {
//         // Gabungkan date dan time jadi satu Date object
//         const aDate = new Date(`${a.date}T${a.time.split(' - ')[0] || a.time}`);
//         const bDate = new Date(`${b.date}T${b.time.split(' - ')[0] || b.time}`);
//         return aDate - bDate;
//     });

//     // Kosongkan container
//     todaySchedule.innerHTML = '';

//     // Render ulang semua schedule
//     schedules.forEach((item, idx) => {
//         // Pilih warna bendera berdasarkan prioritas
//         let flagColor = 'bg-gem_green';
//         if (item.level === 1) flagColor = 'bg-gem_blue';
//         if (item.level === 2) flagColor = 'bg-gem_purple';
//         if (item.level === 3) flagColor = 'bg-gem_red';

//         const newSchedule = document.createElement('div');
//         newSchedule.className = "bg-white flex-col border-[1px] p-3 rounded-[3px] border-accent/10";
//         newSchedule.innerHTML = `
//             <div class="flex items-stretch">
//                 <div class="w-2 ${flagColor} rounded-l-md mr-4"></div>
//                 <div class="w-full">
//                     <div class="flex items-center justify-between">
//                         <span class="text-accent font-bold lg:text-xl text-lg">${item.title}</span>
//                         <button class="markDoneBtn bg-accent text-secondary rounded-full px-2 py-1 flex items-center gap-x-1" data-idx="${idx}" ${item.done ? 'disabled style="opacity:0.5;"' : ''}>
//                             <i class="fa-solid fa-check text-sm"></i>
//                             <span class="text-sm font-body">Marks Done</span>  
//                         </button>
//                     </div>
//                     <p class="lg:text-sm text-[12px]">${item.desc}</p>
//                     <div class="flex gap-2">
//                         <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
//                             <i class="fa-solid fa-clock text-accent"></i>
//                             <span class="text-accent lg:text-sm text-[12px] ">${item.time}</span>
//                         </div>
//                         <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
//                             <i class="fa-solid fa-calendar text-accent"></i>
//                             <span class="text-accent lg:text-sm text-[12px] ">${item.date}</span>
//                         </div>
//                         <div class="inline-flex gap-x-2 items-center mt-2" style="background-color:${item.color}50; border-radius:9999px; padding:0.25rem 0.5rem;">
//                             <span class="text-accent lg:text-sm text-[12px] font-semibold">${item.category}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//         todaySchedule.appendChild(newSchedule);

//         // Event listener untuk Marks Done
//         const markBtn = newSchedule.querySelector('.markDoneBtn');
//         if (markBtn && !item.done) {
//             markBtn.addEventListener('click', function() {
//                 schedules[idx].done = true;
//                 renderScheduleList();
//                 updateProgress();
//             });
//         }
//     });
// }