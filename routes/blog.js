'use strict';
const router = require('express').Router();

const HttpError = require("helpers/HttpError");
const ACL = require('helpers/ACL');
const Blogs = require("models/Blogs");
const ObjectId = require("helpers/ObjectId");
const form = require('express-form2');
  var field   = form.field;

/**
 * Get list of posts
 */
router.get(
    ['/'],

    // Controller
    (req, res, next) => {
        Blogs
            .find()
            .then((blogs) => {
                if (blogs.length == 0) {
                    res.statusCode = 204;
                    res.send();
                    return;
                }

                res.send(blogs.map((e) => e.public));
            })
            .catch(next);
    }
);

/**
 * Create post
 */
router.post(
    ['/'],

    ACL('blog.create'),

    form(
        field('title')
            .trim()
            .required()
            .minLength(3)
            .maxLength(255),

        field('text')
            .trim()
            .required()
    ),

    // Controller
    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, "Invalid input data", req.form.errors));
        }

        let post = new Blogs({
            title: req.form.title,
            text: req.form.text,
        });

        post
            .save()
            .then((post) => {
                res.send(post.public);
            })
            .catch(next);
    }
);

/**
 * Get one post by Id
 */
router.get(
    ['/:postId'],

    // Controller
    (req, res, next) => {
        res.send(req.data.post.public);
    }
);

/**
 * Delete post by Id
 */
router.delete(
    ['/:postId'],

    ACL('blog.update'),

    // Controller
    (req, res, next) => {
        let id = req.data.post._id;

        Blogs
            .findByIdAndRemove(id)
            .then(() => {
                res.send();
            })
            .catch(next);
    }
);

/**
 * Update post by Id
 */
router.put(
    ['/:postId'],

    ACL('blog.update'),

    form(
        field('title')
            .trim()
            .required()
            .minLength(3)
            .maxLength(255),

        field('text')
            .trim()
            .required()
    ),

    // Controller
    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, "Invalid input data", req.form.errors));
        }

        let post = req.data.post;

        post.title = req.form.title;
        post.text = req.form.text;

        post
            .save()
            .then((post) => {
                res.send(post.public);
            })
            .catch(next);
    }
);

// Params
router.param('postId', (req, res, next, postId) => {
    if (!ObjectId.isValid(postId)) {
        return next(new HttpError(416, "Post id is not valid"));
    }

    Blogs
        .findById(postId)
        .then((post) => {
            if (!post) {
                return next(new HttpError(404, "Post not found"));
            }

            req.data = req.data || {};
            req.data.post = post;
            next();
        })
        .catch(next);
});

module.exports = router;