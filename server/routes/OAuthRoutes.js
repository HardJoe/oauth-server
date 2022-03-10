const express = require('express');

const { verifyProject } = require('../middlewares/projectMiddleware');
const {
  verifyAccessToken,
  verifyUser,
} = require('../middlewares/authenticate');

const {
  generateToken,
  getResource,
} = require('../controllers/oAuthController');

const router = express.Router();

router.route('/token').post([verifyUser, verifyProject], generateToken);

router.route('/resource').post(verifyAccessToken, getResource);

module.exports = router;
