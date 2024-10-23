const { Service } = require('egg');
class UsersService extends Service {
  async checkUser({ username
    , password, role = 'user' }) {
    const user = await this.ctx.model.Users.findOne({
      where: {
        username,
        role
      },
    });
    if (!user) {
      // 没有找到
      return null;
    }
    if (!user.active) {
      // 没有找到
      return 'forbidden';
    }
    // 验证是否和数据库一致
    if (this.ctx.helper.checkPassword(password, user.password)) {
      // 更新登录时间
      await this.ctx.model.Users.update(
        { lastLogin: new Date() },
        { where: { id: user.id } }
      );
      return {
        id: user.id,
        mobile: user.mobile,
        username: user.username,
        avatar: user.avatar,
      };
    }
    return null;

  }
  async checkUserByMobile({ mobile, code }) {
    const ctx = this.ctx;
    // 查找是否有这个手机号和验证码
    const verify = await ctx.service.sms.verifyCode({ mobile, code });
    if (!verify) {
      return null;
    }

    const [user] = await ctx.model.Users.findOrCreate({
      where: {
        mobile,
      },
      defaults: {
        mobile,
        username: `用户_${mobile.substring(7)}`,
        lastLogin: new Date(),
        role: 'user',
      },
    });
    // 更新登录时间
    await ctx.model.Users.update(
      { lastLogin: new Date() },
      { where: { id: user.id } }
    );

    return {
      id: user.id,
      mobile: user.mobile,
      username: user.username,
      avatar: user.avatar,
    };
  }
  // 管理员验证码登录
  async checkAdminUserByMobile(mobile) {
    const ctx = this.ctx;
    const user = await ctx.model.Users.findOne({
      where: {
        mobile,
        role: 'admin'
      }
    });
    if (!user) {
      return null
    }
    if (!user.active) {
      // 没有找到
      return 'forbidden';
    }

    return {
      id: user.id,
      mobile: user.mobile,
      username: user.username,
      avatar: user.avatar,
    };
  }

  async find(id) {
    const user = await this.ctx.model.Users.findByPk(id);
    return user;
  }

  async create(params) {
    // generate user and quotas records
    const t = await this.ctx.model.transaction();
    try {
      const source = params.password;
      params.password = this.ctx.helper.encryptPassword(source);
      const user = await this.ctx.model.Users.create({ ...params, lastLogin: new Date() }, { transaction: t });
      await this.ctx.model.UserWordQuotas.create({
        userId: user.id,
      }, { transaction: t });
      await t.commit();
      return user;
    } catch (error) {
      await t.rollback();
      this.ctx.logger.error('create user failed', params, Date.now());
    }

  }

  async update({ params, whereParams }) {
    const source = params.password ?? null;
    // maybe need to encrypt password
    if (source && source.length > 0) {
      params.password = this.ctx.helper.encryptPassword(source);
    } else {
      Reflect.deleteProperty(params, 'password');
    }

    return await this.ctx.model.Users.update(
      params,
      {
        where: whereParams,
      }
    );
  }

  async destroy(id) {
    return await this.ctx.model.Users.destroy(
      {
        where: {
          id,
        },
      }
    );
  }
  /**
   * @description 列表查询
   * @param {Object} query 查询条件
   * @return {Object} 结果
   * @memberof ProjectService
   */
  async pagingList(query) {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    const { limit, page, filter } = query;
    // 计算分页偏移量
    const offset = ctx.helper.calcPagingOffset(page, limit);

    // 处理条件约束

    const whereObj = Object.keys(filter).reduce((obj, key) => {
      obj[key] = { [Op.like]: `%${filter[key]}%` };
      return obj;
    }, {});
    // 定义要包含的模型和连接条件

    // 请求数据库
    const result = await ctx.model.Users.findAndCountAll({
      attributes: this.attributes,
      where: whereObj,
      limit: Number(limit) ? Number(limit) : null,
      offset: offset ? offset : null,
      include: {
        model: app.model.UserWordQuotas,
        attributes: ['total', 'used']
      },
      order: [
        ['createdAt', 'desc'],
      ],
    });
    // 格式化数据并返回
    return ctx.helper.formatPagingData({ page, limit, count: result.count, list: result.rows });
  }
  /**
   * @description 列表查询同时获取用户充值金额
   * @param {Object} query 查询条件
   * @return {Object} 结果
   * @memberof ProjectService
   */
  async pagingListByAmount(query) {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    const { limit, page, filter } = query;
    // 计算分页偏移量
    const offset = ctx.helper.calcPagingOffset(page, limit);

    // 处理条件约束
    const whereObj = Object.keys(filter).reduce((obj, key) => {
      obj[key] = { [Op.like]: `%${filter[key]}%` };
      return obj;
    }, {});

    // 请求数据库
    const result = await ctx.model.Users.findAndCountAll({
      where: whereObj,
      limit: Number(limit) ? Number(limit) : null,
      offset: offset ? offset : null,
      attributes: [
        'username',
        'mobile',
        'createdAt',
        'lastLogin',
      ],
      include: [{
        model: app.model.Payments,
        as: "payments",
        required: false,
        where: {
          paymentStatus: 1
        },
        attributes: ['totalAmount']
      }],
      order: [
        ['createdAt', 'desc'],
      ],
    });
    // 格式化数据并返回
    return ctx.helper.formatPagingData({ page, limit, count: result.count, list: result.rows });
  }

  // 检查用户登录权限
  async checkPermission(id) {
    try {
      const user = await this.ctx.model.Users.findByPk(id)
      if (!user || !user.active) {
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }
  // 检查用户管理员登录权限
  async checkSuperPermission(id) {
    try {
      const user = await this.ctx.model.Users.findByPk(id)
      if (!user || user.role !== 'admin') {
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }
}


module.exports = UsersService;
