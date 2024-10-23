const Controller = require('egg').Controller;
class UsersController extends Controller {
  async loginByMobile() {
    const ctx = this.ctx;
    const { mobile, code } = ctx.request.body;
    const user = await ctx.service.users.checkUserByMobile({ mobile, code });
    if (user) {
      ctx.body = this.ctx.resultData('登录成功', {
        accessToken: this.ctx.helper.generateToken({ id: user.id }),
        info: user,
      });
      ctx.status = 200;
    } else {
      ctx.body = this.ctx.resultErrorData('验证码有误，请重试');
      ctx.status = 404;
    }
  }
  async sendCode() {
    const ctx = this.ctx;
    const { mobile } = ctx.request.query;
    await ctx.service.sms.send(mobile);
    ctx.body = this.ctx.resultData('发送成功');
    ctx.status = 200;
  }
  async sendOutCode() {
    const ctx = this.ctx;
    const id = ctx.state.user.id;
    const data = await ctx.model.Users.findOne({ where: { id } })
    const mobile = data.mobile;
    await ctx.service.sms.send(mobile);
    ctx.body = this.ctx.resultData('发送成功');
    ctx.status = 200;
  }

  async getBalance() {
    const ctx = this.ctx;
    const id = ctx.state.user.id;
    const data = await ctx.model.Users.findOne({ where: { id } })
    const balance = data.balance;
    ctx.body = this.ctx.resultData('获取成功', { balance });
    ctx.status = 200;
  }

  async updateTradePwd() {
    const ctx = this.ctx;
    const id = ctx.state.user.id;
    const { tradePassword } = ctx.request.body;
    console.log(this.ctx.helper.encryptPassword(tradePassword));
    
    await ctx.model.Users.update({ tradePassword:this.ctx.helper.encryptPassword(tradePassword) }, { where: { id } })
    ctx.body = this.ctx.resultData('修改成功');
    ctx.status = 200;
  }
  async checkTradePwd() {
    const ctx = this.ctx;
    const id = ctx.state.user.id;
    const data = await ctx.model.Users.findOne({ where: { id } })
    ctx.body = this.ctx.resultData('ok', { isTo: Boolean(data.tradePassword) });
    ctx.status = 200;
  }
}
module.exports = UsersController;
