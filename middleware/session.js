const crypto = require('crypto');

const TOKEN_SECRET_KEY = 'taskflow_secure_session_token_key_2026';

function generateAuthToken(userId) {
  if (!userId) {
    throw new Error('User ID is required to generate authentication token.');
  }

  const payload = `${userId}:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', TOKEN_SECRET_KEY);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  const tokenBuffer = Buffer.from(`${payload}:${signature}`);
  return tokenBuffer.toString('base64');
}

function extractBearerToken(reqHeader) {
  if (!reqHeader || !reqHeader.authorization) {
    return null;
  }
  const parts = reqHeader.authorization.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}

function verifyAuthToken(tokenString, maxAgeMs = 86400000) {
  try {
    const decoded = Buffer.from(tokenString, 'base64').toString('utf8');
    const [userId, timestampStr, signature] = decoded.split(':');

    if (!userId || !timestampStr || !signature) {
      return { valid: false, reason: 'Malformed token structure' };
    }

    const payload = `${userId}:${timestampStr}`;
    const hmac = crypto.createHmac('sha256', TOKEN_SECRET_KEY);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false, reason: 'Invalid signature verification' };
    }

    const tokenTime = parseInt(timestampStr, 10);
    const now = Date.now();

    if (now - tokenTime > maxAgeMs) {
      return { valid: false, reason: 'Authentication token expired' };
    }

    return { valid: true, userId, timestamp: tokenTime };
  } catch (err) {
    return { valid: false, reason: 'Token parsing error' };
  }
}

module.exports = {
  generateAuthToken,
  extractBearerToken,
  verifyAuthToken
};
