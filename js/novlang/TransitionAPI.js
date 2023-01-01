export class TransitionAPI {
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
