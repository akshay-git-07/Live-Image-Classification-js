const video = document.getElementById("video");
const result = document.getElementById("result");
const confidence = document.getElementById("confidence")
const startBtn = document.getElementById("startBtn");

let stream;
let classifier;
let keepDetecting;

var width = 600;
var height = 400;

// Getting ready the Speech Synthesizer
let utter = new SpeechSynthesisUtterance();
utter.rate = 1;    

// Checking if the device has camera support or not
if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
  console.log("Good to go.")
} else {
  utter.text = "Your device doesn't have camera support.";
  speak();
  alert("Your device doesn't have camera support.");
}

let faceMode;

// Checking if the device is mobile or pc
if (/Android | webOS | iPhone | iPad | iPod | BlackBerry | IEMobile | Opera Mini/i.test (navigator.userAgent)) {
  faceMode = 'environment';
} else {
  faceMode = 'user';
  video.classList.add('rotate');
}

// Create a webcam capture
async function startStreaming() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: {
      width: width,
      height: height,
      facingMode: {
        exact: faceMode
      }
    } });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    utter.text = "Please check your camera permissions.";
    speak();
    alert("Please check your camera permissions.");
    startBtn.innerText = 'Start';
    // alert(err);
  }
}

// Stop the webcam
function stopStreaming() {
  stream.getTracks().forEach(function(track) {
    track.stop();
  });
}

// Text to Speech
function speak() {
  speechSynthesis.speak(utter);
}

// Loading the classifier with Custom Model
classifier = ml5.imageClassifier("./resources/model.json", () => console.log("Model loaded"));

// Start to classify video
async function startDetecting() {
  if (keepDetecting) {
    classifier.predict(video, (err, results) => {
      if (err) {
        result.innerHTML = 'Some error occurred. Please refresh the browser.';
      } else {
        utter.text = results[0].label;
        result.innerHTML = results[0].label;
        confidence.innerHTML = Math.round(results[0].confidence * 100) + '%';
        speak();
        setTimeout(function() {
          startDetecting();
        }, 1000);
      }
    });
  }
  else{
    result.innerHTML = "";
    confidence.innerHTML = "";
  }
}

// Stops classifying
function stopDetecting() {
  keepDetecting = false;
}

// Handing the stream and detection using button
startBtn.addEventListener("click", () => {
  const text = startBtn.innerText;
  if (text == 'Start') {
    startBtn.innerText = 'Stop';
    startStreaming();
    keepDetecting = true;
    startDetecting();
  } else {
    startBtn.innerText = 'Start';
    stopDetecting();
    stopStreaming();
  }
});


// Adjusting the video ratio according to the screen size
var width830 = window.matchMedia("(max-width: 830px)");
width830.addListener(() => {
  if (width830.matches) {
    height = 300;
    width = 480;
  }
});

var width600 = window.matchMedia("(max-width: 600px)");
width600.addListener(() => {
  if (width600.matches) {
    height = 280;
    width = 380;
  }
});

var width400 = window.matchMedia("(max-width: 400px)");
width400.addListener(() => {
  if (width400.matches) {
    height = 280;
    width = 320;
  }
});

function toggleMenu(){
  const menuToggle = document.querySelector('.menuToggle');
  const navigation = document.querySelector('.navigation');
  menuToggle.classList.toggle('active');
  navigation.classList.toggle('active');
}