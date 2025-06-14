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
    const fillWidths = [0, 33, 66, 94];
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
            } else {
                taskTimeInput.classList.add('hidden');
                eventTimeInput.classList.remove('hidden');
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