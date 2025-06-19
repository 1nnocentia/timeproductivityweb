async function getKategoriByName(name) {
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

async function createKategoriBackend(namaKategori, color) {
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

async function getPrioritasByName(name) {
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

async function createPrioritasBackend(namaPrioritas, color) {
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


// endpoint untuk mendapatkan semua kategori
async function handleCreateKategori() {
    const namaKategori = document.getElementById('kategoriNama').value;
    const color = document.getElementById('kategoriColor').value;

    try {
        const response = await fetchProtected(`${BASE_URL}/kategori`, {
            method: 'POST',
            body: JSON.stringify({ namaKategori, color })
        });
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error creating kategori:', error);
        displayResponse({ message: 'Error jaringan atau server.' }, true);
    }
}

async function handleGetAllKategori() {
    try {
        const response = await fetchProtected(`${BASE_URL}/kategori`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting kategori:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// prioritas
async function handleCreatePrioritas() {
    const namaPrioritas = document.getElementById('prioritasNama').value;
    const color = document.getElementById('prioritasColor').value;

    try {
        const response = await fetchProtected(`${BASE_URL}/prioritas`, {
            method: 'POST',
            body: JSON.stringify({ namaPrioritas, color })
        });
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error creating prioritas:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

async function handleGetAllPrioritas() {
    try {
        const response = await fetchProtected(`${BASE_URL}/prioritas`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting prioritas:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// events
async function createEventBackend(tanggal, jamMulai, jamAkhir) {
    try {
        const response = await fetchProtected(`${BASE_URL}/events`, {
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

async function handleCreateEvent() {
    const tanggal = document.getElementById('eventTanggal').value;
    const jamMulai = document.getElementById('eventJamMulai').value;
    const jamAkhir = document.getElementById('eventJamAkhir').value;

    try {
        const newEvent = await createEventBackend(tanggal, jamMulai, jamAkhir);
        if (newEvent) {
            displayResponse(newEvent);
        }
    } catch (error) {
        console.error('Error creating event:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

async function handleGetAllEvents() {
    try {
        const response = await fetchProtected(`${BASE_URL}/events`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting events:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// task
async function createTaskBackend(tanggal, jamDeadline, status) {
    try {
        const response = await fetchProtected(`${BASE_URL}/tasks`, {
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

async function handleCreateTask() {
    const tanggal = document.getElementById('taskTanggal').value;
    const jamDeadline = document.getElementById('taskJamDeadline').value;
    const status = document.getElementById('taskStatus').value;

    try {
        const newTask = await createTaskBackend(tanggal, jamDeadline, status);
        if (newTask) {
            displayResponse(newTask);
        }
    } catch (error) {
        console.error('Error creating task:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

async function handleGetAllTasks() {
    try {
        const response = await fetchProtected(`${BASE_URL}/tasks`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting tasks:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// data jadwal
async function createDataJadwalBackend(judulJadwal, deskripsiJadwal, eventId, taskId, kategoriId, prioritasId) {
    try {
        const response = await fetchProtected(`${BASE_URL}/data-jadwal`, {
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

async function handleCreateDataJadwal() {
    const judulJadwal = document.getElementById('jadwalJudul').value;
    const deskripsiJadwal = document.getElementById('jadwalDeskripsi').value;
    const eventId = document.getElementById('jadwalEventId').value;
    const taskId = document.getElementById('jadwalTaskId').value;
    const kategoriId = document.getElementById('jadwalKategoriId').value;
    const prioritasId = document.getElementById('jadwalPrioritasId').value;

    try {
        const newDataJadwal = await createDataJadwalBackend(
            judulJadwal,
            deskripsiJadwal,
            eventId ? parseInt(eventId) : null,
            taskId ? parseInt(taskId) : null,
            kategoriId ? parseInt(kategoriId) : null,
            prioritasId ? parseInt(prioritasId) : null
        );
        if (newDataJadwal) {
            displayResponse(newDataJadwal);
        }
    } catch (error) {
        console.error('Error creating Data Jadwal:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

async function handleGetAllDataJadwal() {
    try {
        const response = await fetchProtected(`${BASE_URL}/data-jadwal`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting Data Jadwal:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// grafik laporan
async function handleGetReportsByPrioritas() {
    try {
        const response = await fetchProtected(`${BASE_URL}/data-jadwal/reports/by-prioritas`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting reports by prioritas:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

async function handleGetReportsByKategori() {
    try {
        const response = await fetchProtected(`${BASE_URL}/data-jadwal/reports/by-kategori`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting reports by kategori:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

async function handleGetEventCountsByPeriod() {
    const periodType = document.getElementById('reportPeriodType').value;
    try {
        const response = await fetchProtected(`${BASE_URL}/data-jadwal/reports/events-by-period?periodType=${periodType}`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting event counts by period:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

async function handleGetTaskCountsByPeriod() {
    const periodType = document.getElementById('reportPeriodType').value;
    try {
        const response = await fetchProtected(`${BASE_URL}/data-jadwal/reports/tasks-by-period?periodType=${periodType}`);
        if (response) {
            const data = await response.json();
            displayResponse(data);
        }
    } catch (error) {
        console.error('Error getting task counts by period:', error);
        displayResponse({ message: 'Network or Server Error.' }, true);
    }
}

// Fungsi `createQuest` yang dipanggil dari `scriptDashboard.js`
async function createQuest(type, title, desc, date, jamMulai, jamAkhir, jamDeadline, status, categoryName, categoryColor, currentLevel, gemData) {
    let kategoriId = null;
    let prioritasId = null;
    let eventId = null;
    let taskId = null;

    try {
        // 1. create atau get Kategori
        let existingKategori = await getKategoriByName(categoryName);
        if (existingKategori) {
            kategoriId = existingKategori.id;
        } else {
            const newKategori = await createKategoriBackend(categoryName, categoryColor);
            if (newKategori) kategoriId = newKategori.id;
        }

        // 2. create atau get Prioritas
        const priorityDescription = gemData[currentLevel].description.split(' ')[0];
        let existingPrioritas = await getPrioritasByName(priorityDescription);
        if (existingPrioritas) {
            prioritasId = existingPrioritas.id;
        } else if (currentLevel !== -1) {
            const newPrioritas = await createPrioritasBackend(priorityDescription, gemData[currentLevel].color);
            if (newPrioritas) prioritasId = newPrioritas.id;
        }

        // 3. create Event atau Task
        if (type === 'event') {
            const newEvent = await createEventBackend(date, jamMulai, jamAkhir);
            if (newEvent) eventId = newEvent.id;
        } else if (type === 'task') {
            const newTask = await createTaskBackend(date, jamDeadline, status);
            if (newTask) taskId = newTask.id;
        }

        // 4. create DataJadwal
        if (((type === 'event' && eventId) || (type === 'task' && taskId)) && kategoriId && prioritasId) {
            const newDataJadwal = await createDataJadwalBackend(title, desc, eventId, taskId, kategoriId, prioritasId);
            if (newDataJadwal) {
                return { newDataJadwal }; 
            }
        }
        return null;
    } catch (error) {
        console.error('Error in createQuest logic:', error);
        throw error;
    }
}
