import { config } from "./js/config.js";
import Engine from "./js/engine.js";

let backgroundImage = document.querySelector(".background.image");
let dialogElement = document.querySelector(".text");
let effects = document.querySelector(".effect");
let scene = document.querySelector('.scene');
let choises = document.querySelector(".choises"); 

let engine = new Engine(backgroundImage, dialogElement, effects, scene, choises, config);

engine.importScript('/script.js', (script) => {
    engine.executeScript(script);
});

document.onkeyup = (event) => {
    if (event.key == "Enter" || event.key == " ") {
        if (engine.typing) {
            engine.typingInterval.disable();
            engine.typing = false;
            return engine.handlers.Text.set(engine.handlers.Text.textToType);
        }
        engine.index++;
        engine.next();
    }
}
