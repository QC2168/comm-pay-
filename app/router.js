/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;


  router.post('/users/loginByMobile', controller.users.loginByMobile)
  router.get('/users/balance', middleware.auth(), controller.users.getBalance)
  router.resources('users', '/users', controller.users);
  router.get('/getUserBindCards', middleware.auth(), controller.cards.getUserBind)
  router.resources('cards', '/cards', middleware.auth(), controller.cards);
  router.post('/file/upload', controller.file.upload);
  router.get('/withdrawals/getSelfRecord', middleware.auth(), controller.withdrawals.getSelfRecord);
  router.resources('withdrawals', '/withdrawals', middleware.auth(), controller.withdrawals);
  router.get('/sendCode', controller.users.sendCode)
  router.get('/sendOutCode', middleware.auth(), controller.users.sendOutCode)
  router.post('/admin/login', controller.admin.users.login)
  router.post('/updateTradePwd', middleware.auth(), controller.users.updateTradePwd)
  router.get('/checkTradePwd', middleware.auth(), controller.users.checkTradePwd)
};
