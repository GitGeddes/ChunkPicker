var rows = 25;
var cols = 43;
var zDelta = 0.1; // zoom delta
var dragging = false;
var unlockedChunks = [];
var potentialChunks = [];
var borderWidth = " 2px";


$(document).ready(function () {
	buildArray(rows, cols);

	// Get the div holding the map images and grid of buttons
	var imageDiv = document.getElementById("imgDiv");

	// Reposition the map to be centered on Lumbridge
	repositionMap(imageDiv);

	// Allow dragging the map, and set a flag when dragging
	$("#imgDiv").draggable({
		drag: function (event, ui) {
			dragging = true;

			var margin = 50;
			// Restrict how far the user can drag the map
			if (ui.position.left < -imageDiv.offsetWidth + window.innerWidth - margin) {
				ui.position.left = -imageDiv.offsetWidth + window.innerWidth - margin;
			}
			if (ui.position.left > margin) {
				ui.position.left = margin;
			}
			if (ui.position.top < -imageDiv.offsetHeight + window.innerHeight - margin) {
				ui.position.top = -imageDiv.offsetHeight + window.innerHeight - margin;
			}
			if (ui.position.top > margin) {
				ui.position.top = margin;
			}
		}
	});

	// Zoom on map
	window.addEventListener('wheel', function(e) {
		e.preventDefault();

		var dir; // Direction of scroll
		if (e.deltaY > 0) dir = -zDelta;
		else dir = zDelta;
		// zScale += dir;

		// Set minimum and maximum zoom of map
		var minWidth = 0.95 * window.innerWidth
		var maxWidth = 5 * window.innerWidth
		if (imageDiv.offsetWidth == minWidth && dir < 0) {
			// Zooming out would do nothing
			// zScale -= dir;
			return;
		}
		else if (imageDiv.offsetWidth == maxWidth && dir > 0) {
			// Zooming in would do nothing
			// zScale -= dir;
			return;
		}
		else if (imageDiv.offsetWidth * (1 + dir) <= minWidth) {
			// zScale -= dir;
			// Calculate the percent difference between the previous and new width
			dir = (minWidth - imageDiv.offsetWidth) / imageDiv.offsetWidth;
			imageDiv.style.width = minWidth + "px";
		}
		else if (imageDiv.offsetWidth * (1 + dir) >= maxWidth) {
			// zScale -= dir;
			// Calculate the percent difference between the previous and new width
			dir = (maxWidth - imageDiv.offsetWidth) / imageDiv.offsetWidth;
			imageDiv.style.width = maxWidth + "px";
		}
		else {
			imageDiv.style.width = (imageDiv.offsetWidth * (1 + dir)) + "px";
		}
		
		// Zoom on the mouse position
		zoomOnMouse(e, dir);
		// Fix the location of the map because it could go off-screen
		fixMapEdges();
	});

	// Zoom on the mouse location
	function zoomOnMouse(event, dir) {
		var leftNumber = Number(imageDiv.style.left.slice(0, -2));
		var topNumber = Number(imageDiv.style.top.slice(0, -2));
		var currentMouseX = Math.round(event.clientX);
		var currentMouseY = Math.round(event.clientY);

		// As image zooms, shift top-left corner closer to or further from mouse position
		var offsetX = (currentMouseX - leftNumber) * dir;
		var offsetY = (currentMouseY - topNumber) * dir;

		imageDiv.style.left = (leftNumber - offsetX) + "px";
		imageDiv.style.top = (topNumber - offsetY) + "px";
	}

	function fixMapEdges() {
		// Take the "px" off the end and cast from a String to a Number
		var leftNumber = Number(imageDiv.style.left.slice(0, -2));
		var topNumber = Number(imageDiv.style.top.slice(0, -2));
		var rightEdge = leftNumber + imageDiv.offsetWidth;
		var bottomEdge = topNumber + imageDiv.offsetHeight;

		var margin = 50;
		if (leftNumber > margin) {
			imageDiv.style.left = margin + "px";
		}
		if (rightEdge < window.innerWidth - margin) {
			imageDiv.style.left = (window.innerWidth - margin) - imageDiv.offsetWidth + "px";
		}
		if (topNumber > margin) {
			imageDiv.style.top = margin + "px";
		}
		if (bottomEdge < window.innerHeight - margin) {
			imageDiv.style.top = (window.innerHeight - margin) - imageDiv.offsetHeight + "px";
		}
	}
});

function repositionMap(imageDiv) {
	// Chunk width is 96 pixels wide when the map is initially 4128 pixels wide
	// Lumbridge is at chunk (32, 13), so position in the middle of that chunk
	var lumbyX = 96 * 32.5;
	var lumbyY = 96 * 13.5;
	imageDiv.style.left = Math.round(-lumbyX + window.innerWidth / 2) + "px";
	imageDiv.style.top = Math.round(-lumbyY + window.innerHeight / 2) + "px";
}

/**
 * Called from html, filters out drag clicks
 * Calls our overwritable on click function
 * @param id
 */
function chunkClicked(id) {
	if (dragging == true) {
		// Reset dragging flag, but don't click
		dragging = false;
	}
	else {
		onChunkPicked(Number(id));
	}
}

/**
 * The method which is called when a chunk is clicked.
 * We overwrite this with the matching method for different menus
 * Called from 'chunkClicked(id)'
 * @param id
 */
var onChunkPicked = function (id) {
	console.log(`Not Yet Overridden ${id}`);
};

// Build an array of divs that act like buttons
function buildArray(rows, columns) {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < columns; j++) {
			var btn = document.createElement("div");
			btn.className = "locked";
			btn.id = (i * columns + j).toString();
			btn.setAttribute("onclick", "chunkClicked(this.id)");
			document.getElementById("btnDiv").appendChild(btn);
		}
	}
}

// Toggle chunk type on click
function toggleChunkButton(id) {
	var btn = document.getElementById(id);
	if (btn.className == "locked") {
		addChunkAsPotential(id);
	}
	else if (btn.className == "potential") {
		addChunkAsUnlocked(id);
	}
	else if (btn.className == "unlocked") {
		addChunkAsLocked(id);
	}
}

function addChunkAsPotential(id) {
	var btn = document.getElementById(id);

	// Redundant (?)
	// unlockedChunks = removeElementFromArray(unlockedChunks, id);
	if (potentialChunks.indexOf(id) === -1) {
		potentialChunks.push(id);
	}

	btn.innerText = potentialChunks.indexOf(id)+1;
	btn.className = "potential";
}

function addChunkAsUnlocked(id) {
	id = Number(id);
	var btn = document.getElementById(id);
	btn.innerText = "";
	btn.className = "unlocked";

	potentialChunks = removeElementFromArray(potentialChunks, id);
	if (unlockedChunks.indexOf(id) === -1) {
		unlockedChunks.push(id);
	}

	drawUnlockedBorders();
}

function addChunkAsLocked(id) {
	var btn = document.getElementById(id);
	btn.className = "locked";
	btn.innerText = "";

	unlockedChunks = removeElementFromArray(unlockedChunks, id);
	potentialChunks = removeElementFromArray(potentialChunks, id);

	// This chunk is no longer unlocked, update borders
	drawUnlockedBorders();
}

// Randomly roll one of the potential (numbered) chunks
function pickPotentialChunk() {
	var chunks = document.getElementsByClassName("potential");
	if (chunks.length == 0) return;

	removeUnlockedTileNumbers();

	// Pick a random index
	var randomIndex = Math.floor(Math.random() * chunks.length);
	for (var i = chunks.length - 1; i >= 0; i--) {
		if (i == randomIndex) {
			var chunk = chunks[i];
			chunk.className = "between";
			// Wait 1 second for "between" animation to finish
			setTimeout(function () {
				const savedText = chunk.innerText;
				addChunkAsUnlocked(chunk.id);
				chunk.innerText = savedText;
			}, 1000);
		}
		else {
			chunks[i].className = "locked";
		}
	}
	potentialChunks = [];
}

function getAdjacentTileIDs(id) {
	var neighbors = [];

	var top = false;
	var right = false;
	var bottom = false;
	var left = false;

	// Check for edge cases
	if (0 <= id && id < cols) top = true;
	if ((id + 1) % cols == 0) right = true;
	if ((rows - 1) * cols <= id && id < rows * cols) bottom = true;
	if (id % cols == 0) left = true;

	// Top neighbor
	if (!top) neighbors.push(Number(id) - cols);
	else neighbors.push(-1); // Indicate no valid neighbor
	// Right neighbor
	if (!right) neighbors.push(Number(id) + 1);
	else neighbors.push(-1);
	// Bottom neighbor
	if (!bottom) neighbors.push(Number(id) + cols);
	else neighbors.push(-1);
	// Left neighbor
	if (!left) neighbors.push(Number(id) - 1);
	else neighbors.push(-1);

	return neighbors;
}

function makeBorders(id) {
	var neighbors = getAdjacentTileIDs(parseInt(id));
	var chunk = document.getElementById(id);

	var borderString = "";

	for (var i = 0; i < neighbors.length; i++) {
		// Check existence of each neighbor
		if (neighbors[i] > -1) {
			if (document.getElementById(neighbors[i]).className == "unlocked") {
				borderString = borderString + " 0px";
			}
			else {
				borderString = borderString + borderWidth;
			}
		}
		else {
			borderString = borderString + borderWidth;
		}
	}

	chunk.style.borderWidth = borderString;
}

function removeUnlockedTileNumbers() {
	var unlocked = document.getElementsByClassName("unlocked");

	for (var i = 0; i < unlocked.length; i++) {
		unlocked[i].innerText = "";
	}
}

// Draw borders around all unlocked chunks
function drawUnlockedBorders() {
	for (var i = 0; i < unlockedChunks.length; i++) {
		makeBorders(unlockedChunks[i]);
	}
}

function removeElementFromArray(array, element) {
	var index = array.indexOf(element);
	if (index > -1) {
		array.splice(index, 1);
	}
	return array;
}

/**
 * Called when the user opens the Unlocker menu
 * Overwrite the chunk clicked method,
 * Put your logic here
 */
function onUnlockerMenuOpened() {
	onChunkPicked = toggleChunkButton;
	for (var i = 0; i < potentialChunks.length; i++) {
		var chunkID = potentialChunks[i];
		addChunkAsPotential(chunkID);
	}
}

/**
 * Called when the Unlocker Menu is closed
 */
function onUnlockerMenuClosed() {
	for (var i = 0; i < potentialChunks.length; i++) {
		var chunkID = potentialChunks[i];
		var btn = document.getElementById(chunkID);
		btn.className = "locked";
		btn.innerText = "";
	}
}
