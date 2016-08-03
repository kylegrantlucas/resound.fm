# TODO: Move this shit to Rake
# Color Extraction for all tracks
Track.all.each do |track|
    track.extractColors
end