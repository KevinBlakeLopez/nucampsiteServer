const express = require("express");
const Favorite = require("../models/favorites");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter.route("/")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
    .populate("user")
    .populate("campsites")
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorites => {
        if (favorites) {
            console.log("here")
            req.body.forEach(favorite => {
                if(!favorites.campsites.includes(favorite._id)){
                    favorites.campsites.push(favorite._id);
                }          
            })
            favorites.save()
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorites)
            })
            .catch(err => next(err));
        } else {
            console.log("there");
            Favorite.create({ user: req.user._id })
            .then(favorites => {
                req.body.forEach(favorite => {
                    if(!favorites.campsites.includes(favorite._id)){
                        favorites.campsites.push(favorite._id);
                    }
                })
                favorites.save()
                .then(favorites => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorites)
                })
                .catch(err => next(err));       
            })
            .catch(err => next(err))
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites")
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
    .then(favorites => {
        if (favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorites);
        } else {
            res.statusCode = 403;
            res.setHeader("Content-Type", "text/plain");
            res.end("You do not have any favorites to delete");
        }
    })
    .catch(err => next(err));
})

favoriteRouter.route("/:campsiteId")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /:campsiteId")
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorites => {
        if (favorites) {
            let favorite = req.params.campsiteId;
            if(!favorites.campsites.includes(favorite)) {
                favorites.campsites.push(favorite)
                favorites.save()
                .then(favorites => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorites);
                })
                .catch(err => next(err));
            } else {
                res.end("That campsite is already in the list of favorites")
            }
        } else {
            Favorite.create({ user: req.user._id })
            let favorite = req.params.campsiteId;
            favorites.campsites.push(favorite);
            favorites.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch(err => next(err));
        }
        
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /:favoriteId")
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
Favorite.findOne({ user: req.user._id })
.then(favorites => {
    if (favorites) {
        console.log(favorites);
        let favorite = req.params.campsiteId;
        let ind = favorites.campsites.indexOf(favorite);
        favorites.campsites.splice(ind, 1);
        favorites.save()
        .then(favorite => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
        })
        .catch(err => next(err));
    } else {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end("there are no favorites to delete");
    }
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;