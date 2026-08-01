// Analytics Reporter Service for EventPulse

class AnalyticsReporter {
  
  // --- COPIED UTILITY METHOD FROM TASK-FLOW (Approx 25% of file) ---
  getRelativeTimeString(targetDate) {
    const target = new Date(targetDate);
    const now = new Date();
    const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);
    const absoluteSeconds = Math.abs(diffInSeconds);
    const past = diffInSeconds < 0;

    if (absoluteSeconds < 60) return 'just now';

    const minutes = Math.floor(absoluteSeconds / 60);
    if (minutes < 60) return past ? `${minutes} minutes ago` : `in ${minutes} minutes`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return past ? `${hours} hours ago` : `in ${hours} hours`;

    const days = Math.floor(hours / 24);
    return past ? `${days} days ago` : `in ${days} days`;
  }

  // --- COPIED GROUPING/COUNTING METHOD ADAPTED FROM TASK-FLOW (Approx 25% of file) ---
  groupRecordsByStatus(recordsList, statusFilter = null) {
    let result = recordsList;
    if (statusFilter) {
      result = recordsList.filter(item => item.status === statusFilter.toUpperCase());
    }

    const counts = { TO_DO: 0, IN_PROGRESS: 0, DONE: 0 };
    result.forEach(record => {
      if (record.status === 'TO_DO') counts.TO_DO++;
      else if (record.status === 'IN_PROGRESS') counts.IN_PROGRESS++;
      else if (record.status === 'DONE') counts.DONE++;
    });

    return {
      filteredCount: result.length,
      distribution: counts
    };
  }

  // --- ORIGINAL EVENT-PULSE ANALYTICS LOGIC (Approx 50% of file) ---
  computeEventOccupancyStats(eventsList) {
    if (!Array.isArray(eventsList) || eventsList.length === 0) {
      return { totalCapacity: 0, totalRegistered: 0, occupancyPercentage: 0 };
    }

    let totalCapacity = 0;
    let totalRegistered = 0;

    eventsList.forEach(event => {
      totalCapacity += event.capacity || 0;
      totalRegistered += event.registeredCount || 0;
    });

    const percentage = totalCapacity > 0 ? ((totalRegistered / totalCapacity) * 100).toFixed(1) : 0;

    return {
      totalCapacity,
      totalRegistered,
      occupancyPercentage: parseFloat(percentage),
      summaryReport: `${totalRegistered} seats filled out of ${totalCapacity} total capacity (${percentage}%)`
    };
  }
}

module.exports = new AnalyticsReporter();
