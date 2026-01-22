// ==============================
// POST EDITOR STATE
// ==============================

let selectedPhotoPath = '';
let canvas, ctx, originalImage;

// ==============================
// NAVIGATION
// ==============================

// User cancels → story resets
function goBackToFeed() {
    // Clear the post when going back
    sessionStorage.removeItem('justinePost');
    sessionStorage.clear();
    window.location.href = 'feed.html';
}

// ==============================
// PHOTO SELECTION
// ==============================

function selectPostPhoto(element) {
    const allOptions = document.querySelectorAll('.post-photo-option');
    allOptions.forEach(option => option.classList.remove('selected'));

    element.classList.add('selected');
    selectedPhotoPath = element.getAttribute('data-photo');

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.disabled = false;
}

function goToEditor() {
    if (!selectedPhotoPath) return;

    document.getElementById('stepSelection').classList.add('hidden');
    document.getElementById('stepEditor').classList.remove('hidden');

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'none';

    loadImageToCanvas();
}

// ==============================
// CANVAS / IMAGE
// ==============================

function loadImageToCanvas() {
    canvas = document.getElementById('photoCanvas');
    ctx = canvas.getContext('2d');
    originalImage = new Image();

    originalImage.onload = () => {
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);
        console.log('Image loaded successfully:', selectedPhotoPath);
    };

    originalImage.onerror = () => {
        console.error('Failed to load image:', selectedPhotoPath);
        alert('Error loading image. Please check the file path.');
    };

    originalImage.src = selectedPhotoPath;
    console.log('Attempting to load image from:', selectedPhotoPath);
}

// ==============================
// FILTERS
// ==============================

function applyFilters() {
    if (!originalImage || !canvas) return;

    const brightness = parseInt(document.getElementById('brightnessSlider').value);
    const blur = parseInt(document.getElementById('blurSlider').value);
    const filter = document.getElementById('filterSelect').value;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = blur > 0 ? `blur(${blur}px)` : 'none';
    ctx.drawImage(originalImage, 0, 0);

    if (brightness !== 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] += brightness;
            data[i + 1] += brightness;
            data[i + 2] += brightness;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    applyColorFilter(filter);
}

function applyColorFilter(filter) {
    if (filter === 'none') return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (filter === 'warm') {
            data[i] += 30;
            data[i + 2] -= 20;
        }
        if (filter === 'cool') {
            data[i] -= 20;
            data[i + 2] += 30;
        }
        if (filter === 'vintage') {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            data[i]     = Math.min(255, 0.393*r + 0.769*g + 0.189*b);
            data[i + 1] = Math.min(255, 0.349*r + 0.686*g + 0.168*b);
            data[i + 2] = Math.min(255, 0.272*r + 0.534*g + 0.131*b);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// ==============================
// RESET
// ==============================

function resetEdits() {
    document.getElementById('brightnessSlider').value = 0;
    document.getElementById('blurSlider').value = 0;
    document.getElementById('filterSelect').value = 'none';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    ctx.drawImage(originalImage, 0, 0);
}

// ==============================
// SAVE POST (STORY MODE)
// ==============================

function savePost() {
    const editedPhoto = canvas.toDataURL('image/jpeg', 0.9);

    // Save to sessionStorage only (clears on page refresh automatically)
    sessionStorage.setItem('justinePost', JSON.stringify({
        image: editedPhoto,
        caption: 'My first post ✨'
    }));

    showPostSuccessAnimation();
}

// ==============================
// POST SUCCESS ANIMATION
// ==============================

function showPostSuccessAnimation() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    overlay.innerHTML = `
        <div style="text-align:center;color:white;">
            <div style="font-size:60px;">✓</div>
            <div style="font-size:24px;margin:10px 0;">Posted!</div>
            <div id="likeCounter" style="font-size:40px;">❤️ <span>1</span></div>
            <div id="commentSection" style="margin-top:25px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.3);min-height:60px;display:flex;flex-direction:column;justify-content:center;">
            </div>
            <div style="margin-top:15px;font-style:italic;">
              "They finally noticed me..."
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    let likes = 1;
    const span = overlay.querySelector('#likeCounter span');
    const commentSection = overlay.querySelector('#commentSection');
    let commentAdded = false;

    const interval = setInterval(() => {
        likes += Math.floor(Math.random() * 2) + 1;
        span.textContent = likes;

        if (likes >= 4 && !commentAdded) {
            commentAdded = true;
            const commentDiv = document.createElement('div');
            commentDiv.style.cssText = `
                font-size: 16px;
                font-style: italic;
                color: #ffb6c1;
                animation: slideIn 0.5s ease-out;
            `;
            commentDiv.innerHTML = '<strong>Daniella:</strong> so pretty ❤️';
            commentSection.appendChild(commentDiv);
        }

        if (likes >= 7) {
            clearInterval(interval);

            setTimeout(() => {
                window.location.href = 'profile-after.html?fromPost=true';
            }, 1200);
        }
    }, 700);

    // Add animation style
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}
