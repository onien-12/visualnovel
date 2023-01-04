import { SoundAPI } from "./SoundAPI.js";
import { SpriteAPI } from "./SpriteAPI.js";
import { BackgroundTransitionAPI } from "./TransitionAPI.js";

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
     * @param {BackgroundTransitionAPI} transition
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

    /**
     * adds sprite to scene
     * @param {string} name 
     * @param {SpriteAPI} sprite 
     */
    addSprite(name, sprite) {
        if (!this.#scene.sprites) this.#scene.sprites = {};
        this.#scene.sprites[name] = sprite.getSprite();
    }

    /** builds scene */
    getScene() {
        return this.#scene;
    }
}
