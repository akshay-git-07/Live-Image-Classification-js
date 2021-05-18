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
utter.rate = 1.5;    

// Create a webcam capture
async function startStreaming() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: {width: width, height: height} });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    alert("Please check your camera permissions.");
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
  console.log('detecting');
  if (keepDetecting) {
    console.log('keep detecting');
    classifier.predict(video, (err, results) => {
      console.log('predict');
      if (err) {
        console.log(err);
      } else {
        utter.text = results[0].label;
        result.innerHTML = results[0].label;
        confidence.innerHTML = Math.round(results[0].confidence * 100) + '%';
        speak();
        utter.onend = () => startDetecting();
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
    // startDetecting();
  } else {
    startBtn.innerText = 'Start';
    stopDetecting();
    stopStreaming();
  }
});


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