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
	menuTopParent = $("#menuTopParent")[0];
	const children = document.getElementsByClassName('menuParent');
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		menuParents[child.id] = child;
	}
	openMenu(MenuState.NONE);
});


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

	currentMenuState = newMenuState;
	let newMenuParent = menuParents[MenuState[currentMenuState]];
	if (newMenuParent !== undefined) {
		newMenuParent.style.display = 'block';
	}

	onMenuOpened(newMenuState);
}

function closeMenu() {
	menuTopParent.style.display = 'none';
}


function onMenuOpened(menuState) {
	switch (menuState) {
		case MenuState.UNLOCKER: {
			break;
		}
		case MenuState.CHUNKINFO: {
			break;
		}
		case MenuState.NONE: {
			closeMenu();
			break;
		}
	}
}
