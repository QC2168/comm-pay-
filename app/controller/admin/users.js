// app/controller/users.js
const Controller = require('egg').Controller;
// const Ajv = require('ajv');
// const usersSchema = require('../../schema/definitions/users');
// const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
// const validateUsersSchema = ajv.compile(usersSchema);
const { Op } = require('sequelize');


const createRule = {
  username: 'string',
  password: 'string',
};

class UsersController extends Controller {

  async index() {
    const { ctx, service } = this;
    const createRule = {
      username: { type: 'string', required: false },
      mobile: { type: 'string', required: false },
      role: { type: 'string', required: false },
      page: { type: 'string', required: true, allowEmpty: false, format: /\d+/ },
      limit: { type: 'string', required: true, allowEmpty: false, format: /\d+/ },
    };
    // 校验参数
    ctx.validate(createRule, ctx.request.query);
    const { page, limit, ...rest } = ctx.request.query;
    // 获取结果
    const data = await service.users.pagingList({
      page,
      limit,
      filter: { ...rest },
    });
    const list = data.list;
    const meta = Object.keys(data)
      .filter(key => key !== 'list')
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    // 接口返回
    ctx.body = ctx.resultData('查询成功', list, meta);
  }

  async pushQuotas() {
    const { ctx } = this;
    const pushQuotasRule = {
      value: 'int',
    };
    // 校验参数
    ctx.validate(pushQuotasRule, ctx.request.body);
    const value = ctx.request.body.value;
    await ctx.service.quotas.increase({ total: value, userId: ctx.params.id })
    ctx.body = ctx.resultData('推送成功', null);
  }

  async login() {
    const ctx = this.ctx;
    const { username, password } = ctx.request.body;
    ctx.validate(createRule, ctx.request.body);
    const user = await ctx.service.users.checkUser({ username, password, role: 'admin' });
    if (user === 'forbidden') {
      ctx.body = this.ctx.resultErrorData('账号已被禁用', null);
      ctx.status = 404;
    } else if (user) {
      ctx.body = this.ctx.resultData('登录成功', {
        accessToken: this.ctx.helper.generateToken({ id: user.id, super: true }),
        info: user,
      });
      ctx.status = 200;
    } else {
      ctx.body = this.ctx.resultData('账号密码有误', null);
      ctx.status = 404;
    }
  }
}
module.exports = UsersController;
