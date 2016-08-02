'use strict';
const router = require('express').Router();

const HttpError = require("helpers/HttpError");
const Session = require("helpers/Session");
const ACL = require('helpers/ACL');
const Users = require("models/Users");
const form = require('express-form2');
  var field   = form.field;

router.post(
    ['/signin'],

    // Body validation
    form(
        field('email')
            .required()
            .trim()
            .isEmail(),

        field('password')
            .required()
    ),

    // Controller
    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, "Invalid input data", req.form.errors));
        }

        Users
            .auth(req.form.email, req.form.password)
            .then((user) => {
                return Session
                    .create(user._id)
            })
            .then((token) => {
                res.send({
                    token
                });
            })
            .catch(next);
    }
);

router.post(
    ['/signup'],

    // Body validation
    form(
        field('email')
            .required()
            .trim()
            .isEmail(),

        field('password')
            .required()
            .minLength(8)
            .maxLength(40)
    ),

    // Controller
    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, "Invalid input data", req.form.errors));
        }

        Users
            .findOne({
                email: req.form.email,
            })
            .then((user) => {
                if (user) {
                    throw new HttpError(409);
                }

                return null;
            })
            .then(() => {
                var user = new Users({
                    email: req.form.email,
                    password: req.form.password,
                });

                return user.save();
            })
            .then(() => {
                res.send();
            })
            .catch(next);
    }
);

router.get(
    ['/check/:email'],

    // Param validation
    form(
        field('email')
            .required()
            .trim()
            .isEmail()
    ),

    // Controller
    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, "Invalid input data", req.form.errors));
        }

        Users
            .findOne({
                email: req.form.email,
            })
            .then((user) => {
                if (user) {
                    throw new HttpError(406, "Email already used");
                }

                res.send();
            })
            .catch(next);
    }
);

router.post(
    ['/logout'],

    ACL('auth.logout'),

    // Controller
    (req, res, next) => {
        Session
            .kill(req.session)
            .then(() => {
                res.statusCode = 202;
                res.send();
            })
            .catch(next);
    }
);

module.exports = router;