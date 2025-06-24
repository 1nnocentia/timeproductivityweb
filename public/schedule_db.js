/**
 * Mendapatkan kategori berdasarkan nama.
 * @param {string} name - Nama kategori.
 * @returns {Promise<Object|null>}
 */
window.getKategoriByName = async function(name) {
    try {
        const response = await fetchProtected(`${BASE_URL}/kategori`);
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

/**
 * Membuat kategori baru di backend.
 * @param {string} namaKategori - Nama kategori baru.
 * @param {string} color - Kode warna hex untuk kategori.
 * @returns {Promise<Object|null>}
 */
window.createKategoriBackend = async function(namaKategori, color) {
    try {
        const response = await fetchProtected(`${BASE_URL}/kategori`, {
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

/**
 * Mendapatkan prioritas berdasarkan nama.
 * @param {string} name - Nama prioritas.
 * @returns {Promise<Object|null>}
 */
window.getPrioritasByName = async function(name) {
    try {
        const response = await fetchProtected(`${BASE_URL}/prioritas`);
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

/**
 * Membuat prioritas baru di backend.
 * @param {string} namaPrioritas - Nama prioritas baru.
 * @param {string} color - Kode warna hex untuk prioritas.
 * @returns {Promise<Object|null>}
 */
window.createPrioritasBackend = async function(namaPrioritas, color) {
    try {
        const response = await fetchProtected(`${BASE_URL}/prioritas`, {
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

/**
 * Membuat event baru di backend.
 * @param {string} tanggal - Tanggal event.
 * @param {string} jamMulai - Waktu mulai event.
 * @param {string} jamAkhir - Waktu akhir event.
 * @returns {Promise<Object|null>}
 */
window.createEventBackend = async function(tanggal, jamMulai, jamAkhir) {
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

window.createTaskBackend = async function(tanggal, jamDeadline, status) {
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

window.createDataJadwalBackend = async function(judulJadwal, deskripsiJadwal, eventId, taskId, kategoriId, prioritasId) {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal`, {
            method: 'POST',
            body: JSON.stringify({
                judulJadwal,
                deskripsiJadwal,
                eventId,
                taskId,
                kategoriId,
                prioritasId,
                userId: window.userId 
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

window.createQuest = async function(type, title, desc, date, jamMulai, jamAkhir, jamDeadline, status, categoryName, categoryColor, currentLevel, gemData) {
    let kategoriId = null;
    let prioritasId = null;
    let eventId = null;
    let taskId = null;

    try {
        // Panggilan ke helper functions menggunakan window.
        let existingKategori = await window.getKategoriByName(categoryName);
        if (existingKategori) {
            kategoriId = existingKategori.id;
        } else {
            const newKategori = await window.createKategoriBackend(categoryName, categoryColor);
            if (newKategori) kategoriId = newKategori.id;
        }

        const priorityName = gemData[currentLevel].name; // Menggunakan 'name' dari gemData
        let existingPrioritas = await window.getPrioritasByName(priorityName);
        if (existingPrioritas) {
            prioritasId = existingPrioritas.id;
        } else if (currentLevel !== -1) {
            const newPrioritas = await window.createPrioritasBackend(priorityName, gemData[currentLevel].color);
            if (newPrioritas) prioritasId = newPrioritas.id;
        }

        if (type === 'event') {
            const newEvent = await window.createEventBackend(date, jamMulai, jamAkhir);
            if (newEvent) eventId = newEvent.id;
        } else if (type === 'task') {
            const newTask = await window.createTaskBackend(date, jamDeadline, status);
            if (newTask) taskId = newTask.id;
        }

        if (((type === 'event' && eventId) || (type === 'task' && taskId)) && kategoriId && prioritasId) {
            const newDataJadwal = await window.createDataJadwalBackend(title, desc, eventId, taskId, kategoriId, prioritasId);
            if (newDataJadwal) {
                await window.recordUserInteraction(); // Panggil fungsi untuk mencatat streak
                return { newDataJadwal }; 
            }
        }
        return null;
    } catch (error) {
        console.error('Error in createQuest logic:', error);
        throw error;
    }
}


window.handleCreateKategori = async function() {
    const namaKategori = document.getElementById('kategoriNama').value;
    const color = document.getElementById('kategoriColor').value;

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/kategori`, {
            method: 'POST',
            body: JSON.stringify({ namaKategori, color })
        });
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error creating kategori:', error);
        window.displayResponse({ message: 'Error jaringan atau server.' }, true);
    }
}

window.handleGetAllKategori = async function() {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/kategori`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting kategori:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleCreatePrioritas = async function() {
    const namaPrioritas = document.getElementById('prioritasNama').value;
    const color = document.getElementById('prioritasColor').value;

    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/prioritas`, {
            method: 'POST',
            body: JSON.stringify({ namaPrioritas, color })
        });
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error creating prioritas:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleGetAllPrioritas = async function() {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/prioritas`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting prioritas:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleCreateEvent = async function() {
    const tanggal = document.getElementById('eventTanggal').value;
    const jamMulai = document.getElementById('eventJamMulai').value;
    const jamAkhir = document.getElementById('eventJamAkhir').value;

    try {
        const newEvent = await window.createEventBackend(tanggal, jamMulai, jamAkhir);
        if (newEvent) {
            window.displayResponse(newEvent);
        }
    } catch (error) {
        console.error('Error creating event:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleGetAllEvents = async function() {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/events`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting events:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleCreateTask = async function() {
    const tanggal = document.getElementById('taskTanggal').value;
    const jamDeadline = document.getElementById('taskJamDeadline').value;
    const status = document.getElementById('taskStatus').value;

    try {
        const newTask = await window.createTaskBackend(tanggal, jamDeadline, status);
        if (newTask) {
            window.displayResponse(newTask);
        }
    } catch (error) {
        console.error('Error creating task:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleGetAllTasks = async function() {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/tasks`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting tasks:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleCreateDataJadwal = async function() {
    const judulJadwal = document.getElementById('jadwalJudul').value;
    const deskripsiJadwal = document.getElementById('jadwalDeskripsi').value;
    const eventId = document.getElementById('jadwalEventId').value;
    const taskId = document.getElementById('jadwalTaskId').value;
    const kategoriId = document.getElementById('jadwalKategoriId').value;
    const prioritasId = document.getElementById('jadwalPrioritasId').value;

    try {
        const newDataJadwal = await window.createDataJadwalBackend(
            judulJadwal,
            deskripsiJadwal,
            eventId ? parseInt(eventId) : null,
            taskId ? parseInt(taskId) : null,
            kategoriId ? parseInt(kategoriId) : null,
            prioritasId ? parseInt(prioritasId) : null
        );
        if (newDataJadwal) {
            window.displayResponse(newDataJadwal);
        }
    } catch (error) {
        console.error('Error creating Data Jadwal:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleGetAllDataJadwal = async function() {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting Data Jadwal:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// Reports
window.handleGetReportsByPrioritas = async function() {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal/reports/by-prioritas`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting reports by prioritas:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleGetReportsByKategori = async function() {
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal/reports/by-kategori`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting reports by kategori:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleGetEventCountsByPeriod = async function() {
    const periodType = document.getElementById('reportPeriodType').value;
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal/reports/events-by-period?periodType=${periodType}`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting event counts by period:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

window.handleGetTaskCountsByPeriod = async function() {
    const periodType = document.getElementById('reportPeriodType').value;
    try {
        const response = await window.fetchProtected(`${window.BASE_URL}/data-jadwal/reports/tasks-by-period?periodType=${periodType}`);
        if (response) {
            const data = await response.json();
            window.displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting task counts by period:', error);
        window.displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// Fungsi untuk mencatat interaksi streak
// window.recordUserInteraction = async function() {
//     if (!window.userId) {
//         console.warn('User ID tidak ditemukan. Streak tidak dicatat.');
//         return;
//     }
//     try {
//         const response = await window.fetchProtected(`${window.BASE_URL}/users/${window.userId}/record-interaction`, {
//             method: 'POST'
//         });
//         if (response) {
//             const data = await response.json();
//             console.log("Interaksi streak dicatat!", data);
//             // Panggil fungsi di scriptDashboard.js untuk me-refresh tampilan streak
//             if (typeof fetchAndDisplayStreak === 'function') { // Check if the function exists
//                 fetchAndDisplayStreak();
//             } else {
//                 console.warn("fetchAndDisplayStreak function not found. Streak UI will not refresh automatically.");
//             }
//         }
//     } catch (error) {
//         console.error('Error recording user interaction:', error);
//     }
// }