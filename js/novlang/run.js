import { SceneAPI } from "./SceneAPI.js";
import { SoundTransitionAPI, SoundAPI } from "./SoundAPI.js";
import { TransitionAPI } from "./TransitionAPI.js";

/** runs novlang script */
export default class Runner {
    /** import() result */
    script;

    scenario = {
        main: []
    };

    constructor(script) {
        this.script = script;
    }

    /** @private */
    #getApi() {
        return {
            /** loads scene to scenario
             * @param {string} branch
             * @param {SceneAPI} scene
             */
            loadScene: (branch, scene) => {
                this.scenario[branch].push(scene.getScene());
            },
            /** creates new branch in scenario
             * @param {string} branch
             */
            createBranch: (branch) => {
                this.scenario[branch] = [];
            }
        }
    }

    async run() {
        this.script.main(this.#getApi());
    }
}

export let api = {
    Scene: SceneAPI,
    Transition: TransitionAPI,
    Sound: {
        Transition: SoundTransitionAPI,
        Sound: SoundAPI
    }
}