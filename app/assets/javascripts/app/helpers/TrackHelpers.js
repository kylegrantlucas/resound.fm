module.exports = {

  isYoutube: function (track) {
    return track.provider === 'youtube' || track.provider === 'itunes';
  },

  isSoundcloud: function (track) {
    return track.provider === 'soundcloud';
  },

  sourceUrl: function (track) {
    if (this.isYoutube(track)) {
      return "https://www.youtube.com/watch?v=" + track.key;
    } else if (this.isSoundcloud(track)) {
      return "/api/soundcloud/" + track.key;
    } else {
      return "#";
    }
  },

  videoThumbnailUrl: function (video) {
    return "http://img.youtube.com/vi/" + video.key + "/default.jpg";
  }
};