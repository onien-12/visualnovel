import { SoundAPI } from "./SoundAPI.js";
import { TransitionAPI } from "./TransitionAPI.js";

export class SceneAPI {
    #scene = {};

    /**
     * @param {string} text
     * @param {string} name
     */
    constructor(text, name) {
        this.#scene.text = text;
        this.#scene.name = name;
    }

    /** sets text */
    setText(text) {
        this.#scene.text = text;
    }

    /** sets name */
    setName(name) {
        this.#scene.name = name;
    }

    /** sets background
     * @param {string} file
     * @param {TransitionAPI} transition
     */
    setBackground(file, transition = null) {
        this.#scene.background = { src: file };

        if (transition) {
            this.#scene.background.transition = transition.getTransition();
        }
    }

    /** adds sound
     * @param {SoundAPI} sound
     */
    addSound(name, sound) {
        if (!this.#scene.sounds) this.#scene.sounds = {};
        this.#scene.sounds[name] = sound.getSound();
    }

    /** builds scene */
    getScene() {
        return this.#scene;
    }
}
