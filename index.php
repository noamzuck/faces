<?php
$json = scandir('/labeled_images/');
//$json=json_encode($json, JSON_PRETTY_PRINT);
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
    const json = []
    for (let i = 2; i < "<?php echo count($json); ?>"; i++) {
      json.push("<?php echo $json["+i+"]; ?>")
    }
    console.log(json)
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
