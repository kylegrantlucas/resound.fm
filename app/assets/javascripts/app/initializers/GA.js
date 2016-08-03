module.exports = function (curUser) {
  ga('create', window.GA_ID, { 'userId': curUser.id, 'cookieDomain': 'none'});
};