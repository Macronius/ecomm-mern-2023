const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

export default asyncHandler;

/**
 * the function takes in request, response, and next
 * will resolve a promise
 * if resolves successfully, will call next, which calls the next piece of middleware
 * 
 * this enables to proceed without a bunch of try/catch blocks
 * error handling is done through express (using a "custom error handler")
 */