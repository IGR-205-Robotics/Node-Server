const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log('request received');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({ message: "request received" });
    next();
});

module.exports = app;