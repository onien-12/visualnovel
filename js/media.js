/** Media controller
 * @module Media
 * @author Onien
 */


/** @class Media
 */
export default class Media {
  /** @member {HTMLElement} element
   * @desc controlled element
   */

  /** @function constructor
   * @desc inits.
   * @param {HTMLElement} mediaElement
   */
  constructor(mediaElement) {
    this.element = mediaElement;
  }

  /** @method addMedia
   * @desc adds media to the Media#element
   * @param {Object} options
   * @param {string} options.type - can be "video"
   * @param {Object} [options.transition]
   * @param {number} options.transition.time - transition duration
   * @param {Object} options.transition.styles - css styles for transition
   * @param {string} options.transition.easing - css transition easing
   * @param {Object} options.attrs - video html attributes "{<attr name>: <attr value>}"
   * @param {string} options.name - media name. will be set in "mediaName" html attribute
   * @param {Object} [options.styles] - css styles without transition
   * @param {string} options.src - video source. sets in the "src" html atribute
   * @returns {HTMLDivElement} ParentVideo - html parent element
   */
  addMedia(options) {
    // options: Dictionary
    if (options.type == "video") {
      let ParentVideo = document.createElement("div");
      let video = document.createElement("video");

      ParentVideo.appendChild(video);
      ParentVideo.classList.add("media", "video");
      ParentVideo.setAttribute("mediaName", options.name);

      if (options.attrs != undefined) {
        Object.keys(options.attrs).forEach((key) => {
          video.setAttribute(key, options.attrs[key]);
        });
      }

      video.setAttribute("src", options.src);
      this.element.appendChild(ParentVideo);

      if (options.styles != undefined)
        Object.assign(ParentVideo.style, options.styles);
      if (options.transition != undefined) {
        ParentVideo.style.transition = `all ${options.transition.time}s ${options.transition.easing}`;
        setTimeout(
          () => Object.assign(ParentVideo.style, options.transition.styles),
          15
        );
      }
      return ParentVideo;
    }
  }
}
