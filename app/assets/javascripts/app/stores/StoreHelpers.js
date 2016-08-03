module.exports = {
  mergeCollections: function (c1, c2, key){
    // Add the two arrays together and remove th
    key = key || 'id';
    return _.uniq(_.union(c1, c2), key);
  },

  Pages: {

    post: {
      appUrl: function (o) {
        return '/posts/' + o.postId;
      },
      url: function (o) {
        return '/api/posts/' + o.postId;
      }
    },

    feed: {
      appUrl: function (o) {
        return '/feed'
      },
      url: function (o) {
        return '/api/posts/feed';
      },
      comparator: function (p) {
        return -new Date(p.created_at).getTime();
      }
    },

    explore: {
      appUrl: function (o) {
        return '/explore'
      },
      url: function (o) {
        return '/api/posts';
      },
      comparator: function (p) {
        return -new Date(p.created_at).getTime();
      }
    },

    trending: {
      appUrl: function (o) {
        return '/trending'
      },
      url: function (o) {
        return '/api/posts/trending';
      },
      comparator: function (p) {
        return -p.score;
      }
    },

    userliked: {
      appUrl: function (o) {
        return '/users/' + o.userId + '/liked';
      },
      url: function (o) {
        return '/api/users/' + o.userId + '/posts/liked';
      },
      comparator: function (p) {
        return -new Date(p.favorited_at).getTime();
      }
    },

    liked: {
      appUrl: function (o) {
        return '/liked'
      },
      url: function (o) {
        return '/api/users/' + o.userId + '/posts/liked';
      },
      comparator: function (p) {
        return -new Date(p.favorited_at).getTime();
      }
    },

    tag: {
      appUrl: function (o) {
        return '/tags/' + o.tag;
      },
      url: function (o) {
        return '/api/tags/' + o.tag;
      },
      comparator: function (p) {
        return -new Date(p.created_at).getTime();
      }
    },

    userposts: {
      appUrl: function (o) {
        return '/users/' + o.userId;
      },
      url: function (o) {
        return '/api/users/' + o.userId + '/posts';
      },
      comparator: function (p) {
        return -new Date(p.created_at).getTime();
      }
    }
  }
}