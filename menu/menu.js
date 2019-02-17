/**
 * https://www.w3schools.com/howto/howto_custom_select.asp
 */
/**
 * The different menus that can be opened
 */
const MenuState = {
	UNLOCKER: 'UNLOCKER',
	CHUNKINFO: 'CHUNKINFO',
	NONE: 'NONE',
};
/**
 * The currently open menu
 * @type {string}
 */
let currentMenuState = undefined;

// HTML elements
let menuTopParent;
let menuParents = {};

$(document).ready(function () {
	// Get the html parents for our different menus.
	menuTopParent = $("#menuTopParent")[0];
	const children = document.getElementsByClassName('menuParent');
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		menuParents[child.id] = child;
	}

	//Start with the menu closed
	openMenu(MenuState.NONE);
});


/**
 * Called when the user selects a menu
 * Closes the current one and opens the new one.
 * @param newMenuState
 */
function openMenu(newMenuState) {
	console.log(newMenuState);
	if (currentMenuState === newMenuState) {
		return;
	}

	menuTopParent.style.display = 'block';

	let oldMenuParent = menuParents[MenuState[currentMenuState]];
	if (oldMenuParent !== undefined) {
		oldMenuParent.style.display = 'none';
	}

	onMenuClosed(currentMenuState);


	currentMenuState = newMenuState;
	let newMenuParent = menuParents[MenuState[currentMenuState]];
	if (newMenuParent !== undefined) {
		newMenuParent.style.display = 'block';
	}

	onMenuOpened(newMenuState);
}

/**
 * Hides the full menu
 */
function closeMenu() {
	menuTopParent.style.display = 'none';
}


/**
 * Put your logic for opening the menus here
 * @param menuState
 */
function onMenuOpened(menuState) {
	switch (menuState) {
		case MenuState.UNLOCKER: {
			onUnlockerMenuOpened();
			break;
		}
		case MenuState.CHUNKINFO: {
			onChunkInfoMenuOpened();
			break;
		}
		case MenuState.NONE: {
			closeMenu();
			onChunkPicked = selectChunk;
			break;
		}
	}
}


/**
 * Put your logic for Closing the menus here
 * @param menuState
 */
function onMenuClosed(menuState) {
	switch (menuState) {
		case MenuState.UNLOCKER: {
			onUnlockerMenuClosed();
			break;
		}
		case MenuState.CHUNKINFO: {
			onChunkInfoMenuClosed();
			break;
		}
		case MenuState.NONE: {
			onChunkInfoMenuClosed();
			break;
		}
	}
}