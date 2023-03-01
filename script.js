let img = document.getElementById("cam1");
let video = null; // video element
let detector = null; // detector object
let detections = []; // store detection result
let detecting = false;
let faceMask = false;
let classifier;
let imageModelURL = "./model/";
let label = "";


function setup() {
	createCanvas(640, 480);

	video = createCapture(VIDEO);
	video.size(640, 480);
	video.hide();

	classifier = ml5.imageClassifier(imageModelURL + "model.json", video, modelCReady);
	detector = ml5.objectDetector("cocossd", modelODReady);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function modelCReady() {
	console.log("Classifier Model is loaded");
	classifyVideo();
}

function classifyVideo() {
	classifier.classify(gotResult);
}

function gotResult(err, results) {
	if (err) {
		console.error(err);
		return;
	}
	label = results[0].label + " - " + (results[0].confidence * 100).toFixed(1);
	classifyVideo();
}

function toggleMask() {
	if (!video || !classifier) return;
	if (!faceMask) {
		toggleCMask.innerText = "Stop Check Face Mask";
	} else {
		toggleCMask.innerText = "Check Face Mask";
	}
	faceMask = !faceMask;
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function modelODReady() {
	console.log("Object Detection Model is loaded");
	objectDetect();
}

function objectDetect() {
	detector.detect(video, gotDetections);
}

function gotDetections(error, results) {
	if (error) {
		console.error(error);
	}
	detections = results;
	detector.detect(video, gotDetections);
}

function toggleDetecting() {
	if (!video || !detector) return;
	if (!detecting) {
		toggleODetecting.innerText = "Stop Detecting";
	} else {
		toggleODetecting.innerText = "Start Detecting";
	}
	detecting = !detecting;
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function draw() {
	if (!video) return;
	image(video, 0, 0);

	if (faceMask) {
		fill("red");
		textSize(20);
		textAlign(CENTER);
		text(label, width / 2, height - 4);
		console.log("face mask", faceMask, "----detecting", detecting);
	}

	if (detecting) {
		for (let i = 0; i < detections.length; i++) {
			let object = detections[i];
			if (object.label !== "person") {
				stroke("green");
			} else {
				stroke("yellow");
			}
			strokeWeight(6);
			noFill();
			rect(object.x, object.y, object.width, object.height);
			noStroke();
			fill("white");
			textSize(20);

			text(object.label, object.x + 40, object.y + 24);
			text((object.confidence * 100).toFixed(1), object.x + 40, object.y + 50);
			console.log("Result: ", detections[i]);
		}
	}
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++












