/**
 * https://www.w3schools.com/howto/howto_custom_select.asp
 */
/**
 * The different menus that can be opened
 */
const MenuState = {
	UNLOCKER: 'UNLOCKER',
	CHUNKINFO: 'CHUNKINFO',
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
	menuTopParent = $("#menuTopParent");
	const children = document.getElementsByClassName('menuParent');
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		menuParents[child.id] = child;
	}
	openMenu(MenuState.UNLOCKER);
});


function openMenu(newMenuState) {
	console.log(newMenuState);
	if (currentMenuState === newMenuState) {
		return;
	}

	if (currentMenuState !== undefined){
		menuParents[MenuState[currentMenuState]].style.display = 'none';
	}

	currentMenuState = newMenuState;
	menuParents[MenuState[currentMenuState]].style.display = 'block';
}



