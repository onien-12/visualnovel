/**
* HTML WINDOW SYSTEM
* @module WindowSystem
* @author Onien
*/

/** Creates new Windows class. I know... 
 * @class Windows
 */

export default class Windows {
  /** @function constructor
   * @desc creates and sets up Windows class
   * @param {string} classname - class name of window
   * @param {HTMLElement} addElement - parent element
   * @param {object} options - options
   * @param {boolean} options.cssInject - inject custom css from class
   */
    constructor(classname = "window", addElement, options = {}) {
        this.classname = classname;
		this.addElement = addElement;
        this.window_GlobalCss = `

.window-drag-handle {
    position: relative;
    top: 0;
    height: 20px;
    width: 100%;
    background: #45433e;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
}

.window-content {
	position: absolute;
    width: 100%;
    height: calc(100% - 20px);
}

.window {
    position: absolute !important;
    min-height: 150px;
    min-width: 240px;
	border-radius: 16px;
}

.window-close {
    position: relative;
    left: calc(100% - 15px);
    color: #fff;
}

.window-maximize {
    position: relative;
    left: calc(100% - 50px); 
    color: #fff;
}

.windowTitle {
	position: absolute;
	left: 50%;
	transform: translateX(-50%) translateY(30%);
	color: #fff;
	top: -50%;
}

.ui-resizable-handle {
	position: absolute;
}

`;

		if (options.cssInject) document.head.innerHTML += `<style id="FL-window-css">${this.window_GlobalCss}</style>`;
    }

    /** @function open
     * @desc opens a given window
     * @param {(string | HTMLElement)} ThisWindow - which window
     */ 

    open(ThisWindow) {
        $(ThisWindow).show(100); //показываем переданное окно
    }

	/** @function close
	 * @desc closes a given window
	 * @param {string} id - id of the window
	 * @param {object} options - options
	 * @param {boolean} options.animate - true to animate window closing
	 * @param {integer} options.animTime - animation duration
	 * @param {Function} options.onclose - callback function when window just closed
	 */
    
    close( id, options = {animate: true, animTime: 110, onclose: () => {}} ) { //закрытие
       if (options.animate == true) { //если с анимацией
           $("#" + id).hide(options.animTime); //прячем
           setTimeout(() => $("#" + id).remove(), options.animTime + 10); //полностью удаляем
        }
        else $("#" + id).remove(); //просто полностью удаляем
		options?.onclose(id, options);
    }

	/** @function maximize
	 * @desc maximizes and minimizes the window
	 * <br> If window is already maximized, then fucntion is automatically minimizes this window
	 * <br> If window is already minimized, then fucntion is automatically maximizes this window
	 * <br><br> .window-maximize button will change icon:
	 * <br> if maximized to "_"
	 * <br> if minimized to "o"
	 * <br> you can not change animation time - it is always 0.2s
	 * <br> function writes Class.previousPos and if window minimized from maximized state, window will move to this previous position
	 * <br> previousPos writes only when window is being maximized
	 * @param {string} id - id of the window
	 */
		 
    maximize(id) {
        
        $("#" + id).css("transition", "all 0.2s"); //анимация
        
        if ( $("#" + id).width() != window.innerWidth && $("#" + id).height() != window.innerHeight ) { //если не на весь экран
            this.previousPos = { //коо-ты где мы развернули окно
                width: $("#" + id).css("width"),
                height: $("#" + id).css("height"),
                top: $("#" + id).css("top"), 
                left: $("#" + id).css("left")
            };
            $("#" + id).css({width: window.innerWidth, height: window.innerHeight, top: 0, left: 0}); //делаем на весь экран, и позиции по нулям
            $("#" + id + " > .window-drag-handle > .window-maximize").text("_"); //меняем значок у расширения окна
        }
        
        else { //если и так на весь экран - сворачиваем
            $("#" + id).css(this.previousPos); //на предыдущие позиции
            $("#" + id + " > .window-drag-handle > .window-maximize").text("o");
        }
        
        
        setTimeout(() => $("#" + id).css("transition", ""), 110); //откл. анимацию
    }

	/** @function addWindow
	 * @desc adds a window
	 * @param {object} options - options
	 * @param {boolean} options.drag - enable/disable window dragging
	 * @param {boolean} options.closable - enable/disable window closing
	 * @param {boolean} options.maxable - enable/disable window maximizing and minimizing
	 * @param {object} options.windowOptions - options for window events
	 * @param {object} options.windowOptions.close - options for window closing. See {@link Windows#close}
         * @returns {Window} a window object
	 */

    
    addWindow(options = { drag: true, closable: true, maxable: true, windowOptions: { 
		close: {
			animate: true,
			animTime: 110,
			onclose: () => {}
		}
	} } ) {
        this.newWindow = document.createElement("div"); //создаем див
        this.newWindow.style = "display: none; width: 600px; height: 580px; z-index: 500; box-shadow: 0 0 10px rgba(0,0,0,0.2);"; //присваиваем ему стили
        
        let unitID_window = Math.floor(Math.random() * Math.floor(10000)); //делаем уникальный ID
        while (true) {
            if (document.getElementById("window-id" + unitID_window)) unitID_window = Math.floor(Math.random() * Math.floor(10000)); //смотрим чтобы такого ID не было
            //если есть, то генерируем снова
            
            else break; //если нет, то выходим из цикла
        }
        
        this.newWindow.id = "window-id" + unitID_window; //задаем этот ID
        this.newWindow.className = this.classname; //задаем класс
        this.newWindow.innerHTML = ` 
        <div class="window-drag-handle">
			<span class="windowTitle"></span>
            <span class="window-close">x</span>
            <span class="window-maximize">o</span>
        </div>
        <div class="window-content" style="background: #fff; padding: 3px">
        
        </div>
        `; //внутренний HTML окна
        
        //Контент окна:
            // #<id> > .window-content
            
        //Верхняя часть перетаскивания:
            // #<id> > .window-drag-handle > .window-maximize
            
        this.addElement.appendChild(this.newWindow); //добавляем
        
        //OPTIONS SET
        
        if (options.drag) {
            $("#window-id" + unitID_window).draggable({ //настраиваем перетаскивание если включено
               handle: ".window-drag-handle",
               start: () => $("#window-id" + unitID_window).fadeTo(300, 0.85),
               stop: () => $("#window-id" + unitID_window).fadeTo(300, 1),
               scroll: false,
               snap: "body"
            }).resizable();
        }
        
        document.getElementById("window-id" + unitID_window).addEventListener("click", ev => {
            if ($(ev.target).hasClass("window-maximize") && options.maxable) this.maximize(ev.target.parentNode.parentNode.id); //настраиваем разворот окна
            if ($(ev.target).hasClass("window-close") && options.closable) this.close(ev.target.parentNode.parentNode.id, options.windowOptions.close); //настраиваем закрытие окна
        }, false);
    
        let data = Object.assign(this.newWindow, { 
            window_html: (html, id = this.newWindow.id) => {
                $("#" + id + " > .window-content").html(html);
            },
            open: (thiswindow) => {
                this.open(thiswindow);
            },
            close: (id = this.newWindow.id, options = { animate: true, animTime: 110 }) => {
                this.close(id, options);
            },
            maximize: (id = this.newWindow.id) => {
                this.maximize(id);
            },
			setTitle: (title, id = this.newWindow.id) => {
				$("#" + id + " > .window-drag-handle > .windowTitle").html(title);
			},
			getFromContent: (selector, id) => {
				return document.querySelector(`#${id} > .window-content > ${selector}`);
			},
			getFromContentAll: (selector, id) => {
				return [...document.querySelectorAll(`#${id} > .window-content > ${selector}`)];
			}
        });
             
        return data;
    }
}

/** Functions and props for each created window by {@link Windows#addWindow}
 * @typedef Window
 * @type {object}
 * @prop {Function} window_html - html, id
 * @prop {Function} open - window
 * @prop {Function} close - id, options
 * @prop {Function} maximize - id
 * @prop {Function} setTitle - title, id
 * @prop {Function} getFromContent - selector, id
 * @prop {Function} getFromContentAll - selector, id
 */
