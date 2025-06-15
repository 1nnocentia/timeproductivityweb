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
    
    const scheduleType = document.querySelector('input[name="scheduleType"]');
    const activityTitle = document.querySelector('input[name="activityTitle"]');
    const activityDesc = document.querySelector('input[name="activityDesc"]')
    const activityDate = document.querySelector('input[name="activityDate"]');

    const category = document.querySelector('input[name="category"]').value;
    const color = document.getElementById('colorPickerBtn').style.backgroundColor;
    const priority = currentLevel;

    scheduleForm.addEventListener('submit', function(e){})
    
    // FORM SUBMIT DRAFT
    // const scheduleForm = document.getElementById('scheduleForm');
    // if(scheduleForm){
    //     scheduleForm.addEventListener('submit', function(e){
    //         e.preventDefault();

    //         const scheduleType = document.querySelector('input[name="scheduleType"]').value;
    //         const activityTitle = document.querySelector('input[name="activityTitle"]').value;
    //         const activityDesc = document.querySelector('input[name="activityDesc"]')
    //         const activityDate = document.querySelector('input[name="activityDate"]').value;

    //         const category = document.querySelector('input[name="category"]').value;
    //         const color = document.getElementById('colorPickerBtn').style.backgroundColor;
    //         const priority = currentLevel;

    //         let timeData ={};
    //         if(scheduleType === 'task'){
    //             timeData.startTime = document.getElementById('startTime').value;
    //         } else {
    //             timeData.endTime = document.getElementById('endTime').value;
    //         }

    //         const formData = {
    //             id: Data.now(),
    //             scheduleType,
    //             activityTitle,
    //             activityDesc,
    //             activityDate,
    //             category,
    //             color,
    //             priority,
    //             ...timeData
    //         };

            // simpan ke localStorage
            // saveToLocalStorage(formData);

            // reset form
            // scheduleForm.reset();
            // currentLevel = -1;
            // resetPriorityUI();

            // tampilkan data
            // displaySavedData();
    //     });
    // }

    // function resetPriorityUI(){
    //     const info = document.getElementById(gem-info);
    //     if (info) {
    //         info.innerText = "";
    //     }

    //     for(let i = 0; i < gemData.length; i++){
    //         const gemImage = document.getElementById(`gem-${i}`);
    //         if (gemImage){
    //             gemImage.src = gemData[i].inactive;
    //         }
    //     }

    //     const sliderFill = document.getElementById("slider-fill");
    //     if(sliderFill){
    //         sliderFill.style.width = '0%';
    //         sliderFill.style.backgroundColor='transparent';
    //     }
    // }

    // function saveToLocalStorage(data){
    //     let savedData = JSON.parse(localStorage.getItem('questData')) || [];

    //     // tambahkan data baru
    //     savedData.push(data);

    //     // simpan kembali ke localStorage
    //     localStorage.setItem('questData', JSON.stringify(savedData));
    // }


    // fungsi menampilkan data yang disimpan
    // function displaySavedData(){
    //     const savedData = JSON.parse(localStorage.getItem('questData')) || [];
    //     const container = document.getElementById('questContainer');

    //     if (!container)return;

    //     container.innerHTML='';

    //     savedData.forEach(data=> {
    //         const questElement = createQuestElement(data);
    //         container.appendChild(questElement);
    //     });
    // }

    // function createQuestElement(data) {
    //     const questElement = document.createElement('div');
    //     questElement.className = 'bg-white rounded-lg p-4 mb-4 shadow';
    //     questElement.style.borderLeft = `4px solid ${data.color}`;
        
    //     const typeBadge = data.itemType === 'task' ? 
    //         '<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Task</span>' : 
    //         '<span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Event</span>';
        
    //     const priorityText = ['Non-Critical', 'Preventive', 'Urgent', 'Emergency'][data.priority];
        
    //     let timeInfo = '';
    //     if (data.itemType === 'task') {
    //         timeInfo = `<p class="text-sm text-gray-600">Deadline: ${data.deadlineTime}</p>`;
    //     } else {
    //         timeInfo = `<p class="text-sm text-gray-600">Time: ${data.startTime} - ${data.endTime}</p>`;
    //     }
        
    //     questElement.innerHTML = `
    //         <div class="flex justify-between items-start">
    //             <div>
    //                 <h3 class="font-bold text-lg">${data.title}</h3>
    //                 ${typeBadge}
    //             </div>
    //             <span class="text-sm font-semibold" style="color: ${gemData[data.priority]?.color || '#000'}">
    //                 ${priorityText}
    //             </span>
    //         </div>
    //         <p class="text-gray-700 mt-2">${data.description}</p>
    //         <div class="mt-2">
    //             <p class="text-sm text-gray-600">Date: ${data.date}</p>
    //             ${timeInfo}
    //             <p class="text-sm text-gray-600">Category: ${data.category}</p>
    //         </div>
    //     `;
        
    //     return questElement;
    // }
    
    // Panggil displaySavedData saat halaman dimuat
    // displaySavedData();
});