require 'soundcloud'
require 'itunes-search-api'
require 'song_utils'


class SongSearch

  def initialize(soundcloud_key)
    I18n.config.enforce_available_locales = false
    @soundcloud = SoundCloud.new({client_id: soundcloud_key})
  end

  def search_itunes(query)
    itunes_tracks = ITunesSearchAPI.search(term: query, country: 'US', entity: 'song', limit: 5)
    Thread.current[:tracks] = SongUtils.process_itunes_songs(itunes_tracks)
  end

  def search_soundcloud(query)
    sc_tracks = @soundcloud.get('/tracks', q:query, filter:'streamable', limit: 5)
    Thread.current[:tracks] = SongUtils.process_soundcloud_songs(sc_tracks)
  end

  def search_realtime(query)
    itunes_thread = Thread.new { search_itunes(query) }
    soundcloud_thread = Thread.new { search_soundcloud(query) }

    itunes_thread.join
    soundcloud_thread.join

    soundcloud_thread[:tracks].zip(itunes_thread[:tracks]).flatten.compact
  end

end