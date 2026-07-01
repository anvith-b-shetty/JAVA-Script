import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";

        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyAzsjAdV89vPsU859S0quUS45eyFNszp9A",
            authDomain: "eduvideohub.firebaseapp.com",
            projectId: "eduvideohub",
            storageBucket: "eduvideohub.appspot.com",
            messagingSenderId: "515336313103",
            appId: "1:515336313103:web:83fa0e09a84f4c7732c67a",
            measurementId: "G-BS3EJ737D7"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const storage = getStorage(app);

        // Sign in anonymously
        signInAnonymously(auth).catch((error) => {
            console.error("Error signing in anonymously:", error);
        });

        async function displayVideos() {
            const videoList = document.getElementById('videos');
            videoList.innerHTML = '';
            const querySnapshot = await getDocs(collection(db, "videos"));
            querySnapshot.forEach((doc) => {
                const video = doc.data();
                const videoCard = document.createElement('li');
                videoCard.classList.add('col-md-4');
                videoCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            ${video.type === 'youtube' ? 
                                `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>` :
                                `<video width="100%" controls>
                                    <source src="${video.url}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>`
                            }
                            <h5>${video.title}</h5>
                            <p>${video.category}</p>
                            <button class="btn btn-danger remove-video" data-id="${doc.id}">Remove</button>
                        </div>
                    </div>
                `;
                videoList.appendChild(videoCard);
            });
        }

        async function addVideo(video) {
            try {
                await addDoc(collection(db, "videos"), video);
                displayVideos();
                showNotification("Video added successfully!", "success");
            } catch (error) {
                console.error("Error adding video:", error);
                showNotification("Error adding video.", "danger");
            }
        }

        async function removeVideo(docId) {
            await deleteDoc(doc(collection(db, "videos"), docId));
            displayVideos();
            showNotification("Video removed successfully!", "success");
        }

        function showNotification(message, type) {
            const notification = `
                <div class="alert alert-${type}" role="alert">
                    ${message}
                </div>
            `;
            document.getElementById('notifications').innerHTML = notification;
            setTimeout(() => {
                document.getElementById('notifications').innerHTML = '';
            }, 3000);
        }

        document.getElementById('video-form').addEventListener('submit', async function(event) {
            event.preventDefault();
            const videoUrl = document.getElementById('video-url').value;
            const videoFile = document.getElementById('video-file').files[0];
            const videoTitle = document.getElementById('video-title').value;
            const videoCategory = document.getElementById('video-category').value;
            
            if (!videoTitle || !videoCategory || (!videoUrl && !videoFile)) {
                showNotification("Please fill out all fields.", "danger");
                return;
            }

            if (videoUrl) {
                const videoId = videoUrl.split('v=')[1];
                await addVideo({type: 'youtube', id: videoId, title: videoTitle, category: videoCategory});
            } else if (videoFile) {
                const storageRef = ref(storage, `videos/${videoFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, videoFile);

                document.getElementById('upload-progress').style.display = 'block';
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        document.querySelector('.progress-bar').style.width = `${progress}%`;
                        document.querySelector('.progress-bar').setAttribute('aria-valuenow', progress);
                        document.querySelector('.progress-bar').textContent = `${Math.round(progress)}%`;
                    }, 
                    (error) => {
                        console.error("Error uploading file:", error);
                        showNotification("Error uploading file.", "danger");
                    }, 
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        await addVideo({type: 'file', url: downloadURL, title: videoTitle, category: videoCategory});
                        document.getElementById('upload-progress').style.display = 'none';
                    }
                );
            }

            document.getElementById('video-url').value = '';
            document.getElementById('video-file').value = '';
            document.getElementById('video-title').value = '';
            document.getElementById('video-category').value = '';
        });

        document.addEventListener('click', async function(event) {
            if (event.target.classList.contains('remove-video')) {
                const docId = event.target.getAttribute('data-id');
                await removeVideo(docId);
            }
        });

        document.getElementById('search-bar').addEventListener('input', function() {
            const searchQuery = this.value.toLowerCase();
            document.querySelectorAll('#videos .card').forEach(function(card) {
                const title = card.querySelector('h5').textContent.toLowerCase();
                card.style.display = title.includes(searchQuery) ? 'block' : 'none';
            });
        });

        displayVideos();