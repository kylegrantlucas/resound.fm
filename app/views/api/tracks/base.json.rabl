object @track
attributes :id, :name, :artist, :album, :provider, :key, :color1, :color2, :color3, :color4

node(:duration) do |track|
  video = track.videos.where(key: track.key).first
  if video && video.duration
    video.duration
  else
    track.duration
  end
end

node(:icon100) { |track| track.icon100 }
node(:icon200) { |track| track.icon200 }
node(:icon400) { |track| track.icon400 }