const express = require('express');
const router = express.Router();

const taskController = require('./task.controller');
const taskValidator = require('./task.validator');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');

// Every task route requires an authenticated user
router.use(requireAuth);

router.post('/', validate(taskValidator.createRules), taskController.create);
router.get('/', validate(taskValidator.listRules), taskController.list);
router.get('/:id', validate(taskValidator.idRules), taskController.getById);
router.put('/:id', validate(taskValidator.updateRules), taskController.update);
router.patch('/:id/status', validate(taskValidator.statusRules), taskController.updateStatus);
router.delete('/:id', validate(taskValidator.idRules), taskController.delete);

module.exports = router;
