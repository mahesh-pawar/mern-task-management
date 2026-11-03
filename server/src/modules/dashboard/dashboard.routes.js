const express = require('express');
const router = express.Router();

const dashboardController = require('./dashboard.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

router.get('/stats', requireAuth, dashboardController.getStats);

module.exports = router;
