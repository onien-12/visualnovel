import { color } from "./js/utils.js"; //загружаем утилиты

export let scenario = {
  main: [
    {
      text: "test",
      name: "test",
      sprites: {
        durak: {
          top: "50%",
          left: "40%",
          pose: "coke",
          poses: {
            coke: "../images/coke.jpeg",
            sprite: "../images/sprite.jpg"
          },
          styles: {
            // start styles
            opacity: 0,
          },
          transition: {
            // transition
            time: 0.5,
            easing: "ease",
            styles: {
              opacity: 1,
            },
          },
        },
      },
      varibles: {
        lp: { // also there are methods: increment, decrement, multiply, divide, -- string funcs -- conc, remove (replaces value to "")
          set: 0
        }
      },
      background: {
        src: "../images/mountains.jpg",
      },
      sounds: {
        main: {
          src: "../sounds/just_think.mp3", // source file
          volume: 1, // start volume
          ended: {
            do: {
              text: "just think ended"
            }
          }
        }
      },
      js: (dialog) => { // this function will execute. There is 1 argument - current dialog. But if you use `function () { <code> }`, you can use <this> keyword and get engine
        console.log("hello from js");
      }
    },
    {
      next: {
        instantly: true,
        increment: 1,
      },
      text: "это большой текст с поддержкой { text='html', color='red' } и я очень надеюсь, что это всё работает { text='нормально', color='green', background='white' }! LP: { text=lp, color='yellow' }",
      name: "Весь мир",
      events: {
        sprites: {
          durak: {
            styles: {
              top: "30%",
            },
            time: 0.3,
          },
        },
      },
      media: {
        what: {
          type: "video",
          src: "../videos/videoplayback.mp4",
          styles: {
            top: "20%",
            left: "40%",
            zIndex: "3",
            opacity: "0"
          },
          attrs: {
            autoplay: "true"
          },
          ended: {
            removeMedia: true, // if you want to remove media element after end
            do: {
              branch: {
                set: "videoended"
              }
            }
          } 
        },
      },
    },
    {
      events: {
        media: {
          what: {
            time: 1,
            styles: {
              opacity: "1"
            }
          }
        }
      }
    },
    {
      text: "hello",
      events: {
        sprites: {
          durak: {
            changePose: "sprite",
            effect: true,
            time: 5,
            easing: "linear",
            stylesBefore: {
              backgroundSize: "100% 100%"
            },
            styles: {
              width: "300px",
              height: "500px"
            }
          }
        },
        media: {
          what: {
            styles: {
              top: "40%",
              left: "50%",
              opacity: "0.5",
            },
            time: 0.5,
            pause: true,
            // or play: true
          },
        },
      },
      objects: {
        block: {
          add: true,
          style: {
            position: "absolute",
            zIndex: "998",
            top: "10%",
            left: "25%",
            width: "150px",
            height: "300px",
            background: "green",
            border: "3px solid blue"
          }
        }
      },
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
                  // result = 2.5
                }
              },
              branch: { // setting branch
                set: "dontknow" // setting branch
              }
            },
            // mouseenter: {
            // text: "bad mouseenter!",
            // name: "wowo mouseenter!"
            // }
          }
        },
        {
          name: "good",
          text: "hezasd",
          active: true,
          hidden: false,
          // hideChoisesElement: false, // if you dont want to hide choises parent element
          do: {
            process: {
              // removeChoise: true, // if you want to remove choise user clicked
              text: "good",
              name: "good",
              varibles: {
                lp: {
                  increment: 35
                }
              }
            },
            mouseenter: {
              removeChoise: true, // if you want to remove choise under mouse
              text: "good mouseenter"
            }
          }
        }
      ],
      other: {
        hideUIAtChoises: true // will text and name ui be hidden at choise
      }
    },
    {
      text: "really",
      name: "i dont know"
    },
    {
      repeat: {
        times: 15, // set how many times we need to repeat <do> section
        do: { // what we need to repeat
          varibles: { // just increment (lp) varible
            lp: {
              increment: 1
            }
          },
          js: (dialog, { iteration }) => {
            console.log("yea " + iteration);
          }
        },
        after: { // after loop ended
          text: "you now have { lp } LP"
        },
        "async": true // if true, all loop will be async (wrapped into setInterval)
      } // repeat 5 times
    }
  ], 
  dontknow: [
    {
      text: "[w] hello from brach dontknow akj lkjhsh",
      name: "wowowo dontknow branch",
    },
    {
      
      events: {
        media: {
          what: {
            play: true
          }
        }
      },
      objects: {
        nothing: {
          tag: "span",
          style: {
            position: "absolute",
            top: "50%",
            left: "30%",
            zIndex: "999"
          },
          html: "nothing happened! And yes, you can use { text='this parser', color='green' } here! With varibles, of course { lp }",
          add: true // add to scene?
        }
      },
      next: {
        increment: 1,
        instantly: true
      }
    },
    {
      branch: {
        set: "main",
        cursor: 4
      },
      events: {
        objects: {
          nothing: {
            // if set <html> property, it will change inner html
            // stylesBefore: { <styles> } // styles before transition
            // remove: true // remove after transition
            // add: true // if you didnt add to scene before (in initialization)
            time: 3,
            easing: "linear",
            styles: {
              opacity: "0.6",
              top: "70%",
              left: "60%"
            }
          },
          block: {
            time: 2,
            easing: "ease",
            styles: {
              filter: "sepia(0.4)"
            }
          }
        }
      }
    }
  ],
  videoended: [
    {
      text: "video actually ended"
    },
    {
      timeout: {
        duration: 500, // 500 ms
        doInstantly: { // do before timeout (instantly)
          text: "[w] really"
        }
      },
      branch: {
        set: "dontknow"
      }
    }
  ]
}
