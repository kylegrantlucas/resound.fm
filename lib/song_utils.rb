class SongUtils

  def self.process_itunes_song(s)
    icon200 = s['artworkUrl100'].to_s.gsub('.100x100-', '.200x200-')
    icon400 = s['artworkUrl100'].to_s.gsub('.100x100-', '.400x400-')
    {
        provider: 'itunes',
        name: s['trackName'],
        itunes_id: s['trackId'],
        icon100: s['artworkUrl100'],
        icon200: icon200,
        icon400: icon400,
        duration: (s['trackTimeMillis'] / 1000).to_i,
        album: s['collectionName'],
        artist: s['artistName'],
        artist_id: s['artistId'],
        itunes_collection_id: s['collectionId']
    }
  end

  def self.process_itunes_songs(songs)
    songs.collect do |s|
      process_itunes_song(s)
    end
  end

  def self.process_soundcloud_song(s)
    icon100 = s['artwork_url'] || s['user']['avatar_url'] || ''
    icon200 = icon100.to_s.gsub('-large', '-t200x200')
    icon400 = icon100.to_s.gsub('-large', '-crop')
    {
        provider: 'soundcloud',
        name: s['title'],
        key: s['id'],
        icon100: icon100,
        icon200: icon200,
        icon400: icon400,
        duration: (s['duration'] / 1000).to_i,
        artist: s['user']['username'],
        artist_id: s['user']['id']
    }
  end

  def self.process_soundcloud_songs(songs)
    songs.collect do |s|
     process_soundcloud_song(s)
    end
  end

end