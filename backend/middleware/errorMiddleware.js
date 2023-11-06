// final error function in case no other error handler called
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    //
    res.status(404);
    //
    next(error);
}

// overwrite the default express error handler
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // check for Mongoose bad ObjectId (CastError) - overwrite the standard HTML'd CastError (show something different)
    if (err.name === "CastError" && err.kind === 'ObjectId') {
        statusCode = 404;
        message = "Resource not found";
    }

    //
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? "short stack of pancakes" : err.stack,
    })

}

export {notFound, errorHandler};