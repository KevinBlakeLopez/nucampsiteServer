const express = require("express");
const partnersRouter = express.Router();

partnersRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res) => {
    res.end("Will send all the partners to you");
})
.post((req, res) => {
    res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT not supported");
})
.delete((req, res) => {
    res.end("Deleting all partners");
})

partnersRouter.route("/:partnerId")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res) => {
    res.end(`Will send the details of the partner to you ${req.params.partnerId}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST not supported on /partners/${req.params.partnerId}`);
})
.put((req, res) => {
    res.end(`Will update the partner: ${req.body.name} with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting the partner: ${req.params.partnerId}`);
})

module.exports = partnersRouter;