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
});