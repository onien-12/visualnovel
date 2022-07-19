/** Main engine file
 * @module Engine
 * @author Onien
 */

import Effects from "./effects.js";
import Images from "./image.js";
import Sound from "./sound.js";
import Text from "./text.js";
import Media from "./media.js";
import Choises from "./choises.js";
import SceneObject from "./object.js"; 

/** Main Engine class. See {@tutorial scenario-example}
 * @class Engine
 */

export default class Engine {
  /** @member {Object} handlers
   * @desc there are 4 handlers: handlers.Text, handlers.BackImage, handlers.Effects, handlers.Media
   */

  /** @member {Object} config
   * @desc config
   */

  /** @member {HTMLElement} scene
   * @desc scene element. there will be placed all sprites
   */

  /** @member {HTMLElement} textElement */

  /** @member {HTMLElement} dialogElement */

  /** @member {HTMLElement} choisesElement */

  /** @member {Object[]} registered
   * @desc there will be all dialogs
   */

  /** @member {number} readingIndex
   * @desc current dialog
   */

  /** @member {Object.<string, Sound>} sounds
   * @desc there will be all sounds
   */

  /** @member {boolean} typing
   * @desc true, if Text is typing text
   */

  /** @member {number} typingInterval
   * @desc interval (from setInterval) of typing
   */

  /** @member {Map} sprites
   * @desc there will be all sprites
   */

  /** @member {Map} varibles
   * @desc contains all user-created varibles
   */

  /** @member {Map<string, SceneObject>} objects
   * @desc contains all scene objects
   */

  /** @member {string} branchReading
   * @desc name of branch currently reading
   */

  /** @function constructor
   * @param {HTMLElement} backgroundImageElement - background image element
   * @param {HTMLElement} textElement - text element
   * @param {HTMLElement} effect - effect element
   * @param {HTMLElement} mediaElement - media parent element
   * @param {HTMLElement} choisesElement - choises parent element
   * @param {Object} config
   */
  constructor(
    backgroundImageElement,
    textElement,
    effect,
    mediaElement,
    choisesElement,
    config
  ) {
    this.handlers = {
      Text: new Text(textElement, config.text),
      BackImage: new Images(backgroundImageElement),
      Effects: new Effects(effect),
      Media: new Media(mediaElement),
    };
    this.config = config;

    this.scene = document.querySelector(".scene");
    this.textElement = textElement;
    this.dialogElement = textElement.querySelector(".dialog");
    this.choisesElement = choisesElement;

    this.registered = {};
    this.readingIndex = 0;
    this.branchReading = "";

    this.sounds = {};

    this.typing = false;
    this.typingInterval;
    this.sprites = new Map();
    this.varibles = new Map();
    this.objects = new Map();
  }

  /** @method setTitle
   * @desc sets html > head > title innerHTML. Title of the page
   * @param {string} text - new title
   */
  setTitle(text) {
    document.querySelector("title").innerText = text;
  }

  /** @method importScenario
   * @desc imports scenario from file. Uses "import" fucntion
   * @param {string} file - which file will be loaded
   * @param {Function} loaded - when file is loaded
   */
  importScenario(file, loaded) {
    import(file).then((scenario) => {
      this.registered = scenario.scenario;
      loaded();
    });
  }

  /** @method registerDialog
   * @desc adds dialog to Engine#registered
   * @param {Object} dialog
   */
  registerDialog(dialog, name) {
    this.registered[name].push(dialog);
  }

  /** @method onTypingEnd
   * @desc this method calls when all text is typed or if next set to intstant mode <br>
   * if next isnt undefined and its object (additional setting), it will read and handle settings <br>
   * else, it will just call Engine#next and increment Engine@readingIndex;
   */

  onTypingEnd() {
    this.typing = false;
    let dialog = this.registered[this.branchReading][this.readingIndex];

    if (dialog.next != undefined && typeof(dialog.next) == "object") {
      if (dialog.next.increment != undefined) {
        this.readingIndex += dialog.next.increment;
      }
      return this.next();
    }
    else if (dialog.next != undefined && typeof(dialog.next) == "boolean" && dialog.next) {
      this.readingIndex++;
      return this.next();
    }
  }

  /** @method next
   * @desc processes dialog from Engine#registered under index (index)
   * @param {number} [index=Engine#readingIndex]
   * @param {Object} [?dialog=null]
   * @returns {Object} processed dialog
   */

  next(index = this.index, dialog = null) {
    if (dialog == null) 
      if (this.index == this.registered[this.branch].length) return; // if end reached

    this.typing = true;
    
    this.textElement.style.display = "block";

    if (dialog == null)
      dialog = this.registered[this.branch][this.index]; // this dialog

    if (!dialog.other?.dontStopText)
      this.typingInterval?.disable();

    setTimeout(
      () => {
        if (dialog.next != undefined && typeof(dialog.next) == "object") {
          if (dialog.next.instantly)
            this.onTypingEnd();
        }

        if (dialog.text == undefined) {
          if (dialog.texts != undefined) {
            this.dialogElement.innerHTML = "";

            dialog.texts.formatting.forEach((format, idx) => {
              this.dialogElement.appendChild(format);
              format.classList.add(
                `format${parseInt(format.innerText.slice(1, -1)) - 1}`
              );
              format.innerHTML = "";
            });
            this.handlers.Text.typeMultiply(
              dialog.texts.strings,
              dialog.texts.formatting,
              () => this.onTypingEnd()
            );
          }
        } else {
          if (dialog.text.trim().startsWith("[w]")) {
            // if text continue at this dialog
            this.handlers.Text.type(
              dialog.text.replace("[w]", ""),
              this.dialogElement.innerHTML,
              () => this.onTypingEnd(), this.handlers.Text.textEl, this.config.text.speed, Object.fromEntries(this.varibles)
            );
          } else
            this.typingInterval = this.handlers.Text.type(dialog.text, "", () =>
              this.onTypingEnd(), this.handlers.Text.textEl, this.config.text.speed, Object.fromEntries(this.varibles)
            ); // type text
        }


        if (dialog.name != undefined) {
          // if name changed
          this.handlers.Text.setName(dialog.name); // change name
        }
        if (dialog.background != undefined) {
          // if background changed
          this.handlers.BackImage.setAsBackground(
            dialog.background.src,
            dialog.background.transition
          ); // change background
        }
        if (dialog.varibles != undefined) {
          Object.keys(dialog.varibles).forEach((varible) => {
            let actions = dialog.varibles[varible];

            if (!this.varibles.has(varible)) { // creating then
              this.varibles.set(varible, 0);
            }

            Object.keys(actions).forEach(action => {
              let value = actions[action];

              if (action == "set") {
                this.varibles.set(varible, value);
              }
              else if (action == "increment") {
                this.varibles.set(varible, this.varibles.get(varible) + value);
              }
              else if (action == "decrement") {
                this.varibles.set(varible, this.varibles.get(varible) - value);
              }
              else if (action == "multiply") {
                this.varibles.set(varible, this.varibles.get(varible) * value);
              }
              else if (action == "divide") {
                this.varibles.set(varible, this.varibles.get(varible) / value);
              }
              // string functions
              else if (action == "conc") {
                this.varibles.set(varible, this.varibles.get(varible) + value);
              }
              else if (action == "remove") {
                this.varibles.set(varible, this.varibles.get(varible).replace(value, ""));
              }
            });
          });
        }
        if (dialog.sprites != undefined) {
          if (
            dialog.other != undefined &&
            dialog.other.clearSprites != undefined &&
            dialog.other.clearSprites == true
          )
            this.scene.innerHTML = ""; // clear all

          Object.keys(dialog.sprites).forEach((spriteName) => {
            const sprite = dialog.sprites[spriteName]; // getting sprite

            const img = new Image(); // getting size
            img.src = sprite.poses[sprite.pose];

            img.onload = () => {
              let HTMLElement = document.createElement("div"); // adding sprite div
              HTMLElement.classList.add("image", "sprite"); // class setup
              HTMLElement.setAttribute("sprite", spriteName); // name
              this.scene.appendChild(HTMLElement); // adding

              let image = new Images(HTMLElement); // loading sprite
              image.setAsSprite(sprite.poses[sprite.pose]);

              // -_-_ Setting styles -_-_-

              HTMLElement.style.top = sprite.top;
              HTMLElement.style.left = sprite.left;
              HTMLElement.style.width = img.width + "px";
              HTMLElement.style.height = img.height + "px";
              if (sprite.styles != undefined)
                Object.assign(HTMLElement.style, sprite.styles);
              if (sprite.transition != undefined) {
                HTMLElement.style.transition = `all ${sprite.transition.time}s ${sprite.transition.easing}`;
                setTimeout(
                  () =>
                  Object.assign(HTMLElement.style, sprite.transition.styles),
                  15
                );
              }
              this.sprites.set(spriteName, {
                sprite: sprite,
                element: HTMLElement
              });
            };

          });
        }
        if (dialog.events != undefined) {
          if (dialog.events.sprites != undefined) {
            Object.keys(dialog.events.sprites).forEach((spriteName) => {
              // exec sprite events
              const event = dialog.events.sprites[spriteName];
              const sprite = this.sprites.get(spriteName);
              let element = sprite.element;

              if (event.changePose != undefined) {
                let image = new Images(element);
                image.setAsSprite(sprite.sprite.poses[event.changePose]);
              }

              if (event.effect == true || event.effect == undefined) {
                this.handlers.Effects.anyEffect(element, event, () => {
                  if (event.remove) {
                    element.remove();
                  }
                });
              }
            });
          }

          if (dialog.events.effects != undefined) {
            dialog.events.effects.forEach((effect) => {
              // exec effects
              this.handlers.Effects.handleEffect(
                effect.name,
                effect.time,
                effect.easing,
                effect.timeout,
                effect.styles
              );
            });
          }
          if (dialog.events.media != undefined) {
            Object.keys(dialog.events.media).forEach((mediaEvent) => {
              const event = dialog.events.media[mediaEvent];
              let element = document.querySelector(
                `.media[mediaName=${mediaEvent}]`
              ); // getting media element
              if (event.pause && element) {
                element.querySelector("video").pause();
              }
              if (event.play && element) {
                element.querySelector("video").play();
              }
              if (event.time && event.styles) {
                this.handlers.Effects.anyEffect(element, event, () => {
                  // and applying effect
                  if (event.remove) {
                    // if remove after effect ending
                    element.remove(); // removing
                  }
                });
              }
            });
          }

          if (dialog.events.objects != undefined) {
            Object.keys(dialog.events.objects).forEach((objectName) => {
              if (!this.objects.has(objectName)) {
                throw new Error("Object " + objectName + " not found!");
              }
              let object = this.objects.get(objectName);
              const event = dialog.events.objects[objectName];

              if (event.html) object.setHtml(event.html, Object.fromEntries(this.varibles));
              if (event.add) object.add();

              this.handlers.Effects.anyEffect(object.element, event, () => {
                if (event.remove) { 
                  object.element.remove();
                  this.object.delete(objectName);
                }
              });
            });
          }
        }
        if (dialog.sounds != undefined) {
          // if sounds changed
          Object.keys(dialog.sounds).forEach((soundName) => {
            let soundObj = dialog.sounds[soundName]; // getting sound options
            if (!this.sounds[soundName]) {
              // adding sound to sound array if there is no sound
              this.sounds[soundName] = new Sound(soundObj.src);
            }
            let thisSound = this.sounds[soundName]; // gettung sound from engine
            thisSound.play(); // starting sound
            thisSound.loop = soundObj.loop; // if loop

            if (soundObj.ended && soundObj.ended.do) {
              thisSound.ended = () => {
                this.next(0, soundObj.ended.do);
              }
            }

            if (soundObj.transition) {
              // if transition
              return thisSound.transition(
                soundObj.transition.from,
                soundObj.transition.to,
                soundObj.transition.step,
                soundObj.transition.time,
                () => {
                  if (soundObj.stop) {
                    thisSound.stop();
                  }
                }
              );
            }
            if (soundObj.stop) return thisSound.stop();
            thisSound.volume = soundObj.volume;
          });
        }
        if (dialog.media != undefined) {
          Object.keys(dialog.media).forEach((media) => {
            let values = dialog.media[media];
            this.handlers.Media.addMedia({ ...values, name: media, onend: (options, element) => {
              if (!values.ended) return;

              if (values.ended.removeMedia) element.parentNode.remove();
              if (values.ended.do) this.next(0, values.ended.do);
            } });
          });
        }
        if (dialog.choises != undefined) { // processing choises
          if (dialog.other != undefined ) {
            if (dialog.other.stopTypingAtChoises != undefined && dialog.other.stopTypingAtChoises) {
              this.typingInterval.disable();
              this.typing = false;
            }
            if (dialog.other.hideUIAtChoises != undefined && dialog.other.hideUIAtChoises) {
              this.textElement.style.display = "none";
            }
          }
          let choise = new Choises(dialog.choises);
          let builded = choise.build();

          this.choisesElement.appendChild(builded);

          this.choisesElement.hidden = false;

          choise.onSelect = (choiseObj, element) => {
            if (choiseObj.hideChoisesElement == undefined || choiseObj.hideChoisesElement) {
              this.choisesElement.hidden = true;
              this.choisesElement.querySelector(".choisesParent").remove();
            }

            if (choiseObj.do.process != undefined) {
              if (choiseObj.do.removeChoise != undefined && choiseObj.do.removeChoise) {
                element.remove();
              }
              this.next(0, choiseObj.do.process);
            }
          }

          choise.onMouseEnter = (choiseObj, element) => {
            if (choiseObj.do.mouseenter != undefined) {
              if (choiseObj.do.mouseenter.removeChoise != undefined && choiseObj.do.mouseenter.removeChoise) {
                element.remove();
              }
              this.next(0, choiseObj.do.mouseenter);
            }
          }
        }
        if (dialog.branch != undefined) {
          if (dialog.branch.set != undefined) {
            this.branch = dialog.branch.set;
            if (dialog.branch.cursor != undefined) {
              this.index = dialog.branch.cursor;
            }
            this.next();
          }
        }

        if (dialog.objects != undefined) {
          Object.keys(dialog.objects).forEach(objectName => {
            const event = dialog.objects[objectName];
            let object = new SceneObject(this.scene, event);
            if (event.add) object.add();
            if (event.html) object.setHtml(event.html, Object.fromEntries(this.varibles));

            this.objects.set(objectName, object);
          });
        }
        document.querySelector(".count").innerText = this.readingIndex + "; " + this.branchReading;
      },
      dialog.timeout == undefined ? 1 : dialog.timeout
    );

    return dialog;
  }

  set branch(value) {
    if (this.registered[value] != undefined) {
      this.branchReading = value;
      this.readingIndex = 0;
    }
    else throw new Error("Cannot set branch " + value + ". Branch not found");
  }

  get branch() {
    return this.branchReading;
  }

  set index(value) {
    if (this.index == this.registered[this.branch].length) throw new Error("Cannot set index " + value + ". End reached in branch " + this.branch); // if end reached

    this.readingIndex = value;
  }

  get index() {
    return this.readingIndex;
  }
}
