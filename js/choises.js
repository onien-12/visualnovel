/** Choises builder
 * @module Choises
 * @author Onien
 */

/** Main Choises class
 * @class Choises
 */

export default class Choises {
    /** @member {Array.Object} choises
     * @desc choise options
     * @example
     *  [
     *    {
     *      name: "hello",
     *      text: "select hello",
     *      active: true,
     *      hidden: false
     *    }
     *  ]
     */

    /** @member {Function} onSelect
     * @desc onSelect event
     */

    /** @member {Function} onMouseEnter
     * @desc onMouseEnter event
     */

    /** @function constructor
     * @desc inits.
     * @param {Array.Object} choises - choises options
     */

    constructor(choises) {
        this.choises = choises;
        this.onSelect = () => {};
        this.onMouseEnter = () => {};
    }   

    /** @method build
     * @desc builds html
     */
    build() {
        let parent = document.createElement("div");
        parent.classList.add("choisesParent");

        this.choises.forEach((choise, idx) => {
            let choiseElement = document.createElement("div");
            choiseElement.classList.add("choiseOption");

            if (!choise.active) choiseElement.classList.add("choiseDisabled"); // active or not

            choiseElement.setAttribute("index", idx); // choise index
            choiseElement.setAttribute("name", choise.name); // setting choise name as html attribute

            choiseElement.hidden = choise.hidden == false || choise.hidden == undefined ? false : true; // if undefined or false => hidden = false

            choiseElement.innerHTML = choise.text;

            choiseElement.onclick = () => {
                if (choiseElement.classList.contains("choiseDisabled")) return; // if disabled
                this.onSelect.call(this, choise, choiseElement);
            } 

            choiseElement.onmouseenter = () => {
                this.onMouseEnter.call(this, choise, choiseElement);
            }

            parent.appendChild(choiseElement);
        });

        return parent;
    }

    /** @event Choises#onSelect
     * @type {Object}
     * @prop {Object} choise - choise option
     * @prop {HTMLDivElement} choiseElement - element
     */

    /** @event Choises#onMouseEnter
     * @type {Object}
     * @prop {Object} choise - choise option
     * @prop {HTMLDivElement} choiseElement - element
     */
}
