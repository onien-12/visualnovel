/** Image controller
 * @module Images
 * @author Onien
 */


/** 
 * The main class of Image controller
 * @class Images
 */
export default class Images {
    /** @member {HTMLElement} element
     * @desc element
     */

    /** @function constructor
     * @desc inits.
     * @param {HTMLElement} element - which element will be controlled
     */
    constructor(element) {
        this.element = element;
    }

    /** @method setImage
     * @desc sets image. It uses backgroundImage css property and sets it to "url({image})"
     * @param {string} image - image url or base64
     * @param {HTMLElement} [element=Images#element]
     */
    setImage(image, element = this.element) {
        return element.style.backgroundImage = `url(${image})`;
    }

    /** @method setAsBackground
     * @desc sets a background image of element with animation
     * @param {string} image
     * @param {Object} animation
     * @param {string} animation.name - can be none or opacity
     * @param {number} animation.time - duration in seconds
     * @param {string} animation.easing - css transition easing
     * @param {HTMLElement} [elememt=Images#element]
     */
    setAsBackground(image, animation = {name: "none"}, element = this.element) {
        element.style.zIndex = "0";
        if (animation.name == "none")
            return this.setImage(image, element);
        else {
            if (animation.name == "opacity") {
                element.style.transition = `opacity ${animation.time}s ${animation.easing}`;
                element.style.opacity = 0;
                element.addEventListener("transitionend", () => {
                    this.setImage(image, element);
                    element.style.opacity = 1;
                });
            }
        }
    }

    setAsSprite(image, element = this.element) {
        element.style.zIndex = "1";
        this.setImage(image, element);
    }
}
