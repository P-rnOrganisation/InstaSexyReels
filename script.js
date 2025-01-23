const repoURL = 'https://api.github.com/repos/gitporn69/instaserver/contents/'; // Replace with your GitHub repo details

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
            const videocard = document.createElement("div");
            videocard.setAttribute("class", "video-card");
            videoGalleryContent.appendChild(videocard);

            const video = document.createElement('video');
            video.setAttribute("class", "video-player");
            video.controls = true;
            video.src = file.download_url;

            // Extract numeric value from file name and set as id
            const videoId = file.name.match(/\d+/)[0];
            video.id = `video-${videoId}`;
            videocard.appendChild(video);

            // Add long press event listener for sharing options
            let pressTimer;
            videocard.addEventListener('mousedown', (e) => {
            pressTimer = setTimeout(() => {
                const shareDialog = document.createElement('div');
                shareDialog.setAttribute('class', 'share-dialog');

                const shareLink = document.createElement('a');
                shareLink.href = file.download_url;
                shareLink.textContent = 'Share';
                shareLink.addEventListener('click', () => {
                navigator.share({
                    title: 'Check out this video',
                    url: `https://p-rnorganisation.github.io/InstaSexyReels/#video-${videoId}?fullscreen=true`
                });
                });

                const copyLink = document.createElement('button');
                copyLink.textContent = 'Copy Link';
                copyLink.addEventListener('click', () => {
                navigator.clipboard.writeText(`https://p-rnorganisation.github.io/InstaSexyReels/#video-${videoId}?fullscreen=true`);
                alert('Link copied to clipboard');
                });

                shareDialog.appendChild(shareLink);
                shareDialog.appendChild(copyLink);
                document.body.appendChild(shareDialog);

                // Remove dialog after some time or on click outside
                setTimeout(() => {
                document.body.removeChild(shareDialog);
                }, 5000);
            }, 1000); // 1 second long press
            });

            videocard.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
            });

            videocard.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
            });
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
    } catch (error) {
        console.error('Error fetching media:', error);
    }
}

fetchMedia();
