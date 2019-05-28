var zDelta = 0.1; // zoom delta

$(document).ready(function() {
    buildArray(rows, cols);

    // Get the div holding the map images and grid of buttons
	var imageDiv = document.getElementById("imgDiv");

	// Chunk width is 96 pixels wide when the map is initially 4128 pixels wide
	// Lumbridge is at chunk (32, 13), so position in the middle of that chunk
	var lumbyX = 96 * 32.5;
	var lumbyY = 96 * 13.5;
	// Reposition the map to be centered on Lumbridge
	repositionMapOnPoint(imageDiv, lumbyX, lumbyY);

	// Allow dragging the map, and set a flag when dragging
	$("#imgDiv").draggable({
		drag: function (event, ui) {
			dragging = true;

			var margins = calculateViewPortMargins();
			// Restrict how far the user can drag the map
			if (ui.position.top > margins[0]) {
				// Top edge
				ui.position.top = margins[0];
			}
			if (ui.position.left < -imageDiv.offsetWidth + window.innerWidth - margins[1]) {
				// Right edge
				ui.position.left = -imageDiv.offsetWidth + window.innerWidth - margins[1];
			}
			if (ui.position.top < -imageDiv.offsetHeight + window.innerHeight - margins[2]) {
				// Bottom edge
				ui.position.top = -imageDiv.offsetHeight + window.innerHeight - margins[2];
			}
			if (ui.position.left > margins[3]) {
				// Left edge
				ui.position.left = margins[3];
			}
		}
	});

	// Zoom on map
	window.addEventListener('wheel', function(e) {
		// Calculate the direction of scrolling
		var dir;
		if (e.deltaY > 0) dir = -zDelta; // Zoom out
		else dir = zDelta; // Zoom in

		// Set minimum and maximum zoom of map
		var minWidth = Math.floor(0.95 * calculateViewPortWidth());
		var maxWidth = Math.floor(10 * calculateViewPortWidth());
		if (imageDiv.offsetWidth <= minWidth && dir < 0) {
			// Zooming out would do nothing
			return;
		}
		else if (imageDiv.offsetWidth >= maxWidth && dir > 0) {
			// Zooming in would do nothing
			return;
		}
		else if (imageDiv.offsetWidth * (1 + dir) <= minWidth) {
			// Calculate the percent difference between the previous and new width
			dir = (minWidth - imageDiv.offsetWidth) / imageDiv.offsetWidth;
			imageDiv.style.width = minWidth + "px";
		}
		else if (imageDiv.offsetWidth * (1 + dir) >= maxWidth) {
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
		fixMapEdges(imageDiv);
		// Resize the font-size of potential chunks to fit inside resized chunks
		resizePotentialFont(dir);
	});

	// Zoom on the mouse location
	function zoomOnMouse(event, dir) {
		// Pull number out of string, cut "px" off end
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
});

// Center the map on a specific location
function repositionMapOnPoint(imageDiv, x, y) {
	imageDiv.style.left = Math.round(-x + window.innerWidth / 2) + "px";
	imageDiv.style.top = Math.round(-y + window.innerHeight / 2) + "px";
}

// If map has gone outside of boundaires, move it back inside
function fixMapEdges(imageDiv) {
	// Take the "px" off the end and cast from a String to a Number
	var leftNumber = Number(imageDiv.style.left.slice(0, -2));
	var topNumber = Number(imageDiv.style.top.slice(0, -2));
	var rightEdge = leftNumber + imageDiv.offsetWidth;
	var bottomEdge = topNumber + imageDiv.offsetHeight;

	var margins = calculateViewPortMargins();
	if (topNumber > margins[0]) {
		imageDiv.style.top = margins[0] + "px";
	}
	if (rightEdge < window.innerWidth - margins[1]) {
		imageDiv.style.left = (window.innerWidth - margins[1]) - imageDiv.offsetWidth + "px";
	}
	if (bottomEdge < window.innerHeight - margins[2]) {
		imageDiv.style.top = (window.innerHeight - margins[2]) - imageDiv.offsetHeight + "px";
	}
	if (leftNumber > margins[3]) {
		imageDiv.style.left = margins[3] + "px";
	}
}

// Calculate the margins of the map viewport based on if the sidebars are open
function calculateViewPortMargins() {
	// Format: [top, right, bottom, left]
	var margins = [50, 50, 50, 50];
	margins[1] += document.getElementById("sidebarRight").offsetWidth;
	margins[3] += document.getElementById("sidebarLeft").offsetWidth;
	return margins; 
}

// Calculate the width of the viewport
function calculateViewPortWidth() {
	// Start with webpage window width and subtract from it
	var width = window.innerWidth -
		document.getElementById("sidebarRight").offsetWidth -
		document.getElementById("sidebarLeft").offsetWidth;
	return width;
}

// As the map zooms, also zoom the font size of potential chunk numbers
function resizePotentialFont(dir) {
	var allChunks = document.getElementById("btnDiv").children;
	var newFontSize = 0;
	if (allChunks.length > 1) {
		// Calculate the new font-size to then be able to limit its minimum and maximum
		newFontSize = Number(allChunks[0].style.fontSize.slice(0, -2)) * (1 + dir);
	}
	for (var i = 0; i < allChunks.length; i++) {
		allChunks[i].style.fontSize = newFontSize + "pt";
	}
}