// app/service/sms.js
const Service = require('egg').Service;
class SMSService extends Service {
  async send(mobile, code = null) {
    const hasCache = await this.ctx.service.fileCache.get(mobile);
    if (hasCache) {
      throw new Error('验证码发送频繁，请稍后重试');
    }
    if (code === null) {
      code = this.ctx.helper.randomInteger(100000, 999999);
    }
    try {
  // 发送验证码
    } catch (error) {
      this.ctx.logger.error(error, Date.now())
      throw new Error('验证码发送失败，请稍后重试');
    }
    // 写入缓存，15分钟
    await this.ctx.service.fileCache.set(mobile, code, 60 * 15);
    return true
  }
  async verifyCode({ mobile, code }) {
    const hasCache = await this.ctx.service.fileCache.get(mobile);
    if (!hasCache) {
      return false
    }
    if (Number(code) === hasCache) {
      await this.ctx.service.fileCache.remove(mobile);
      return true
    }

    return false
  }
}

module.exports = SMSService;
