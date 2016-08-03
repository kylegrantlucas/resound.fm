module.exports = {
  fullName: function (user) {
    return user.first_name + ' ' + user.last_name;
  },

  profileUrl: function (user) {
    return '/users/' + user.username;
  },

  likedUrl: function (user) {
    return '/users/' + user.username + '/liked';
  },

  followersUrl: function (user) {
    return '/users/' + user.username + '/followers';
  },

  followingUrl: function (user) {
    return '/users/' + user.username + '/following';
  },

  UsernameRegex: /\w[\w\.]*\w/,
  UserTagRegex: /@\w[\w\.]*\w/,
  UserUrlRegex: /\/users\/\w[\w\.]*\w/
};