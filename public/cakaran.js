// js/script.js

const gemData = [
    {
        active: "/assets/Aset_Aplikasi_Non_critical.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#82E97B',
        description: 'Tasks with low impact that can be done later without causing problems.'
    },

    {
        active: "/assets/Aset_Aplikasi_Perventive.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#7BD6EB',
        description: 'Regular tasks done to avoid bigger issues in the future.'
    },
    
    {
        active: "/assets/Aset_Aplikasi_Urgent.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#DC7BEB',
        description: 'Important tasks that should be handled soon to prevent disruption.'
    },

    {
        active: "/assets/Aset_Aplikasi_Emergency.png",
        inactive: "/assets/Aset_Aplikasi_Gem_Gray.png",
        color: '#EC7980',
        description: 'Critical issues that must be fixed immediately to ensure safety or function.'
    }
];

let currentLevel = -1;

function setLevel(level) {
    // if same level, do nothing
    if (currentLevel === level) {
        return;
    }

    // update fill bar
    const fillWidths = [5, 35, 70, 100];
    const sliderFill = document.getElementById("slider-fill");
    if (sliderFill) { // pake validasi untuk menghindari error
        sliderFill.style.width = `${fillWidths[level]}%`;
        sliderFill.style.backgroundColor = gemData[level].color;
    }

    // update gems nya
    for (let i = 0; i < gemData.length; i++) {
    const gemImage = document.getElementById(`gem-${i}`);
        if (gemImage) { 
            if (i === level) {
                gemImage.src = gemData[i].active;
            } else {
                gemImage.src = gemData[i].inactive;
            }
        }
    }

    // update dskripsi prioritasnya
    const info = document.getElementById("gem-info");
    if (info) {
        info.innerText = `${gemData[level].description}`;
        info.style.color = gemData[level].color;
    }
    
    currentLevel = level;
}

document.addEventListener('DOMContentLoaded', function() {
    // Darkmode
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');

    if (themeToggle && html && icon) {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        }

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
        });
    }

    const openPopupBtn = document.getElementById('openPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const popupOverlay = document.getElementById('popupOverlay');

    if (openPopupBtn) { // Periksa elemen ada sebelum menambahkan event listener
        openPopupBtn.addEventListener('click', function() {
            if (popupOverlay) popupOverlay.classList.remove('hidden');
        });
    } else {
        console.warn("Element with ID 'openPopup' not found.");
    }

    if (closePopupBtn) { // Periksa elemen ada
        closePopupBtn.addEventListener('click', function() {
            if (popupOverlay) popupOverlay.classList.add('hidden');
        });
    } else {
        console.warn("Element with ID 'closePopup' not found.");
    }

    if (popupOverlay) { // Periksa elemen ada
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                popupOverlay.classList.add('hidden');
            }
        });
    } else {
        console.warn("Element with ID 'popupOverlay' not found.");
    }

    // EVENT OR TASK : TIME OPTION
    const taskTypeRadio = document.getElementById('taskType');
    const eventTypeRadio = document.getElementById('eventType');
    const taskTimeInput = document.getElementById('taskTimeInput');
    const eventTimeInput = document.getElementById('eventTimeInput');
    const deadlineTimeInput = document.getElementById('deadlineTime'); // Tambahkan variabel untuk input ini
    const startTimeInput = document.getElementById('startTime'); // Tambahkan variabel untuk input ini
    const endTimeInput = document.getElementById('endTime'); // Tambahkan variabel untuk input ini


    function toggleTimeInputs() {
        if (taskTypeRadio && eventTypeRadio && taskTimeInput && eventTimeInput && deadlineTimeInput && startTimeInput && endTimeInput) {
            if (taskTypeRadio.checked) {
                taskTimeInput.classList.remove('hidden');
                eventTimeInput.classList.add('hidden');
                deadlineTimeInput.required = true; // Akses melalui variabel
                startTimeInput.required = false; // Akses melalui variabel
                endTimeInput.required = false; // Akses melalui variabel
            } else {
                taskTimeInput.classList.add('hidden');
                eventTimeInput.classList.remove('hidden');
                deadlineTimeInput.required = false; // Akses melalui variabel
                startTimeInput.required = true; // Akses melalui variabel
                endTimeInput.required = true; // Akses melalui variabel
            }
        } else {
            console.warn("One or more time input elements for toggleTimeInputs not found.");
        }
    }

    toggleTimeInputs();
    if (taskTypeRadio) taskTypeRadio.addEventListener('change', toggleTimeInputs);
    if (eventTypeRadio) eventTypeRadio.addEventListener('change', toggleTimeInputs);

    // PRIORITY CUSTOM (dari scriptDashboard.js asli)
    const info = document.getElementById("gem-info");
    if (info) {
        info.innerText = "Pilih level prioritas"; // Menginisialisasi pesan
    } else {
        console.warn("Element with ID 'gem-info' not found.");
    }

    for (let i = 0; i < gemData.length; i++) {
        const gemImage = document.getElementById(`gem-${i}`);
        if (gemImage) {
            gemImage.src = gemData[i].inactive;
        } else {
             console.warn(`Element with ID 'gem-${i}' not found.`);
        }
    }

    const sliderFill = document.getElementById("slider-fill");
        if (sliderFill) {
            sliderFill.style.width = `0%`;
            sliderFill.style.backgroundColor = 'transparent';
        } else {
            console.warn("Element with ID 'slider-fill' not found.");
        }
    currentLevel = -1;
    
    // BUTTON MORE (tetap di sini)
    const moreButtons = document.querySelectorAll('.moreButton');

    moreButtons.forEach(button => {
        button.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Coming Soon!');
        });
    });

    // FORM SUBMIT (Popup "Add New Quest") - Panggil fungsi dari schedule-functions.js
    const scheduleForm = document.getElementById('scheduleForm');
    const todaySchedule = document.getElementById('todaySchedule');
    const categoryColorInput = document.getElementById('categoryColorInput');
    const activityTitle = document.getElementById('activityTitle');
    const activityDescription = document.getElementById('activityDescription');
    const activityDate = document.getElementById('activityDate');
    const categoryInput = document.getElementById('categoryInput');

    if (scheduleForm && todaySchedule && categoryColorInput && activityTitle && activityDescription && activityDate && categoryInput) {
        scheduleForm.addEventListener('submit', async function(e){
            e.preventDefault();

            const type = document.querySelector('input[name="scheduleType"]:checked').value;
            const title = activityTitle.value;
            const desc = activityDescription.value;
            const date = activityDate.value;
            const categoryName = categoryInput.value;
            const categoryColor = categoryColorInput.value;
            let jamMulai = null;
            let jamAkhir = null;
            let jamDeadline = null;
            let status = null;

            if (type === 'task') {
                jamDeadline = deadlineTimeInput.value; 
                status = "TODO";
            } else { // type === 'event'
                jamMulai = startTimeInput.value; 
                jamAkhir = endTimeInput.value;
            }

            try {
                // Panggil fungsi createQuest (yang akan berada di schedule-functions.js)
                const questData = await createQuest(type, title, desc, date, jamMulai, jamAkhir, jamDeadline, status, categoryName, categoryColor, currentLevel, gemData);
                
                if(questData) {
                    // Pastikan window.displayResponse ada
                    if (typeof window.displayResponse === 'function') {
                        window.displayResponse({ message: "Quest berhasil ditambahkan!", data: questData.newDataJadwal }, false);
                    } else {
                        console.log("Quest berhasil ditambahkan!", questData.newDataJadwal);
                    }
                    

                    // Tambahkan ke UI Schedule
                    const newSchedule = document.createElement('div');
                    newSchedule.className = "bg-white flex-col border-[1px] p-3 rounded-[3px] border-accent/10";
                    let timeDisplay = '';
                    if (type === 'task') {
                        timeDisplay = jamDeadline;
                    } else {
                        timeDisplay = `${jamMulai} - ${jamAkhir}`;
                    }
                    
                    let flagColorHex = '#808080';
                    if (currentLevel !== -1) {
                        flagColorHex = gemData[currentLevel].color;
                    }
                    
                    newSchedule.innerHTML = `
                        <div class="flex items-stretch">
                            <div class="w-2 rounded-l-md mr-4" style="background-color: ${flagColorHex};"></div>
                            <div>
                                <span class="text-accent font-bold lg:text-xl text-lg">${title}</span>
                                <p class="lg:text-sm text-[12px]">${desc}</p>
                                <div class="flex gap-2">
                                    <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
                                        <i class="fa-solid fa-clock text-accent"></i>
                                        <span class="text-accent lg:text-sm text-[12px] ">${timeDisplay}</span>
                                    </div>
                                    <div class="inline-flex gap-x-2 items-center mt-2" style="background-color:${categoryColor}50; border-radius:9999px; padding:0.25rem 0.5rem;">
                                        <span class="text-accent lg:text-sm text-[12px] font-semibold">${categoryName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    if (todaySchedule) {
                        todaySchedule.appendChild(newSchedule);
                    }
                } else {
                    if (typeof window.displayResponse === 'function') {
                        window.displayResponse({ message: "Gagal menambahkan Quest (operasi backend)." }, true);
                    } else {
                        console.error("Gagal menambahkan Quest (operasi backend).");
                    }
                }

            } catch (error) {
                console.error('Error in form submit/create quest:', error);
                if (typeof window.displayResponse === 'function') {
                    window.displayResponse({ message: 'Terjadi kesalahan saat memproses quest.' }, true);
                } else {
                    console.error('Terjadi kesalahan saat memproses quest.');
                }
            }

            // Reset form & UI
            scheduleForm.reset();
            if (popupOverlay) popupOverlay.classList.add('hidden');
            for (let i = 0; i < gemData.length; i++) {
                const gemImage = document.getElementById(`gem-${i}`);
                if (gemImage) gemImage.src = gemData[i].inactive;
            }
            if (sliderFill) {
                sliderFill.style.width = `0%`;
                sliderFill.style.backgroundColor = 'transparent';
            }
            currentLevel = -1;
            const infoElement = document.getElementById("gem-info");
            if (infoElement) infoElement.innerText = "";
        });
    } else {
        console.warn("One or more schedule form elements not found.");
    }

    // Initial render for calendar/priority display
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
});