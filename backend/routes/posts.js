const express = require('express');


const extractFile = require('../middleware/load-image');
const checkAuth = require('../middleware/check-auth');

const postsController = require('../controllers/posts');
const router = express.Router();
/**These routes are resful api's that use the express middleware to connect to the DB we also create our
 * own middelware.
 *
 * extractFile: that allows the application to upload images and save them to the images folder
 * in the backend in the DB only the imagePath is stored.
 *
 * checkAuth: is an auto check to see if the user logged in to access authorized routes.
 */

router.post("", checkAuth, extractFile, postsController.createPost);

router.put("/:id", checkAuth, extractFile, postsController.editPost);

router.get('', postsController.getAllPosts);

router.get("/:id", postsController.getPostById);

router.delete("/:id", checkAuth, postsController.deletePost);

module.exports = router;
