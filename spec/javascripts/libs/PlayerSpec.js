xdescribe("Player", function() {
  var PostQueue = require('app/collections/PostQueue');
  var PostQueueFixture = require('app/fixtures/PostQueue');
  var Post = require('app/models/Post');
  var Player = require('app/lib/Player');
  var player, postQueue;

  beforeEach(function () {
    player = new Player();
    postQueue = new PostQueue(PostQueueFixture);
  });

  it("should properly set it's defaults", function () {
    expect(player.pos).toEqual(0);
    expect(player.playing).toEqual(false);
    expect(player.queue).toEqual(null);
    expect(player.curPost).toEqual(null);
    expect(player.listened).toEqual(false);
    expect(player.savedCurPost).toEqual(null);
  });

  describe(".initQueue", function () {
    it("should set the queue", function() {
      player.initQueue(postQueue);
      expect(player.queue).toEqual(postQueue);
    });

    it("should set the curPost after initializing the queue", function() {
      player.initQueue(postQueue);
      expect(player.curPost).toEqual(postQueue.first());
    });

    it("curPost after initializing an empty queue", function() {
      player.initQueue(new PostQueue());
      expect(player.curPost).toEqual(null);
    });
  });

  describe(".setCurPost", function () {
    beforeEach(function () {
      player.initQueue(postQueue);
    });

    it("should not change the queue when passed a post from the current queue", function() {
      player.setCurPost(postQueue.at(1));
      expect(player.queue).toEqual(postQueue);
    });

    it("should change the queue when passed a post from another queue", function() {
      var newQueue = new PostQueue(PostQueueFixture);
      player.setCurPost(newQueue.at(0));
      expect(player.queue).toEqual(newQueue);
    });

    it("should should trigger change:queue if the queue changed", function() {
      var newQueue = new PostQueue(PostQueueFixture);

      player.on('change:queue', function (queue) {
        expect(queue).toEqual(newQueue);
      });

      player.setCurPost(newQueue.at(0));
    });

    it("should reset the position of the player to 0", function() {
      player.setCurPost(postQueue.at(1));
      expect(player.pos).toEqual(0);
    });

    it("should reset the listened state of the player to false", function() {
      player.setCurPost(postQueue.at(1));
      expect(player.listened).toEqual(false);
    });

    it("should trigger change:curPost", function() {
      player.on('change:curPost', function (post) {
        expect(post).toEqual(postQueue.at(1));
      });

      player.setCurPost(postQueue.at(1));
    });
  });

  describe(".setQueue", function () {
    var newQueue;

    beforeEach(function () {
      newQueue = new PostQueue(PostQueueFixture);
      player.initQueue(postQueue);
    });

    it("should change the queue", function() {
      player.setQueue(newQueue);
      expect(player.queue).toEqual(newQueue);
    });

    it("should should trigger change:queue", function() {

      player.on('change:queue', function (queue) {
        expect(queue).toEqual(newQueue);
      });

      player.setQueue(newQueue);
    });
  });

  describe(".setPreview", function () {
    var newQueue;

    beforeEach(function () {
      player.setCurPost(postQueue.at(1));
      newQueue = new PostQueue(PostQueueFixture);
      player.clearPreview();
    });

    it("should set savedCurPost to the former curPost", function () {
      player.setPreview(newQueue.at(0));
      expect(player.savedCurPost).toEqual(postQueue.at(1));
    });

    it("should set curPost to the passed post to preview", function () {
      player.setPreview(newQueue.at(0));
      expect(player.curPost).toEqual(newQueue.at(0));
    });

    it("should trigger change:curPost", function() {
      player.on('change:curPost', function (post) {
        expect(post).toEqual(newQueue.at(0));
      });

      player.setPreview(newQueue.at(0));
    });

  });

  describe(".clearPreview", function () {
    var newQueue;

    beforeEach(function () {
      player.setCurPost(postQueue.at(1));
      newQueue = new PostQueue(PostQueueFixture);
      player.setPreview(newQueue.at(0));
    });

    it("should set playing to false", function () {
      player.clearPreview();
      expect(player.playing).toEqual(false);
    });

    it("should set savedCurPost to null", function () {
      player.clearPreview();
      expect(player.savedCurPost).toEqual(null);
    });

    it("should call setCurPost with the savedCurPost", function () {
      spyOn(player, 'setCurPost');
      player.clearPreview();

      expect(player.setCurPost).toHaveBeenCalledWith(postQueue.at(1));
    });
  });

  describe(".isPlaying", function () {
    beforeEach(function () {
      player.playing = false;
    });

    it("should return the player's playing state if no post is supplied", function () {
      expect(player.isPlaying()).toEqual(player.playing);
      player.playing = true;
      expect(player.isPlaying()).toEqual(player.playing);
    });

    it("should return true if the provided song is the current song and is playing", function () {
      player.playing = true;
      player.setCurPost(postQueue.at(1));

      expect(player.isPlaying(postQueue.at(1))).toEqual(true);
    });

    it("should return false if the provided song isn't the current song", function () {
      player.playing = true;
      player.setCurPost(postQueue.at(1));

      expect(player.isPlaying(postQueue.at(2))).toEqual(false);
    });

    it("should return false if the provided song is the current song but isn't playing", function () {
      player.playing = false;
      player.setCurPost(postQueue.at(1));

      expect(player.isPlaying(postQueue.at(1))).toEqual(false);
    });

  });

  describe(".isCurPost", function () {

    it("should return false if no post is provided", function () {
      player.setCurPost(postQueue.at(1));
      expect(player.isCurPost()).toEqual(false);
    });

    it("should return false if there is no curPost set", function () {
      expect(player.isCurPost(postQueue.at(1))).toEqual(false);
    });

    it("should return false if the post is the curPost but isn't from the same page or from a preview", function () {
      var newQueue = new PostQueue(PostQueueFixture);

      postQueue.page = '/foo';
      newQueue.page = '/bar';

      player.setCurPost(postQueue.at(1));

      expect(player.isCurPost(newQueue.at(1))).toEqual(false);
    });

    it("should return true if the post is the curPost and from the same page", function () {
      var newQueue = new PostQueue(PostQueueFixture);

      postQueue.page = '/foo';
      newQueue.page = '/foo';

      player.setCurPost(postQueue.at(1));

      expect(player.isCurPost(newQueue.at(1))).toEqual(true);
    });

    it("should return true if the post is the curPost and is a preview", function () {
      var newQueue = new PostQueue(PostQueueFixture);

      postQueue.page = '/foo';
      newQueue.page = '/bar';

      player.setCurPost(postQueue.at(1));
      player.setPreview(newQueue.at(0));

      expect(player.isCurPost(newQueue.at(0))).toEqual(true);
    });

  });

  describe(".isPreview", function () {
    beforeEach(function () {
      player.setCurPost(postQueue.at(1));
    });

    it("should return true if the post is the curPost and is a preview", function () {
      var newQueue = new PostQueue(PostQueueFixture);
      player.setPreview(newQueue.at(0));

      expect(player.isPreview(newQueue.at(0))).toEqual(true);
    });

    it("should return false if the post is the curPost and isn't a preview", function () {
      expect(player.isPreview(postQueue.at(1))).toEqual(false);
    });

    it("should return true if the curPost is a preview and no params are passed", function () {
      var newQueue = new PostQueue(PostQueueFixture);
      player.setPreview(newQueue.at(0));

      expect(player.isPreview()).toEqual(true);
    });

    it("should return false if there is no curPost", function () {
      expect(player.isPreview()).toEqual(false);
    });
  });

  describe(".play", function () {
    it("should should stop the current track, set a new preview track, and play it if passed a post and a true isPreview value", function () {
      var newQueue = new PostQueue(PostQueueFixture);

      var oldPost = postQueue.at(1);
      var oldTrack = oldPost.get('track');
      spyOn(oldTrack, 'stop');
      player.setCurPost(oldPost);

      var newPost = newQueue.at(2);
      var newTrack = newPost.get('track');
      spyOn(newTrack, 'play');

      player.play(newPost, true);

      expect(player.curPost).toEqual(newPost);
      expect(oldTrack.stop).toHaveBeenCalled();
      expect(newTrack.play).toHaveBeenCalled();
      expect(player.isPreview()).toEqual(true);
    });

    it("should set and play the provided track if there is no current post", function () {
      expect(player.curPost).toBeNull();

      var post = postQueue.at(2);
      var track = post.get('track');
      spyOn(track, 'stop');
      spyOn(track, 'play');

      player.play(post);

      expect(player.curPost).toEqual(post);
      expect(track.stop).not.toHaveBeenCalled();
      expect(track.play).toHaveBeenCalled();
    });

    it("should stop the current track, set and play the provided track if it is not the current post", function () {
      var newQueue = new PostQueue(PostQueueFixture);

      var oldPost = postQueue.at(1);
      var oldTrack = oldPost.get('track');
      spyOn(oldTrack, 'stop');
      player.setCurPost(oldPost);

      var newPost = newQueue.at(2);
      var newTrack = newPost.get('track');
      spyOn(newTrack, 'play');

      player.play(newPost);

      expect(player.curPost).toEqual(newPost);
      expect(oldTrack.stop).toHaveBeenCalled();
      expect(newTrack.play).toHaveBeenCalled();
    });

    it("should play curPost if nothing is playing", function () {
      var post = postQueue.at(1);
      var track = post.get('track');
      spyOn(track, 'stop');
      spyOn(track, 'play');

      player.setCurPost(post);
      player.play(post);

      expect(player.curPost).toEqual(post);
      expect(track.stop).not.toHaveBeenCalled();
      expect(track.play).toHaveBeenCalled();
    });
  });

  describe(".resume", function () {

    it("should clear the preview and play the originally selected post", function () {
      var newQueue = new PostQueue(PostQueueFixture);

      var oldPost = postQueue.at(1);
      var oldTrack = oldPost.get('track');
      spyOn(oldTrack, 'stop');
      player.setCurPost(oldPost);

      var newPost = newQueue.at(2);
      var newTrack = newPost.get('track');
      spyOn(newTrack, 'play');

      spyOn(player, 'clearPreview');


      player.setPreview(newQueue.first());
      player.resume();

      expect(track.play).toHaveBeenCalled();

    });


  });

});
