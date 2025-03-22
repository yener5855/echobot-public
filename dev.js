// Enable strict mode
'use strict';

// Enable debug mode
const debug = require('debug')('app:debug');
const error = require('debug')('app:error');

// Log server startup
debug('Starting server...');

// Global error handler
process.on('uncaughtException', (err) => {
    error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Debugging middleware for Express.js
const express = require('express');
const app = express();

// Log server initialization
debug('Initializing server...');

app.use((req, res, next) => {
    debug(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

// Log request body
app.use(express.json());
app.use((req, res, next) => {
    debug('Request Body:', req.body);
    next();
});

// Log query parameters
app.use((req, res, next) => {
    debug('Query Parameters:', req.query);
    next();
});

// Log cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use((req, res, next) => {
    debug('Cookies:', req.cookies);
    next();
});

// Log session data (if using express-session)
const session = require('express-session');
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use((req, res, next) => {
    debug('Session Data:', req.session);
    next();
});

// Log response headers
app.use((req, res, next) => {
    res.on('finish', () => {
        debug('Response Headers:', res.getHeaders());
    });
    next();
});

// Log request IP address
app.use((req, res, next) => {
    debug('Request IP:', req.ip);
    next();
});

// Log request protocol
app.use((req, res, next) => {
    debug('Request Protocol:', req.protocol);
    next();
});

// Log request hostname
app.use((req, res, next) => {
    debug('Request Hostname:', req.hostname);
    next();
});

// Log request original URL
app.use((req, res, next) => {
    debug('Request Original URL:', req.originalUrl);
    next();
});

// Log request parameters
app.use((req, res, next) => {
    debug('Request Parameters:', req.params);
    next();
});

// Log response time
app.use((req, res, next) => {
    const startHrTime = process.hrtime();
    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        debug(`Response Time: ${elapsedTimeInMs}ms`);
    });
    next();
});

// Log request method and URL for all routes
app.use((req, res, next) => {
    debug(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

// Log response body (if possible)
const responseBodyLogger = (req, res, next) => {
    const oldSend = res.send;
    res.send = function (body) {
        debug('Response Body:', body);
        oldSend.apply(res, arguments);
    };
    next();
};
app.use(responseBodyLogger);

// Example route to demonstrate error handling
app.get('/error', (req, res) => {
    throw new Error('This is a test error!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        error('Error starting server:', err);
    } else {
        debug(`Server is running on port ${PORT}`);
    }
});

// Additional debugging utilities

// Log environment variables
debug('Environment Variables:', process.env);

// Log memory usage
setInterval(() => {
    const memoryUsage = process.memoryUsage();
    debug('Memory Usage:', memoryUsage);
}, 60000); // Log every 60 seconds

// Log request headers
app.use((req, res, next) => {
    debug('Request Headers:', req.headers);
    next();
});

// Log response status codes
app.use((req, res, next) => {
    res.on('finish', () => {
        debug(`Response Status Code: ${res.statusCode}`);
    });
    next();
});

// Log stack trace for errors
app.use((err, req, res, next) => {
    error('Stack Trace:', err.stack);
    next(err);
});
