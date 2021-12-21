<?php
$json = scandir('/app/labeled_images/');
$json=array_diff(scandir('/app/labeled_images/'), array('.', '..'));
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webcam</title>
  <script defer src="face-api.min.js"></script>
  <script>
  //var json = [<?php echo '"'.implode('","', $json).'"' ?>];
    const video = document.getElementById('targetVideo')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models1'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models1'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models1'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models1')
]).then(loadArr)

async function loadArr() {
    let json = [<?php echo '"'.implode('","', $json).'"' ?>];
    startVideo(json)
}

async function startVideo(json) {
    const container = document.createElement('div')
    container.style.position = 'relative'
    document.body.append(container)
    const LabeledFaceDescriptors = await loadLabeledImages(json)
    const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.6)

    navigator.mediaDevices.getUserMedia({video: {} }).then( stream => {
        console.log(stream);
        video.srcObject = stream;
    }).catch( err => {
        console.error(err);
    })
  </script>
  <script defer src="script-live.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    canvas {
      position: absolute;
      width: 720px;
      width: 560px;
    }
  </style>
</head>

<body>
  <video id="targetVideo" height="720" width="560" autoplay="false" autoplay mute></video>
</body>

</html>
