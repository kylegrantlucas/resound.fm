require 'text'
require 'i18n'

class ScoredVideo
  include Comparable

  attr :video
  attr :track
  attr :score
  attr :duration_difference
  attr :featured_channel
  attr :matched_type
  attr :edit_distance

  def initialize(track, video)
    @video = video
    @track = track
    @score = beat_match_score
  end

  def <=>(other)
    other.score <=> score
  end

  def inspect
    @video
  end

  def normalize_string(str)
    I18n.transliterate(str).gsub(/\W/, '').downcase
  end

  def beat_match_score
    duration_difference_score + featured_channel_score
  end

  def duration_difference
    (video.duration - track[:duration]).abs
  end

  def duration_difference_score
    case duration_difference
      when 0
        10
      when 1
        9
      when 2
        7
      when 3..5
        4
      else
        0
    end
  end

  def featured_channel_score
    featured_channels = [
        'vevo'
    ]

    featured = 0

    author = video.author.name.downcase

    featured_channels.each do |c|
      if author.include? c
        featured = 4
        break
      end
    end

    featured
  end

  def edit_distance
    query_str = normalize_string(track[:name] + track[:artist])
    query_str_rev = normalize_string(track[:artist] + track[:name])
    title_str = normalize_string(video.title)
    [Text::Levenshtein.distance(query_str, title_str), Text::Levenshtein.distance(query_str_rev, title_str)].min
  end

  #def matched_type
  #  types = [
  #      'live',
  #      'cover',
  #      'remix',
  #      'acoustic',
  #      'mashup'
  #  ]
  #
  #  matched = 1
  #
  #  video_title = normalize_string(video.title)
  #  track_title = normalize_string(track[:name])
  #
  #  types.each do |t|
  #    if track_title.include? t and not video_title.include? t
  #      matched = 0
  #      break
  #    elsif not track_title.include? t and video_title.include? t
  #      matched = 0
  #      break
  #    end
  #  end
  #
  #  matched
  #end

end