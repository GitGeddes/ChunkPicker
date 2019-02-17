/**
 * Created by jespe on 2019-02-17.
 */
/**
 * Called when the Chunk Info Menu is opened
 */
function onImportMenuOpened() {
	onChunkPicked = selectChunk;
	if (currentChunk !== undefined) {
		selectChunk(currentChunk);
	}
}

/**
 * Called when the Chunk Info Menu is closed
 */
function onImportMenuClosed() {

}

$(document).ready(function () {

});

function createExportJson() {
	const exportObject = {
		unlockedChunks: [],
		potentialChunks: [],
		chunkNotes: notesForChunks,
	};
	for (var i = 0; i < unlockedChunks.length; i++) {
		var id = unlockedChunks[i];
		exportObject.unlockedChunks.push(chunkIDs.getChunkIDFromSpriteIndex(id));
	}
	for (var i = 0; i < potentialChunks.length; i++) {
		var id = potentialChunks[i];
		exportObject.potentialChunks.push(chunkIDs.getChunkIDFromSpriteIndex(id));
	}

	//Create File name
	let fileName = "chunkSelectorSaveFile";

	fileName += ".json";
	//Create file name
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
	var dlAnchorElem = document.getElementById('downloadAnchorElem');
	dlAnchorElem.setAttribute("href", dataStr);
	dlAnchorElem.setAttribute("download", fileName);
	dlAnchorElem.click();

	// return JSON.stringify(exportObject, null, 2);
}

function onMergeComplete(data) {
	// Notes
	const chunkNotes = data.chunkNotes;
	for (const chunkID in chunkNotes) {
		if (chunkNotes.hasOwnProperty(chunkID)) {
			const notes = chunkNotes[chunkID];
			if (notesForChunks.hasOwnProperty(chunkID)) {
				// If we already have notes, Append the notes ontop of our own
				notesForChunks[chunkID] = notesForChunks[chunkID]+'\n'+notes;
			}
			else {
				// We dont have any notes, just save them
				notesForChunks[chunkID] = notes;
			}
		}
	}

}

function onImportComplete(data) {
	console.log(data);

	//Unlocked chunks
	const unlocked = data.unlockedChunks;

	unlockedChunks = [];
	for (var i = 0; i < unlocked.length; i++) {
		var chunkID = Number(unlocked[i]);
		unlockChunk(chunkIDs.getSpriteIndexFromChunkID(chunkID));
	}

	// Potential chunks
	potentialChunks = [];
	const potential = data.potentialChunks;
	for (var i = 0; i < potential.length; i++) {
		var chunkID = Number(potential[i]);
		potentialChunks.push(chunkIDs.getSpriteIndexFromChunkID(chunkID));
	}

	// Notes
	notesForChunks = data.chunkNotes;

}

function importButtonClicked() {
	onFileImported = onImportComplete;
	var importFileSelector = document.getElementById('importFileSelector');
	importFileSelector.click();
}

function mergeButtonClicked() {
	onFileImported = onMergeComplete;
	var importFileSelector = document.getElementById('importFileSelector');
	importFileSelector.click();
}


function onSaveFileImported() {
	var importFileSelector = document.getElementById('importFileSelector');

	let file = importFileSelector.files[0];
	if (file == undefined) {
		return;
	}

	var reader = new FileReader();
	reader.onload = function (event) {
		var jsonObj = JSON.parse(event.target.result);
		onFileImported(jsonObj);

		updateSearch(currentSearch);
		if (currentChunk !== undefined){
			selectChunk(currentChunk);
		}

	};

	reader.readAsText(file);
}

let onFileImported = function (data) {
	console.log("not yet overridden");
};