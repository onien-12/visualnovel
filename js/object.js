/** Object module
 * @module object
 * @author Onien
 */

import { parse } from "./parser.js";

/** @class SceneObject
 * @desc creates objects 
 * @param {HTMLElement} scene - parent object
 * @param {Object} config - config object
 * @param {string} [config.tag] - tag name of new html element. if not set, it defaults <div> tag
 * @param {string[]} [config.class] - classes to add to new element. if not set, it defaults nothing
 * @param {string} [config.id] - id of the element. if not set, it defaults nothing ("")
 * @param {Object} [config.style] - style of the element (element.style html property) 
 * @param {Map<string, string>} [config.attrs] - html attributes
 * @param {string} [selector] - if you dont wont to create new element, just use existing one
 */
export default class SceneObject {
    constructor(scene, config, selector = "") {
        if (!selector) 
            this.element = document.createElement(config.tag ?? "div"); // if not exists, tag will be <div>
        else 
            this.element = document.querySelector(selector);

        this.element.classList.add(...(config.class ?? [])); // if not exists, add nothing
        this.element.id = config.id ?? ""; // sets id or nothing
        if (config.style) Object.assign(this.element.style, config.style); // sets styles
        if (config.attrs) Array.from(config.attrs).map(([key, value]) => this.element.setAttribute(key, value));

        this.scene = scene;
    }

    /** @method add
     * @desc adds element to scene
     */

    add() {
        this.scene.appendChild(this.element);
    }

    /** @member classList
     * @desc setter/getter. sets/gets class list. To set needs array of classes
     */
    set classList(list) {
        this.element.className = "";
        this.element.classList.add(...list);
    }

    get classList() {
        return this.element.classList;
    }

    /** @member html
     * @desc getter. gets innerHTML
     */

    /** @method setHtml
     * @param {string} html
     * @param {Object} [parserData] - parser data
     */

    setHtml(value, parserData = {}) {
        this.element.innerHTML = parse(value, parserData, {useDOM: true});
    }

    get html() {
        return this.element.innerHTML;
    }
}
