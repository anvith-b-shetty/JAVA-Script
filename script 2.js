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
                alert('Invalid YouTube URL. Please enter a valid YouTube video link.');
                return;
            }
        } else if (file) {
            const videoURL = URL.createObjectURL(file);
            video = {
                type: 'local',
                src: videoURL
            };
        } else {
            alert('Please enter a YouTube URL or choose a video file.');
            return;
        }

        savedVideos.push(video);
        localStorage.setItem('videos', JSON.stringify(savedVideos));
        addVideoToList(video, savedVideos.length - 1);

        document.getElementById('video-url').value = '';
        document.getElementById('video-file').value = '';
    });

    function addVideoToList(video, index) {
        const newVideo = document.createElement('li');
        if (video.type === 'youtube') {
            newVideo.innerHTML = `<iframe width="560" height="315" src="${video.src}" frameborder="0" allowfullscreen></iframe>`;
        } else if (video.type === 'local') {
            newVideo.innerHTML = `<video width="560" height="315" controls><source src="${video.src}" type="video/mp4">Your browser does not support the video tag.</video>`;
        }
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeVideo(index));
        newVideo.appendChild(removeButton);
        videoList.appendChild(newVideo);
    }

    function removeVideo(index) {
        savedVideos.splice(index, 1);
        localStorage.setItem('videos', JSON.stringify(savedVideos));
        renderVideoList();
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
});
