export class VariableAPI {
    #variable = [
        { type: 'int' }
    ];

    /**
     * @param {'str'|'int'|'float'} type
     */
    constructor(type) {
        this.#variable[0].type = type;
    }


    /** @type {'int'|'str'|'float'} type */
    setType(type) {
        this.#variable[0].type = type;
    }

    /** sets <set> property
     * @param {string | number} value
     */
    set(value) {
        if (this.#variable[0].type == 'str')
            this.#append('set', value.toString());
        else if (this.#variable[0].type == 'int' || this.#variable[0].type == 'float')
            this.#append('set', +value);
        return this;
    }

    /** adds divide action */
    divide(by) {
        this.#append('divide', by);
        return this;
    }

    /** adds multiply action */
    multiply(by) {
        this.#append('multiply', by);
        return this;
    }

    /** adds increment action */
    increment(by) {
        this.#append('increment', by);
        return this;
    }
    /** shorthand for {@link increment} */
    sum(by) {
        return this.increment(by);
    }

    /** concat strings */
    concat(_with) {
        this.#append('conc', _with);
        return this;
    }

    /** adds decrement action */
    decrement(by) {
        this.#append('decrement', by);
        return this;
    }
    /** shorthand for {@link decrement} */
    minus(by) {
        return this.decrement(by);
    }

    /** root of the number with root root */
    root(root) {
        this.#append('root', root);
        return this;
    }

    /** rounds number with <floating> numbers after period */
    round(floating) {
        this.#append('round', floating);
        return this;
    }

    /** Math.floor's number */
    floor() {
        this.#append('floor', 0);
        return this;
    }
 
    /** Math.ceil's number */
    ceil() {
        this.#append('ceil', 0);
        return this;
    }

    /** sinus of the number */
    sin() {
        this.#append('sin', 0);
        return this;
    }

    /** cosinus of the number */
    cos() {
        this.#append('cos', 0);
        return this;
    }

    /** remove action for string */
    remove(what) {
        this.#append('remove', what);
        return this;
    }

    /** replace action for string */
    replace(value, replacer) {
        this.#append('replace', {
            value,
            replacer
        });
        return this;
    }

    /** appends to an object
     * @param {string} name
     * @param {*} value
     */
    #append(name, value) {
        let object = {}
        object[name] = value;

        this.#variable.push(object);
    }

    /** builds scene */
    getVariable() {
        return this.#variable;
    }
}
