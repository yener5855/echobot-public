class CodeEnvironment {
    constructor() {
        this.environment = {};
    }

    setVariable(key, value) {
        this.environment[key] = value;
    }

    getVariable(key) {
        return this.environment[key];
    }

    clearEnvironment() {
        this.environment = {};
    }

    removeVariable(key) {
        delete this.environment[key];
    }

    listVariables() {
        return Object.keys(this.environment);
    }
}

module.exports = CodeEnvironment;
