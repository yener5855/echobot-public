class ErrorHandler {
    constructor() {
        // Initialization code
    }

    logError(error) {
        console.error(error);
    }

    handleError(error) {
        this.logError(error);
        // Additional error handling logic
    }

    throwError(message) {
        throw new Error(message);
    }

    catchAsyncErrors(fn) {
        return function (req, res, next) {
            fn(req, res, next).catch(next);
        };
    }
}

module.exports = ErrorHandler;
