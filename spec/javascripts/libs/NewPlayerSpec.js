describe("Player", function() {
  var Player = require("app/lib/Player");
  var Post = require("app/models/Post");
  var PostQueue = require("app/collections/PostQueue");
  var PostQueueFixture = require('app/fixtures/PostQueue');

  describe("Constructor", function () {

    it("should initialize default values without a queue", function () {
      var player = new Player();

      expect(player.pos).toEqual(0);
      expect(player.queue).toBeNull();
      expect(player.playing).toEqual(false);
      expect(player.curPost).toBeNull();
    });

    it("should initialize with an empty queue", function () {
      var queue = new PostQueue();
      var player = new Player(queue);

      expect(player.pos).toEqual(0);
      expect(player.queue).toEqual(queue);
      expect(player.playing).toEqual(false);
      expect(player.curPost).toBeNull();
    });

    it("should initialize with a queue with posts and set curPost to the first post in the queue", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      expect(player.pos).toEqual(0);
      expect(player.queue).toEqual(queue);
      expect(player.playing).toEqual(false);
      expect(player.curPost).toEqual(queue.first());
    });

  });

  describe(".setQueue", function () {

    it("should set the queue in the empty player to the provided queue", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player();

      player.setQueue(queue);

      expect(player.queue).toEqual(queue);
    });

  });

  describe(".initQueue", function () {

    it("should set the queue if there is no queue currently set", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player();

      player.initQueue(queue);

      expect(player.queue).toEqual(queue);
    });

    it("shouldn't set the queue if there is a queue currently set", function () {
      var firstQueue = new PostQueue(PostQueueFixture);
      var secondQueue = new PostQueue(PostQueueFixture);
      var player = new Player(firstQueue);

      player.initQueue(secondQueue);

      expect(player.queue).toEqual(firstQueue);
    });

  });

  describe(".isCurPost", function () {

    it("should return false if the post id's are different", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);
      var notTheCurPost = queue.at(2);

      expect(player.isCurPost(notTheCurPost)).toEqual(false);
    });

    it("should return false if the posts are from different pages", function () {
      var firstQueue = new PostQueue(PostQueueFixture, {page: "pageA"});
      var secondQueue = new PostQueue(PostQueueFixture, {page: "pageB"});
      var player = new Player(firstQueue);

      expect(player.isCurPost(secondQueue.first())).toEqual(false);
    });

    it("should return true if the post id's are the same and the posts from the same page", function () {
      var firstQueue = new PostQueue(PostQueueFixture, {page: "pageA"});
      var secondQueue = new PostQueue(PostQueueFixture, {page: "pageA"});
      var player = new Player(firstQueue);

      expect(player.isCurPost(secondQueue.first())).toEqual(true);
    });

  });

  describe(".isPlaying", function () {

    it("should return false if the post isn't the current post and the player is playing", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);
      var notTheCurPost = queue.at(2);

      player.playing = true;

      expect(player.isPlaying(notTheCurPost)).toEqual(false);
    });

    it("should return false if the post is the current post and the player isn't playing", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.playing = false;

      expect(player.isPlaying(queue.first())).toEqual(false);
    });

    it("should return true if the post is the current post and the player is playing", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.playing = true;

      expect(player.isPlaying(queue.first())).toEqual(true);
    });

    it("should return the current player playing state if no post is provided", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.playing = true;

      expect(player.isPlaying()).toEqual(true);
    });

  });

  describe(".isLoading", function () {

    it("should work", function () {
      pending();
    });

  });

  describe(".play", function () {

    it("should trigger change:playing on the player", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.on('change:playing', function (playing) {
        expect(playing).toEqual(true);
      });

      player.play();
    });

    it("should set playing to true", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.play();

      expect(player.playing).toEqual(true);
    });

    it("should call setCurPost if passed a post", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      spyOn(player, "setCurPost");

      player.play(queue.at(2));

      expect(player.setCurPost).toHaveBeenCalledWith(queue.at(2));
    });

  });

  describe(".pause", function () {

    it("should trigger change:playing on the player", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.playing = true;

      player.on('change:playing', function (playing) {
        expect(playing).toEqual(false);
      });

      player.pause();
    });

    it("should set playing to false", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.playing = true;

      player.pause();

      expect(player.playing).toEqual(false);
    });

  });

  describe(".seek", function () {

    it("should trigger change:pos with the provided pos", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.on('change:playing', function (pos) {
        expect(pos).toEqual(10);
      });

      player.seek(10);
    });

    it("should set the pos to the provided pos", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.seek(10);

      expect(player.pos).toEqual(10);
    });

  });

  describe(".prev", function () {

    it("should do nothing when there is no previous song", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.prev();

      expect(player.curPost).toEqual(queue.first());
    });

    it("should go to the previous song when there is one", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.curPost = queue.at(1);

      player.prev();

      expect(player.curPost).toEqual(queue.first());
    });

    it("should trigger a change:curPost event if the post changed", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.curPost = queue.at(1) ;

      player.on('change:curPost', function (post) {
        expect(post).toEqual(queue.first());
      });

      player.prev();
    });

    it("should call setCurPost if the post changed", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);
      player.curPost = queue.at(1);

      spyOn(player, "setCurPost");

      player.prev();

      expect(player.setCurPost).toHaveBeenCalledWith(queue.first());
    });

  });

  describe(".next", function () {

    it("should do nothing when there is no next song", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);
      player.curPost = queue.last();

      player.next();

      expect(player.curPost).toEqual(queue.first());
    });

    it("should go to the previous song when there is one", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.curPost = queue.at(queue.size() - 2);

      player.next();

      expect(player.curPost).toEqual(queue.last());
    });

    it("should trigger a change:curPost event if the post changed", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);

      player.curPost = queue.at(1) ;

      player.on('change:curPost', function (post) {
        expect(post).toEqual(queue.first());
      });

      player.prev();
    });

    it("should call setCurPost if the post changed", function () {
      var queue = new PostQueue(PostQueueFixture);
      var player = new Player(queue);
      player.curPost = queue.at(1);

      spyOn(player, "setCurPost");

      player.prev();

      expect(player.setCurPost).toHaveBeenCalledWith(queue.first());
    });

  });

});
