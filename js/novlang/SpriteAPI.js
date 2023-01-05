export class SpriteAPI {
    #sprite = {};

    /**
     * @param {string} top css top
     * @param {string} left css left
     */
    constructor(top, left) {
        this.#sprite.top = top;
        this.#sprite.left = left;
    }

    /**
     * sets pose
     * @param {string} pose
     */
    setPose(pose) {
        this.#sprite.pose = pose;
    }

    /**
     * adds sprite pose
     * @param {string} name
     * @param {string} file
     */
    addPose(name, file) {
        if (!this.#sprite.poses)
            this.#sprite.poses = {};
        this.#sprite.poses[name] = file;
    }

    /**
     * sets styles
     * @param {CSSStyleDeclaration} styles
     */
    setStyles(styles) {
        this.#sprite.styles = styles;
    }

    /**
     * sets style property
     * @param {string} styleName
     * @param {string} value
     */
    setStyle(styleName, value) {
        if (!this.#sprite.styles)
            this.#sprite.styles = {};
        this.#sprite.styles[styleName] = value;
    }

    /**
     * sets transition
     * @param {SpriteTransitionAPI} transition
     */
    setTransition(transition) {
        this.#sprite.transition = transition.getTransition();
    }

    getSprite() {
        return this.#sprite;
    }
}
