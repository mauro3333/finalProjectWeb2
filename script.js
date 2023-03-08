const width = 640;
const height = 480;
let video = null; // video element
let objectDetector = null; // detector object
let detecting = false;
let faceMask = false;
let classifier;
let imageModelURL = "./model/";
let label = "";
let canvas, ctx;
let objects = [];
let levelOfConfidence = 0;

var slider = document.getElementById("myRange");
var output = document.getElementById("level-confidence");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
	output.innerHTML = this.value;
	levelOfConfidence = this.value;
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.addEventListener("DOMContentLoaded", function () {
	make();
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function make() {
	// get the video
	video = await getVideo();

	//***************************************
	// video = new Image();
	// video.crossOrigin = "anonymous";
	// video.src = `http://192.168.137.100:81/stream`;
	// video.width = width;
	// video.height = height;
	//************************************

	objectDetector = await ml5.objectDetector("cocossd", modelODReady);
	classifier = await ml5.imageClassifier(
		imageModelURL + "model.json",
		video,
		modelCReady
	);

	canvas = createCanvas(width, height);
	ctx = canvas.getContext("2d");
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function modelCReady() {
	console.log("Classifier Model is loaded");
	classifyVideo();
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function classifyVideo() {
	classifier.classify(gotResult);
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function gotResult(err, results) {
	if (err) {
		console.error(err);
		return;
	}
	label = results[0].label + " - " + (results[0].confidence * 100).toFixed(1);
	draw();
	classifyVideo();
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
	detect();
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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

		if (detecting) {
			detect();
		}
	});
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function toggleDetecting() {
	if (!video || !objectDetector) return;
	if (!detecting) {
		toggleODetecting.innerText = "Stop Detecting";
		detect();
	} else {
		toggleODetecting.innerText = "Start Detecting";
	}
	detecting = !detecting;
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function draw() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, height);
	ctx.drawImage(video, 0, 0);

	if (faceMask) {
		ctx.font = "25px Arial";
		ctx.fillStyle = "yellow";
		ctx.fillText(label, width - 380, height - 10);
	}

	if (detecting) {
		for (let i = 0; i < objects.length; i += 1) {

			if((objects[i].confidence * 100) >= levelOfConfidence){
				console.log("----", (objects[i].confidence * 100), "++++", levelOfConfidence);
				ctx.font = "20px Arial";
				ctx.fillStyle = "yellow";
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
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function getVideo() {
	// Grab elements, create settings, etc.
	const videoElement = document.createElement("video");
	videoElement.setAttribute("style", "display: none;");
	videoElement.width = width;
	videoElement.height = height;
	document.body.appendChild(videoElement);

	// Create a webcam capture
	// const capture = await navigator.mediaDevices.getUserMedia({ video: true });
	// videoElement.srcObject = capture;
	// videoElement.play();

	navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
		video.srcObject = stream;
		video.play();
	});

	console.log("--------camera ready:");

	return videoElement;
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function createCanvas(w, h) {
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	document.body.appendChild(canvas);
	return canvas;
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// let objectDetector;
// let detecting = false;
// let status;
// let objects = [];
// let video;
// let canvas, ctx;
// const width = 640;
// const height = 480;

// let arrayUrlCameras = ["192.168.137.78", "192.168.137.122", "192.168.137.251"];
// let arrayCameras = [];
// let arrayCanvas = [];

// window.addEventListener("DOMContentLoaded", function () {
// 	arrayUrlCameras.forEach(url => {
// 		img = new Image();
// 		img.crossOrigin = "anonymous";
// 		img.src = `http://${url}:81/stream`;
// 		img.width = width;
// 		img.height = height;
// 		arrayCameras.push(img);
// 		console.log("--------cameras:", arrayCameras);
// 		fetch(`http://${url}/control?var=framesize&val=8`);

// 		canvas = createCanvas(width, height);
// 		ctx = canvas.getContext("2d");
// 		arrayCanvas.push(ctx);
// 		console.log("--------canvas:", arrayCanvas);

// 	});
// 	make();
// });

// async function make() {
// 	// fetch(`http://${cameras[1]}/control?var=framesize&val=8`);

// 	objectDetector = await ml5.objectDetector("cocossd", detect);

// 	// canvas = createCanvas(width, height);
// 	// ctx = canvas.getContext("2d");
// }

// function detect() {
// 	arrayCameras.forEach((element, index) => {
// 		objectDetector.detect(element, function (err, results) {
// 			if (err) {
// 				console.log(err);
// 				return;
// 			}
// 			objects = results;

// 			if (objects) {
// 				// console.log("------element:", element, "   ++++++++++++index: ", index);
// 				draw(element, arrayCanvas[index]);
// 			}
// 			detect();
// 		});
// 	});
// }

// function draw(camera, canvasX) {
// 	// Clear part of the canvas
// 	canvasX.fillStyle = "#000000";
// 	canvasX.fillRect(0, 0, width, height);
// 	canvasX.drawImage(camera, 0, 0);

// 	if (detecting) {
// 		for (let i = 0; i < objects.length; i += 1) {
// 			canvasX.font = "20px Arial";
// 			canvasX.fillStyle = "yellow";
// 			canvasX.fillText(
// 				objects[i].label,
// 				objects[i].x + 0,
// 				objects[i].y + -25
// 			);
// 			canvasX.fillText(
// 				(objects[i].confidence * 100).toFixed(1),
// 				objects[i].x + 0,
// 				objects[i].y + -3
// 			);

// 			canvasX.beginPath();
// 			canvasX.rect(
// 				objects[i].x,
// 				objects[i].y,
// 				objects[i].width,
// 				objects[i].height
// 			);
// 			canvasX.strokeStyle = "yellow";
// 			canvasX.lineWidth = 5;
// 			canvasX.stroke();
// 			canvasX.closePath();
// 		}
// 	}
// }

// function createCanvas(w, h) {
// 	const canvas = document.createElement("canvas");
// 	canvas.width = w;
// 	canvas.height = h;
// 	document.body.appendChild(canvas);
// 	console.log("----------------- canvas ready");
// 	return canvas;
// }

// function toggleDetecting() {
// 	if (!objectDetector) return;
// 	if (!detecting) {
// 		toggleODetecting.innerText = "Stop Detecting";
// 	} else {
// 		toggleODetecting.innerText = "Start Detecting";
// 	}
// 	detecting = !detecting;
// }
