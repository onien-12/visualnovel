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
            else if (animation.name == "fade") {
                let newBackground = document.createElement("div");

                newBackground.classList.add("background", "image");

                newBackground.position = "absolute";
                newBackground.opacity = 0;

                this.setImage(image, newBackground);

                this.element.parentNode.appendChild(newBackground);

                element.style.transition = newBackground.style.transition = `opacity ${animation.time}s ${animation.easing}`;
                setTimeout(() => { element.style.opacity = 0; newBackground.style.opacity = 1 }, 15);
                
                element.addEventListener("transitionend", () => {
                    this.setImage(image, element);
                    newBackground.remove();
                    element.style.transition = "";
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
