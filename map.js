var rows = 25;
var cols = 43;
var dragging = false;
var counter = 0;
var unlockedChunks = [];
var potentialChunks = [];


$(document).ready(function () {
	buildArray(rows, cols);

	// Allow dragging the map, and set a flag when dragging
	$("#imgDiv").draggable({
		drag: function () {
			dragging = true;
		}
	});
});

/**
 * Called from html, filters out drag clicks
 * Calls our overwritable on click function
 * @param id
 */
function chunkClicked(id) {
	if (dragging == true) {
		// Prevent clicking when dragging the map
		dragging = false;
	}
	else {
		onChunkPicked(id)
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

// Counter for numbering potential chunks
function toggleChunkButton(id) {

	var btn = document.getElementById(id);
	if (btn.className == "locked") {
		addChunkAsPotential(id);
	}
	else if (btn.className == "potential") {
		unlockChunk(id);
	}
	else if (btn.className == "unlocked") {
		lockChunk(id);
	}

}

function addChunkAsPotential(id) {
	var btn = document.getElementById(id);
	counter += 1;
	btn.innerText = counter;
	btn.className = "potential";
	unlockedChunks = removeElementFromArray(unlockedChunks, id);
	if (potentialChunks.indexOf(id) === -1) {
		potentialChunks.push(id);
	}
}

function unlockChunk(id) {
	var btn = document.getElementById(id);
	counter -= 1;
	btn.innerText = "";
	btn.className = "unlocked";

	potentialChunks = removeElementFromArray(potentialChunks, id);
	if (unlockedChunks.indexOf(id) === -1) {
		unlockedChunks.push(id);
	}

	drawUnlockedBorders();
}

function lockChunk(id) {
	var btn = document.getElementById(id);
	btn.className = "locked";
	btn.innerText = "";


	unlockedChunks = removeElementFromArray(unlockedChunks, id);
	potentialChunks = removeElementFromArray(potentialChunks, id);

	drawUnlockedBorders();
}

function pickPotentialChunk() {
	var chunks = document.getElementsByClassName("potential");
	if (chunks.length == 0) return;

	removeUnlockedTileNumbers();

	// Randomly pick one of the numbered tiles
	var randomIndex = Math.floor(Math.random() * chunks.length);
	for (var i = chunks.length - 1; i >= 0; i--) {
		if (i == randomIndex) {
			var chunk = chunks[i];
			chunk.className = "between";
			setTimeout(function () {
				var chunks = document.getElementsByClassName("between");
				let pickedChunk = chunks[0];
				const savedText = pickedChunk.innerText;
				unlockChunk(pickedChunk.id);
				pickedChunk.innerText = savedText;
			}, 1000);
		}
		else {
			chunks[i].className = "locked";
		}
	}
	potentialChunks = [];
	counter = 0;
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
				borderString = borderString + " 2px";
			}
		}
		else {
			borderString = borderString + " 2px";
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

function drawUnlockedBorders() {
	var unlocked = document.getElementsByClassName("unlocked");

	for (var i = 0; i < unlocked.length; i++) {
		makeBorders(unlocked[i].id);
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
	counter = 0;
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
