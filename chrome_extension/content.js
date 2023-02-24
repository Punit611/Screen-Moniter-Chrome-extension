console.log("in content script")
function create_object(type, id) {
    let box = document.createElement(type);
    if (type == 'br') {
        document.body.prepend(box);
        return;
    }
    box.id = id;
    if (type == "video") {
        box.autoplay = true;
        box.style = "height: 200px; width: 250px; margin:0px 10px ";

        document.body.prepend(box);
    }
    else if (type == "button") {
        box.innerHTML = id;
        box.style = "margin: auto"
        document.getElementById("strong").appendChild(box);
    }
    else if (type == "strong") {
        box.style = " background-color: rgb(197, 156, 20); padding: 3px; "
        document.body.prepend(box);
    }
    else
        document.body.append(box);
}
function CreateForm() {


    // Create an input element for Full Name
    var FN = document.createElement("input");
    FN.setAttribute("type", "text");
    FN.setAttribute("id", "FullName");
    FN.setAttribute("placeholder", "Full Name");
    FN.style = "margin:10px";

    // Create an input element for emailID
    var EID = document.createElement("input");
    EID.setAttribute("type", "text");
    EID.setAttribute("id", "emailID");
    EID.setAttribute("placeholder", "E-Mail ID");
    FN.style = "margin:10px";

    // Create an input element for emailID
    var TST = document.createElement("input");
    TST.setAttribute("type", "text");
    TST.setAttribute("id", "test");
    TST.setAttribute("placeholder", "Test - ID");
    TST.style = "margin:10px";

    document.getElementById("strong").appendChild(FN);
    document.getElementById("strong").appendChild(EID);
    document.getElementById("strong").appendChild(TST);
}


create_object("strong", "strong");
create_object("button", "start-record");
create_object("br", "br");

create_object("canvas", "canvas_video");
create_object("canvas", "canvas_screen");
create_object("video", "video");
create_object("video", "screen");
create_object("br", "br");

CreateForm();
create_object("button", "stop-record");
create_object("br", "br");

let start_button = document.querySelector("#start-record");
let stop_button = document.querySelector("#stop-record");
let video = document.querySelector("#video");
let screen = document.querySelector("#screen");



let API_URL = "http://localhost:3000/storeImageData"
let camera_stream = null;
let screen_stream = null;
let timerId;


function capture_btn_start() {
    clearInterval(timerId); // Clear previous interval, if any
    timerId = setInterval(() => { capture_images_and_send_images(); }, 5000);
    
};


start_button.addEventListener('click', async function () {
    camera_stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = camera_stream;

    screen_stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: "screen" } });
    screen.srcObject = screen_stream;
    capture_btn_start();
});



function capture(type) {

    var video_id = "screen";
    var canvas_id = "canvas_screen";
    console.log("inside", type)
    if (type == "user") {
        video_id = "video";
        canvas_id = "canvas_video";
    }

    var canvas = document.getElementById(canvas_id);
    var video = document.getElementById(video_id);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
        .getContext("2d")
        .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    /** Code to merge image **/
    /** For instance, if I want to merge a play image on center of existing image **/
    const playImage = new Image();
    playImage.src = "path to image asset";
    playImage.onload = () => {
        const startX = video.videoWidth / 2 - playImage.width / 2;
        const startY = video.videoHeight / 2 - playImage.height / 2;
        canvas
            .getContext("2d")
            .drawImage(playImage, startX, startY, playImage.width, playImage.height);
        canvas.toBlob() = (blob) => {
            const img = new Image();
            img.src = window.URL.createObjectUrl(blob);
        };
    };
    /** End **/
}

function capture_images_and_send_images() {
    console.log("capturing images");

    if (camera_stream == null || screen_stream == null)
        return;
        console.log("Inside images");

    const name = document.getElementById("FullName").value;
    const email = document.getElementById("emailID").value;
    const test = document.getElementById("test").value;
    const formData = new FormData();

    // Capture the user image
    const userCanvas = document.createElement('canvas');
    userCanvas.width = video.videoWidth;
    userCanvas.height = video.videoHeight;
    userCanvas.getContext('2d').drawImage(video, 0, 0, userCanvas.width, userCanvas.height);
    userCanvas.toBlob(userBlob => {
        formData.append('user_image', userBlob, 'user_image.png');

        // Capture the screen image
        const screenCanvas = document.createElement('canvas');
        screenCanvas.width = screen.videoWidth;
        screenCanvas.height = screen.videoHeight;
        screenCanvas.getContext('2d').drawImage(screen, 0, 0, screenCanvas.width, screenCanvas.height);
        screenCanvas.toBlob(screenBlob => {
            formData.append('screen_image', screenBlob, 'screen_image.png');


            // Append the other fields
            formData.append('name', name);
            formData.append('email', email);
            formData.append('test', test);
            console.log("name:-email:- ",name, email, test);

            // Send the form data using fetch
            if (name != email && name != test) {
                fetch(API_URL, {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.text())
                    .then(data => console.log(data))
                    .catch(error => console.error(error));
            }
        }, 'image/png');
    }, 'image/png');
}

stop_button.addEventListener('click', async function () {
    clearInterval(timerId); // Stop after 1 minute
    
    if (screen_stream != null)
        screen_stream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
        });
    if (camera_stream != null)
        camera_stream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
        });
});






