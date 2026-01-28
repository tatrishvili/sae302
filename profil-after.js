document.addEventListener('DOMContentLoaded', () => {
    console.log('Profile After Page Loaded');
    
    // Get profile image from localStorage (set by profile.js)
    const selectedProfilePhoto = localStorage.getItem('selectedProfilePhoto');
    console.log('Profile Photo from localStorage:', selectedProfilePhoto);
    
    // Get post from sessionStorage only (clears on refresh)
    const justinePostData = sessionStorage.getItem('justinePost');
    console.log('Post Data from sessionStorage:', justinePostData);
    
    let postImg = null;
    
    // Clear old posts array if needed (prevent accumulation)
    // Only keep posts that were added in THIS session
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
        avatar.onload = () => {
            console.log('Profile image loaded successfully');
            if (placeholderIcon) {
                placeholderIcon.style.display = 'none !important';
            }
        };
        avatar.onerror = () => console.error('Failed to load profile image');
        
        // Immediately hide placeholder
        if (placeholderIcon) {
            placeholderIcon.style.display = 'none !important';
        }
        
        // Also update nav profile image
        if (navAvatar) {
            navAvatar.src = selectedProfilePhoto;
            navAvatar.style.display = 'block';
            navAvatar.onload = () => {
                if (navPlaceholder) {
                    navPlaceholder.style.display = 'none !important';
                }
            };
        }
        if (navPlaceholder) {
            navPlaceholder.style.display = 'none !important';
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
        
        // Get posts array from sessionStorage (can store multiple posts)
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
        
        // Add current post to array if not already there
        if (postImg && !postsArray.some(p => p === postImg)) {
            postsArray.push(postImg);
            sessionStorage.setItem('justinePostsArray', JSON.stringify(postsArray));
        }
        
        // Display all posts in grid
        grid.innerHTML = '';
        postsArray.forEach((imgSrc) => {
            const postItem = document.createElement('div');
            postItem.className = 'profile-post-item';
            postItem.innerHTML = `<img src="${imgSrc}" alt="Post" style="width: 100%; height: 100%; object-fit: cover;">`;
            grid.appendChild(postItem);
        });
        
        postCount.textContent = postsArray.length.toString();
        
        // Update followers count from sessionStorage
        const followerElements = document.querySelectorAll('[id="postCount"]');
        if (followerElements.length > 1) {
            // The second postCount element is actually followers
            const storedFollowers = sessionStorage.getItem('justineFollowers');
            if (storedFollowers) {
                followerElements[1].textContent = storedFollowers;
            } else {
                // Fallback if not stored
                const baseFollowers = 3;
                const randomAddition = Math.floor(Math.random() * 3) + (postsArray.length > 1 ? 2 : 0);
                const totalFollowers = baseFollowers + randomAddition;
                followerElements[1].textContent = totalFollowers.toString();
                sessionStorage.setItem('justineFollowers', totalFollowers.toString());
            }
        }
        
        console.log('Posts displayed successfully:', postsArray.length);
    } else {
        console.log('No post image found');
    }
});

function continueBrowsing() {
    window.location.href = 'feed.html';
}
