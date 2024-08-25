let currentStream = null;
let currentFacingMode = 'user';

async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    const constraints = { video: { facingMode: currentFacingMode } };
    try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        const cameraStream = document.getElementById('camera-stream');
        cameraStream.srcObject = currentStream;
        cameraStream.style.transform = currentFacingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
    } catch (error) {
        console.error('Error accessing camera: ', error);
    }
}
document.getElementById('sort-mode').addEventListener('click', async () => {
  var data = getdata();
  postImage(data,'sort_item');
    
});
document.getElementById('rate-mode').addEventListener('click', async () => {
    var data = getdata();
  postImage(data,'rate');
    
});

document.getElementById('switch-camera').addEventListener('click', async () => {
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    startCamera();
});

document.getElementById('sort-mode').addEventListener('click', () => {
    document.getElementById('sort-mode').classList.add('active');
    document.getElementById('rate-mode').classList.remove('active');
});

document.getElementById('rate-mode').addEventListener('click', () => {
    document.getElementById('rate-mode').classList.add('active');
    document.getElementById('sort-mode').classList.remove('active');
});

document.getElementById('take-photo').addEventListener('click', async () => {
    let mode = document.querySelector('.toggle-button.active').id;
    const video = document.getElementById('camera-stream');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    let image = canvas.toDataURL('image/jpeg');

    fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: image, mode: mode === 'rate-mode' ? 'rate' : 'sort' })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error processing image with OpenAI: ', error));
});

startCamera();
const url = 'get_picture_description';
photo = document.getElementById('photo');
function toggle(id) {
    //0 = photo, 1 = video

    if (id == 0) {
        document.getElementById("pDiv").style.display = "";
        document.getElementById("vDiv").style.display = "none";

    } else {
        document.getElementById("pDiv").style.display = "none";
        document.getElementById("vDiv").style.display = "";

    }
}
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

function getdata() {

    const video = document.getElementById('camera-stream');

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    data=  canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    toggle(0);
    return  data;

 
}
function postImage(data,action) {
        var post_data={
            "user_id": 1,
    "base64_image": data,
    "funct": action
        };
    postData(url, post_data)
            .then(data => {
                var result= JSON.stringify(data)
                //nomalize the result
                nr= result.replace(/\*/g, "").replace(/\\n/g, "");
                console.log('Success==========nr:',nr);

                // Update the points circle

                const pointsElement = document.getElementById('result');
                if (pointsElement) {
                    pointsElement.textContent = nr; // 
                }
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });

}

 