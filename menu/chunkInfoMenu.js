/**
 * Created by jespe on 2019-02-17.
 */

var infoPositionDiv;
var infoIDDiv;
var notesTextBox;
$(document).ready(function () {
	infoPositionDiv = document.getElementById('chunkInfoPosition');
	infoIDDiv = document.getElementById('chunkInfoID');
	notesTextBox = document.getElementById('notesTextBox');
	notesTextBox.innerText = "Work In Progress";
});

/**
 * Notes
 * @type MapOf<string>
 */
notesForChunks = {};

/**
 * The currently selected chunk
 * @type {number}
 */
let currentChunk = undefined;
/**
 * Called when the Chunk Info Menu is opened
 */
function onChunkInfoMenuOpened() {
	onChunkPicked = selectChunk;
	if (currentChunk !== undefined){
		selectChunk(currentChunk);
	}
}

/**
 * Called when the Chunk Info Menu is closed
 */
function onChunkInfoMenuClosed() {
	if (currentChunk !== undefined) {
		var btn = document.getElementById(currentChunk);
		btn.style.borderWidth = '0px';
		btn.className = "locked";
		btn.innerText = "";
	}

	for (var i = 0; i < unlockedChunks.length; i++) {
		var chunkID = unlockedChunks[i];
		unlockChunk(chunkID);
	}

	for (var i = 0; i < potentialChunks.length; i++) {
		var chunkID = potentialChunks[i];
		addChunkAsPotential(chunkID);
	}
}

/**
 * The method which will be called when a chunk is clicked for the "Chunk Info" menu.
 * @param id
 */
function selectChunk(id) {
	console.log(`Selected Chunk ${id}`);
	// Deselect old chunk
	if (currentChunk !== undefined) {
		if (unlockedChunks.indexOf(currentChunk) !== -1) {
			unlockChunk(currentChunk);
		}
		else {
			var btn = document.getElementById(currentChunk);
			btn.className = "locked";
			btn.style.borderWidth = '0px';
			btn.innerText = "";
		}
		
	}

	drawUnlockedBorders();

	//Select the new chunk
	currentChunk = id;

	var btn = document.getElementById(id);
	btn.style.borderWidth = "2px";
	btn.innerText = "";
	btn.className = "selected";
	infoIDDiv.innerText = `Chunk ID : ${chunkIDs.getChunkIDFromSpriteIndex(id)}`;
	infoPositionDiv.innerText = `Chunk Position : ${JSON.stringify(chunkIDs.getPositionFromSpriteIndex(id))})`;

	let chunkID = chunkIDs.getChunkIDFromSpriteIndex(currentChunk);
	let currentNotes = "";
	if (notesForChunks[chunkID] !== undefined) {
		currentNotes = notesForChunks[chunkID];
	}
	notesTextBox.value = currentNotes;
}


function onNoteChanged(newText) {
	console.log(`Text Area Changed : ${newText}`);
	if (currentChunk !== undefined) {
		let chunkID = chunkIDs.getChunkIDFromSpriteIndex(currentChunk);
		notesForChunks[chunkID] = newText;
	}
}