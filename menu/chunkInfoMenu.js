/**
 * Created by jespe on 2019-02-17.
 */

let infoPositionDiv;
let infoIDDiv;
let notesTextBox;
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
let currentSearch = "";
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
		const btn = document.getElementById(currentChunk);
		btn.style.borderWidth = '0px';
		btn.className = "locked";
		btn.innerText = "";
	}

	for (let i = 0; i < unlockedChunks.length; i++) {
		const chunkID = unlockedChunks[i];
		unlockChunk(chunkID);
	}

	for (let i = 0; i < potentialChunks.length; i++) {
		const chunkID = potentialChunks[i];
		addChunkAsPotential(chunkID);
	}
}

/**
 * The method which will be called when a chunk is clicked for the "Chunk Info" menu.
 * @param id
 */
function selectChunk(id) {
	id = Number(id);
	// Deselect old chunk
	if (currentChunk !== undefined) {
		removeSelectionClass(currentChunk);
	}

	drawUnlockedBorders();
	updateSearch(currentSearch);
	//Select the new chunk
	currentChunk = id;

	const btn = document.getElementById(id);
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
	if (currentChunk !== undefined) {
		let chunkID = chunkIDs.getChunkIDFromSpriteIndex(currentChunk);
		notesForChunks[chunkID] = newText;
	}
}

function removeSelectionClass(id) {
	if (unlockedChunks.indexOf(id) !== -1) {
		unlockChunk(id);
	}
	else {
		const btn = document.getElementById(id);
		btn.className = "locked";
		btn.style.borderWidth = '0px';
		btn.innerText = "";
	}
}

function updateSearch(newSearch) {
	removeCurrentSearch();

	currentSearch = newSearch;
	loopThroughSearchedChunks((chunkID)=>{
		const id = chunkIDs.getSpriteIndexFromChunkID(chunkID);
		const btn = document.getElementById(id);
		btn.style.borderWidth = "2px";
		btn.innerText = "";
		btn.className = "searchedChunk" + (unlockedChunks.indexOf(id) !== -1 ? ' unlocked' : ' locked');
	});
}

function removeCurrentSearch() {
	loopThroughSearchedChunks((chunkID)=>{
		const id = chunkIDs.getSpriteIndexFromChunkID(chunkID);
		removeSelectionClass(id);
	});
}


/**
 * Calls the given function for each matching chunk
 * @param func (id : number)=>void
 */
function loopThroughSearchedChunks(func) {
	if (currentSearch == "") {
		return;
	}

	for (const p in notesForChunks) {
		if (notesForChunks.hasOwnProperty(p)) {
			const note = notesForChunks[p];
			if (new RegExp(currentSearch.toLowerCase()).test(note.toLowerCase())){
				func(Number(p));
			}
		}
	}
}