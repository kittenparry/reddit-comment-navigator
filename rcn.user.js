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

// element.classList.add('my-class-name');
// element.classList.remove('my-class-name');

// container of comments
let comments_div = document.getElementsByClassName('sitetable nestedlisting')[0]
// only even children are comments, odds are separators
// list of all comments
let comments = [];
for (i = 0; i < comments_div.children.length; i++) {
	if ((i % 2) == 0) {
		comments.push(comments_div.children[i]);
	}
}

// oh no, a global variable
// selected comment
rcn_sc = 0;
// selected level depth
rcn_dep = 0;
// style class for selected comment
rcn_sc_sel = 'rcn-selected-comment'
// so to not scroll to view initially
rcn_init = true;
// selected element
rcn_sel_el = null;

// remove the styling from last selected value
// add to the new one
// set selected_comment to new value
style_sel_com = (sel) => {
	if (sel < 0) {
		sel = 0;
	}
	comments[rcn_sc].children[2].classList.remove(rcn_sc_sel)
	comments[sel].children[2].classList.add(rcn_sc_sel);
	rcn_sel_el = comments[sel].children[2];
	if (!rcn_init) {
		comments[sel].scrollIntoView();
		// comments[sel].focus(); // not working
	}
	rcn_init = false;
	rcn_sc = sel;
}

// start with first comment selected
style_sel_com(rcn_sc);

change_sel_com_lvl = (dire) => {
	if (rcn_dep == 0 && dire == 'up') {
		return;
	}
	rcn_sel_el.classList.remove(rcn_sc_sel);
	if (dire == 'down') {
		rcn_sel_el = rcn_sel_el.parentElement.children[3].children[0].children[0].children[2];
		rcn_dep += 1;
	} else {
		rcn_sel_el = rcn_sel_el.parentElement.parentElement.parentElement.parentElement.children[2];
		rcn_dep -= 1;
	}
	rcn_sel_el.classList.add(rcn_sc_sel);
	rcn_sel_el.scrollIntoView();
}

// key functions
red_com_nav = (e) => {
	let type = e.target.getAttribute('type');
	let tag = e.target.tagName.toLowerCase();
	if (type != 'text' && tag != 'textarea' && type != 'search') {
		switch (e.keyCode) {
			case 72: // h - prev on same level
				style_sel_com(rcn_sc - 1);
				break;
			case 76: // l - next on same level
				style_sel_com(rcn_sc + 1);
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
