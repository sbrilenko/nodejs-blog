/**
 * Users Model.
 * Here is schema and functionality for api/users
 *
 * @module models/Users
 */
'use strict';

const config = require("config/default");
const mongoose = require("helpers/Mongoose");
const uniqueValidator = require('mongoose-unique-validator');
// This made to void extra coding for expressions handling
const HttpError = require("helpers/HttpError");

const ObjectId = mongoose.Schema.Types.ObjectId;


const modelName = "Users";

/**
 * Definition of Users Schema
 */
var usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
    },
    password: {
        type: String,
        required: true,
    },
    session: [
        {
            type: ObjectId,
        }
    ],
});

usersSchema.plugin(uniqueValidator, { message: '{PATH} "{VALUE}" already in use' });

/**
 * To get public data of Users instance
 *
 * @returns {Object}
 */
usersSchema.virtual('public').get(function() {
    var result = {
        email: this.email,
        id: this._id
    };

    return result;
});


usersSchema.statics.auth = function(email, password) {
    return new Promise((resolve, reject) => {
        this
            .findOne({
                email,
                password
            })
            .then(
                (user) => {
                    if (user) {
                        return resolve(user);
                    }

                    reject(new HttpError(403, "Wrong email or password"));
                },
                reject
            );
    });
};

usersSchema.methods.setSession = function() {
    return new Promise((resolve, reject) => {
        let token = mongoose.Types.ObjectId();
        this.session.push(token);

        this
            .save()
            .then(
                () => {
                    resolve(token);
                },
                reject
            );
    });
};

usersSchema.methods.getSession = function(token) {
    return new Promise((resolve, reject) => {
        let index = this.session.indexOf(token);

        if (index == -1) {
            reject("Tokes is invalid");
            return;
        }
        resolve(token);
    });
};

usersSchema.methods.removeSession = function(token) {
    return new Promise((resolve, reject) => {
        let index = this.session.indexOf(token);

        if (index == -1) {
            reject("Tokes is invalid");
        }

        this.session.splice(index, 1);

        this
            .save()
            .then(
                () => {
                    resolve();
                },
                reject
            );
        return;
    });
};

usersSchema.methods.cleanSession = function() {
    return new Promise((resolve, reject) => {
        this.session = [];

        this
            .save()
            .then(
                () => {
                    resolve();
                },
                reject
            );
    });
};

/**
 * Exporting service model of Users.
 *
 * @type {MongooseModel}
 */
var Users = mongoose.model(modelName, usersSchema);
module.exports = Users;
