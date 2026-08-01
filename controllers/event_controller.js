const validator = require('../utils/validator');
const dateFormatter = require('../utils/date_formatter');
const cache = require('../utils/cache_manager');

let eventsData = [
  {
    id: 'evt-201',
    name: 'Global Tech Summit 2026',
    category: 'CONFERENCE',
    location: 'Convention Center, San Francisco',
    eventDate: '2026-09-10',
    capacity: 500,
    registeredCount: 340,
    description: 'Annual gathering of cloud developers and software architects.'
  },
  {
    id: 'evt-202',
    name: 'DevOps & AI Workshop',
    category: 'WORKSHOP',
    location: 'Tech Hub Room B, Austin',
    eventDate: '2026-08-20',
    capacity: 50,
    registeredCount: 48,
    description: 'Hands-on session building automated AI agent pipelines.'
  }
];

function listAllEvents(req, res) {
  const cachedList = cache.getCache('events_catalog');
  if (cachedList) {
    return res.json({ status: 'ok', source: 'cache', events: cachedList });
  }

  const category = req.query.category;
  let filtered = eventsData;

  if (category) {
    filtered = eventsData.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }

  const formattedEvents = filtered.map(evt => ({
    ...evt,
    seatsRemaining: evt.capacity - evt.registeredCount,
    isPast: dateFormatter.isOverdue(evt.eventDate),
    formattedDate: dateFormatter.formatDateISO(evt.eventDate)
  }));

  cache.setCache('events_catalog', formattedEvents, 45000);
  res.json({ status: 'ok', count: formattedEvents.length, events: formattedEvents });
}

function getEventById(req, res) {
  const eventId = req.params.id;
  const eventObj = eventsData.find(e => e.id === eventId);
  if (!eventObj) {
    return res.status(404).json({ status: 'error', message: 'Event record not found' });
  }
  res.json({ status: 'ok', event: eventObj });
}

function createEvent(req, res) {
  const { name, category, location, eventDate, capacity, description } = req.body;

  if (!validator.isValidString(name)) {
    return res.status(400).json({ status: 'error', message: 'Event name is required' });
  }

  const newEvent = {
    id: `evt-${Date.now()}`,
    name: validator.sanitizeInput(name),
    category: category || 'GENERAL',
    location: validator.sanitizeInput(location || 'Online'),
    eventDate: eventDate || new Date().toISOString(),
    capacity: parseInt(capacity, 10) || 100,
    registeredCount: 0,
    description: validator.sanitizeInput(description || '')
  };

  eventsData.push(newEvent);
  cache.deleteCache('events_catalog');

  res.status(201).json({ status: 'ok', message: 'Event published', event: newEvent });
}

function registerAttendee(req, res) {
  const eventId = req.params.id;
  const { attendeeEmail } = req.body;

  if (!validator.isValidEmail(attendeeEmail)) {
    return res.status(400).json({ status: 'error', message: 'Valid attendee email required' });
  }

  const eventObj = eventsData.find(e => e.id === eventId);
  if (!eventObj) {
    return res.status(404).json({ status: 'error', message: 'Event not found' });
  }

  if (eventObj.registeredCount >= eventObj.capacity) {
    return res.status(400).json({ status: 'error', message: 'Event has reached maximum capacity' });
  }

  eventObj.registeredCount += 1;
  cache.deleteCache('events_catalog');

  res.json({
    status: 'ok',
    message: 'Ticket confirmed!',
    ticketNumber: `TCK-${Math.floor(100000 + Math.random() * 900000)}`,
    eventId: eventObj.id
  });
}

module.exports = {
  listAllEvents,
  getEventById,
  createEvent,
  registerAttendee
};
