document.addEventListener('DOMContentLoaded', function() {
    // Ambil elemen-elemen yang diperlukan
    const openPopupBtn = document.getElementById('openPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const popupOverlay = document.getElementById('popupOverlay');
    
    // Fungsi untuk membuka popup
    function openPopup() {
        popupOverlay.classList.remove('hidden');
    }
    
    // Fungsi untuk menutup popup
    function closePopup() {
        popupOverlay.classList.add('hidden');
    }
    
    // Event listener untuk tombol buka
    openPopupBtn.addEventListener('click', openPopup);
    
    // Event listener untuk tombol tutup
    closePopupBtn.addEventListener('click', closePopup);
    
    // Tutup popup ketika mengklik di luar kotak popup
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
    
    // Tutup popup dengan tombol Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !popupOverlay.classList.contains('hidden')) {
            closePopup();
        }
    });

    //Sliderbaru
    const buttons = document.querySelectorAll('.gem-button');
    const progressBar = document.getElementById('progress-bar');
    const gemImages ={
        accent_green: '/assets/Aset_Aplikasi_Non_critical.png',
        accent_blue: '/assets/Aset_Aplikasi_Perventive.png',
        accent_purple: 'Aset_Aplikasi_Urgent.png',
        accent_red: '/assets/Aset_Aplikasi_Emergency.png',
    };

    buttons.forEach(button => {
        button.addEventListener('click',() => {
            const index = perseInt(button.dataset.index);
            const colorClass = button.dataset.color;

            // Reset all gem images
            buttons.forEach(btn => {
                const img = btn.querySelector('.gem-image');
                img.src = gemImages.gray;
            });

            // Set clicked gem
            const img = button.querySelector('.gem-image');
            img.src = gemImages[colorClass];

            // Calculate slider width
            const percentage = (index / (buttons.length - 1)) * 100;

            // Remove previous color classes
            progressBar.className = 'absolute top-1/2 transform -translate-y-1/2 h-4 rounded-full z-10 transition-all duration-300';

            // Add new color and width
            progressBar.classList.add(`bg-${colorClass}`);
            progressBar.style.width = `${percentage}%`;
        });
    });

    // Data level slider
    // Ganti sesuai urutan level: Non-Critical, Perventive, Urgent, Emergency
    // const progressWidths = ["5%", "35%", "68%", "100%"];
    // const icons = [
    //     { id: "gem-1", active: "/assets/Aset_Aplikasi_Non_critical.png", inactive: "/assets/Aset_Aplikasi_Gem_Gray.png" },
    //     { id: "icon-1", active: "/assets/Aset_Aplikasi_Perventive.png", inactive: "/assets/Aset_Aplikasi_Gem_Gray.png" },
    //     { id: "icon-2", active: "/assets/Aset_Aplikasi_Urgent.png", inactive: "/assets/Aset_Aplikasi_Gem_Gray.png" },
    //     { id: "icon-3", active: "/assets/Aset_Aplikasi_Emergency.png", inactive: "/assets/Aset_Aplikasi_Gem_Gray.png" }
    // ];

    // function setLevel(level) {
    // // Update progress bar width
    //     document.getElementById("slider-fill").style.width = progressWidths[level];

    //     // Update all icons
    //     icons.forEach((icon, index) => {
    //         const img = document.getElementById(icon.id);
    //         img.src = index === level ? icon.active : icon.inactive;
    //     });
    // }

    // console.log("Script loaded");
    // setLevel(1);

    // Set default value (level 1 - Perventive)
    // window.addEventListener("DOMContentLoaded", () => {
    //     setLevel();
    // });

    //slider-fill
    // document.getElementById("slider-fill").style.transition = "width 0.3s ease-in-out";




});

