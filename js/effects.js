/** Effects controller
 * @module Effects
 * @author Onien
 */

/** Effects main class
 * @class Effects
 */

import { parse } from "./parser.js";

export default class Effects {
    /** @member {HTMLElement} element
     * @desc element
     */

    /** @member {Object} effects
     * @desc effects object
     */

    /** @member {Function} effects.dim
     * @desc dim function
     */

    /** @member {Function} effects.opacity
     * @desc opacity function
     */

    /** @function constructor
     * @desc inits effects
     * @param {HTMLElement} element - which element will be controlled
     */
    constructor(element) {
        this.element = element;
        this.effects = {
            dim: this.dim,
            opacity: this.opacity
        }
    }

    /** @method dim
     * @desc handles dim effect: it blacks the element and after that shows it again
     * @param {number} time
     * @param {string} easing - css transition easing
     * @param {number} timeout - timeout before showing
     * @param {object} styles - css styles
     * @param {HTMLElement} [element=this.element]
     * @param {Function} [beforeShow]
     */

    dim(time, easing, timeout, styles, element = this.element, beforeShow = () => {}) {
        let reverse = false;

        element.style.display = "block";
        element.style.backgroundColor = "black";

        element.style.transition = `all ${time.toString()}s ${easing}`;
        Object.assign(element.style, styles);

        setTimeout(() => element.style.opacity = 1, 15); // without timeout doesnt work

        element.addEventListener("transitionend", () => {
            beforeShow();

            if (reverse == true) {
                element.style.display = "none";
                return element.style.background = "none";
            }
            setTimeout(() => {
                element.style.opacity = 0;
                reverse = true;
            }, timeout);
        });
    }

    /** @method opacity
     * @desc handles opacity effect
     * @param {number} time
     * @param {string} easing - css transition easing
     * @param {?number} timeout
     * @param {object} styles - css styles
     * @param {HTMLElement} element
     */
    opacity(time, easing, timeout, styles, element) {
        element.style.opacity = 0;
        element.style.transition = `all ${time.toString()}s ${easing}`;
        Object.assign(element.style, styles);
        setTimeout(() => element.style.opacity = 1, 15); // without timeout doesnt work
    }


    /** @method handleEffect
     * @desc handles effect by its name.
     * @see {@link Effects#dim}
     * @see {@link Effects#opacity}
     * @param {string} name - effect name
     * @param {number} time
     * @param {string} easing
     * @param {number} timeout
     * @param {object} styles
     * @param {HTMLElement} element
     */
    handleEffect(name, time, easing, timeout, styles, element = this.element) {
        return this.effects[name](time, easing, timeout, styles, element);
    }

    /** @method anyEffect
     * @desc just applies css
     * @param {HTMLElement} element
     * @param {object} event - event
     * @param {number} event.time - time
     * @param {string} event.easing - css easing
     * @param {object} event.styles - css styles
     * @param {object} [event.stylesBefore] - css styles before transition
     * @param {Function} end
     * @param {Object} parserData
     */
    anyEffect(element, event, end = () => {}, parserData = {}) {
        let easing, styles = {};
        let time = typeof event.time == "number" ? event.time : parse(event.time, parserData, {useDOM: true});
        if (event.easing) easing = parse(event.easing, parserData, {useDOM: true});
        Object.keys(event.styles).map((key) => styles[key] = parse(event.styles[key].toString(), parserData, {useDOM: true}));

        if (event.stylesBefore) {
            Object.assign(element.style, event.stylesBefore);
            Object.keys(event.stylesBefore).map((key) => event.stylesBefore[key] = parse(event.stylesBefore[key].toString(), parserData, {useDOM: true}));
        }
        if (time != "0" || time != 0) element.style.transition = `all ${time.toString()}s ${easing == undefined ? '' : easing}`; // setting css transition
        setTimeout(() => Object.assign(element.style, styles), event.time != 0 ? 15 : 0); // assign styles
        element.addEventListener("transitionend", () => { // on transition end
            element.style.transition = ""; // clear transition		
            end.call(this, element, event.styles);
        });
    }
}
