document.addEventListener('DOMContentLoaded', () => {
    console.log('Profile After Page Loaded');
    
    // Get profile image from localStorage (set by profile.js)
    const selectedProfilePhoto = localStorage.getItem('selectedProfilePhoto');
    console.log('Profile Photo from localStorage:', selectedProfilePhoto);
    
    // Get post from sessionStorage only (clears on refresh)
    const justinePostData = sessionStorage.getItem('justinePost');
    console.log('Post Data from sessionStorage:', justinePostData);
    
    let postImg = null;
    
    if (justinePostData) {
        try {
            const post = JSON.parse(justinePostData);
            postImg = post.image;
            console.log('Post image extracted successfully');
        } catch (e) {
            console.error('Error parsing post data:', e);
        }
    }

    const avatar = document.getElementById('profileAfterImage');
    const placeholderIcon = document.getElementById('placeholderIconAfter');
    const navAvatar = document.getElementById('navAfterProfileImage');
    const navPlaceholder = document.querySelector('.nav-placeholder');
    const grid = document.getElementById('profilePostsGrid');
    const postCount = document.getElementById('postCount');

    console.log('DOM Elements found:', { avatar, placeholderIcon, navAvatar, navPlaceholder, grid, postCount });

    // Load profile image from localStorage
    if (selectedProfilePhoto) {
        console.log('Loading profile photo...');
        avatar.src = selectedProfilePhoto;
        avatar.style.display = 'block';
        avatar.onload = () => console.log('Profile image loaded successfully');
        avatar.onerror = () => console.error('Failed to load profile image');
        
        if (placeholderIcon) {
            placeholderIcon.style.display = 'none';
        }
        
        // Also update nav profile image
        if (navAvatar) {
            navAvatar.src = selectedProfilePhoto;
            navAvatar.style.display = 'block';
        }
        if (navPlaceholder) {
            navPlaceholder.style.display = 'none';
        }
    } else {
        console.log('No profile photo in localStorage, showing placeholder');
        if (placeholderIcon) {
            placeholderIcon.style.display = 'flex';
        }
    }

    // Display user posts in grid
    if (postImg) {
        console.log('Loading post photo...');
        grid.innerHTML = `
            <div class="profile-post-item">
                <img src="${postImg}" alt="Post" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
        `;
        postCount.textContent = '1';
        
        // Update followers count when post is made
        const followerElements = document.querySelectorAll('[id="postCount"]');
        if (followerElements.length > 1) {
            // The second postCount element is actually followers
            const randomFollowers = Math.floor(Math.random() * 2) + 3; // 3 or 4 followers
            followerElements[1].textContent = randomFollowers;
        }
        
        console.log('Post displayed successfully');
    } else {
        console.log('No post image found');
    }
});

function continueBrowsing() {
    window.location.href = 'feed.html';
}
