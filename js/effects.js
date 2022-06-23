/** Effects controller
 * @module Effects
 * @author Onien
 */

/** Effects main class
 * @class Effects
 */

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
     * @param {object} event.style - css styles
     * @param {Function} end
     */
    anyEffect(element, event, end = () => {}) {
            element.style.transition = `all ${event.time.toString()}s ${event.easing == undefined ? '' : event.easing}`; // setting css transition
            setTimeout(() => Object.assign(element.style, event.styles), 15); // assign styles
            element.addEventListener("transitionend", () => { // on transition end
                    element.style.transition = ""; // clear transition		
                    end.call(this, element, event.styles);
            });
    }
}
