import Engine from "../engine.js";
import { SoundAPI } from "./SoundAPI.js";
import { SpriteAPI } from "./SpriteAPI.js";
import { BackgroundTransitionAPI } from "./TransitionAPI.js";
import { VariableAPI } from './VariableAPI.js';

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
     * @param {string} name
     * @param {SoundAPI} sound
     */
    addSound(name, sound) {
        if (!this.#scene.sounds) this.#scene.sounds = {};
        this.#scene.sounds[name] = sound.getSound();
    }

    /** adds variable controller 
     * @param {string} name
     * @param {VariableAPI} variable
    */
    addVariable(name, variable) {
        if (!this.#scene.variables) this.#scene.variables = {};
        this.#scene.variables[name] = variable.getVariable();
    }

    /** sets <timeout> 
     * @param {number} timeout
     * @param {SceneAPI} instant
    */
    setTimeout(timeout, instant = null) {
        if (!instant) {
            this.#scene.timeout = timeout
        } else {
            this.#scene.timeout = {
                duration: timeout,
                doInstantly: instant.getScene()
            }
        }
    }

    /** set skipping (<next> property)
     * @param {number} increment how many dialogs will be skipped
     * @param {boolean} instantly after typing end or not
     */
    setNext(increment = 1, instantly = false) {
        if (increment == 1 && instantly == false) this.#scene.next = true;
        else {
            this.#scene.next = {
                increment,
                instantly
            }
        }
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

    /** beforeJS in scene
     * @param {(engine: Engine, dialog, additionalJSArguments) => boolean} func
     */
    set onbefore(func) {
        this.#scene.beforeJS = func;
    }
    get onbefore() {
        return this.#scene.beforeJS;
    }

    /** builds scene */
    getScene() {
        return this.#scene;
    }
}
