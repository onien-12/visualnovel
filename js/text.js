/** Text engine. Controls all text
 * @module Text
 * @author Onien
 */


import { parse } from "./parser.js";
import { setupTypewriter } from "./typer/typer.js";


/** Main class of Text Engine 
 * @class Text
 */
export default class Text {
    /** @function constructor
     * @desc creates class
     * @param {HTMLElement} element
     * @param {Object} config
     * @param {number} config.speed - typing speed
     */
    constructor(element, config) {
        this.element = element;
        this.textEl = element.querySelector(".dialog");
        this.nameEl = element.querySelector(".name");
        this.config = config;
        this.typing = false;
        this.textToType = "";
    }


    /** @method setName
     * @desc sets text in the name element
     * @param {string} name - name
     */
    setName(name) {
        this.nameEl.innerText = name;
    }

    /** @method set
     * @desc just sets text
     * @param {string} text - text
     * @param {HTMLElement} element - html element
     */

    set(text, element = this.textEl) {
        element.innerHTML = text;
    }

    /** @method typeMultiply
     * @desc types array of the texts
     * @param {string[]} texts 
     * @param {HTMLElement[]} elements
     * @param {Function} [after]
     * @param {number} [idx=0] - start index
     */

    typeMultiply(texts, elements, after = () => {}, idx = 0) {
        if (idx >= elements.length) return after();

        this.type(texts[elements[idx].classList[0].slice(6)], "", () => {
            this.typeMultiply(texts, elements, after, idx + 1);
        }, elements[idx]);
    }

    /** @method type
     * @desc types in the element, skips html, parses text
     * @param {string} text
     * @param {string} [added=""] - start string
     * @param {Function} [after] - will be executed after all text typed
     * @param {HTMLElement} [element]
     * @param {number} [speed=config.speed] - typing speed
     * @param {Object} [parserData={}]
     * @returns {number} interval
     */

    type(text,  added = "", after = () => {}, element = this.textEl, speed = this.config.speed, parserData = {}) {
        text = parse(text, parserData, {useDOM: true});

        this.textToType = text;

        let typewriter = setupTypewriter(text, element, after, speed, added);
        typewriter.type();

        return typewriter;
    }
}
