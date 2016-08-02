/**
 * Blogs Model.
 * Here is schema and functionality for api/blog
 *
 * @module models/Users
 */
'use strict';

const config = require("config/default");
const mongoose = require("helpers/Mongoose");
// This made to void extra coding for expressions handling
const HttpError = require("helpers/HttpError");

const ObjectId = mongoose.Schema.Types.ObjectId;


const modelName = "Blogs";

/**
 * Definition of Users Schema
 */
var blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

blogsSchema.virtual('public').get(function() {
    var result = {
        id: this._id,
        title: this.title,
        text: this.text,
        created: +this.created,
    };

    return result;
})

/**
 * Exporting service model of Users.
 *
 * @type {MongooseModel}
 */
var Blogs = mongoose.model(modelName, blogsSchema);
module.exports = Blogs;
