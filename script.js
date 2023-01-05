import { api } from "./js/novlang/run.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//             scripts are not executing in runtime! They just generate scenario json and then executes that json object                           //
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
    let helloworld = new api.Scene('its a test, but', 'world');

    let variable = new api.Variable('str');
    variable.set('onien').concat('!');

    let testvar = new api.Variable('float');
    testvar.set(5).sum(9).divide(2).multiply(7).root(3).round(1).multiply(2).minus(0.4);
    // +(cbrt((5 + 9) / 2 * 7).toFixed(1)) * 2 - 0.4

    helloworld.setBackground('/images/bus.jpg');
    helloworld.addVariable('name', variable);
    helloworld.addVariable('testvar', testvar);

    helloworld.setNext();

    let test = new api.Scene(`[w] hello { name }! { text = testvar, color = 'red' }`, 'test');
    let sprite = new api.Sprite('50%', '70%');
    sprite.addPose('sprite', '/images/sprite.jpg');
    sprite.addPose('coke', '/images/coke.jpg');
    
    sprite.setPose('sprite');

    // let music = new api.Sound('/sounds/just_think.mp3');
    // music.setTransition(new api.Transition.Sound(1, 0.5, 0.1, 2));
    // test.addSound('music', music)

    test.setBackground('/images/mountains.jpg', new api.Transition.Background('opacity', 1));
    test.setTimeout(5000);
    test.addSprite('sprite', sprite);

    loadScene('main', helloworld);
    loadScene('main', test);
}
