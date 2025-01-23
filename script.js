const repoURL = 'https://api.github.com/repos/gitporn69/instaserver/contents/'; // Replace with your GitHub repo details
const customLinkBase = 'https://p-rnorganisation.github.io/InstaSexyReels'; // Replace with your custom link

async function fetchMedia() {
    try {
        const response = await fetch(repoURL);
        const data = await response.json();

        const videoGalleryContent = document.querySelector(".video-gallery .contents");
        const imageGalleryContent = document.querySelector(".image-gallery .contents");

        // Filter and sort video files in descending order
        const videoFiles = data
            .filter(file => file.name.endsWith('.mp4'))
            .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

        // Filter and sort image files in descending order
        const imageFiles = data
            .filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.heic'))
            .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

        // Populate video gallery
        videoFiles.forEach(file => {
            const videoId = file.name.replace('.mp4', ''); // Use the numeric filename as ID

            const videocard = document.createElement("div");
            videocard.setAttribute("class", "video-card");
            videoGalleryContent.appendChild(videocard);

            const video = document.createElement('video');
            video.setAttribute("class", "video-player");
            video.setAttribute("id", videoId); // Add video ID
            video.controls = true;
            video.src = file.download_url;
            videocard.appendChild(video);

            // Add a link-sharing button to the controls
            const shareLink = document.createElement('button');
            shareLink.innerText = 'Share';
            shareLink.setAttribute("class", "share-button");
            shareLink.addEventListener('click', () => {
                const customLink = `${customLinkBase}/#${videoId}`;
                navigator.clipboard.writeText(customLink)
                    .then(() => alert('Link copied to clipboard: ' + customLink))
                    .catch(err => console.error('Error copying link: ', err));
            });
            videocard.appendChild(shareLink);
        });

        // Populate image gallery
        imageFiles.forEach(file => {
            const imagecard = document.createElement("div");
            imagecard.setAttribute("class", "image-card");
            imageGalleryContent.appendChild(imagecard);

            const img = document.createElement('img');
            const a = document.createElement('a');
            a.href = file.download_url;
            img.src = file.download_url;
            img.alt = file.name;
            imagecard.appendChild(a);
            a.appendChild(img);
        });

        // Ensure only one video plays at a time
        const videos = document.querySelectorAll('.video-player');
        videos.forEach(video => {
            video.addEventListener('play', () => {
                videos.forEach(v => {
                    if (v !== video) {
                        v.pause();
                    }
                });
            });
        });

        // // Handle opening video in fullscreen from URL
        // const params = new URLSearchParams(window.location.search);
        // const videoId = window.location.hash.substring(1); // Get video ID from hash
        // const fullscreen = params.get('fullscreen');
        // const targetVideo = document.getElementById(videoId);

        // if (targetVideo && fullscreen === 'true') {
        //     targetVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //     targetVideo.requestFullscreen().catch(err => {
        //         console.error("Failed to enable full-screen mode:", err);
        //     });
        //     targetVideo.play();
        // }
    } catch (error) {
        console.error('Error fetching media:', error);
    }
}

fetchMedia();
