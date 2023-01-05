/** creates html element (span) with "color" style
 * @param {string} string
 * @param {color} color
 * @returns {HTMLElement} html span element
 */
export function color(string, color) {
    let element = document.createElement("span");
    element.innerHTML = string;
    element.style.color = color;
    return element;
}

/** removes element from array by index
 * @param {Array} arr - array
 * @param {number} search - index
 * @returns {Array} array with removed index
 */

export function arrayRemove(arr, search) { 
    return arr.filter((elem, idx) => { 
        return idx != search; 
    });
}
