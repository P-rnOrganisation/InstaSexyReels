const repoURL = 'https://api.github.com/repos/gitporn69/instaserver/contents/'; // Replace with your GitHub repo details

// Store the initial HTML
const insta_sexy_html = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insta Sexies</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="container">
        <h1>Instagram Beauties Below</h1>

        <!-- Videos Section -->
        <section class="video-gallery">
            <h2>Videos</h2>
            <div class="contents">
                <!-- Videos are going to be rendered over here -->
            </div>
        </section>

        <!-- Images Section -->
        <section class="image-gallery">
            <h2>Images</h2>
            <div class="contents">

            </div>
        </section>
    </div>
    <script src="script.js"></script>
    <!-- <script src="script_copy.js"></script> -->
</body>`

function togglePassword() {
    var passwordField = document.getElementById('password');
    var passwordIcon = document.querySelector('.toggle-password');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordIcon.textContent = '🙈';
    } else {
        passwordField.type = 'password';
        passwordIcon.textContent = '👁️';
    }
}

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    const submit_btn = document.querySelector("#btn");

    submit_btn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default form submission
        fetchMedia(); // Call fetchMedia when the button is clicked
    });
});

async function fetchMedia() {
    // Get the token from the password input
    const token = document.querySelector("#password").value;

    try {
        const response = await fetch(repoURL, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
            }
        });
        const data = await response.json();

        if (data.message === "Bad credentials") {
            alert("Wrong token! Try again!");
        } else {
            document.querySelector("html").innerHTML = insta_sexy_html;

            const videoGalleryContent = document.querySelector(".video-gallery .contents");
            const imageGalleryContent = document.querySelector(".image-gallery .contents");

            data.forEach(file => {
                if (file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.heic')) {
                    // Create and append an image element
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
                } else if (file.name.endsWith('.mp4')) {
                    // Create and append a video element
                    const videocard = document.createElement("div");
                    videocard.setAttribute("class", "video-card");
                    videoGalleryContent.appendChild(videocard);
                    
                    const video = document.createElement('video');
                    video.setAttribute("class", "video-player");
                    video.controls = true;
                    video.src = file.download_url;
                    videocard.appendChild(video);
                    
                    // Add the event listener to pause other videos when one plays
                    video.addEventListener('play', () => {
                        const videos = document.querySelectorAll('.video-player');
                        videos.forEach(v => {
                            if (v !== video) {
                                v.pause();
                            }
                        });
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error fetching media:', error);
    }
}
