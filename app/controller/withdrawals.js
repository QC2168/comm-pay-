const Controller = require('egg').Controller;
class withdrawalsController extends Controller {
  async create() {
    const ctx = this.ctx;
    // check trade password
    const user = await ctx.model.Users.findOne({ where: { id: ctx.state.user.id } })
    if (!this.ctx.helper.checkPassword(ctx.request.body.tradePassword,user.tradePassword)) {
      ctx.body = this.ctx.resultErrorData('交易密码错误')
      ctx.status = 403
      return
    }
    if (user.balance < ctx.request.body.amount) {
      ctx.body = this.ctx.resultErrorData('余额不足')
      ctx.status = 403
      return
    }
    await ctx.model.Users.decrement({ balance: ctx.request.body.amount }, { where: { id: ctx.state.user.id } });
    await ctx.model.Withdrawals.create({
      userId: ctx.state.user.id,
      ...ctx.request.body,
    });
    ctx.body = this.ctx.resultData('ok');
    ctx.status = 200;
  }
  async getSelfRecord() {
    const { ctx } = this;
    const list = await ctx.model.Withdrawals.findAll({
      where: {
        userId: ctx.state.user.id,
      },
    })
    ctx.body = this.ctx.resultData('ok', list);
    ctx.status = 200;
  }

}
module.exports = withdrawalsController;
