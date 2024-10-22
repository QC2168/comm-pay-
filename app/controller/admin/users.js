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
const loginByMobileRule = {
  mobile: 'string',
  code: 'string',
};


class UsersController extends Controller {
  // 获取所有用户
  /**
 * #swagger-api
 *
 * @function index
 * @description #tags SuperUser
 * @description #parameters data query schema.adminUsersList true - data parameter
 * @description #responses 200 schema.usersResponseType - users model
 * @summary 获取全部用户列表
 */
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
  // 创建用户
  /**
* #swagger-api
*
* @function create
* @description #tags SuperUser
* @description #parameters data body schema.users true - data parameter
* @description #responses 200 schema.usersResponseType - users model
* @summary 创建用户
*/
  async create() {
    const { ctx } = this;
    // const valid = validateUsersSchema(ctx.request.body);
    // if (!valid) {
    //   ctx.body = ctx.resultErrorData('invalid parameter', validateUsersSchema.errors);
    //   ctx.state = 422;
    // }
    const { avatar, mobile, username } = ctx.request.body
    // empty id and avatar
    Reflect.deleteProperty(ctx.request.body, 'id');
    if (avatar.length === 0) {
      Reflect.deleteProperty(ctx.request.body, 'avatar');
    }
    // maybe same mobile or username
    const hasUsername = await this.ctx.model.Users.findOne({
      where: {
        username,
      }
    });
    if (hasUsername) {
      ctx.body = ctx.resultErrorData('创建失败，存在同名用户');
      ctx.status = 404
      return
    }
    const hasMobile = await this.ctx.model.Users.findOne({
      where: {
        mobile: {
          [Op.ne]: null,
          [Op.not]: '',
          [Op.eq]: mobile,
        }
      }
    });
    if (hasMobile) {
      ctx.body = ctx.resultErrorData('创建失败，存在同手机号码用户');
      ctx.status = 404
      return
    }
    await ctx.service.users.create(ctx.request.body);
    ctx.body = ctx.resultData('创建成功', ctx.request.body);
  }
  // 修改用户
  /**
* #swagger-api
*
* @function update
* @description #tags SuperUser
* @description #parameters data body schema.users true - data parameter
* @description #responses 200 schema.usersResponseType - users model
* @summary 修改用户
*/
  async update() {
    const { ctx } = this;
    // const valid = validateUsersSchema(ctx.request.body);
    // if (!valid) {
    //   ctx.body = ctx.resultErrorData('invalid parameter', validateUsersSchema.errors);
    //   ctx.state = 422;
    // }
    const id = ctx.params.id
    const { username, mobile } = ctx.request.body
    // maybe same mobile or username
    const hasUsername = await this.ctx.model.Users.findOne({
      where: {
        username,
        id: {
          [Op.ne]: id,
        }
      }
    });
    if (hasUsername) {
      ctx.body = ctx.resultErrorData('更新失败，存在同名用户');
      ctx.status = 404
      return
    }
    const hasMobile = await this.ctx.model.Users.findOne({
      where: {
        mobile: {
          [Op.ne]: null,
          [Op.not]: '',
          [Op.eq]: mobile,
        },
        id: {
          [Op.ne]: id,
        }
      }
    });
    if (hasMobile) {
      ctx.body = ctx.resultErrorData('更新失败，存在同手机号码用户');
      ctx.status = 404
      return
    }
    const user = await ctx.service.users.update({ params: ctx.request.body, whereParams: { id } });
    ctx.body = ctx.resultData('更新成功', user);
  }
  // 删除用户
  /**
  * #swagger-api
  * @function destroy
  * @description #tags SuperUser
  * @description #responses 200 null - null
  * @summary 删除用户
  */
  async destroy() {
    const { ctx } = this;
    const user = await ctx.service.user.destroy(ctx.params.id);
    ctx.body = ctx.resultData('删除成功', user);
  }

  // 推送字数
  /**
 * #swagger-api
 * @function pushQuotas
 * @description #tags SuperUser
 * @description #parameters data body schema.pushQuotasType true - data parameter
 * @description #responses 200 null - null
 * @summary 推送字数
 */
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
  // 用户状态
  /**
 * #swagger-api
 * @function active
 * @description #tags SuperUser
 * @description #parameters data body schema.pushQuotasType true - data parameter
 * @description #responses 200 null - null
 * @summary 修改登录状态
 */
  async active() {
    const { ctx } = this;
    const userId = ctx.params.id; // 确保从正确的来源获取 userId
    const user = await ctx.model.Users.findOne({ where: { id: userId } });

    if (user) {
      // 取反 active 字段的值
      const newActiveValue = !user.active;
      await ctx.model.Users.update(
        { active: newActiveValue },
        { where: { id: userId } }
      );
      ctx.body = ctx.resultData('状态更新成功', null);
    } else {
      // 如果没有找到用户，返回错误或相应的消息
      ctx.status = 404;
      ctx.body = ctx.resultData('用户未找到', null);
    }
  }

  /**
   * #swagger-api
   *
   * @function login
   * @description #tags SuperUser
   * @description #parameters data body schema.loginType true - data parameter
   * @description #responses 200 schema.loginResponseType - users model
   * @summary 管理员账号密码登录
   */
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

  /**
  * #swagger-api
  *
  * @function loginByMobile
  * @description #tags SuperUser
  * @description #parameters data body schema.loginByMobileType true - data parameter
  * @description #responses 200 schema.loginResponseType - users model
  * @summary 管理员手机验证码登录
  */
  async loginByMobile() {
    const ctx = this.ctx;
    const { mobile, code } = ctx.request.body;
    ctx.validate(loginByMobileRule, ctx.request.body);

    // 查找是否有这个手机号和验证码
    const verify = await ctx.service.sms.verifyCode({ mobile, code });
    if (!verify) {
      ctx.body = this.ctx.resultErrorData('验证码有误，请重试');
      ctx.status = 404;
      return
    }

    const user = await ctx.service.users.checkAdminUserByMobile(mobile);
    if (user === 'forbidden') {
      ctx.body = this.ctx.resultErrorData('用户已被限制使用，无法登录', null);
      ctx.status = 404;
    } else if (user) {
      // 查询配额
      const quotas = await ctx.service.quotas.obtainQuotas(user.id);

      ctx.body = this.ctx.resultData('登录成功', {
        accessToken: this.ctx.helper.generateToken({ id: user.id, super: true }),
        info: user,
        quotas: {
          total: quotas.total,
          used: quotas.used
        }
      });
      ctx.status = 200;
    } else {
      ctx.body = this.ctx.resultErrorData('用户不存在');
      ctx.status = 404;
    }
  }
}
module.exports = UsersController;
