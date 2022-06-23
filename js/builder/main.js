/** HTML window system originally written for Flower Project
 * @external "windowSystem.js"
 * @author Onien
 */

import Windows from "./windowSystem.js";
import { removeArray } from "../utils.js";

let 
	ScenesElement = document.querySelector(".scenes"),
	NewSceneButton = document.querySelector(".headerButtons.newScene"),
	NewSequenceButton = document.querySelector(".headerButtons.newSequence"),
	WindowsElement = document.querySelector(".windows");

let Scenes = window.Scenes = [];
let windows = new Windows("window", WindowsElement, {
	cssInject: true
});

/** @function getOpenButtons 
 * @desc returns all openScene buttons
 * @param {String} selector - buttons selector
 * @returns {Array(HTMLElement)} - list of elemetns
 */

const getOpenButtons = (selector = "button.gotoScene") => {
	return [...document.querySelectorAll(selector)]
}

/** @function CreateNewScene 
 * @desc function creates new scene
 * @param {HTMLElement} element - scenes parent
 */

const CreateNewScene = (element) => {
	bootbox.prompt("Enter scene name", (name) => {
		if (name == null) return bootbox.alert("Enter not empty string!")
		Scenes.push({
			name: name,
			dialogs: []
		});
		scenesSync(element, Scenes);	
	});
}

/** @fucntion buttonsSetup 
 * @desc sets up header button
 * @param {HTMLElement} newScene - new scene button
 * @param {HTMLElement} newSequence - new sequence button
 */

const buttonsSetup = (newScene, newSequence, opens) => {
	newScene.onclick = () => {
		CreateNewScene(ScenesElement); // ScenesElement - global
	};
}

const scenesSync = (element, scenes = Scenes) => {
	element.innerHTML = "";

	scenes.map((scene, idx) => {
		let newScene = document.createElement("div");
		newScene.classList.add("scene");
		newScene.setAttribute("sceneId", idx);

		let sceneElements = {
			sceneName: { element: document.createElement("span"), sets: {
				innerHTML: scene.name
			} },
			sceneActions: { element: document.createElement("span"), sets: {
				innerHTML: scene.dialogs.length > 0 ? scene.dialogs.length : "there are no dialogs"
			} },
			gotoScene: {
				element: document.createElement("button"),
				sets: {
					className: "btn btn-primary navy gotoScene",
					innerHTML: "Open"
				}
			}
		}

		Object.keys(sceneElements).forEach(className => {
			let sceneElement = sceneElements[className];
			sceneElement.element.classList.add(className);
			Object.keys(sceneElement.sets).forEach(setting => {
				let value = sceneElement.sets[setting];
				sceneElement.element[setting] = value;
			});
			if (sceneElement.attributes != undefined) {
				Object.keys(sceneElement.attributes).forEach(attributeName => {
					let atttribute = sceneElement.attributes[attributeName];
					sceneElement.setAttribute(attributeName, atttribute);
				});
			}
			newScene.appendChild(sceneElement.element);
		});

		element.appendChild(newScene);
	});

	getOpenButtons().forEach(button => {
		button.onclick = () => {
			openScene(button.parentNode, parseInt(button.parentNode.getAttribute("sceneId")));
		}	
	});
}

/** @fucntion inputBox 
 * @returns {HTMLElement} html box
 * @param {Object} options - options
 * @param {String} options.tag - if tag is not defined tag will be "input"
 * @param {Object} options.style - parent style
 * @param options.attributes - html element attributes 
 * @desc creates input element
 *  <br> It will generate html:
 *  <br> <{{ options.tag ?? "input" }} style={{ options.style }} class="{{ options.classList.join(" ") }}" ...options.attributes>	
 */

const inputBox = (options) => {
	let box = document.createElement(options.tag ?? "input");
	box.innerHTML = options?.innerHTML;
	options.classList != undefined ? box.classList.add(...options.classList) : null;
	Object.assign(box.style, options.style);
	if (options.attributes != undefined) {
		Object.keys(options.attributes).forEach(attr => {
			let value = options.attributes[attr];
			box.setAttribute(attr, value);
		});
	}
	return box;
}

/** @function textElement 
 * @param {Object} options - text options
 * @param {String} options.tag - if tag is not defined tag will be "span"
 * @param {Object} options.style - parent style
 * @desc creates text element
 * <br> It will generate:
 * <br> <{{ options.tag ?? "span" }} style="{{ options.style }}" class="{{ options.classList.join(" ") }}">
 * <br>	&nbsp;&nbsp; {{ options.innerHTML }}
 * <br> </{{ options.tag ?? "span" }}>

 */ 

const textElement = (options) => {
	let element = document.createElement(options.tag ?? "span");
	element.innerHTML = options?.innerHTML;
	Object.assign(element.style, options.style);
	options.classList != undefined ? element.classList.add(...options.classList) : null;

	return element;
}

/** @function
 * @name selectBox 
 * @returns {HTMLElement}
 * @param {Object} options - Options for select box
 * @param {String} options.tag - if tag is not defined tag will be "select"
 * @param {Object} options.style - parent style
 * @param {Object[]} options.options - html <option value={{ option.value }}>{{ option.innerHTML }}</option> element
 * @param {String} options.options[index].value
 * @param {String} options.options[index].innerHTML
 * @param options.attributes - html element attributes 
 * @desc creates select html element
 * <br> It will generate html:
 * <br> <{{ options.tag ?? "select" }} style={{ options.style }} class="{{ options.classList.join(" ") }}" ...options.attributes>
 * <br>		{ @foreach options.options as option }
 * <br>			<option value={{ option.value }}>{{ option.innerHTML }}</option>
 * <br>		{ /foreach }
 * <br> </{{ options.tag ?? "select" }}>

 */

const selectBox = (options) => {
	let box = document.createElement(options.tag ?? "select");
	options.classList != undefined ? box.classList.add(...options.classList) : null;
	Object.assign(box.style, options.style);
	options.options.map(option => {
		let optionElement = document.createElement("option");
		optionElement.value = option.value;
		optionElement.innerHTML = option.innerHTML;
		box.appendChild(optionElement);
	});
	if (options.attributes != undefined) {
		Object.keys(options.attributes).forEach(attr => {
			let value = options.attributes[attr];
			box.setAttribute(attr, value);
		});
	}
	return box;
}

/** @function makeDialogArticle 
 * @desc function builds dialog article
 * @param {String} name - dialog character name
 * @param {int} id - dialogId attribute
 */

const makeDialogArticle = (name, id) => {
	let parent = document.createElement("div");
	parent.classList.add("dialogArticleOne");
	parent.setAttribute("dialogId", id);

	let dialogCharNameText = textElement({
		innerHTML: name,
		classList: ["dialogArticleName"]
	});

	let gotoDialog = inputBox({ 
		tag: "button",
		innerHTML: "Open",
		classList: ["openDialogButton" , "btn", "btn-primary"]
	});

	parent.appendChild(dialogCharNameText);
	parent.appendChild(gotoDialog);

	/*
	 .dialogArticleOne is the parent element:
		.dialogArticleName dialog character name element
		.openDialogButton.btn.btn-primary open dialog setup ui
	*/

	return parent;
}

/** @function makeSetupUI 
 * @desc function builds scene setup ui
 * there are no params
 */

const makeSetupUI = () => {
	let parent = document.createElement("div");
	parent.classList.add("setupUIRoot");
	
	let nameBoxParent = document.createElement("div");
	nameBoxParent.classList.add("nameBoxParent");

	let nameBox = inputBox({
		classList: ["sceneInputName"]
	});

	let nameLabel = textElement({
		tag: "label",
		innerHTML: "Scene name: ",
		classList: ["nameBoxLabel"],
		style: {
			marginRight: "5px"
		}
	});

	let saveButton = inputBox({
		tag: "button",
		innerHTML: "Save",
		classList: ["sceneEditSave", "btn", "btn-primary"],
		style: {
			position: "absolute",
			bottom: 0,
			right: 0,
			marginBottom: "5px",
			marginRight: "5px"
		}
	});

	let newDialogButton = inputBox({
		tag: "button",
		innerHTML: "New dialog",
		classList: ["newDialogButton", "btn", "btn-success"]
	});

	let dialogs = document.createElement("div");
	dialogs.classList.add("dialogSetupArticle");

	nameBoxParent.appendChild(nameLabel);
	nameLabel.appendChild(nameBox);

	parent.appendChild(nameBoxParent);
	parent.appendChild(dialogs);
	parent.appendChild(newDialogButton);
	parent.appendChild(saveButton);

	/* 
	 .setupUIRoot is the parent node:
		.nameBoxParent is the parent element of scene name input box:
			.nameBoxLabel is the label of name input box:
				.sceneInputName is the name of the scene
		.dialogSetupArticle is the parent element of the dialog articles
			{makeDialogArticle() function returnings}
		.newDialogButton.btn.btn-success new dialog button
		.saveEditSave.btn.btn-primary save button
	*/

	return {
		boxes: {
			nameLabel: nameLabel,
			nameBox: nameBox,
			nameBoxParent: nameBoxParent,
			saveButton: saveButton,
			dialogs: dialogs
		},
		parent: parent
	};
}

/** @see {@link makeDialogUI} */

const makeInputWithLabel = (options) => {
	let Parent = document.createElement("div");
	Parent.classList.add(...options.classList);

	let Box = inputBox({
		classList: ["inputBox"],
		style: options.style,
		tag: options.tag,
		attributes: options.attributes
	});

	let Label = textElement({
		tag: "label",
		innerHTML: options.name,
		classList: ["labelBox"],
		style: {
			marginRight: "5px"
		}
	});

	Parent.appendChild(Label);
	Label.appendChild(Box);

	return Parent;
}

const makeSpriteUI = () => {
	let parent = document.createElement("div");
	parent.classList.add("spriteSetup");
	parent.style.overflowY = "scroll";
	parent.style.height = "inherit";

	let spriteName = makeInputWithLabel({
		name: "Sprite name: ",
		classList: ["spriteName"]
	});

	let spriteImage = makeInputWithLabel({
		name: "File name: ",
		classList: ["spriteImage"],
		style: {
			marginTop: "10px"
		},
		attributes: {
			type: "file"
		}
	});
	
	let spritePreview = document.createElement("div");
	spritePreview.classList.add("imagePreview");
	spritePreview.style.    marginTop      = "10px";
	spritePreview.style.    display        = "flex";
	spritePreview.style.    flexDirection  = "row";
	spritePreview.style.    justifyContent = "space-around";
	spritePreview.style.    height         = "400px";

	let positionParent = document.createElement("div");
	positionParent.classList.add("positionParent");
	positionParent.style.   marginLeft = "25px";
	positionParent.style.   marginTop  = "10px";
	positionParent.         hidden     =  true;

	let positionVisually = document.createElement("div");
	positionVisually.classList.add("positionVisually");

	positionVisually.style.  marginLeft   = "25px";
	positionVisually.style.  marginRight  = "25px";
	positionVisually.style.  marginTop    = "10px";
	positionVisually.style.  border       = "1px solid black";
	positionVisually.style.  borderRadius = "5px";
	positionVisually.style.  height       = "800px";
	positionVisually.style.  overflow     = "hidden";
	
	let positionTop = makeInputWithLabel({
		name: "Top: ",
		classList: ["positionTop"],
		style: {
			marginTop: "10px"
		}
	});

	let positionLeft = makeInputWithLabel({
		name: "Left: ",
		classList: ["positionLeft"],
		style: {
			marginTop: "10px"
		}
	});

	let positionOpen = inputBox({
		tag: "button",
		innerHTML: "Open/close position settings",
		classList: ["positionOpen", "btn", "btn-secondary"],
		style: {
			marginTop: "10px"
		}
	});

	let saveButton = inputBox({
		tag: "button",
		innerHTML: "Save",
		classList: ["spriteSaveButton", "btn", "btn-primary"],
		style: {
			position: "absolute",
			bottom: 0,
			right: 0,
			marginBottom: "5px",
			marginRight: "5px"
		}
	});

	let deletePose = inputBox({
		tag: "button",
		innerHTML: "delete pose",
		classList: ["deletePoseButton"],
		style: {
			marginTop: "10px"
		}
	});

	parent.appendChild(spriteName);
	parent.appendChild(spriteImage);
	parent.appendChild(spritePreview);
	parent.appendChild(deletePose);

	parent.appendChild(document.createElement("br"));

	parent.appendChild(positionOpen);
	parent.appendChild(positionParent);
	positionParent.appendChild(positionTop);
	positionParent.appendChild(positionLeft);

	positionParent.appendChild(positionVisually);

	parent.appendChild(saveButton);

	return parent;
}

const addSpriteHTML = (pose, spritePreview, poses) => {
	let preview = document.createElement("div");
	preview.style.backgroundImage = "url(" + pose + ")";
	preview.style.maxWidth = "400px";
	preview.style.backgroundSize = "100% 100%";
	preview.style.width = "50%";
	preview.classList.add("spritePose");

	let changeButton = document.createElement("input");
	changeButton.classList.add("changeButton");
	changeButton.type = "file";
	changeButton.style.top = "-15px";
	changeButton.style.width = "30px";
	changeButton.style.left = "50%";
	changeButton.style.width = "220px";
	changeButton.style.position = "relative";
	changeButton.style.zIndex = "5";
	changeButton.style.background = "white";
	changeButton.style.transform = "translateX(-50%)";
	changeButton.hidden = true;


	preview.appendChild(changeButton);

	preview.onclick = event => {
		if (!event.target.classList.contains("spritePose")) return;

		[...spritePreview.querySelectorAll(".spritePose")].map(el => el.classList.remove("spriteSelected"));
		event.target.classList.add("spriteSelected");
	}

	preview.onmouseenter = event => {
		changeButton.hidden = false;
	}

	preview.onmouseleave = event => {
		changeButton.hidden = true;
	}

	changeButton.onchange = event => {
		var reader = new FileReader();

		reader.onload = () => {
			let index = [...spritePreview.querySelectorAll(".spritePose")].indexOf(preview);

			preview.style.backgroundImage = "url(" + reader.result + ")";
			poses[index] = reader.result;
		}

		reader.readAsDataURL(event.target.files[0]);	
	}

	return preview;
}

const openSpriteSetup = ({ parentWindow, scene, sprite, spriteName, spritesParent }) => {
	let newWindow = windows.addWindow();
	newWindow.open(newWindow);
	newWindow.setTitle(`Editing sprite: ${spriteName}`, newWindow.id);
	newWindow.window_html(makeSpriteUI().outerHTML, newWindow.id);
	
	let posParent = newWindow.getFromContent(".spriteSetup > .positionParent", newWindow.id);
	let save = newWindow.getFromContent(".spriteSetup > .spriteSaveButton", newWindow.id);

	let posOpen = newWindow.getFromContent(".spriteSetup > .positionOpen", newWindow.id);
	let positionTop = posParent.querySelector(".positionTop > .labelBox > .inputBox", newWindow.id);
	let positionLeft = posParent.querySelector(".positionLeft > .labelBox > .inputBox", newWindow.id);
	let positionVisually = posParent.querySelector(".positionVisually", newWindow.id);

	let spriteNameBox = newWindow.getFromContent(".spriteSetup > .spriteName > .labelBox > .inputBox", newWindow.id);
	let spriteImageFile = newWindow.getFromContent(".spriteSetup > .spriteImage > .labelBox > .inputBox", newWindow.id);
	let spritePreview = newWindow.getFromContent(".spriteSetup > .imagePreview", newWindow.id);

	let deletePose = newWindow.getFromContent(".spriteSetup > .deletePoseButton", newWindow.id);

	positionTop.value = sprite.top ?? "";
	positionLeft.value = sprite.left ?? "";
	spriteNameBox.value = spriteName;

	if (sprite != undefined && sprite.poses != undefined && sprite.poses.length > 0) {
		sprite.poses.forEach(pose => {
			if (!pose.startsWith("data:image")) return;
			spritePreview.appendChild(addSpriteHTML(pose, spritePreview, sprite.poses));
		});
	}

	if (sprite.poses == undefined) sprite.poses = [];

	deletePose.onclick = event => {
		if (spritePreview.querySelector(".spriteSelected") == null) return;

		let spriteElement = spritePreview.querySelector(".spriteSelected");
		let index = [...spritePreview.querySelectorAll(".spritePose")].indexOf(spriteElement);


		spriteElement.remove();
	}

	save.onclick = () => {
		sprite.top = positionTop.value;
		sprite.left = positionLeft.value;
		if (spriteName != spriteNameBox.value) {
			scene.sprites[spriteNameBox.value] = sprite;
			delete scene.sprites[spriteName];
			spriteName = spriteNameBox.value;
		}

		newWindow.setTitle(`Editing sprite: ${spriteName}`, newWindow.id);

		spritesSync(spritesParent, scene, parentWindow);
	}

	posOpen.onclick = () => {
		posParent.hidden = !posParent.hidden;
		
		// Preparing visual positioning

		if (spritePreview.src == "") return;

		positionVisually.innerHTML = "";

		let image = new Image();
		image.src = sprite.poses[0];
		image.style.position = "relative";
		image.style.border = "1px dashed orange";

		image.style.left = positionLeft.value;
		image.style.top = positionTop.value;
		
		positionVisually.appendChild(image);

		$(image).draggable({
			drag: (event, ui) => {
				positionTop.value = Math.round((ui.position.top / positionVisually.offsetHeight) * 100) + "%";
				positionLeft.value = Math.round((ui.position.left / positionVisually.offsetWidth) * 100) + "%";
			}
		});
	}

	positionTop.oninput = event => {
		if (posParent.hidden) return;

		let element = positionVisually.querySelector("img");
		element.style.top = positionTop.value;
		element.style.left = positionLeft.value;
	}

	positionLeft.oninput = event => {
		if (posParent.hidden) return;

		let element = positionVisually.querySelector("img");
		element.style.top = positionTop.value;
		element.style.left = positionLeft.value;
	}

	spriteImageFile.onchange = (event) => {
		var reader = new FileReader();
		reader.onload = () => {
			spritePreview.appendChild(addSpriteHTML(reader.result, spritePreview, sprite.poses));
			sprite.poses.push(reader.result);
		}
		reader.readAsDataURL(event.target.files[0]);
	}
}

/** @function makeDialogUI 
 * @desc function buils dialog setup ui
 * there are no params
 * @returns {HTMLElement}
 */

const makeDialogUI = () => {
	let parent = document.createElement("div");
	parent.classList.add("dialogSetup");
	parent.style.overflowY = "scroll";
	parent.style.height = "inherit";

	let openOtherSettings = inputBox({
		tag: "button",
		innerHTML: "Open/close other settings",
		classList: ["openOtherSettings", "btn", "btn-secondary"],
		style: {
			margin: "10px"
		}
	});

	let openBackgroundSettings = inputBox({
		tag: "button",
		innerHTML: "Open/close background settings",
		classList: ["openBackgroundSettings", "btn", "btn-secondary"],
		style: {
			margin: "10px"
		}
	});

	let backgroundSettings = document.createElement("div");
	backgroundSettings.classList.add("backgroundSettings");
	backgroundSettings.style.marginLeft = "25px";

	let nextSettings = document.createElement("div");
	nextSettings.classList.add("nextAdditionalSettings");
	nextSettings.style.marginLeft = "25px";
	nextSettings.hidden = true;

	let otherSettings = document.createElement("div");
	otherSettings.classList.add("otherSettings");
	otherSettings.style.marginLeft = "25px";

	let spriteSettings = document.createElement("div");
	spriteSettings.classList.add("spriteSettings");
	spriteSettings.style.marginLeft = "25px";

	let backgroundTransitionParent = document.createElement("div");
	backgroundTransitionParent.classList.add("backgroundTransitionParent");
	backgroundTransitionParent.style.marginLeft = "45px";
	backgroundTransitionParent.hidden = true;

	let charName = makeInputWithLabel({
		name: "Character name: ",
		classList: ["characterName"]
	});

	let dialogText = makeInputWithLabel({
		tag: "textarea",
		name: "Dialog text: ",
		classList: ["dialogTextParent"],
		style: {
			marginTop: "10px"
		}
	});

	let timeoutText = makeInputWithLabel({
		name: "Timeout: ",
		classList: ["timeoutText"],
		style: {
			marginTop: "10px"
		},
		attributes: {
			type: "number"
		}
	});

	let nextCheckbox = makeInputWithLabel({
		name: "Process next dialog after typing: ",
		classList: ["nextCheckbox"],
		style: {
			marginTop: "10px"
		},
		attributes: {
			type: "checkbox"
		}
	});

	let nextOpen = makeInputWithLabel({
		name: "Additional settings for [Next]: ",
		classList: ["nextAdditionalCheckbox"],
		style: {
			marginTop: "10px"
		},
		attributes: {
			type: "checkbox"
		}
	});

	let nextAdditionalInstantly = makeInputWithLabel({
		name: "Process before text: ",
		classList: ["nextAdditionalInstant"],
		attributes: {
			type: "checkbox"
		}
	});

	let nextAdditionalIncrement = makeInputWithLabel({
		name: "Skip dialogs: ",
		classList: ["nextAdditionalIncrement"],
		attributes: {
			type: "number"
		}
	});

	let clearSpritesCheckbox = makeInputWithLabel({
		name: "Dont clear sprites: ",
		classList: ["clearSprites"],
		attributes: {
			type: "checkbox"
		}
	});

	let backgroundFile = makeInputWithLabel({
		name: "File name: ",
		classList: ["backgroundFile"],
		attributes: {
			type: "file"
		}
	});

	let useBackgroundTransition = makeInputWithLabel({
		name: "Open/close transition settings: ",
		classList: ["backgroundUseTransition"],
		attributes: { 
			type: "checkbox"
		}
	});

	let backgroundTransitionEasing = makeInputWithLabel({
		name: "Transition easing: ",
		classList: ["backgroundTransitionEasing"],
		style: {
			marginTop: "10px"
		}
	});

	let backgroundTransitionTime = makeInputWithLabel({
		name: "Transition time: ",
		classList: ["backgroundTransitionTime"],
		attributes: {
			type: "number"
		},
		style: {
			marginTop: "10px"
		}
	});

	let backgroundTransitionName = selectBox({
		options: [
			{
				value: "opacity",
				innerHTML: "opacity"
			}
		],
		classList: ["backgroundTransitionName"],
		style: {
			marginTop: "10px"
		}
	});

	let spriteNew = inputBox({
		tag: "button",
		innerHTML: "New sprite",
		classList: ["dialogNewSprite", "btn", "btn-success"],
		style: {
			margin: "10px",
			marginLeft: "25px"
		},
		attributes: {
			hidden: true
		}
	});

	let spritesOpen = inputBox({
		tag: "button",
		innerHTML: "Open/Close sprites",
		classList: ["spritesOpen", "btn", "btn-secondary"],
		style: {
			margin: "10px"
		}
	});

	let sprites = document.createElement("div");
	sprites.classList.add("sprites")
	sprites.hidden = true;

	let saveButton = inputBox({
		tag: "button",
		innerHTML: "Save",
		classList: ["dialogSaveButton", "btn", "btn-primary"],
		style: {
			position: "absolute",
			bottom: 0,
			right: 0,
			marginBottom: "5px",
			marginRight: "5px"
		}
	});

	let suggest = textElement({
		innerHTML: "You can scroll this window!",
		classList: ["dialogWindowSuggestion"],
		style: {
			position: "absolute",
			bottom: 0,
			left: "5px",
			marginBottom: "5px"
		}
	});

	let backgroundPreview = document.createElement("img");
	backgroundPreview.classList.add("backgroundPreview");
	backgroundPreview.style.width = "50%";
	backgroundPreview.style.marginTop = "10px";

	parent.appendChild(charName);
	parent.appendChild(dialogText);
	parent.appendChild(timeoutText);
	parent.appendChild(nextCheckbox);
	parent.appendChild(nextOpen);

	nextSettings.appendChild(nextAdditionalInstantly);
	nextSettings.appendChild(nextAdditionalIncrement);

	parent.appendChild(nextSettings);

	parent.appendChild(openOtherSettings);
	
	parent.appendChild(otherSettings);
	otherSettings.appendChild(clearSpritesCheckbox);

	parent.appendChild(document.createElement("br"));

	parent.appendChild(openBackgroundSettings);
	parent.appendChild(backgroundSettings);
	backgroundSettings.appendChild(backgroundFile);
	backgroundSettings.appendChild(useBackgroundTransition);
	backgroundSettings.appendChild(backgroundTransitionParent);
	backgroundSettings.appendChild(backgroundPreview);
	
	backgroundTransitionParent.appendChild(backgroundTransitionName);
	backgroundTransitionParent.appendChild(backgroundTransitionTime);
	backgroundTransitionParent.appendChild(backgroundTransitionEasing);

	parent.appendChild(spritesOpen);
	parent.appendChild(sprites);
	parent.appendChild(spriteNew);

	parent.appendChild(saveButton);
	parent.appendChild(suggest);

	/*
	 .dialogSetup is parent element of everything:
		.characterName is the name of the character
		.dialogTextParent is the parent element of the dialog text
		.timeoutText is the parent element of the dialog timeout
		.nextCheckbox is the parent element of the next checkbox
		.nextAdditionalCheckbox is the checbox that will open next additional settings
		.nextAdditionalSettings is the parent element of the next additional settings
			.nextAdditionalInstant is the element that controls instant of the next command
			.nextAdditionalIncrement is the element that controls how many dialogs will be skipped
		.otherSettings is the parent element of the other settings:
			.clearSprites is the checkbox element that controls sprite clearing
		br is the line breaker
		.backgroundSettings is the parent element of background settings:
			.backgroundFile is the input[type="file"] to upload the image
			.backgroundUseTransition is the input[type="checkbox"] to close/open transition settings
			.backgroundTransitionParent is the parent element of the transition settings:
				.backgroundTransitionName is the element of transition settings to control transition name
				.backgroundTransitionTime is the input to control transition time
				.backgroundTransitionEasing is the input to control transition easing
		.saveSettings is the button element to save dialog settings 

		all inputs have structure like
		<div class="class" style="options.style">
			<label class="labelBox" for="">
				<input class="inputBox" ...options.attributes>
			</label>
		</div>
	 */

	return {		
		parent: parent
	}
}

/** @function openScene 
 * @desc function opens scene setup ui
 * @param {HTMLElement} sceneElement - never read
 * @param {int} index - scene index
 */

const openScene = (sceneElement, index) => {
	let thisWindow = windows.addWindow(); // creating window
	let ui = makeSetupUI(); // building setup ui
	let scene = Scenes[index];

	thisWindow.open(thisWindow);
	thisWindow.setTitle(`Editing scene: ${scene.name}`, thisWindow.id);
	thisWindow.window_html(ui.parent.outerHTML, thisWindow.id);

	dialogsSync(scene.dialogs, thisWindow.getFromContent(".setupUIRoot > .dialogSetupArticle", thisWindow.id), scene, thisWindow);
	
	let sceneNameInput = thisWindow.getFromContent(".setupUIRoot > .nameBoxParent > .nameBoxLabel > .sceneInputName", thisWindow.id);
	let dialogArticles = thisWindow.getFromContent(".setupUIRoot > .dialogSetupArticle", thisWindow.id);

	sceneNameInput.value = scene.name;

	// -------------------- EVENTS --------------------

	thisWindow.getFromContent(".setupUIRoot > .sceneEditSave", thisWindow.id).onclick = (event) => {
		scene.name = sceneNameInput.value;

		scenesSync(ScenesElement);
		
		thisWindow.setTitle(`Editing scene: ${scene.name}`, thisWindow.id);
	};
	
	thisWindow.getFromContent(".setupUIRoot > .newDialogButton", thisWindow.id).onclick = (event) => {
		bootbox.prompt("Enter character name", (name) => {
			scene.dialogs.push({
				name: name
			});
			dialogsSync(scene.dialogs, thisWindow.getFromContent(".setupUIRoot > .dialogSetupArticle", thisWindow.id), scene, thisWindow);
			scenesSync(ScenesElement);
			thisWindow.style.minHeight = (dialogArticles.offsetHeight + 100) + "px";
			
		});
	}
}

/** @function openDialog 
 * @desc function opens ui of dialog setup 
 * @param {HTMLElement} dialog - dialog article element in scene setup ui
 * @param {Object} scene - opened scene
 * @param {Object} sceneDialog - dialog object
 * @param {HTMLElementWindow} setupWindow - scene setup window
 */

const openDialog = (dialog, scene, sceneDialog, setupWindow) => {
	let dialogWindow = windows.addWindow(); // create window
	let ui = makeDialogUI(); // build ui for dialog setup
	let index = dialog.getAttribute("dialogId"); // getting article index

	// ------------ WINDOW SETUP --------------

	dialogWindow.open(dialogWindow);
	dialogWindow.setTitle(`Editing dialog in ${scene.name}`, dialogWindow.id);
	dialogWindow.window_html(ui.parent.outerHTML, dialogWindow.id);
	
	// ------- GETTING ELEMENTS -------

	let openBackgroundSettings =       dialogWindow.getFromContent(".dialogSetup > .openBackgroundSettings", dialogWindow.id); // background settings open button
	let openOtherSettings =            dialogWindow.getFromContent(".dialogSetup > .openOtherSettings", dialogWindow.id); // other settings open button
	let otherSettings =                dialogWindow.getFromContent(".dialogSetup > .otherSettings", dialogWindow.id); // other settings parent
	let backgroundSettings =           dialogWindow.getFromContent(".dialogSetup > .backgroundSettings", dialogWindow.id); // background settings parent
	let backgroundTransitionSettings = backgroundSettings.querySelector(".backgroundTransitionParent"); // background transition settings
	let charNameBox =                  dialogWindow.getFromContent(".dialogSetup > .characterName > .labelBox > .inputBox", dialogWindow.id); // character name box
	let dialogText =                   dialogWindow.getFromContent(".dialogSetup > .dialogTextParent > .labelBox > .inputBox", dialogWindow.id); // dialog text input box
	let timeoutText =                  dialogWindow.getFromContent(".dialogSetup > .timeoutText > .labelBox > .inputBox", dialogWindow.id); // timeout input box
	let nextCheckbox =                 dialogWindow.getFromContent(".dialogSetup > .nextCheckbox > .labelBox > .inputBox", dialogWindow.id);  // instant next checkbox
	let clearSprites =                 otherSettings.querySelector(".clearSprites > .labelBox > .inputBox"); // other settings: dont clear sprites checkbox
	let backgroundFile =               backgroundSettings.querySelector(".backgroundFile > .labelBox > .inputBox"); // background file input
	let backgroundPreview =            backgroundSettings.querySelector(".backgroundPreview"); // background image preview
	let backgroundUseTransition =      backgroundSettings.querySelector(".backgroundUseTransition > .labelBox > .inputBox"); // open transition settings checkbox
	let backgroundTransitionEasing =   backgroundTransitionSettings.querySelector(".backgroundTransitionEasing > .labelBox > .inputBox"); // transition easing
	let backgroundTransitionTime =     backgroundTransitionSettings.querySelector(".backgroundTransitionTime > .labelBox > .inputBox"); // transition time
	let backgroundTransitionName =     backgroundTransitionSettings.querySelector(".backgroundTransitionName"); // transition time select element
	let newSprite =                    dialogWindow.getFromContent(".dialogSetup > .dialogNewSprite", dialogWindow.id); // new sprite button
	let spritesParent =                dialogWindow.getFromContent(".dialogSetup > .sprites", dialogWindow.id); // sprites parent
	let spritesOpen =                  dialogWindow.getFromContent(".dialogSetup > .spritesOpen", dialogWindow.id); // open sprite settings
	let nextAdditionalCheckbox =       dialogWindow.getFromContent(".dialogSetup > .nextAdditionalCheckbox > .labelBox > .inputBox", dialogWindow.id); // next additional settings open
	let nextAdditionalIncrement =      dialogWindow.getFromContent(".dialogSetup > .nextAdditionalSettings > .nextAdditionalIncrement > .labelBox > .inputBox", dialogWindow.id); // next additional settings: increment
	let nextAdditionalInstantly =      dialogWindow.getFromContent(".dialogSetup > .nextAdditionalSettings > .nextAdditionalInstant > .labelBox > .inputBox", dialogWindow.id); // next additional settings: immediately
	let nextAdditionalSettings =       dialogWindow.getFromContent(".dialogSetup > .nextAdditionalSettings", dialogWindow.id); // next additional settings parent

	if (sceneDialog.other == undefined) sceneDialog.other = {} // if other settting is undefined
	if (sceneDialog.background == undefined) sceneDialog.background = {} // if background setting is undefined
	if (sceneDialog.sprites == undefined) sceneDialog.sprites = {};

	// --------- SETTING UP UI INPUTS ---------

	charNameBox.value = sceneDialog.name == undefined ? "" : sceneDialog.name; // setting character name
	dialogText.value = sceneDialog.text == undefined ? "" : sceneDialog.text; // setting dialog text
	timeoutText.value = sceneDialog.timeout == undefined ? "" : sceneDialog.timeout; // setting timeout 
	nextCheckbox.checked = sceneDialog.next == undefined || sceneDialog.next == false || typeof(sceneDialog.next) != "boolean" ? false : true; // setting next
	clearSprites.checked = sceneDialog.other.clearSprites == undefined || sceneDialog.other.clearSprites == true ? false : true; // setting clearSprites
	backgroundPreview.src = sceneDialog.background.src != undefined && sceneDialog.background.src.startsWith("data:image") &&  // if image IS base64 data
		sceneDialog.background != undefined ? sceneDialog.background.src // if it isnt undefined
		: ""; // else
	if (sceneDialog.background.transition != undefined) { // setting background transition settings
		backgroundTransitionName.value = sceneDialog.background.transition.name == undefined ? "" : sceneDialog.background.transition.name;
		backgroundTransitionTime.value = sceneDialog.background.transition.time == undefined ? "" : sceneDialog.background.transition.time;
		backgroundTransitionEasing.value = sceneDialog.background.transition.easing == undefined ? "" : sceneDialog.background.transition.easing;
	}
	nextAdditionalCheckbox.checked = sceneDialog.next != undefined && typeof(sceneDialog.next) == "object" ? true : false;
	nextAdditionalIncrement.value = nextAdditionalCheckbox.checked ? sceneDialog.next.increment : "";
	nextAdditionalInstantly.checked = nextAdditionalCheckbox.checked && sceneDialog.next.instantly ? true : false;

	spritesSync(spritesParent, sceneDialog, dialogWindow); // syncing sprites

	dialogWindow.getFromContent(".dialogSetup > .dialogSaveButton", dialogWindow.id).onclick = () => { // save button clicked
		if (charNameBox.value.trim() != "") sceneDialog.name = charNameBox.value; // if name set
		else sceneDialog.name = undefined; // else

		sceneDialog.timeout = timeoutText.value.trim() == "" ? undefined : parseInt(timeoutText.value); // setting timeout

		sceneDialog.text = dialogText.value; // setting text

		sceneDialog.other.clearSprites = clearSprites.checked == false ? undefined : false; // if clearSprites == false, then nothing

		backgroundTransitionEasing.style.border = "";
		backgroundTransitionTime.style.border = "";
		backgroundTransitionName.style.border = "";

		if (
			backgroundTransitionEasing.value.trim() != "" && 
			backgroundTransitionTime.value.trim() != "" &&
			backgroundTransitionName.value.trim() != ""
		) { // if all transition set
			sceneDialog.background.transition = {}
			sceneDialog.background.transition.easing = backgroundTransitionEasing.value; // setting easing
			sceneDialog.background.transition.time = backgroundTransitionTime.value; // setting time
			sceneDialog.background.transition.name = backgroundTransitionName.value; // setting name
		}
		else {
			sceneDialog.background.transition = undefined;

			// USER TRANSITION ERRORS

			if (backgroundTransitionName.value.trim() == "") backgroundTransitionName.style.border = "2px solid red";
			if (backgroundTransitionTime.value.trim() == "") backgroundTransitionTime.style.border = "2px solid red";
			if (backgroundTransitionEasing.value.trim() == "") backgroundTransitionEasing.style.border = "2px solid red";
		}

		if (nextAdditionalCheckbox.checked) {
			sceneDialog.next = {
				instantly: nextAdditionalInstantly.checked
			}
			if (nextAdditionalIncrement.value.trim() == "") {
				sceneDialog.next.increment = 0;
			}
		}
		else sceneDialog.next = nextCheckbox.checked == false ? undefined : true; // if next, setting next = true
			

		dialogsSync(scene.dialogs, setupWindow.getFromContent(".setupUIRoot > .dialogSetupArticle", setupWindow.id), scene, setupWindow);
	}

	openOtherSettings.onclick = () => {
		otherSettings.hidden = !otherSettings.hidden;
	}

	openBackgroundSettings.onclick = () => {
		backgroundSettings.hidden = !backgroundSettings.hidden;
	}

	backgroundUseTransition.onchange = () => {
		backgroundTransitionSettings.hidden = !backgroundTransitionSettings.hidden;
	}

	backgroundFile.onchange = (event) => {
		var reader = new FileReader();
		reader.onload = () => {
			backgroundPreview.src = reader.result;
			sceneDialog.background.src = reader.result;	
		};
		reader.readAsDataURL(event.target.files[0]);
	}

	newSprite.onclick = (event) => {
		bootbox.prompt("Enter sprite name: ", (name) => {
			sceneDialog.sprites[name] = {};
			spritesSync(spritesParent, sceneDialog, dialogWindow);
		});
	}

	spritesOpen.onclick = () => {
		spritesParent.hidden = !spritesParent.hidden;
		newSprite.hidden = !newSprite.hidden;
	}

	nextAdditionalCheckbox.onchange = () => {
		nextAdditionalSettings.hidden = !nextAdditionalCheckbox.checked;
	}

	nextAdditionalCheckbox.onchange();
}

const spritesSync = (spritesParent, scene, dialogWindow) => {
	spritesParent.innerHTML = "";
	Object.keys(scene.sprites).forEach((spriteName) => {
		let sprite = scene.sprites[spriteName];
		
		let spriteArticle = document.createElement("div");
		spriteArticle.classList.add("spriteArticle");
		spriteArticle.setAttribute("spriteName", spriteName);

		let label = document.createElement("label");
		label.innerHTML = spriteName;

		let button = inputBox({
			tag: "button",
			innerHTML: "Open",
			classList: ["openSpriteSetup", "btn", "btn-primary"]
		});	

		spriteArticle.appendChild(label);
		spriteArticle.appendChild(button);
		spritesParent.appendChild(spriteArticle);
	});	
	[...spritesParent.querySelectorAll(".openSpriteSetup")].forEach((spriteButton) => {
		let spriteName = spriteButton.parentNode.getAttribute("spriteName");
		spriteButton.onclick = () => {
			openSpriteSetup({ 
				parentWindow: dialogWindow,
				scene: scene, 
				sprite: scene.sprites[spriteName],
				spriteName: spriteName,
				spritesParent: spritesParent
			});
		}
	});
}

/** @function dialogSync 
 * @desc function creates dialog open handlers in element
 * @param {Object} dialogs - dialog in scene
 * @param {HTMLElement} element - element to update dialogs
 * @param {Object} scene - opened scene
 * @param {HTMLElementWindow} thisWindow - opened scene editor window (see openDialog)
 */

const dialogsSync = (dialogs, element, scene, thisWindow) => {
	let idGenerator = makeId();
	element.innerHTML = ""; // clear all element

	dialogs.map(dialog => {
		element.appendChild(makeDialogArticle(dialog.name == undefined || dialog.name.trim() == "" ? "prev character" : dialog.name, idGenerator.next().value)); // if name is empty, then name =prev character
	});

	 [...element.querySelectorAll(".dialogArticleOne")].forEach((dialogArticle, idx) => {
		dialogArticle.querySelector(".openDialogButton").onclick = () => {
			openDialog(dialogArticle, scene, scene.dialogs[idx], thisWindow); // on Open button click, open dialog
		}
	});
}

/** @generator makeId
 * @desc just returns unique identifier 
 * @yields {int} - next number
 */

function* makeId() {
	let id = 0;

	while (true) {
		yield id++;
	}
}

/** @function */
buttonsSetup(NewSceneButton, NewSequenceButton);
