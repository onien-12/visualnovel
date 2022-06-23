/** @function color
 * @desc creates html element (span) with "color" style
 * @param {string} string
 * @param {color} color
 * @returns {HTMLElement} html span element
 */

export function color(string, color) {
    let Element = document.createElement("span");
    Element.innerHTML = string;
    Element.style.color = color;
    return Element;
}

/** @function arrayRemove
 * @desc removes element from array by index
 * @param {Array} arr - array
 * @param {number} srch - index
 * @returns {Array} array with removed index
 */

export function arrayRemove(arr, srch) { 
    return arr.filter((elem, idx) => { 
        return idx != srch; 
    });
}
