const Controller = require('egg').Controller;
class CardsController extends Controller {
  // 新建
  async create() {
    const { ctx } = this;
    const id = ctx.state.user.id;
    const data = await ctx.model.Users.findOne({ where: { id } })
    const mobile = data.mobile;
    const verify = await this.service.sms.verifyCode({ mobile, code: ctx.request.body.code })
    if (!verify) {
      ctx.body = this.ctx.resultErrorData('验证码有误，请重试');
      ctx.status = 404;
      return
    }
    try {
      /* 可能会抛出异常的代码块 */
      const { bankBranch, cardNumber, holderName,cardPhoto } = ctx.request.body
      await ctx.model.BankCards.create({
        userId: ctx.state.user.id,
        bankBranch, cardNumber, holderName,cardPhoto
      })
      ctx.body = this.ctx.resultData('创建成功');
      ctx.status = 200;
    } catch (error) {
      /* 处理异常的代码块 */
      ctx.body = this.ctx.resultErrorData('创建失败', error.message);
      ctx.status = 404;
    }
  }
  async getUserBind() {
    const { ctx } = this;
    try {
      /* 可能会抛出异常的代码块 */
      const list = await ctx.model.BankCards.findAll({
        where: {
          userId: ctx.state.user.id,
        },
      })
      ctx.body = this.ctx.resultData('ok', list);
      ctx.status = 200;
    } catch (error) {
      /* 处理异常的代码块 */
      ctx.body = this.ctx.resultErrorData('失败', error.message);
      ctx.status = 404;
    }
  }

  // 列表
  async index() {

  }
  // 获取
  async show() {

  }
  // 更新
  async update() {

  }
}
module.exports = CardsController;
