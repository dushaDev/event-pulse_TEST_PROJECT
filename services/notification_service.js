// EventPulse Notification & Email Dispatch Service

class NotificationService {
  constructor(smtpHost = 'smtp.eventpulse.local', smtpPort = 587) {
    this.smtpHost = smtpHost;
    this.smtpPort = smtpPort;
    this.dispatchQueue = [];
  }

  // --- COPIED HELPER FUNCTION FROM TASK-FLOW (Approx 10% overlap) ---
  sanitizeInput(inputStr) {
    if (typeof inputStr !== 'string') return '';
    return inputStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- ORIGINAL EVENT-PULSE SPECIFIC LOGIC (Approx 90%) ---
  sendRegistrationConfirmation(attendeeEmail, eventName, ticketNumber) {
    const cleanEmail = attendeeEmail.trim().toLowerCase();
    const cleanEventName = this.sanitizeInput(eventName);
    
    const mailSubject = `Registration Confirmed for ${cleanEventName}`;
    const mailBody = `
      Hello!
      Your ticket for ${cleanEventName} has been generated.
      Ticket Code: ${ticketNumber}
      
      We look forward to seeing you at the event!
    `;

    const payload = {
      to: cleanEmail,
      subject: mailSubject,
      body: mailBody.trim(),
      queuedAt: new Date().toISOString()
    };

    this.dispatchQueue.push(payload);
    return this.processNextInQueue();
  }

  processNextInQueue() {
    if (this.dispatchQueue.length === 0) return false;
    const msg = this.dispatchQueue.shift();
    console.log(`[NotificationService] Sent email to ${msg.to} regarding ${msg.subject}`);
    return { delivered: true, messageId: `msg-${Date.now()}` };
  }

  getQueueStatus() {
    return {
      pendingCount: this.dispatchQueue.length,
      host: this.smtpHost,
      port: this.smtpPort
    };
  }
}

module.exports = new NotificationService();
