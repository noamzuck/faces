const video = document.getElementById('targetVideo')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models1'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models1'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models1'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('models1')
]).then(loadArr)

async function loadArr() {
    /*let url = 'https://api.npoint.io/9efa4b6ac0f89af5b01c'
    let json = await(await fetch(url)).json()*/
    
    let json = ['Adam Sandler','Andy Samberg','Angelina Jolie','Arnold Schwarzenegger','Benedict Cumberbatch','Brad Pitt','Chedwick Boseman','Chris Evans','Chris Hemsworth','Chris Pine','Chris Pratt',"Conan O'Brien",'Daniel Radcliffe','David Schwimmer','Dwayne Johnson','Elizabeth Olsen','Emma Stone','Emma Watson','Gal Gadot','George Clooney','Hailee Steinfeld','James Corden','James Earl Jones','Jason Statham','Jennifer Aniston','Jennifer Lawrence','Jennifer Lopez','Jesse Eisenberg','Jim Parsons','Jimmy Fallon','Jimmy Kimmel','Johnny Depp','Julia Roberts','Kaley Cuoco','Kevin Hurt','Leonardo Decaprio4','Leonardo DiCaprio','Margot Robbie','Mark Wahlberg','Morgan Freeman','Neil Patrick Harris','Paul Walker','Reese Witherspoon','Robert Downey Jr.','Ryan Reynolds','Samuel L. Jackson','Sandra Bullock','Scarlett Johansson','Stan Lee','Steve Carell','Tom Cruise','Tom Holland','Vin Diesel','Will Smith','Zac Efron','Zendaya']
    json = ['therock']
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
                const img = await faceapi.fetchImage(`faces/${label}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}
