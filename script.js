// ==============================
// GLOBAL NAVIGATION
// ==============================

function goToRegister() {
    window.location.href = 'register.html';
}

function goToProfile(event) {
    event.preventDefault();
    window.location.href = 'profile.html';
    return false;
}

// ==============================
// GLOBAL UI EFFECTS
// ==============================

document.addEventListener('DOMContentLoaded', () => {

    // Success notification auto-hide
    const successNotification = document.getElementById('successNotification');
    if (successNotification) {
        setTimeout(() => {
            successNotification.style.opacity = '0';
            successNotification.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                successNotification.style.display = 'none';
            }, 500);
        }, 3000);
    }

    // Typing animation (register page)
    const nicknameField = document.getElementById('nickname');

    if (nicknameField) {
        const typingSequence = [
            'Justine_dumas',
            '',
            'Justinee777',
            '',
            'Justine__'
        ];

        let index = 0;

        function typeText(text, cb) {
            let i = 0;
            nicknameField.value = '';
            const interval = setInterval(() => {
                if (i < text.length) {
                    nicknameField.value += text[i++];
                } else {
                    clearInterval(interval);
                    cb && cb();
                }
            }, 200);
        }

        function eraseText(cb) {
            const interval = setInterval(() => {
                nicknameField.value = nicknameField.value.slice(0, -1);
                if (!nicknameField.value) {
                    clearInterval(interval);
                    cb && cb();
                }
            }, 50);
        }

        function runSequence() {
            if (index >= typingSequence.length) return;
            const text = typingSequence[index++];
            if (text === '') {
                eraseText(runSequence);
            } else {
                typeText(text, runSequence);
            }
        }

        setTimeout(runSequence, 500);
    }
});

// ==============================
// FLOATING ICONS
// ==============================

function animateFloatingIcons() {
    const icons = document.querySelectorAll('.floating-icon, .form-floating-icon');
    icons.forEach((icon, i) => {
        icon.style.animationDelay = `${i * 0.2}s`;
    });
}

window.addEventListener('load', animateFloatingIcons);

// ==============================
// SHARED ANIMATIONS
// ==============================

const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
`;
document.head.appendChild(style);
