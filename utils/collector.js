class UnifiedCollector {
    constructor() {
        this.data = [];
    }

    collect(item) {
        this.data.push(item);
    }

    getData() {
        return this.data;
    }

    clearData() {
        this.data = [];
    }

    removeItem(item) {
        this.data = this.data.filter(i => i !== item);
    }

    findItem(predicate) {
        return this.data.find(predicate);
    }
}

module.exports = UnifiedCollector;
