// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const openPopupBtn = document.getElementById('openPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const popupOverlay = document.getElementById('popupOverlay');

    function openPopup() {
        popupOverlay.classList.remove('hidden');
    }

    function closePopup() {
        popupOverlay.classList.add('hidden');
    }

    openPopupBtn.addEventListener('click', openPopup);
    closePopupBtn.addEventListener('click', closePopup);

    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });

    // EVENT OR TASK : TIME OPTION
    const taskTypeRadio = document.getElementById('taskType');
    const eventTypeRadio = document.getElementById('eventType');
    const taskTimeInput = document.getElementById('taskTimeInput');
    const eventTimeInput = document.getElementById('eventTimeInput');

    function toggleTimeInputs() {
        if (taskTypeRadio.checked) {
            taskTimeInput.classList.remove('hidden');
            eventTimeInput.classList.add('hidden');
        } else {
            taskTimeInput.classList.add('hidden');
            eventTimeInput.classList.remove('hidden');
        }
    }

    toggleTimeInputs();
    taskTypeRadio.addEventListener('change', toggleTimeInputs);
    eventTypeRadio.addEventListener('change', toggleTimeInputs);

    // COLOR OPTION BG 
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const colorOptions = document.getElementById('colorOptions');
    let selectedColor = 'accent_blue'

    // Tampilkan atau sembunyikan dropdown warna saat diklik
    colorPickerBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        colorOptions.classList.toggle('hidden');
    });

    // Saat warna diklik, ganti warna button
    colorOptions.addEventListener('click', function (e) {
        if (e.target.dataset.color) {
            selectedColor = e.target.dataset.color;
            colorPickerBtn.style.backgroundColor = selectedColor;
            colorOptions.classList.add('hidden');
        }
    });

    document.addEventListener('click', function () {
        colorOptions.classList.add('hidden');
    });
    
    // PRIORITY CUSTOM
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

    function setLevel(level) {
        // update fill bar
        const fillWidths = [10, 33, 66, 90];
        const sliderFill = document.getElementById("slider-fill");
        sliderFill.style.width = `${fillWidths[level]}%`;
        sliderFill.style.backgroundColor = gemData[level].color;

        // update info text
        const info = document.getElementById("gem-info");
        info.innerText = `GEM ${level + 1} - ${gemData[level].description}`;
    }


    // TAMBAHKAN ITEM KE UI
    
});
