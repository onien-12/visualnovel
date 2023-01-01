/** Parser module
 * @module Parser
 * @author Onien
 */

/**
 * @function parseVar
 * @desc parses and finds varible from given data
 * @param {string} token - varible token
 * @param {Object} data - data
 * @example
 *  // returns "hello"
 *  parseVar("data.1.really", {
 *    data: [
 *      "something",
 *      {
 *        really: "hello"
 *      }
 *    ]
 *  })
 *  @returns {*} value
 */
function parseVar(token, data) {
  let value;
  let errors = [];
  token.split(".").forEach((varible, idx) => {
    try {
      if (idx > 0) {
        value = value[varible];
      } else {
        value = data[varible];
      }
    } catch {
      return errors.push({
        type: "error",
        text: "error: varible " + varible + " not found!",
      });
    }
    if (value == undefined) {
      return errors.push({
        type: "error",
        text: "error: varible " + varible + " not found!",
      });
    }
  });
  if (errors.length > 0) return errors;
  return value;
}

/** @function Throw
 * @desc retuns error message
 * @example
 *  // returns "ERROR: messageage at 2! Substring wowo - 5 in token tokeeen"
 *  Throw("messageage", {
 *    idx: 2, substr: "wowo", substridx: 5, token: "tokeeen"
 *  })
 * @param {string} message
 * @param {Object} trace
 * @param {number} trace.idx
 * @param {string} trace.substr
 * @param {number} trace.substridx
 * @param {string} trace.token
 * @returns {string} message
 */
function Throw(message, trace) {
  return `ERROR: ${message} at ${trace.idx}! Substring ${trace.substr} - ${trace.substridx} in token ${trace.token}`;
}

/** @function generateHTML
 * @desc generates html without using dom methods
 * @example
 *  // returns <div style="background: green">hello</div>
 *  generateHTML(new Map([
 *    ["background", "green"],
 *    ["tag", "div"],
 *    ["text", "hello"]
 *  ]));
 * @param {Map} parsed
 * @returns {string} html
 */
function generateHTML(parsed) {
  let text;
  let styles = "";
  let errors = [];
  let tagname = parsed.get("tag") ?? "span";
  let className = "";
  let id = "";
  parsed.forEach((value, key) => {
    if (key == "text") {
      text = value;
    } else if (key == "color") {
      styles += "color: " + value + "; ";
    } else if (key == "background") {
      styles += "background: " + value + "; ";
    } else if (key == "className") {
      className = value;
    } else if (key == "style") {
      styles = value;
    } else if (key == "id") {
      id = value;
    } else if (key == "tag");
    else {
      return errors.push({
        type: "error",
        text: `ERROR: Couldn't find "${key}" param`,
      });
    }
  });
  if (errors.length > 0) return errors;
  return `<${tagname}${
    styles.trim() != "" ? ' style="' + styles + '"' : ""
  }${
    className.trim() != "" ? ' class="' + className + '"' : ""
  }${
    id.trim() != "" ? ' id="' + id + '"' : ""
  }>${text}</${tagname}>`;
}

/** @function generateHTMLDOM
 * @desc generates html using dom
 * @see {@link generateHTML}
 * @returns {(string|Array.Object)} if dom isnt exists, it will return array of objects with errors
 */
function generateHTMLDOM(parsed) {
  try {
    let errors = [];
    let newElement = document.createElement(parsed.get("tag") ?? "span");
    parsed.forEach((value, key) => {
      if (key == "text") {
        newElement.innerText = value;
      } else if (key == "color") {
        newElement.style.color = value;
      } else if (key == "background") {
        newElement.style.background = value;
      } else if (key == "style") {
        newElement.setAttribute("style", value);
      } else if (key == "id") {
        newElement.id = value;
      } else if (key == "className") {
        newElement.className = value;
      } else if (key == "tag");
      else {
        return errors.push({
          type: "error",
          text: `ERROR: Couldn't find "${key}" param`,
        });
      }
    });
    if (errors.length > 0) return errors;
    return newElement.outerHTML;
  } catch {
    return [
      {
        type: "error",
        text: "Couldn't find DOM parser!",
      },
    ];
  }
}

/** @function parse
 * @desc parses text to html
 * @example
 *  // returns Hello, onien! I think you want to eat and to do .... Btw, <span style="color: red; ">this is the phrase</span>. Oh, <span style="background: green; ">green back?</span>
 *  parse("Hello, {name}! I think you want {wants.0} and {wants.1}. Btw, { text=phrase, color='red' }. Oh, { text='green back?', background='green' }", 
 *  {
 *    name: "onien",
 *    wants: [
 *      "to eat",
 *      "to do ..."
 *    ],
 *    phrase: "this is the phrase"
 *  })

 *  @param {string} str - string to parse
 *  @param {Object} data
 *  @param {Object} options
 *  @param {boolean} options.useDOM
 *  @returns {(string|string[])} parsed text (html) or array of errors
 */
export function parse(str, data, options = {}) {
  let splited = str.split(/(?<=})|(?=\{)/);
  let errors = [];
  let newValue = "";
  splited.forEach((substr, substridx) => {
    if (substr.startsWith("{")) {
      let token = substr.slice(1, -1);
      let parsed = new Map();
      if (token.split(",").length != 1) {
        token.split(",").forEach((arg, idx) => {
          if (arg.split("=").length == 1) {
            return errors.push(
              Throw("Expected value", {
                substr: substr,
                substridx: substridx,
                idx: idx,
                token: token,
              })
            );
          }
          let argname = arg.split("=")[0];
          let argvalue = arg.split("=")[1];

          // -------------- checking errors ----------

          if (argvalue.trim() == "") {
            return errors.push(
              Throw("Expected non-empty value", {
                substr: substr,
                substridx: substridx,
                idx: idx,
                token: token,
              })
            );
          }
          if (argname.trim() == "") {
            return errors.push(
              Throw("Expected non-empty argname", {
                substr: substr,
                substridx: substridx,
                idx: idx,
                token: token,
              })
            );
          }

          // ---------- value process ----------

          if (argvalue.trim().startsWith("'")) {
            parsed.set(argname.trim(), argvalue.trim().slice(1, -1));
          } else {
            let varible = parseVar(argvalue.trim(), data);
            if (typeof varible == "object" && varible[0].type == "error") {
              return errors.push(varible[0].text);
            }
            parsed.set(argname.trim(), varible);
          }
        });
      } else {
        let varible = parseVar(token.trim(), data);
        if (typeof varible == "object" && varible[0].type == "error") {
          return errors.push(varible[0].text);
        }
        parsed.set("__VALUE", varible);
      }

      if (parsed.has("__VALUE")) substr = parsed.get("__VALUE");
      else {
        let generated;
        if (options.useDOM == undefined || options.useDOM == true) {
          generated = generateHTMLDOM(parsed);
        } else {
          generated = generateHTML(parsed);
        }
        if (typeof generated == "object" && generated[0].type == "error") {
          return errors.push(generated[0].text);
        }
        substr = generated;
      }
    }
    newValue += substr;
  });
  if (errors.length > 0) {
    return errors;
  }
  return newValue;
}
