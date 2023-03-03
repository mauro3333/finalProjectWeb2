// let img = document.getElementById("cam1");
// let video = null; // video element
// let detector = null; // detector object
// let detections = []; // store detection result
// let detecting = false;
// let faceMask = false;
// let classifier;
// let imageModelURL = "./model/";
// let label = "";

// function setup() {
// 	createCanvas(640, 480);

// 	video = createCapture(VIDEO);
// 	video.size(640, 480);
// 	video.hide();

// 	classifier = ml5.imageClassifier(imageModelURL + "model.json", video, modelCReady);
// 	detector = ml5.objectDetector("cocossd", modelODReady);
// }

// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// function modelCReady() {
// 	console.log("Classifier Model is loaded");
// 	classifyVideo();
// }

// function classifyVideo() {
// 	classifier.classify(gotResult);
// }

// function gotResult(err, results) {
// 	if (err) {
// 		console.error(err);
// 		return;
// 	}
// 	label = results[0].label + " - " + (results[0].confidence * 100).toFixed(1);
// 	classifyVideo();
// }

// function toggleMask() {
// 	if (!video || !classifier) return;
// 	if (!faceMask) {
// 		toggleCMask.innerText = "Stop Check Face Mask";
// 	} else {
// 		toggleCMask.innerText = "Check Face Mask";
// 	}
// 	faceMask = !faceMask;
// }
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// function modelODReady() {
// 	console.log("Object Detection Model is loaded");
// 	objectDetect();
// }

// function objectDetect() {
// 	detector.detect(video, gotDetections);
// }

// function gotDetections(error, results) {
// 	if (error) {
// 		console.error(error);
// 	}
// 	detections = results;
// 	detector.detect(video, gotDetections);
// }

// function toggleDetecting() {
// 	if (!video || !detector) return;
// 	if (!detecting) {
// 		toggleODetecting.innerText = "Stop Detecting";
// 	} else {
// 		toggleODetecting.innerText = "Start Detecting";
// 	}
// 	detecting = !detecting;
// }
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// function draw() {
// 	if (!video) return;
// 	image(video, 0, 0);

// 	if (faceMask) {
// 		fill("red");
// 		textSize(20);
// 		textAlign(CENTER);
// 		text(label, width / 2, height - 4);
// 		console.log("face mask", faceMask, "----detecting", detecting);
// 	}

// 	if (detecting) {
// 		for (let i = 0; i < detections.length; i++) {
// 			let object = detections[i];
// 			if (object.label !== "person") {
// 				stroke("green");
// 			} else {
// 				stroke("yellow");
// 			}
// 			strokeWeight(6);
// 			noFill();
// 			rect(object.x, object.y, object.width, object.height);
// 			noStroke();
// 			fill("white");
// 			textSize(20);

// 			text(object.label, object.x + 40, object.y + 24);
// 			text((object.confidence * 100).toFixed(1), object.x + 40, object.y + 50);
// 			console.log("Result: ", detections[i]);
// 		}
// 	}
// }
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Real time Object Detection using objectDetector
=== */

let objectDetector;
let detecting = false;
let status;
let objects = [];
let video;
let canvas, ctx;
const width = 640;
const height = 480;

async function make() {
	// get the video
	video = await getVideo();

	objectDetector = await ml5.objectDetector("cocossd", startDetecting);

	canvas = createCanvas(width, height);
	ctx = canvas.getContext("2d");
}

// when the dom is loaded, call make();
window.addEventListener("DOMContentLoaded", function () {
	make();
});

function startDetecting() {
	console.log("model ready");
	detect();
}

function detect() {
	objectDetector.detect(video, function (err, results) {
		if (err) {
			console.log(err);
			return;
		}
		objects = results;

		if (objects) {
			draw();
		}

		detect();
	});
}

function draw() {
	// Clear part of the canvas
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, height);


		ctx.drawImage(video, 0, 0);
	if (detecting) {
		for (let i = 0; i < objects.length; i += 1) {
			ctx.font = "20px Arial";
			ctx.fillStyle = "black";
			ctx.fillText(
				objects[i].label,
				objects[i].x + 0,
				objects[i].y + -25
			);
			ctx.fillText(
				(objects[i].confidence * 100).toFixed(1),
				objects[i].x + 0,
				objects[i].y + -3
			);

			ctx.beginPath();
			ctx.rect(
				objects[i].x,
				objects[i].y,
				objects[i].width,
				objects[i].height
			);
			ctx.strokeStyle = "yellow";
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.closePath();
		}
	}
}

// Helper Functions
async function getVideo() {
	// Grab elements, create settings, etc.
	const videoElement = document.createElement("video");
	videoElement.setAttribute("style", "display: none;");
	videoElement.width = width;
	videoElement.height = height;
	document.body.appendChild(videoElement);

	// Create a webcam capture
	const capture = await navigator.mediaDevices.getUserMedia({ video: true });
	videoElement.srcObject = capture;
	videoElement.play();

	return videoElement;
}

function createCanvas(w, h) {
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	document.body.appendChild(canvas);
	return canvas;
}

function toggleDetecting() {
	if (!video || !objectDetector) return;
	if (!detecting) {
		toggleODetecting.innerText = "Stop Detecting";
	} else {
		toggleODetecting.innerText = "Start Detecting";
	}
	detecting = !detecting;
}