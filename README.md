# visualnovel
visualnovel engine written in js


With this engine you can write visualnovels using JSON!

Example:
```js
/** 
 * Scenario example
 * @tutorial scenario-example
 */

import {
    color
} from "./js/utils.js"

// ------------------------------------------------------
//                                                      |
// You can see media example in the "scenario.js" file  |
//                                                      |
// ------------------------------------------------------

export let scenario = {
    main: [ // branch name: main
        {
            text: "Hello world!", // typed text - "Hello world!"
            name: "test", // and name - "test"
            background: { // setting background: "../images/bus.jpg"
                src: "../images/bus.jpg" // source file
                // also, here can be transition, it should be so then
                /*
                transition: {
                    name: "opacity", // - there's only one transition, but I will add more
                    time: 1, // - 1 second
                    easing: "easeOut" // - css transition easing. Engine uses css
                }
                 */
            },
            sprites: { // now sprites section
                bottle: { // sprite name: bottle
                    top: "50%", // position top 
                    left: "40%", // position left
                    // you also can use css in position
                    pose: "sprite", // default pose
                    poses: {
                        coke: "../images/coke.jpeg", // pose name is coke
                        sprite: "../images/sprite.jpg" // pose name is sprite
                        // you can add as many poses as you want
                    },
                    styles: { // styles for sprite. It sets at the init. of the sprite
                        opacity: 0
                    },
                    transition: { // transition starts after sprite added to the scene
                        time: 0.5, // time (seconds)
                        easing: "ease", // css easing
                        styles: { // styles to set
                            opacity: 1
                        }
                    }
                }
            },
            sounds: { // sounds section
                ambience: { // sound name - ambience. You can set it to everything
                    src: "../sounds/forest_ambience.mp3", // source file
                    volume: 0.5, // start volume
                    loop: true // will it loop
                }
            }
        },
        {
            text: "test really! WORD!", // type text
            name: "Семён", // set name
            events: { // ok, now events. 
                sprites: { // events for sprites. In this event section only sprites will be changed
                    bottle: { // sprite name - bottle
                        styles: { // set css styles
                            top: "30%",
                            left: "30%"
                        },
                        time: 0.5, // time (seconds)
                        easing: "linear" // css easing
                    }
                }
            }
            /*
             * we can set branches like this.
             branch: {
                set: "<branchname>",
                // and we can set cursor position (Engine#readingIndex)
                cursor: <cursorpos>
             }
             */
        },
        { // if you set "[w]" on the start of the text, it will be added to the end of previous text
            text: "[w] Так."
        },
        {
            text: "[w] Отсюда надо { text='hello', background='red' }. { <varible name> }"
        },
        {
            text: "[w] Своими соплями ничего не добьюсь!",
            choises: [
                {
                  name: "bad", // just a name for choise. It will not display
                  text: "haha", // text (html)
                  active: true, // if user can choise if
                  hidden: false, // if it visible
                  do: { // do if chosen
                    process: { // process (Engine#next)
                      varibles: { // setting variblesd
                        lp: { // varibles reading action-by-action: if first is set to 5, second is increment by 4 and third is decrement by 7, then result will be = 2 ( 5 + 4 - 7 )
                          increment: 1, // first action
                          multiply: 3, // 2-d
                          divide: 2, // 3-d
                          increment: 3, // 4-th
                          decrement: 2 // 5-th
                        }
                      },
                      branch: { // setting branch
                        set: "somebranch" // setting branch
                      }
                    },
                    mouseenter: { // if mouse is over choise element
                        text: "mouseover!",
                        name: "mouseover btw"
                    }
                  }
                },
                {
                  name: "good",
                  text: "hezasd",
                  active: true,
                  hidden: false,
                  do: {
                    process: {
                      text: "good",
                      name: "good",
                      varibles: {
                        lp: {
                          increment: 35
                        }
                      },
                      branch: {
                        set: "notexists" // error
                      }
                    }
                  }
                }
              ],
              other: {
                hideUIAtChoises: true // will text and name ui be hidden at choise
              }
        },
        {
            text: "Привет!", // text
            name: "???", // name
            sprites: { // sprites
                coke: { // new sprite. Coke
                    top: "50%", // position
                    left: "40%", // also pos
                    pose: "coke",
                    poses: {
                        coke: "../images/coke.jpeg",
                        mar: "../images/marat.png"
                    },
                    styles: { // start styles
                        opacity: 0 // setting start opacity
                    },
                    transition: { // transition 
                        time: 0.5, // time (seconds)
                        easing: "ease", // css easing
                        styles: { // and styles to set
                            opacity: 1,
                            top: "40%"
                        }
                    }
                }
            },
            events: { // events section
                sprites: {
                    bottle: { // applying to the "bottle"
                        styles: {
                            opacity: 0 // before removing, setting styles. So, it will start changing opacity to 0 and remove
                        }, //                        |
                        remove: true, //            < Remove sprite after transition. You can set time:0 and it can be instantly
                        time: 0.5, // time
                        easing: "ease" // css easing
                    }
                }
            },
            sounds: { // sounds section
                ambience: { // we will change "ambience" sound
                    // we dont need "src" because "ambience" alredy exists
                    stop: true, // stop after transition 
                    transition: { // sound transition
                        from: 0.9, // start volume
                        to: 0, // end volume
                        step: 0.01, // step
                        time: 10 // time
                    }
                }
            }, // other dialog settings
            other: { // after every dialog change, engine clears all sprites if "sprite" section is exists in the dialog. "sprites" section describes sprites that exist
                clearSprites: false // but we disable it by setting this thing
            }
        },
        {
            text: "Меня Славей зовут! И ты тоже зови!", // typed
            name: "Славя", // name
            sounds: { // sounds section
                ambience: { // we removed "ambience", so we need to load it
                    src: "../sounds/forest_ambience.mp3", // loading file
                    loop: true, // loop
                    transition: { // and start transition
                        from: 0,
                        to: 0.8,
                        step: 0.01,
                        time: 100
                    }
                }
            }
        },
        {
            text: "Зову.",
            name: "Семён"
        },
        {
            text: "Пошли",
            name: "Славя",
            next: true // dont wait next Engine#next call, just process next dialog
        },
        {
            timeout: 200, // start processing this dialog after 200 ms
            text: "[w] туда" // and typing after delay
        },
        {
            text: "Куда?!",
            name: "Семён",
            events: {
                effects: [ // effects section
                    { // you can add as many effects as you want
                        name: "dim", // what effect will be handled
                        time: 1, // effect time
                        easing: "ease", // easing 
                        timeout: 1000, // timeout before return transiiton is started
                        styles: {}
                    }
                ]
            }
        },
        {
            timeout: 2000,
            text: "",
            name: ""
        }
    ],
    somebranch: [
        {
            text: "hello from new branch"
        }
    ]
}
```


You can get documentation from "out" folder. Also, you can get it at https://onien-12.github.io/visualnovel/ <br>
Template scenario you can find in root directory "scenariotemplate.js" <br><br>

## Todo:
- [X] Choises
- [X] Varibles
- [ ] Finish the builder
- [X] Scenario branches
- [ ] Conditions
