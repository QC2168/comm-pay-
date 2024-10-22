module.exports = ({ router, controller }) => {
  router.resources('users', '/users', controller.users);
  router.resources('cards', '/cards', controller.cards);
  router.resources('withdrawals', '/withdrawals', controller.withdrawals);
};
