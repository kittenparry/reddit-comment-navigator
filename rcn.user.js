// ==UserScript==
// @name         reddit Comment Navigator
// @namespace    https://github.com/kittenparry/
// @version      0.1.0-a.1
// @description  Use keyboard keys to upvote, downvote, collapse/expand & navigate through comments
// @author       kittenparry
// @match        *://*.reddit.com/r/*/comments/*
// @grant        none
// @license      GPL-3.0-or-later
// ==/UserScript==

// append the custom css to page
var css = `
.rcn-selected-comment {
	border: 2px solid #000
}
`;

if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}

// oh no, a global variable
// selected comment
rcn_sc = 0;
// selected level depth
rcn_dep = 0;
// style class for selected comment
rcn_sc_sel = 'rcn-selected-comment'
// initial selection & selected global element variable
rcn_sel_el = document.getElementsByClassName('sitetable nestedlisting')[0].children[0].children[2];
rcn_sel_el.classList.add(rcn_sc_sel);

// select prev & next elements on the same level
change_sel_com_same = (dire) => {
	if (rcn_sc <= 0 && dire == 'left') {
		rcn_sc = 0;
		return;
	}
	rcn_sel_el.classList.remove(rcn_sc_sel);
	if (dire == 'right') {
		rcn_sc += 2;
		rcn_sel_el = rcn_sel_el.parentElement.parentElement.children[rcn_sc].children[2];
	} else {
		rcn_sc -= 2;
		rcn_sel_el = rcn_sel_el.parentElement.parentElement.children[rcn_sc].children[2];
	}
	rcn_sel_el.classList.add(rcn_sc_sel);
	check_if_in_view();
};

// move a level up or down
change_sel_com_lvl = (dire) => {
	if (rcn_dep == 0 && dire == 'up') {
		return;
	}
	// reset selected when changing depth
	rcn_sc = 0;
	rcn_sel_el.classList.remove(rcn_sc_sel);
	if (dire == 'down') {
		rcn_sel_el = rcn_sel_el.parentElement.children[3].children[0].children[0].children[2];
		rcn_dep += 1;
	} else {
		rcn_sel_el = rcn_sel_el.parentElement.parentElement.parentElement.parentElement.children[2];
		rcn_dep -= 1;
	}
	rcn_sel_el.classList.add(rcn_sc_sel);
	check_if_in_view();
}

/* * * * * * * * *
 * EXTERNAL BEGIN *
 * * * * * * * * */

/*!
 * Source: https://gomakethings.com/how-to-check-if-any-part-of-an-element-is-out-of-the-viewport-with-vanilla-js/
 * Check if an element is out of the viewport
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}  elem The element to check
 * @return {Object}     A set of booleans for each side of the element
 */
rcn_is_out_of_viewport = (elem) => {

	// Get element's bounding
	var bounding = elem.getBoundingClientRect();

	// Check if it's out of the viewport on each side
	var out = {};
	out.top = bounding.top < 0;
	out.left = bounding.left < 0;
	out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
	out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
	out.any = out.top || out.left || out.bottom || out.right;
	out.all = out.top && out.left && out.bottom && out.right;

	return out;
};

/* * * * * * * *
 * EXTERNAL END *
 * * * * * * * */

check_if_in_view = () => {
	let is_out = rcn_is_out_of_viewport(rcn_sel_el);
	if (is_out.any) {
		rcn_sel_el.scrollIntoView();
	}
};


// key functions
red_com_nav = (e) => {
	let type = e.target.getAttribute('type');
	let tag = e.target.tagName.toLowerCase();
	if (type != 'text' && tag != 'textarea' && type != 'search') {
		switch (e.keyCode) {
			case 72: // h - prev on same level
				change_sel_com_same('left');
				break;
			case 76: // l - next on same level
				change_sel_com_same('right');
				break;
			case 74: // j - move one level up
				change_sel_com_lvl('up');
				break;
			case 75: // k - move one level down
				change_sel_com_lvl('down');
				break;
			case 81: // q - upvote
				//
				break;
			case 69: // e - downvote
				//
				break;
			case 82: // r - collapse/expand
				//
				break;
			default:
		}
	}
}

window.addEventListener('keydown', e => red_com_nav(e), false);

/*
h - prev on same level
l - next on same level
j - move one level up
k - move one level down
q - upvote
e - downvote
r - collapse/expand
*/
