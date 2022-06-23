/** @function setupTypewriter
 * @desc setups and returns typewriter
 * @param {string} html - text (html)
 * @param {HTMLElement} t - html element
 * @param {Function} after
 * @param {number} speed
 * @returns {{type: type, disable: disable}}
 */

export function setupTypewriter(html, t, after, speed) {
      var HTML = html;

      t.innerHTML = "";

      var cursorPosition = 0,
          tag = "",
          writingTag = false,
          tagOpen = false,
          enabled = true,
          typeSpeed = speed,
        tempTypeSpeed = 0;

      var type = function() {

          if (!enabled) return;
        
          if (writingTag === true) {
              tag += HTML[cursorPosition];
          }

          if (HTML[cursorPosition] === "<") {
              tempTypeSpeed = 0;
              if (tagOpen) {
                  tagOpen = false;
                  writingTag = true;
              } else {
                  tag = "";
                  tagOpen = true;
                  writingTag = true;
                  tag += HTML[cursorPosition];
              }
          }
          if (!writingTag && tagOpen) {
              tag.innerHTML += HTML[cursorPosition];
          }
          if (!writingTag && !tagOpen) {
              if (HTML[cursorPosition] === " ") {
                  tempTypeSpeed = 0;
              }
              else {
                  tempTypeSpeed = (Math.random() * typeSpeed) + 50;
              }
              t.innerHTML += HTML[cursorPosition];
          }
          if (writingTag === true && HTML[cursorPosition] === ">") {
              tempTypeSpeed = (Math.random() * typeSpeed) + 50;
              writingTag = false;
              if (tagOpen) {
                  var newSpan = document.createElement("span");
                  t.appendChild(newSpan);
                  newSpan.innerHTML = tag;
                  tag = newSpan.firstChild;
              }
          }

          cursorPosition += 1;
          if (cursorPosition < HTML.length) {
              setTimeout(type, tempTypeSpeed);
          }
          else after();

      };

    var disable = function() {
        enabled = false;
    };

      return {
          type: type,
          disable: disable
      };
  }
