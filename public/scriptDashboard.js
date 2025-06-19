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
let schedules = []; // {title, desc, level, done, ...}

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
    
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }
    
    // Check for saved theme or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark');
        updateIcon(true);
    } else {
        html.classList.remove('dark');
        updateIcon(false);
    }
    
    // Update toggle button icon
    function updateIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (isDark) {
                icon.className = 'fas fa-sun text-white';
            } else {
                icon.className = 'fas fa-moon text-accent';
            }
        }
    }
    
    // Toggle function
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
        
        console.log('Theme toggled to:', isDark ? 'light' : 'dark');
    }
    
    // Add click event to toggle button
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });
    
    // Global toggle function
    window.toggleDarkMode = toggleTheme;
    
    const openPopupBtn = document.getElementById('openPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const popupOverlay = document.getElementById('popupOverlay');

    if (openPopupBtn) {
        openPopupBtn.addEventListener('click', function() {
            if (popupOverlay) popupOverlay.classList.remove('hidden');
        });
    }
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function() {
            if (popupOverlay) popupOverlay.classList.add('hidden');
        });
    }

    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) { 
                popupOverlay.classList.add('hidden');
            }
        });
    }

    // EVENT OR TASK : TIME OPTION
    const taskTypeRadio = document.getElementById('taskType');
    const eventTypeRadio = document.getElementById('eventType');
    const taskTimeInput = document.getElementById('taskTimeInput');
    const eventTimeInput = document.getElementById('eventTimeInput');

    function toggleTimeInputs() {
    if (taskTypeRadio && eventTypeRadio && taskTimeInput && eventTimeInput) {
            if (taskTypeRadio.checked) {
                taskTimeInput.classList.remove('hidden');
                eventTimeInput.classList.add('hidden');
                // Set required biar bisa submit 
                document.getElementById('deadlineTime').required = true;
                document.getElementById('startTime').required = false;
                document.getElementById('endTime').required = false;
            } else {
                taskTimeInput.classList.add('hidden');
                eventTimeInput.classList.remove('hidden');
                // Set required biar bisa submit
                document.getElementById('deadlineTime').required = false;
                document.getElementById('startTime').required = true;
                document.getElementById('endTime').required = true;
            }
        }
    }

    toggleTimeInputs();
    if (taskTypeRadio) taskTypeRadio.addEventListener('change', toggleTimeInputs);
    if (eventTypeRadio) eventTypeRadio.addEventListener('change', toggleTimeInputs);

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
    const info = document.getElementById("gem-info");
    if (info) {
        info.innerText = "";
    }

    // pastikan dlu semua gems nya inactive
    for (let i = 0; i < gemData.length; i++) {
        const gemImage = document.getElementById(`gem-${i}`);
        if (gemImage) {
            gemImage.src = gemData[i].inactive;
        }
    }

    // pastikan juga slidernya tidak ada yang terisi
    const sliderFill = document.getElementById("slider-fill");
        if (sliderFill) {
            sliderFill.style.width = `0%`;
            sliderFill.style.backgroundColor = 'transparent';
        }

    
    // BUTTON MORE
    const moreButtons = document.querySelectorAll('.moreButton');

    moreButtons.forEach(button => {
        button.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Coming Soon!');
        });
    });

    // FORM SUBMIT
    const scheduleForm = document.getElementById('scheduleForm');
    const todaySchedule = document.getElementById('todaySchedule');

    scheduleForm.addEventListener('submit', function(e){
        e.preventDefault();

        // Ambil data dari form
        const type = document.querySelector('input[name="scheduleType"]:checked').value;
        const title = document.getElementById('activityTitle').value;
        const desc = document.getElementById('activityDescription').value;
        const date = document.getElementById('activityDate').value;
        const category = document.getElementById('categoryInput').value;
        const color = document.getElementById('categoryColorInput').value;
        
        // Ambil waktu berdasarkan jenisnya
        let time = '';
        if (type === 'task') {
            time = document.getElementById('deadlineTime').value;
        } else {
            const start = document.getElementById('startTime').value;
            const end = document.getElementById('endTime').value;
            time = `${start} - ${end}`;
        }

        // simpan ke array
        schedules.push({
            title,
            desc,
            date,
            category,
            color,
            time,
            type,
            level: currentLevel,
            done: false
        });

        renderScheduleList();
        updateProgress();

        // Pilih warna bendera berdasarkan prioritas
        let flagColor = 'bg-gem_green';
        if (currentLevel === 1) flagColor = 'bg-gem_blue';
        if (currentLevel === 2) flagColor = 'bg-gem_purple';
        if (currentLevel === 3) flagColor = 'bg-gem_red';

        // Style Schedule baru 
        const newSchedule = document.createElement('div');
        newSchedule.className = "bg-white flex-col border-[1px] p-3 rounded-[3px] border-accent/10";
        const scheduleIdx = schedules.length - 1;
        newSchedule.innerHTML = `
            <div class="flex items-stretch">
                <div class="w-2 ${flagColor} rounded-l-md mr-4"></div>
                <div class="w-full">
                    <div class="flex items-center justify-between">
                        <span class="text-accent font-bold lg:text-xl text-lg">${title}</span>
                        <button class="markDoneBtn bg-accent text-secondary rounded-full px-2 py-1 flex items-center gap-x-1" data-idx="${scheduleIdx}">
                            <i class="fa-solid fa-check text-sm"></i>
                            <span class="text-sm font-body">Marks Done</span>  
                        </button>
                    </div>
                    <p class="lg:text-sm text-[12px]">${desc}</p>
                    <div class="flex gap-2">
                        <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
                            <i class="fa-solid fa-clock text-accent"></i>
                            <span class="text-accent lg:text-sm text-[12px] ">${time}</span>
                        </div>

                        <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
                            <i class="fa-solid fa-calendar text-accent"></i>
                            <span class="text-accent lg:text-sm text-[12px] ">${date}</span>
                        </div>

                        <div class="inline-flex gap-x-2 items-center mt-2" style="background-color:${color}50; border-radius:9999px; padding:0.25rem 0.5rem;">
                            <span class="text-accent lg:text-sm text-[12px] font-semibold">${category}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Tambahkan ke todaySchedule
        // todaySchedule.appendChild(newSchedule);

        // Tambahkan event listener untuk tombol Marks Done
        const markBtn = newSchedule.querySelector('.markDoneBtn');
        if (markBtn) {
            markBtn.addEventListener('click', function() {
                const idx = parseInt(this.dataset.idx);
                schedules[idx].done = true;
                this.disabled = true;
                this.classList.add('opacity-50');
                updateProgress();
            });
        }

        // Reset form & tutup popup
        scheduleForm.reset();
        document.getElementById('popupOverlay').classList.add('hidden');
        // Reset priority slider
        for (let i = 0; i < gemData.length; i++) {
            const gemImage = document.getElementById(`gem-${i}`);
            if (gemImage) gemImage.src = gemData[i].inactive;
        }
        const sliderFill = document.getElementById("slider-fill");
        if (sliderFill) {
            sliderFill.style.width = `0%`;
            sliderFill.style.backgroundColor = 'transparent';
        }

        currentLevel = -1;
        document.getElementById("gem-info").innerText = "";
    });
    
    
});


function openModal() {
    document.getElementById('addActivityModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('addActivityModal').classList.add('hidden');
}

function openQuestModal() {
  document.getElementById('addQuestModal').classList.remove('hidden');
}

function closeQuestModal() {
  document.getElementById('addQuestModal').classList.add('hidden');
}


// function toggleTimeInput(type) {
//   const taskInput = document.getElementById('taskTimeInput');
//   const eventInput = document.getElementById('eventTimeInput');
//   if (taskType === 'event') {
//     taskInput.classList.add('hidden');
//     eventInput.classList.remove('hidden');
//   } else {
//     taskInput.classList.remove('hidden');
//     eventInput.classList.add('hidden');
//   }
// }

// SCHEDULE PUNYAA

// Show modal
document.getElementById('addCategoryBtn').onclick = function() {
  document.getElementById('addCategoryModal').classList.remove('hidden');
};

// Hide modal
function closeCategoryModal() {
  document.getElementById('addCategoryModal').classList.add('hidden');
}

// Add category
function addCategory(event) {
  event.preventDefault();
  const name = document.getElementById('categoryNameInput').value;
  const color = document.getElementById('categoryColorInput').value;
  if (name.trim() === "") return;

  // Create category box
  const box = document.createElement('div');
  box.className = "relative flex items-center px-3 py-1 rounded-lg text-white text-sm font-semibold";
  box.style.backgroundColor = color;

  // Category name
  const span = document.createElement('span');
  span.textContent = name;

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.innerHTML = '&times;';
  delBtn.className = "ml-2 text-white text-lg font-bold hover:text-red-400 focus:outline-none";
  delBtn.onclick = function() {
    box.remove();
  };

  box.appendChild(span);
  box.appendChild(delBtn);

  document.getElementById('categoryList').appendChild(box);

  // Reset and close modal
  document.getElementById('categoryForm').reset();
  closeCategoryModal();
}

// Example: June 2025 has 5 weeks
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function showMonth(monthIdx) {
  // Hide month cards
  document.getElementById('monthCards').classList.add('hidden');
  // Show date grid
  const dateGrid = document.getElementById('dateGrid');
  dateGrid.classList.remove('hidden');

  // Set year
  const year = 2025;
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const lastDate = new Date(year, monthIdx + 1, 0).getDate();

  // Build grid header
  let html = `
    <div class="flex justify-between items-center mb-4">
      <span class="text-xl font-bold text-accent-500">${monthNames[monthIdx]} ${year}</span>
      <button onclick="backToMonths()" class="text-accent-500 underline text-sm">Back to months</button>
    </div>
    <div class="grid grid-cols-7 text-center text-base font-semibold text-gray-500 mb-2">
      <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
    </div>
    <div class="grid grid-cols-7 gap-y-6 text-lg font-bold">
  `;

  // Fill blanks before first day
  for (let i = 0; i < firstDay; i++) {
    html += `<div></div>`;
  }

  // Fill days
  for (let d = 1; d <= lastDate; d++) {
    html += `<div class="rounded-lg bg-gray-100 py-6 hover:bg-accent-100 transition cursor-pointer">${d}</div>`;
  }

  html += '</div>';
  dateGrid.innerHTML = html;
}

function backToMonths() {
  document.getElementById('dateGrid').classList.add('hidden');
  document.getElementById('monthCards').classList.remove('hidden');
}

// Initial render
renderCalendar(selectedDate.getFullYear(), selectedDate.getMonth());

let selectedYear = 2025;
let selectedMonth = 5; // 0 = January

function showYearView() {
  document.getElementById('year-view').classList.remove('hidden');
  document.getElementById('month-view').classList.add('hidden');
  document.getElementById('dateGrid').classList.add('hidden');
}

function showMonthsForYear(year) {
  selectedYear = year;
  updateCalendarTitle();
  document.getElementById('year-view').classList.add('hidden');
  document.getElementById('month-view').classList.remove('hidden');
  document.getElementById('dateGrid').classList.add('hidden');
}

function showMonthDates(monthIdx) {
  selectedMonth = monthIdx;
  updateCalendarTitle();
  document.getElementById('month-view').classList.add('hidden');
  document.getElementById('dateGrid').classList.remove('hidden');
  renderDateGrid(selectedYear, selectedMonth);
}

function updateCalendarTitle() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  document.getElementById('calendar-title').textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
}

// Example renderDateGrid function (implement as you wish)
function renderDateGrid(year, month) {
  // ...generate your date grid for the selected year and month...
}

// Initialize title on page load
updateCalendarTitle();

function updateProgress() {
    // Priority: 0=Non Critical, 1=Perventive, 2=Urgent, 3=Emergency
    const priorities = [
        { id: 3, bar: 'bg-gem_red', selector: 'progress-emergency' },
        { id: 2, bar: 'bg-gem_purple', selector: 'progress-urgent' },
        { id: 1, bar: 'bg-gem_blue', selector: 'progress-perventive' },
        { id: 0, bar: 'bg-gem_green', selector: 'progress-noncritical' }
    ];
    priorities.forEach(prio => {
        const total = schedules.filter(s => s.level === prio.id).length;
        const done = schedules.filter(s => s.level === prio.id && s.done).length;
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);

        // Update bar width
        const bar = document.querySelector(`.${prio.selector} .progress-bar`);
        if (bar) bar.style.width = percent + '%';

        // Update text
        const text = document.querySelector(`.${prio.selector} .progress-text`);
        if (text) text.textContent = percent + '%';
    });
}

function renderScheduleList() {
    // Urutkan berdasarkan tanggal dan waktu terdekat
    schedules.sort((a, b) => {
        // Gabungkan date dan time jadi satu Date object
        const aDate = new Date(`${a.date}T${a.time.split(' - ')[0] || a.time}`);
        const bDate = new Date(`${b.date}T${b.time.split(' - ')[0] || b.time}`);
        return aDate - bDate;
    });

    // Kosongkan container
    todaySchedule.innerHTML = '';

    // Render ulang semua schedule
    schedules.forEach((item, idx) => {
        // Pilih warna bendera berdasarkan prioritas
        let flagColor = 'bg-gem_green';
        if (item.level === 1) flagColor = 'bg-gem_blue';
        if (item.level === 2) flagColor = 'bg-gem_purple';
        if (item.level === 3) flagColor = 'bg-gem_red';

        const newSchedule = document.createElement('div');
        newSchedule.className = "bg-white flex-col border-[1px] p-3 rounded-[3px] border-accent/10";
        newSchedule.innerHTML = `
            <div class="flex items-stretch">
                <div class="w-2 ${flagColor} rounded-l-md mr-4"></div>
                <div class="w-full">
                    <div class="flex items-center justify-between">
                        <span class="text-accent font-bold lg:text-xl text-lg">${item.title}</span>
                        <button class="markDoneBtn bg-accent text-secondary rounded-full px-2 py-1 flex items-center gap-x-1" data-idx="${idx}" ${item.done ? 'disabled style="opacity:0.5;"' : ''}>
                            <i class="fa-solid fa-check text-sm"></i>
                            <span class="text-sm font-body">Marks Done</span>  
                        </button>
                    </div>
                    <p class="lg:text-sm text-[12px]">${item.desc}</p>
                    <div class="flex gap-2">
                        <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
                            <i class="fa-solid fa-clock text-accent"></i>
                            <span class="text-accent lg:text-sm text-[12px] ">${item.time}</span>
                        </div>
                        <div class="inline-flex gap-x-2 items-center mt-2 bg-primary rounded-full px-2 py-1">
                            <i class="fa-solid fa-calendar text-accent"></i>
                            <span class="text-accent lg:text-sm text-[12px] ">${item.date}</span>
                        </div>
                        <div class="inline-flex gap-x-2 items-center mt-2" style="background-color:${item.color}50; border-radius:9999px; padding:0.25rem 0.5rem;">
                            <span class="text-accent lg:text-sm text-[12px] font-semibold">${item.category}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        todaySchedule.appendChild(newSchedule);

        // Event listener untuk Marks Done
        const markBtn = newSchedule.querySelector('.markDoneBtn');
        if (markBtn && !item.done) {
            markBtn.addEventListener('click', function() {
                schedules[idx].done = true;
                renderScheduleList();
                updateProgress();
            });
        }
    });
}