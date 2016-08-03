object @video

attributes :id, :key, :title, :created_at

node(:high_quality_thumbnail) { |video| video.high_quality_thumbnail }
node(:medium_quality_thumbnail) { |video| video.medium_quality_thumbnail }
node(:thumbnail) { |video| video.thumbnail }