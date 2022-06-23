/** Sound controller
 * @module Sound
 * @author Onien
 */


/** Sound main class
 * @class Sound
 */
export default class Sound {
    /** @member {string} file
     * @desc filename
     */

    /** @member {Audio} audio
     * @desc html audio class
     */

    /** @function constructor
     * @desc inits.
     * @param {string} file - audio file. will be used in the Audio class as file
     */
    constructor(file) {
        this.file = file;
        this.audio = new Audio(this.file);
    }

    /** @method transition
     * @desc does sound transition.
     * @param {number} from
     * @param {number} to
     * @param {number} step
     * @param {number} time
     * @param {Function} after
     */
    transition(from, to, step, time, after) {
        let count = from;
        let mode = "";
        if (from > to) mode = "dec";
        else if (from < to) mode = "inc";
        else return; 
        let interval = setInterval(() => {
            if (mode == "inc") {
                if (count >= to) {
                    after();
                    return clearInterval(interval);
                }
                else {
                    count += step;
                    this.volume = count;
                }
            }
            else {
                if (count <= to || count < step) {
                    after();
                    return clearInterval(interval);
                }
                else {
                    count -= step;
                    this.volume = count;
                }
            }
        }, time);
    }

    /** @method play
     * @desc plays audio
     */

    play() {
        this.audio.play();
    }

    /** @method stop
     * @desc stops audio
     */

    stop() {
        this.audio.pause();
    }

    /**
     * @type {number}
     * @desc sets volume
     */
    set volume(value) {
        this.audio.volume = value;
    }

    /**
     * @type {boolean}
     * @desc sets loop or not
     */
    set loop(value) {
        this.audio.loop = value;
    }
}
