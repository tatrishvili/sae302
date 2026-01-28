
let selectedPhotoPath = '';
let canvas, ctx, originalImage;
let isSecondPost = false;


document.addEventListener('DOMContentLoaded', () => {
    const postsData = sessionStorage.getItem('justinePostsArray');
    isSecondPost = postsData ? JSON.parse(postsData).length >= 1 : false;
    
    if (isSecondPost) {
        updateForSecondPost();
    }
});

function updateForSecondPost() {
    const stepSubtitle = document.querySelector('.step-subtitle');
    if (stepSubtitle) {
        stepSubtitle.textContent = 'Lets choose the best one to post';
    }
    
    // Hide justine-thought on second post
    const justineThought = document.getElementById('justineThought');
    if (justineThought) {
        justineThought.style.display = 'none';
    }
    
    const advancedSection = document.getElementById('advancedControls');
    if (advancedSection) {
        advancedSection.classList.remove('hidden');
    }
    
    const firstPostPhotos = document.getElementById('firstPostPhotos');
    const secondPostPhotos = document.getElementById('secondPostPhotos');
    if (firstPostPhotos && secondPostPhotos) {
        firstPostPhotos.classList.add('hidden');
        secondPostPhotos.classList.remove('hidden');
    }
}

function goBackToFeed() {
    sessionStorage.removeItem('justinePost');
    window.location.href = 'feed.html';
}

function resetStory() {
    sessionStorage.clear();
    localStorage.removeItem('selectedProfilePhoto');
    window.location.href = 'index.html';
}

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


function applyFilters() {
    if (!originalImage || !canvas) return;

    const brightness = parseInt(document.getElementById('brightnessSlider').value);
    const blur = parseInt(document.getElementById('blurSlider').value);
    const filter = document.getElementById('filterSelect').value;
    
    // Advanced filters for second post
    const smoothing = parseInt(document.getElementById('smoothingSlider')?.value || 0);
    const skinTone = parseInt(document.getElementById('skinToneSlider')?.value || 0);

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
    
    if (isSecondPost && (smoothing > 0 || skinTone !== 0)) {
        applyAdvancedFilters(smoothing, skinTone);
    }
}

function applyAdvancedFilters(smoothing, skinTone) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const eyeBrightness = parseInt(document.getElementById('eyeBrightnessSlider')?.value || 0);
    const faceSlimming = parseInt(document.getElementById('faceSlimmingSlider')?.value || 0);
    const blush = parseInt(document.getElementById('blushSlider')?.value || 0);
    const makeup = parseInt(document.getElementById('makeupSlider')?.value || 0);

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Apply skin tone adjustment (subtle warmth/coolness)
        if (skinTone !== 0) {
            r = Math.min(255, Math.max(0, r + skinTone));
            g = Math.min(255, Math.max(0, g + skinTone * 0.5));
        }
        
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }

    // Apply face smoothing using a simple blur technique
    if (smoothing > 0) {
        const smoothingAmount = Math.floor(smoothing / 10);
        if (smoothingAmount > 0) {
            applyBlurEffect(imageData, smoothingAmount);
        }
    }
    
    // Apply eye brightening (detect lighter areas and brighten)
    if (eyeBrightness > 0) {
        applyEyeBrightening(imageData, eyeBrightness);
    }
    
    // Apply blush effect (warm peachy tone to cheek areas)
    if (blush > 0) {
        applyBlushEffect(imageData, blush);
    }
    
    // Apply makeup (lips and eye enhancement)
    if (makeup > 0) {
        applyMakeup(imageData, makeup);
    }

    ctx.putImageData(imageData, 0, 0);
    
    // Apply face slimming using canvas distortion
    if (faceSlimming > 0) {
        applyFaceSlimming(faceSlimming);
    }
}

function applyEyeBrightening(imageData, intensity) {
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Focus on upper portion where eyes typically are
    const centerX = width / 2;
    const centerY = height * 0.35;
    const eyeRadius = width * 0.15;
    
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        
        // Calculate distance from eye center areas
        const leftEyeDist = Math.sqrt(Math.pow(x - (centerX - width * 0.1), 2) + Math.pow(y - centerY, 2));
        const rightEyeDist = Math.sqrt(Math.pow(x - (centerX + width * 0.1), 2) + Math.pow(y - centerY, 2));
        
        // Apply brightening to eye areas
        if (leftEyeDist < eyeRadius || rightEyeDist < eyeRadius) {
            const minDist = Math.min(leftEyeDist, rightEyeDist);
            const falloff = Math.max(0, 1 - minDist / eyeRadius);
            const brighten = intensity * falloff * 0.8;
            
            data[i] = Math.min(255, data[i] + brighten);
            data[i + 1] = Math.min(255, data[i + 1] + brighten);
            data[i + 2] = Math.min(255, data[i + 2] + brighten);
        }
    }
}

function applyBlushEffect(imageData, intensity) {
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Cheek areas (left and right sides of face)
    const centerX = width / 2;
    const centerY = height * 0.5;
    const cheekRadius = width * 0.12;
    
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        
        // Calculate distance from cheek areas
        const leftCheekDist = Math.sqrt(Math.pow(x - (centerX - width * 0.18), 2) + Math.pow(y - centerY, 2));
        const rightCheekDist = Math.sqrt(Math.pow(x - (centerX + width * 0.18), 2) + Math.pow(y - centerY, 2));
        
        // Apply blush (warm peachy tone)
        if (leftCheekDist < cheekRadius || rightCheekDist < cheekRadius) {
            const minDist = Math.min(leftCheekDist, rightCheekDist);
            const falloff = Math.max(0, 1 - minDist / cheekRadius);
            const blushAmount = intensity * falloff * 0.6;
            
            // Add warmth (more red and less blue for blush)
            data[i] = Math.min(255, data[i] + blushAmount * 0.4);      // Red
            data[i + 1] = Math.min(255, data[i + 1] + blushAmount * 0.2); // Green
            data[i + 2] = Math.max(0, data[i + 2] - blushAmount * 0.3);   // Blue
        }
    }
}

function applyMakeup(imageData, intensity) {
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    const centerX = width / 2;
    
    // Lips area (lower center part of face)
    const lipsY = height * 0.65;
    const lipsRadius = width * 0.08;
    const eyesY = height * 0.35;
    const eyesRadius = width * 0.1;
    
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        
        // Lips area - apply darker red/burgundy tone
        const lipsDistance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - lipsY, 2));
        if (lipsDistance < lipsRadius) {
            const lipsFalloff = Math.max(0, 1 - lipsDistance / lipsRadius);
            const lipAmount = intensity * lipsFalloff * 0.5;
            
            // Apply lipstick color (deep red/burgundy)
            data[i] = Math.min(255, data[i] + lipAmount * 0.6);      // More red
            data[i + 1] = Math.max(0, data[i + 1] - lipAmount * 0.3); // Less green
            data[i + 2] = Math.max(0, data[i + 2] - lipAmount * 0.2); // Less blue
        }
        
        // Eyes area - apply darker tones for eyeliner/eyeshadow effect
        const leftEyeDist = Math.sqrt(Math.pow(x - (centerX - width * 0.1), 2) + Math.pow(y - eyesY, 2));
        const rightEyeDist = Math.sqrt(Math.pow(x - (centerX + width * 0.1), 2) + Math.pow(y - eyesY, 2));
        
        if (leftEyeDist < eyesRadius || rightEyeDist < eyesRadius) {
            const minEyeDist = Math.min(leftEyeDist, rightEyeDist);
            const eyeFalloff = Math.max(0, 1 - minEyeDist / eyesRadius);
            const eyeAmount = intensity * eyeFalloff * 0.4;
            
            // Apply eyeshadow/eyeliner (subtle darkening with slight purple tone)
            data[i] = Math.max(0, data[i] - eyeAmount * 0.2);      // Slightly less red
            data[i + 1] = Math.max(0, data[i + 1] - eyeAmount * 0.3); // Reduce green
            data[i + 2] = Math.min(255, data[i + 2] + eyeAmount * 0.5); // Add blue for eye definition
        }
    }
}

function applyFaceSlimming(intensity) {
    // Create a temporary canvas for the warping effect
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw current canvas to temp
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    tempCtx.putImageData(imageData, 0, 0);
    
    // Clear main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const faceWidth = width * 0.4;
    const slimmingAmount = intensity * 0.8;
    
    // Apply horizontal compression to face area (center inward)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Distance from center
            const distFromCenter = Math.abs(x - centerX);
            
            // Apply slimming effect (compress horizontally from edges)
            let sourceX = x;
            if (distFromCenter < faceWidth) {
                const falloff = 1 - (distFromCenter / faceWidth);
                sourceX = centerX + (x - centerX) * (1 - falloff * slimmingAmount / 100);
            }
            
            sourceX = Math.max(0, Math.min(width - 1, Math.round(sourceX)));
            
            const srcImageData = tempCtx.getImageData(Math.round(sourceX), y, 1, 1);
            ctx.putImageData(srcImageData, x, y);
        }
    }
}

function applyBlurEffect(imageData, amount) {
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const copy = new Uint8ClampedArray(data);

    for (let pass = 0; pass < amount; pass++) {
        for (let i = 0; i < data.length; i += 4) {
            if (pass === 0) continue;
            
            const pixelIndex = i / 4;
            const row = Math.floor(pixelIndex / width);
            const col = pixelIndex % width;

            if (row > 0 && row < height - 1 && col > 0 && col < width - 1) {
                let r = 0, g = 0, b = 0, count = 0;

                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const idx = ((row + dy) * width + (col + dx)) * 4;
                        r += copy[idx];
                        g += copy[idx + 1];
                        b += copy[idx + 2];
                        count++;
                    }
                }

                data[i] = Math.round(r / count);
                data[i + 1] = Math.round(g / count);
                data[i + 2] = Math.round(b / count);
            }
        }
    }
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
    
    // Reset advanced controls if they exist
    const smoothingSlider = document.getElementById('smoothingSlider');
    const skinToneSlider = document.getElementById('skinToneSlider');
    const eyeBrightnessSlider = document.getElementById('eyeBrightnessSlider');
    const faceSlimmingSlider = document.getElementById('faceSlimmingSlider');
    const blushSlider = document.getElementById('blushSlider');
    const makeupSlider = document.getElementById('makeupSlider');
    
    if (smoothingSlider) smoothingSlider.value = 0;
    if (skinToneSlider) skinToneSlider.value = 0;
    if (eyeBrightnessSlider) eyeBrightnessSlider.value = 0;
    if (faceSlimmingSlider) faceSlimmingSlider.value = 0;
    if (blushSlider) blushSlider.value = 0;
    if (makeupSlider) makeupSlider.value = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    ctx.drawImage(originalImage, 0, 0);
}

// ==============================
// SAVE POST (STORY MODE)
// ==============================

function savePost() {
    const editedPhoto = canvas.toDataURL('image/jpeg', 0.9);

    // Get existing posts array
    let postsArray = [];
    const postsData = sessionStorage.getItem('justinePostsArray');
    if (postsData) {
        try {
            postsArray = JSON.parse(postsData);
        } catch (e) {
            console.error('Error parsing posts array:', e);
            postsArray = [];
        }
    }
    
    // Add new post to array (limit to 2 posts max)
    postsArray.push(editedPhoto);
    if (postsArray.length > 2) {
        postsArray = postsArray.slice(-2); // Keep only last 2
    }
    sessionStorage.setItem('justinePostsArray', JSON.stringify(postsArray));
    
    // Also set current post for backward compatibility
    sessionStorage.setItem('justinePost', JSON.stringify({
        image: editedPhoto,
        caption: isSecondPost ? 'Look at me now... 📸' : 'My first post ✨',
        isSecondPost: isSecondPost
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
            <div id="followerCounter" style="font-size:18px;margin-top:15px;color:#ffb6c1;">👥 Followers: <span>0</span></div>
            <div id="commentSection" style="margin-top:25px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.3);min-height:60px;display:flex;flex-direction:column;justify-content:center;">
            </div>
            <div style="margin-top:15px;font-style:italic;">
              "They finally noticed me..."
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    let likes = 1;
    let followers = 0;
    const span = overlay.querySelector('#likeCounter span');
    const followerSpan = overlay.querySelector('#followerCounter span');
    const commentSection = overlay.querySelector('#commentSection');
    let commentAdded = false;

    const interval = setInterval(() => {
        likes += Math.floor(Math.random() * 2) + 1;
        span.textContent = likes;

        // Followers increase after some likes
        if (likes >= 3 && followers < 2) {
            followers += 1;
            followerSpan.textContent = followers;
        }

        if (likes >= 4 && !commentAdded) {
            commentAdded = true;
            const commentDiv = document.createElement('div');
            commentDiv.style.cssText = `
                font-size: 16px;
                font-style: italic;
                color: #ffb6c1;
                animation: slideIn 0.5s ease-out;
            `;
            if (isSecondPost) {
                commentDiv.innerHTML = '<strong>Miley:</strong> I miss you ❤️';
            } else {
                commentDiv.innerHTML = '<strong>Dianna:</strong> so pretty ❤️';
            }
            commentSection.appendChild(commentDiv);
        }

        if ((isSecondPost && likes >= 10) || (!isSecondPost && likes >= 7)) {
            clearInterval(interval);

            // Store final follower count in sessionStorage
            const postsData = sessionStorage.getItem('justinePostsArray');
            const postsArray = postsData ? JSON.parse(postsData) : [];
            
            // Calculate total followers based on posts
            const baseFollowers = 3;
            const followersPerPost = Math.floor(Math.random() * 3) + 2; // 2-4 per post
            const totalFollowers = baseFollowers + (postsArray.length * followersPerPost);
            
            sessionStorage.setItem('justineFollowers', totalFollowers.toString());

            setTimeout(() => {
                // For second post, show profile with both posts
                // For first post, also show profile to let user see the post
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
