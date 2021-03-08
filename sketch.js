const video = document.getElementById("video");
const result = document.getElementById("result");
const confidence = document.getElementById("confidence")
const startBtn = document.getElementById("startBtn");

let stream;
let classifier;
let keepDetecting;
  

// Create a webcam capture
async function startStreaming() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: {width: 480, height: 300} });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    alert("Please check your camera permissions.");
  }
}

// Stop the webcam
function stopStreaming() {
  stream.getTracks().forEach(function(track) {
    track.stop();
  });
}

// Loading the classifier with Custom Model
classifier = ml5.imageClassifier("./resources/model.json", () => console.log("Model loaded"));

// Start to classify video
function startDetecting() {
  if (keepDetecting) {
    classifier.predict(video, (err, results) => {
      result.innerHTML = results[0].label;
      confidence.innerHTML = Math.round(results[0].confidence * 100) + '%';
      startDetecting();
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
