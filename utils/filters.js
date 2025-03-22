class Filters {
    constructor() {
        // Initialization code
    }

    applyFilter(data, filterFunction) {
        return data.filter(filterFunction);
    }

    removeDuplicates(data) {
        return [...new Set(data)];
    }

    sortData(data, compareFunction) {
        return data.sort(compareFunction);
    }

    findItem(data, predicate) {
        return data.find(predicate);
    }
}

module.exports = Filters;
