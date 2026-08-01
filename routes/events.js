const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event_controller');

router.get('/', eventController.listAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.post('/:id/register', eventController.registerAttendee);

module.exports = router;
