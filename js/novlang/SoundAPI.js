export class SoundTransitionAPI {
    #transition = {};

    /**
     * @param {number} from
     * @param {number} to
     * @param {number} step
     * @param {number} time
     */
    constructor(from, to, step, time) {
        this.#transition.from = from;
        this.#transition.to = to;
        this.#transition.step = step;
        this.#transition.time = time;
    }

    /** sets <from> property
     * @param {number} from
     */
    setFrom(from) {
        this.#transition.from = from;
    }

    /** sets time
     * @param {number} time
     */
    setTime(time) {
        this.#transition.time = time;
    }

    /** sets <to> property
     * @param {number} to
     */
    setTo(to) {
        this.#transition.to = to;
    }

    /** sets step
     * @param {number} step
     */
    setStep(step) {
        this.#transition.step = step;
    }

    getTransition() {
        return this.#transition;
    }
}
export class SoundAPI {
    #sound = {};

    /**
     * @param {string} file
     * @param {number} volume
     * @param {boolean} loop
     */
    constructor(file, volume = 1, loop = false) {
        this.#sound.src = file;
        this.#sound.volume = volume;
        this.#sound.loop = loop;
    }

    /** sets source file
     * @param {string} file
     */
    setFile(file) {
        this.#sound.src = file;
    }

    /** sets volume
     * @param {number} volume
     */
    setVolume(volume) {
        this.#sound.volume = volume;
    }

    /** sets volume
     * @param {boolean} loop
     */
    setLoop(loop) {
        this.#sound.loop = loop;
    }

    /** sets stop
     * @param {boolean} stop
     */
    setStop(stop) {
        this.#sound.stop = stop;
    }

    /**
     * sets sound transition
     * @param {SoundTransitionAPI} transition
     * @param {boolean} stopAfter
     */
    setTransition(transition, stopAfter = false) {
        this.#sound.transition = transition.getTransition();
        this.#sound.stop = stopAfter;
    }

    /**
     * set <ended> property
     * @param {SceneAPI} scene
     */
    setEnded(scene) {
        this.#sound.ended = { do: scene.getScene() };
    }

    getSound() {
        return this.#sound;
    }
}
