document.addEventListener('DOMContentLoaded', () => {
  loadEventsCatalog();
});

async function loadEventsCatalog() {
  try {
    const res = await fetch('/api/events');
    const data = await res.json();
    if (data.status === 'ok') {
      renderEventsGrid(data.events);
    }
  } catch (err) {
    console.error('Error fetching event listings:', err);
  }
}

function renderEventsGrid(events) {
  const container = document.getElementById('events-grid');
  container.innerHTML = '';

  events.forEach(evt => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <div>
        <span class="event-category-tag">${evt.category}</span>
        <h3 class="event-name">${escapeText(evt.name)}</h3>
        <p class="event-location">📍 ${escapeText(evt.location)}</p>
        <p style="font-size:0.9rem; color:#8b949e;">${escapeText(evt.description)}</p>
      </div>
      <div class="event-footer">
        <span class="seats-count">${evt.seatsRemaining} seats open</span>
        <button class="btn-ticket" onclick="bookTicket('${evt.id}')">Get Ticket</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function bookTicket(eventId) {
  const email = prompt('Enter your email address to register:');
  if (!email) return;

  try {
    const res = await fetch(`/api/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendeeEmail: email })
    });
    const json = await res.json();
    if (json.status === 'ok') {
      alert(`Registration Successful! Ticket Number: ${json.ticketNumber}`);
      loadEventsCatalog();
    } else {
      alert(`Registration Failed: ${json.message}`);
    }
  } catch (err) {
    alert('Failed to register for event');
  }
}

function escapeText(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
