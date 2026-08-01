class CacheManager {
  constructor(defaultDuration = 600000) {
    this.cacheMap = new Map();
    this.defaultDuration = defaultDuration;
  }

  setCache(cacheKey, entryValue, customTtl = null) {
    if (!cacheKey) return false;
    const expiryTimestamp = Date.now() + (customTtl || this.defaultDuration);
    this.cacheMap.set(cacheKey, {
      payload: entryValue,
      expiryTimestamp
    });
    return true;
  }

  getCache(cacheKey) {
    if (!this.cacheMap.has(cacheKey)) {
      return null;
    }

    const entry = this.cacheMap.get(cacheKey);
    if (Date.now() > entry.expiryTimestamp) {
      this.cacheMap.delete(cacheKey);
      return null;
    }

    return entry.payload;
  }

  deleteCache(cacheKey) {
    return this.cacheMap.delete(cacheKey);
  }

  purgeExpired() {
    const current = Date.now();
    let removed = 0;
    for (const [key, entry] of this.cacheMap.entries()) {
      if (current > entry.expiryTimestamp) {
        this.cacheMap.delete(key);
        removed++;
      }
    }
    return removed;
  }

  clear() {
    this.cacheMap.clear();
  }
}

module.exports = new CacheManager();
