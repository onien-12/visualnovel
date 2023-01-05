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
      variables: {
        lp: [ // also there are methods: increment, decrement, multiply, divide, root, floor, ceil, cos, sin -- string funcs -- conc, remove (replaces value to "")
          { set: 5 }
          /*
          { root: 2 } // value is the root
          or { root: 5 }

          also
          { round: 5 } // number of numbers after period
          { floor: 0 } // every number
          { ceil: 0 } // every number
          { cos: 0 } // every number
          { sin: 0 } // every number
          */
        ],
        /*
        somstring: [
          { set: 'hello' },
          { 
            replace: {
              value: 'llo',
              replacer: 'what'
            }
          }
        ]
        the <somestring> will be hewhat
        */
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
      js: (engine, dialog) => { // this function will execute after everything. There is 1 argument - current dialog. But if you use `function () { <code> }`, you can use <this> keyword and get engine
        console.log("hello from js");
      },
      beforeJS: (engine, dialog) => { // this function will execute before everything; If in this function return false, dialog will stop;
        console.log("before hello from js");
        return true; // continue dialog
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
        block: { // this block will be (drag&drop)
          add: true,
          html: "{ text='', style='width: 10px; left: calc(100% - 10px); right: 0; bottom: 0; position: absolute; display: block; height: 10px', background='white', className='resizeHandler' }",
          class: ["block"],
          style: {
            position: "absolute",
            zIndex: "998",
            top: "10%",
            left: "25%",
            width: "150px",
            height: "300px",
            background: "green",
            border: "3px solid blue"
          },
          events: {
            onmousedown: {
              variables: {
                clicked: [
                  { set: 1 }
                ],
                shiftX: [
                  { type: "int" }, // engine will parse everything to integer. There are 3 types: "str", "int" and 'float'. By default its int, so, you can not set this type if you use integer
                  { set: "{ event.pageX }" },
                  { decrement: "{ event.target.offsetLeft }" }
                ],
                shiftY: [
                  { type: "int" }, // type should be on the first place
                  { set: "{ event.pageY }" },
                  { decrement: "{ event.target.offsetTop }" }
                ]
              }
            }, // you can use all html events
            onmouseup: {
              variables: {
                clicked: [
                  { set: 0 }
                ]
              }
            }
          }
        },
        global: { // invisible object on all screen to track mouse
          get: "html", // if you want to use existing element (query selector)
          style: {
            position: "absolute",
            height: "100vh",
            width: "100%",
            zIndex: "1000"
          },
          events: {
            onmouseup: {
              variables: {
                clicked: [
                  { set: 0 }
                ],
                clickedResize: [
                  { set: 0 }
                ]
              }
            },
            onmousemove: {
              beforeJS: function () { // to get <this>
                if (this.variables.get("clicked") == 1 && this.variables.get("clickedResize") == 0) { // if mouse is down on object "block"
                  return true;
                }
                return false; // just stop execution
              },
              beforeJSElse: { // if beforeJS returned false
                beforeJS: (engine) => { // also you can do so
                  if (engine.variables.get("clickedResize") == 1) return true;
                  return false;
                },
                variables: {
                  resizeX: [
                    { type: "int" },
                    { set: "{ event.pageX }" },
                    { decrement: "{ resizeHandlerX }" }
                  ],
                  resizeY: [
                    { type: "int" },
                    { set: "{ event.pageY }" },
                    { decrement: "{ resizeHandlerY }" }
                  ]
                },
                events: {
                  objects: {
                    block: {
                      time: 0,
                      styles: {
                        height: "{ resizeY }px",
                        width: "{ resizeX }px"
                      }
                    }
                  }
                }
              },
              variables: {
                moveX: [
                  { type: "int" },
                  { set: "{ event.pageX }" },
                  { decrement: "{ shiftX }" }
                ],
                moveY: [
                 { type: "int" },
                 { set: "{ event.pageY }" },
                 { decrement: "{ shiftY }" }
                ]
              },
              events: {
                objects: {
                  block: {
                    time: 0,
                    styles: {
                      top: "{ moveY }px",
                      left: "{ moveX }px"
                    }
                  }
                }
              }
            }
          }
        },
        resizehandler: {
          get: ".block > .resizeHandler",
          events: {
            onmousedown: {
              variables: {
                clickedResize: [
                  { set: 1 }
                ],
                clicked: [
                  { set: 0 }
                ],
                resizeHandlerX: [
                  { type: "int" },
                  { set: "{ event.target.parentNode.offsetLeft }" }
                ],
                resizeHandlerY: [
                  { type: "int" },
                  { set: "{ event.target.parentNode.offsetTop }" }
                ]
              }
            }
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
              variables: { // setting variablesd
                lp: [ // variables reading action-by-action: if first is set to 5, second is increment by 4 and third is decrement by 7, then result will be = 2 ( 5 + 4 - 7 )
                  { increment: 1 }, // first action
                  { multiply: 3 }, // 2-d
                  { divide: 2 }, // 3-d
                  { increment: 3 }, // 4-th
                  { decrement: 2 } // 5-th
                  // result = 2.5
                ]
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
              variables: {
                lp: [
                  { increment: 35 }
                ]
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
      name: "i dont know",
      background: {
        src: "../images/bus.jpg",
        transition: {
          name: "fade",
          time: 10,
          easing: "ease"
        }
      }
    },
    {
      repeat: {
        times: 15, // set how many times we need to repeat <do> section
        do: { // what we need to repeat
          variables: { // just increment (lp) varible
            lp: [
              { increment: 1 }
            ]
          },
          js: (engine, dialog, { iteration }) => {
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
          html: "nothing happened! And yes, you can use { text='this parser', color='green' } here! With variables, of course { lp }",
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
      text: "video actually ended",
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
