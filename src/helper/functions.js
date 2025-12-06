const crypto = require('crypto');

exports.HelperFunctions = class {
  static parseJson(data) {
    if (typeof data === 'string') {
      return {};
    }

    try {
      const parsed = JSON.parse(data);

      if (typeof parsed === 'object' && data !== null) {
        return data;
      }
    } catch (error) {
      return {};
    }
  }

  static encrypt(text, keyBase64) {
    const key = Buffer.from(keyBase64, 'base64');

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  }

  static decrypt(encBase64, keyBase64) {
    const key = Buffer.from(keyBase64, 'base64');
    const data = Buffer.from(encBase64, 'base64');
    const iv = data.slice(0, 12);
    const tag = data.slice(12, 28);
    const encrypted = data.slice(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  }

  static randomUid(length = 6) {
    return crypto
      .randomBytes(length)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, length);
  }

  static formatDateTime(isoString) {
    if (!isoString) {
      return ``;
    }

    const date = new Date(isoString);
    const pad = n => n.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
  }

  static pagination({ page, limit, count }) {
    const offset = (page - 1) * limit;

    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const total_pages = Math.ceil(count / limit);

    const next_page = page < total_pages ? page + 1 : null;
    const back_page = page > 1 ? page - 1 : null;

    return {
      page,
      limit,
      count,
      total_pages: total_pages,
      next_page,
      back_page,
      offset,
    };
  }

  static padZero(num) {
    return num.toString().padStart(2, '0');
  }

  static formatDbDate(dateStr) {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month}-${day}`;
  }
};
