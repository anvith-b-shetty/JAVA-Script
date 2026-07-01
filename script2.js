document.addEventListener('DOMContentLoaded', function() {
    const videoList = document.getElementById('videos');

    // Load saved videos from localStorage
    const savedVideos = JSON.parse(localStorage.getItem('videos')) || [];
    savedVideos.forEach((video, index) => {
        addVideoToList(video, index);
    });

    document.getElementById('video-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const url = document.getElementById('video-url').value;
        const file = document.getElementById('video-file').files[0];
        let video = {};

        if (url) {
            const videoId = extractVideoId(url);
            if (videoId) {
                video = {
                    type: 'youtube',
                    src: `https://www.youtube.com/embed/${videoId}`
                };
            } else {
                showAlert('Invalid YouTube URL. Please enter a valid YouTube video link.', 'danger');
                return;
            }
        } else if (file) {
            const videoURL = URL.createObjectURL(file);
            video = {
                type: 'local',
                src: videoURL
            };
        } else {
            showAlert('Please enter a YouTube URL or choose a video file.', 'danger');
            return;
        }

        savedVideos.push(video);
        localStorage.setItem('videos', JSON.stringify(savedVideos));
        addVideoToList(video, savedVideos.length - 1);

        document.getElementById('video-url').value = '';
        document.getElementById('video-file').value = '';
        showAlert('Video added successfully!', 'success');
    });

    function addVideoToList(video, index) {
        const newVideo = document.createElement('li');
        newVideo.classList.add('col-md-6', 'mb-4');
        if (video.type === 'youtube') {
            newVideo.innerHTML = `
                <div class="card">
                    <iframe width="100%" height="315" src="${video.src}" frameborder="0" allowfullscreen></iframe>
                    <div class="card-body text-center">
                        <button class="btn btn-danger remove-video" data-index="${index}">Remove</button>
                    </div>
                </div>`;
        } else if (video.type === 'local') {
            newVideo.innerHTML = `
                <div class="card">
                    <video width="100%" height="315" controls><source src="${video.src}" type="video/mp4">Your browser does not support the video tag.</video>
                    <div class="card-body text-center">
                        <button class="btn btn-danger remove-video" data-index="${index}">Remove</button>
                    </div>
                </div>`;
        }
        videoList.appendChild(newVideo);

        newVideo.querySelector('.remove-video').addEventListener('click', () => removeVideo(index));
    }

    function removeVideo(index) {
        savedVideos.splice(index, 1);
        localStorage.setItem('videos', JSON.stringify(savedVideos));
        renderVideoList();
        showAlert('Video removed successfully!', 'success');
    }

    function renderVideoList() {
        videoList.innerHTML = '';
        savedVideos.forEach((video, index) => {
            addVideoToList(video, index);
        });
    }

    function extractVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const matches = url.match(regex);
        return matches ? matches[1] : null;
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} mt-3`;
        alertDiv.appendChild(document.createTextNode(message));
        const addVideoSection = document.getElementById('add-video');
        addVideoSection.insertBefore(alertDiv, document.getElementById('video-form'));

        setTimeout(() => alertDiv.remove(), 3000);
    }
});
