// Navigation function from profile to feed (Scene 2)
function continueToFeed() {
    const selectedPhoto = localStorage.getItem('selectedProfilePhoto');
    if (selectedPhoto) {
        window.location.href = 'feed.html';
    }
}

// Select Profile Photo (for profile page)
function selectProfilePhoto(element) {
    const allOptions = document.querySelectorAll('.photo-option');
    allOptions.forEach(option => option.classList.remove('selected'));
    
    element.classList.add('selected');
    const photoPath = element.getAttribute('data-photo');
    
    const profileImage = document.getElementById('profileImage');
    const placeholderIcon = document.getElementById('placeholderIcon');
    
    if (profileImage && placeholderIcon) {
        profileImage.src = photoPath;
        profileImage.style.display = 'block';
        placeholderIcon.style.display = 'none';
        profileImage.style.animation = 'fadeIn 0.5s ease-out';
    }
    
    const navProfileImage = document.getElementById('navProfileImage');
    const navPlaceholder = document.querySelector('.nav-placeholder');
    
    if (navProfileImage) {
        navProfileImage.src = photoPath;
        navProfileImage.style.display = 'block';
        if (navPlaceholder) {
            navPlaceholder.style.display = 'none';
        }
    }
    
    localStorage.setItem('selectedProfilePhoto', photoPath);
    
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.disabled = false;
    }
}

// Add floating animation to icons
function animateFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon, .form-floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.2}s`;
    });
}

// Add fadeIn animation for profile picture
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Initialize animations when page loads
window.addEventListener('load', function() {
    animateFloatingIcons();
});