var rows = 25;
var cols = 43;
var dragging = false;
var unlockedChunks = [];
var potentialChunks = [];
var borderWidth = " 2px";

// Build an array of divs that act like buttons
function buildArray(rows, columns) {
    for (var i = 0; i < rows; i++) {
		for (var j = 0; j < columns; j++) {
			var btn = document.createElement("div");
			btn.className = "locked";
			btn.style.fontSize = "50pt";
			btn.id = (i * columns + j).toString();
			btn.setAttribute("onclick", "toggleChunkButton(this.id)");
			document.getElementById("btnDiv").appendChild(btn);
		}
    }
}

// Toggle chunk type on click
function toggleChunkButton(id) {
	if (dragging == true) {
		// Prevent clicking when dragging the map
		dragging = false;
	}
	else {
		var btn = document.getElementById(id);
		if (btn.className == "locked") {
			addChunkAsPotential(id);
		}
		else if (btn.className == "potential") {
			btn.innerText = "";
			addChunkAsUnlocked(id);
		}
		else if (btn.className == "unlocked") {
			addChunkAsLocked(id);
		}
	}
}

function addChunkAsPotential(id) {
	id = Number(id); // For caution
	var btn = document.getElementById(id);

	if (potentialChunks.indexOf(id) == -1) {
		potentialChunks.push(id);
	}

	removeUnlockedTileNumbers();
	updatePotentialNumbers();
	btn.className = "potential";
}

function addChunkAsUnlocked(id) {
	id = Number(id);
	var btn = document.getElementById(id);
	btn.className = "unlocked";
	//btn.innerText = "";

	potentialChunks = removeElementFromArray(potentialChunks, id);
	if (unlockedChunks.indexOf(id) == -1) {
		unlockedChunks.push(id);
	}

	updatePotentialNumbers();
	drawUnlockedBorders();
}

function addChunkAsLocked(id) {
	id = Number(id);
	var btn = document.getElementById(id);
	btn.className = "locked";
	btn.innerText = "";

	// Remove from both arrays instead of just "unlockedChunks"
	// This is needed because of the Import/Export function
	potentialChunks = removeElementFromArray(potentialChunks, id);
	unlockedChunks = removeElementFromArray(unlockedChunks, id);

	// This chunk is no longer unlocked, update borders
	drawUnlockedBorders();
}

// Return 4 integers that represent neighboring chunk IDs
// If the given chunk is on an edge, return -1 for that direction
function getAdjacentTileIDs(id) {
	id = Number(id);
	// Format: top, right, bottom, left
    var neighbors = [];

	// Initialize that this chunk is not on an edge
    var top = false;
    var right = false;
    var bottom = false;
    var left = false;

    // Check if this chunk is on an edge, true if on an edge
    if (0 <= id && id < cols) top = true;
    if ((id + 1) % cols == 0) right = true;
    if ((rows - 1) * cols <= id && id < rows * cols) bottom = true;
	if (id % cols == 0) left = true;
    
    // Top neighbor
	if (!top) neighbors.push(Number(id) - cols);
    else neighbors.push(-1); // Edge case, return -1 for this direction
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

// Draw borders around a given tile, with no borders between unlocked tiles
function makeBorders(id) {
	var neighbors = getAdjacentTileIDs(parseInt(id));
	var chunk = document.getElementById(id);

	var borderString = "";

	for (var i = 0; i < neighbors.length; i++) {
		// Check existence of each neighbor
		if (neighbors[i] > -1) {
			if (document.getElementById(neighbors[i]).className == "unlocked") {
				// Don't draw borders on neighboring unlocked tiles
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

// Remove the number in unlocked chunks that still have their number from random selection
function removeUnlockedTileNumbers() {
	var unlocked = document.getElementsByClassName("unlocked");
    
    for (var i = 0; i < unlocked.length; i++) {
        unlocked[i].innerText = "";
	}
}
	
// Remove numbers on "between" tiles if the user is spam-clicking the picker
function removeBetweenTileNumbers() {
	var betweens = document.getElementsByClassName("between");

	for (var i = 0; i < betweens.length; i++) {
		betweens[i].innerText = "";
	}
}

// Draw borders around all unlocked chunks, with no borders between other unlocked chunks
function drawUnlockedBorders() {
    var unlocked = document.getElementsByClassName("unlocked");

    for (var i = 0; i < unlocked.length; i++) {
        makeBorders(unlocked[i].id);
    }
}

// Update numbers so that all numbers are unique and don't skip any
function updatePotentialNumbers() {
	for (var i = 0; i < potentialChunks.length; i++) {
		document.getElementById(potentialChunks[i]).innerText = i + 1;
	}
}

// Remove an element from a given array if the element exists
function removeElementFromArray(array, element) {
	var index = array.indexOf(element);
	if (index > -1) {
		array.splice(index, 1);
	}
	return array;
}