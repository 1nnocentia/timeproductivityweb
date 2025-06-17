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

// --- State ---
let quests = [];
let currentPriorityLevel = 0;

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
    
    currentPriorityLevel = level;
    currentLevel = level;
}

document.addEventListener('DOMContentLoaded', function() {
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
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const colorOptions = document.getElementById('colorOptions');

    // initial color
    if (colorPickerBtn) {
        colorPickerBtn.style.backgroundColor = '#E29B9C';
    }

    // Tampilkan atau sembunyikan dropdown warna saat diklik
    if (colorPickerBtn) {
        colorPickerBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (colorOptions) {
                colorOptions.classList.toggle('hidden');
            }
        });
    }

    if (colorOptions) {
        colorOptions.addEventListener('click', function (e) {
            if (e.target.dataset.color) {
                const selectedColor = e.target.dataset.color;
                if (colorPickerBtn) {
                    colorPickerBtn.style.backgroundColor = selectedColor;
                }
                if (colorOptions) {
                    colorOptions.classList.add('hidden');
                }
            }
        });
    }

    document.addEventListener('click', function () {
        if (colorOptions) {
            colorOptions.classList.add('hidden');
        }
    });

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

// Show modal
document.getElementById('addCategoryBtn').onclick = function() {
  document.getElementById('addCategoryModal').classList.remove('hidden');
};

// Hide modal
function closeCategoryModal() {
  document.getElementById('addCategoryModal').classList.add('hidden');
}

// Add category
let categories = [];

function addCategory(event) {
    event.preventDefault();
    const name = document.getElementById('categoryNameInput').value.trim();
    // This must be the color input from the Add Category modal!
    const color = document.querySelector('#addCategoryModal #categoryColorInput').value;
    if (!name) return;
    categories.push({ name, color });
    renderCategories();
    document.getElementById('addCategoryModal').classList.add('hidden');
    event.target.reset();
}

function renderCategories() {
    const list = document.getElementById('categoryList');
    list.innerHTML = '';
    categories.forEach((cat, idx) => {
        const div = document.createElement('div');
        div.className = "flex items-center gap-2 px-3 py-2 rounded-lg mb-2";
        div.style.background = cat.color;
        div.style.minHeight = "40px";
        div.innerHTML = `
            <span class="text-white font-semibold">${cat.name}</span>
            <button onclick="removeCategory(${idx})" class="ml-2 text-white font-bold text-lg leading-none" style="background:transparent;border:none;outline:none;cursor:pointer;">&times;</button>
        `;
        list.appendChild(div);
    });
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

//////////////////////////////////////////////////////////////////////////////////

function setView(view) {
  document.getElementById('week-view').classList.add('hidden');
  document.getElementById('month-view').classList.add('hidden');
  document.getElementById('year-view').classList.add('hidden');
  document.getElementById(view + '-view').classList.remove('hidden');
}
setView('week'); // Default view

function toggleTimeInput(type) {
    const taskInput = document.getElementById('taskTimeInput');
    const eventInput = document.getElementById('eventTimeInput');

    if (type === 'event') {
        taskInput.classList.add('hidden');
        eventInput.classList.remove('hidden');
    } else {
        taskInput.classList.remove('hidden');
        eventInput.classList.add('hidden');
    }
}
function closeModal() {
    document.getElementById('addActivityModal').classList.add('hidden');
}

// --- Task/Event Toggle ---
document.getElementById('taskType').addEventListener('change', function() {
    document.getElementById('taskTimeInput').classList.remove('hidden');
    document.getElementById('eventTimeInput').classList.add('hidden');
});
document.getElementById('eventType').addEventListener('change', function() {
    document.getElementById('taskTimeInput').classList.add('hidden');
    document.getElementById('eventTimeInput').classList.remove('hidden');
});

// --- Popup Open/Close ---
document.querySelectorAll('[onclick="openQuestModal()"]').forEach(btn => {
    btn.onclick = openQuestModal;
});
function openQuestModal() {
    document.getElementById('scheduleForm').reset();
    setLevel(0);
    document.getElementById('taskTimeInput').classList.remove('hidden');
    document.getElementById('eventTimeInput').classList.add('hidden');
    document.getElementById('popupOverlay').classList.remove('hidden');
}
document.getElementById('closePopup').onclick = function() {
    document.getElementById('popupOverlay').classList.add('hidden');
};

// --- Form Submission ---
document.getElementById('scheduleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Get values
    const type = document.querySelector('input[name="scheduleType"]:checked').value;
    const title = document.getElementById('activityTitle').value.trim();
    const desc = document.getElementById('activityDescription').value.trim();
    const date = document.getElementById('activityDate').value;
    const category = document.getElementById('categoryInput').value.trim();
    const categoryColor = document.getElementById('categoryColorInput').value;
    const priority = currentPriorityLevel;
    let startTime = "", endTime = "";

    if (type === "task") {
        startTime = document.getElementById('deadlineTime').value;
        endTime = "";
        if (!startTime) return alert("Please fill deadline time.");
    } else {
        startTime = document.getElementById('startTime').value;
        endTime = document.getElementById('endTime').value;
        if (!startTime || !endTime) return alert("Please fill start and end time.");
    }

    if (!title || !desc || !date || !category) {
        alert("Please fill all required fields.");
        return;
    }

    quests.push({
        type, title, desc, date, startTime, endTime, category, categoryColor, priority
    });

    document.getElementById('popupOverlay').classList.add('hidden');
    renderCalendar();
});

// --- Calendar Rendering ---
function renderCalendar() {
    // --- Setup grid ---
    // Find the week for the selected date (or use current week)
    const today = new Date();
    const weekStart = getStartOfWeek(today);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        weekDates.push(d);
    }
    // Hours (7AM to 4PM as in your screenshot)
    const hours = Array.from({length: 10}, (_, i) => 7 + i);

    // --- Build grid HTML ---
    let html = '<table class="min-w-full border-separate border-spacing-0"><thead><tr><th class="w-16"></th>';
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    for (let d = 0; d < 7; d++) html += `<th class="text-center">${dayNames[d]}</th>`;
    html += '</tr></thead><tbody>';

    for (let h = 0; h < hours.length; h++) {
        html += `<tr>`;
        html += `<td class="text-xs text-gray-500 pr-2 py-1 align-top w-16">${hours[h]} AM${hours[h] >= 12 ? '' : ''}</td>`;
        for (let d = 0; d < 7; d++) {
            const cellDate = weekDates[d];
            const cellDateStr = cellDate.toISOString().slice(0,10);
            const cellHour = hours[h];

            // Find quests for this cell
            const cellQuests = quests.filter(q => {
                if (q.date !== cellDateStr) return false;
                // For event: show if startTime hour matches
                if (q.type === "event") {
                    const startH = parseInt(q.startTime.split(":")[0]);
                    return startH === cellHour;
                }
                // For task: show if deadline hour matches
                if (q.type === "task") {
                    const taskH = parseInt(q.startTime.split(":")[0]);
                    return taskH === cellHour;
                }
                return false;
            });

            if (cellQuests.length > 0) {
                html += `<td class="align-top px-1 py-0.5">`;
                cellQuests.forEach(quest => {
                    html += `
                    <div class="rounded-lg px-2 py-1 text-xs text-white font-semibold shadow mb-1"
                        style="background:${quest.categoryColor}; min-height:40px;">
                        <div>${quest.startTime}${quest.endTime ? ' - ' + quest.endTime : ''} <br>${quest.title}</div>
                    </div>
                    `;
                });
                html += `</td>`;
            } else {
                html += `<td class="align-top px-1 py-0.5"></td>`;
            }
        }
        html += `</tr>`;
    }
    html += '</tbody></table>';

    // Place in your week-view container
    document.getElementById('week-view').innerHTML = html;
}

// --- Helper: Get start of week (Sunday) ---
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0,0,0,0);
    return d;
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', function() {
    setLevel(0);
    renderCalendar();
});

function renderEventsOnGrid() {
    const overlay = document.getElementById('eventOverlay');
    overlay.innerHTML = '';

    // Grid settings
    const hourStart = 7; // 7 AM
    const hourEnd = 16;  // 4 PM
    const hourHeight = 40; // px, adjust to match your cell height
    const dayWidth = overlay.offsetWidth / 7;

    quests.forEach(q => {
        // Find day index (0=Sun, 1=Mon, ...)
        const date = new Date(q.date);
        const dayIdx = date.getDay();
        // Find hour index
        let startHour = parseInt(q.startTime.split(':')[0]);
        let endHour = q.endTime ? parseInt(q.endTime.split(':')[0]) : startHour + 1;
        if (startHour < hourStart || startHour > hourEnd) return; // skip out of range

        const top = (startHour - hourStart) * hourHeight;
        const height = ((endHour - startHour) || 1) * hourHeight - 4; // -4 for margin
        const left = dayIdx * dayWidth + 2; // +2 for border
        const width = dayWidth - 6; // -6 for margin

        // Create event block
        const eventDiv = document.createElement('div');
        eventDiv.style.position = 'absolute';
        eventDiv.style.top = `${top}px`;
        eventDiv.style.left = `${left}px`;
        eventDiv.style.width = `${width}px`;
        eventDiv.style.height = `${height}px`;
        eventDiv.style.background = q.categoryColor;
        eventDiv.style.borderRadius = '0.5rem';
        eventDiv.style.color = '#fff';
        eventDiv.style.fontWeight = 'bold';
        eventDiv.style.fontSize = '0.9rem';
        eventDiv.style.padding = '4px 8px';
        eventDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        eventDiv.style.pointerEvents = 'auto';
        eventDiv.innerHTML = `<div>${q.startTime}${q.endTime ? ' - ' + q.endTime : ''}</div><div>${q.title}</div>`;
        overlay.appendChild(eventDiv);
    });
}

function removeCategory(idx) {
    categories.splice(idx, 1);
    renderCategories();
}

// --- Settings ---
const hours = Array.from({length: 24}, (_, i) => i); // 0-23
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- Render Time Labels ---
const timeLabelTemplate = document.getElementById('time-label-template');
const timeLabelsContainer = document.querySelector('.w-16.flex-col');
timeLabelsContainer.innerHTML = '<div class="h-12"></div>';
hours.forEach(h => {
  const heightValue = 4.5; // in rem, or any unit you prefer
    node.querySelector('div').style.height = `${heightValue}rem`; // dynamically sets height

    // Still set the time label as before
    node.querySelector('div').textContent = (
        h === 0 ? '12 AM' :
        h < 12 ? `${h} AM` :
        h === 12 ? '12 PM' :
        `${h - 12} PM`
        );

});

// --- Render Day Headers ---
const dayHeaderTemplate = document.getElementById('day-header-template');
const dayHeaderRow = document.querySelector('.grid.grid-cols-7.border-b');
dayHeaderRow.innerHTML = '';
days.forEach(d => {
  const node = dayHeaderTemplate.content.cloneNode(true);
  node.querySelector('div').textContent = d;
  dayHeaderRow.appendChild(node);
});

// --- Render Calendar Grid Lines and Events ---
function renderCalendarGrid(events=[]) {
  const gridBody = document.getElementById('calendarGridBody');
  gridBody.innerHTML = '';

  // Draw grid lines
  for (let h = 0; h < hours.length; h++) {
    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('div');
      cell.className = 'absolute border-b border-r border-gray-200';
      cell.style.top = `${h * 26}px`; // 26px per hour row
      cell.style.left = `${d * (100/7)}%`;
      cell.style.width = `${100/7}%`;
      cell.style.height = '26px';
      cell.style.pointerEvents = 'none';
      gridBody.appendChild(cell);
    }
  }

  // Render events
  events.forEach(ev => {
    // ev: {title, dayIdx, startHour, endHour, color}
    const eventDiv = document.createElement('div');
    eventDiv.className = 'absolute rounded-lg px-2 py-1 text-xs text-white font-semibold shadow';
    eventDiv.style.background = ev.color;
    eventDiv.style.left = `${ev.dayIdx * (100/7)}%`;
    eventDiv.style.top = `${ev.startHour * 26}px`;
    eventDiv.style.width = `calc(${100/7}% - 8px)`;
    eventDiv.style.height = `${(ev.endHour-ev.startHour) * 26 - 4}px`;
    eventDiv.style.marginLeft = '4px';
    eventDiv.style.marginRight = '4px';
    eventDiv.style.zIndex = 2;
    eventDiv.innerHTML = `<div>${ev.title}</div>`;
    gridBody.appendChild(eventDiv);
  });
}

// --- Example Events ---
const exampleEvents = [
  { title: 'Olahraga Pagi', dayIdx: 0, startHour: 7, endHour: 9, color: '#B9E29B' },
  { title: 'Calculus', dayIdx: 0, startHour: 10, endHour: 12, color: '#9BBFE2' },
  { title: 'Rapat', dayIdx: 2, startHour: 7, endHour: 13, color: '#B69BE2' }
];

// --- Initial Render ---
renderCalendarGrid(exampleEvents);

// --- Calendar View Switcher ---
document.getElementById('weekBtn').onclick = function() {
    document.getElementById('week-view').classList.remove('hidden');
    document.getElementById('month-view').classList.add('hidden');
};
document.getElementById('monthBtn').onclick = function() {
    document.getElementById('week-view').classList.add('hidden');
    document.getElementById('month-view').classList.remove('hidden');
};
document.getElementById('yearBtn').onclick = function() {
    document.getElementById('week-view').classList.add('hidden');
    document.getElementById('month-view').classList.add('hidden');
};
// Show week view by


// Store quests in memory, with some example tasks
let qs = [
    {
        type: "task",
        title: "Math Homework",
        desc: "Finish calculus exercises",
        date: "2025-06-22", // Example: Sunday
        startTime: "",
        endTime: "",
        deadlineTime: "09:00",
        category: "Study",
        categoryColor: "#4F8EF7"
    },
    {
        type: "event",
        title: "Morning Jog",
        desc: "Jogging at the park",
        date: "2025-06-23", // Example: Monday
        startTime: "06:00",
        endTime: "07:00",
        deadlineTime: "",
        category: "Health",
        categoryColor: "#34A853"
    },
    {
        type: "task",
        title: "Project Meeting",
        desc: "Discuss project with team",
        date: "2025-06-25", // Example: Wednesday
        startTime: "",
        endTime: "",
        deadlineTime: "14:00",
        category: "Work",
        categoryColor: "#FABB05"
    }
];