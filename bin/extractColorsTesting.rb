url = "https://i1.sndcdn.com/artworks-000048044419-swqnmg-crop.jpg?2aaad5e"
extractedHSLColors = Miro::DominantColors.new(url).to_hsl
extractedHexColors = Miro::DominantColors.new(url).to_hex
colors = []

extractedHSLColors.count.times do |index|
    colors[index] = {:hsl => extractedHSLColors[index],
                     :hex => extractedHexColors[index]}
end

# puts colors

colors.sort_by! { |color| [color[:hsl][1] + color[:hsl][2]] }
colors = colors.map {|color| color[:hex]}
colors.reverse!
# colors.each {|color| puts "hsl(#{color[0]}, #{color[1]}%, #{color[2]}%)"}
