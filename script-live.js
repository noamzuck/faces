//console.log(json)

const video = document.getElementById('targetVideo')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models1'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models1'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models1'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models1')
]).then(startVideo(json))

/*async function loadArr(json) {
    //let url = 'https://api.npoint.io/9efa4b6ac0f89af5b01c'
    //let json = await(await fetch(url)).json()
    startVideo(json)
}*/

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

video.addEventListener('play', () => {
        container.append(video)
        const canvas = faceapi.createCanvasFromMedia(video)
        document.body.append(canvas)
        const displaySize = { width: video.height, height: video.width }
        faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvas)
        })
    }, 100)
})
}

function loadLabeledImages(json) {
    const labels = json/*['Hailee Steinfeld', 'Reese Witherspoon', 'Noam']*/
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
                const img = await faceapi.fetchImage(`labeled_images/${label}`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}


/*
async function loadFiles() {
    let url = 'https://faces-reg.herokuapp.com/index1.php'
    let res = await fetch(url),
        ret = await res.text(); 
    return ret; // a Promise() actually.
    //console.log(json)
}
loadFiles().then(ret => console.log(ret));
*/
