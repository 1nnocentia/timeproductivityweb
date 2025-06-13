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
    
});
