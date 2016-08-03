class BeatstreamText

  USERNAME_REGEX = /@(\w[\w\.]*\w)/
  HASHTAG_REGEX = /#(\w[\w\.]*\w)/

  def self.extract_mentioned_usernames (message)
    message.scan(USERNAME_REGEX).flatten
  end

  def self.extract_hashtags (message)
    message.scan(HASHTAG_REGEX).flatten
  end

end