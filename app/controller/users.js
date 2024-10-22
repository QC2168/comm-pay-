const Controller = require('egg').Controller;
class UsersController extends Controller {
  async loginByMobile() {
    const ctx = this.ctx;
    const { mobile, code } = ctx.request.body;
    const user = await ctx.service.users.checkUserByMobile({ mobile, code });
    if (user === 'forbidden') {
      ctx.body = this.ctx.resultErrorData('用户已被限制使用，无法登录', null);
      ctx.status = 404;
    } else if (user) {
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
}
module.exports = UsersController;
