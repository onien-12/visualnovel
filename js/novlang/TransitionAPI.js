export class BackgroundTransitionAPI {
    #transition = {};

    /**
     * @param {string} name
     * @param {number} time
     * @param {string} easing css easing
     */
    constructor(name, time, easing = 'ease-out') {
        this.#transition.name = name;
        this.#transition.time = time;
        this.#transition.easing = easing;
    }

    /** sets name
     * @param {string} name
     */
    setName(name) {
        this.#transition.name = name;
    }

    /** sets time
     * @param {number} time
     */
    setTime(time) {
        this.#transition.time = time;
    }

    /** sets easing
     * @param {string} easing
     */
    setEasing(easing) {
        this.#transition.easing = easing;
    }

    getTransition() {
        return this.#transition;
    }
}


export class SpriteTransitionAPI {
    #transition = {};

    /**
     * @param {number} time
     * @param {string} easing css easing
     */
    constructor(time, easing = 'ease-out') {
        this.#transition.time = time;
        this.#transition.easing = easing;
    }

    /** sets time
     * @param {number} time
     */
    setTime(time) {
        this.#transition.time = time;
    }

    /** sets easing
     * @param {string} easing
     */
    setEasing(easing) {
        this.#transition.easing = easing;
    }

    /**
     * sets styles
     * @param {CSSStyleDeclaration} styles
     */
    setStyles(styles) {
        this.#transition.styles = styles;
    }

    /**
     * sets style property
     * @param {string} styleName 
     * @param {string} value 
     */
    setStyle(styleName, value) {
        if (!this.#transition.styles) this.#transition.styles = {};
        this.#transition.styles[styleName] = value;
    }

    getTransition() {
        return this.#transition;
    }
}
