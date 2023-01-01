import { api } from "./js/novlang/run.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//             scripts are not executing in runtime! They just generate scenario json and then executes that json object                       //
//     that means that you can't change variables in script to change them in runtime. You need to use builtin engine functions to do that         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** @typedef {Object} API
  * @prop {(branch: string, scene: object) => void} api.loadScene
  * @prop {(branch: string) => void} api.createBranch
 */

/** main function
 * @param {API} api
 */
export const main = ({ loadScene, createBranch }) => {
    let helloworld = new api.Scene('hello', 'world');
    helloworld.setBackground('/images/bus.jpg');

    let test = new api.Scene('[w] text', 'test');
    // let music = new api.Sound.Sound('/sounds/just_think.mp3');
    // test.addSound('music', music);

    test.setBackground('/images/mountains.jpg', new api.Transition('opacity', 1));

    loadScene('main', helloworld);
    loadScene('main', test);
}