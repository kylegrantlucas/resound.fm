# == Schema Information
#
# Table name: tracks
#
#  id                   :integer          not null, primary key
#  name                 :string(255)      not null
#  artist               :string(255)      not null
#  artist_id            :string(255)      not null
#  album                :string(255)
#  duration             :integer          not null
#  provider             :string(255)      not null
#  key                  :string(255)      not null
#  itunes_id            :string(255)
#  itunes_collection_id :string(255)
#  icon                 :text             not null
#  created_at           :datetime
#  updated_at           :datetime
#

class Track < ActiveRecord::Base
  has_many :posts
  has_many :videos

  def icon100
    icon
  end

  def icon200
    if provider == 'youtube'
      icon100.to_s.gsub('.100x100-', '.200x200-')
    elsif provider == 'soundcloud'
      icon100.to_s.gsub('-large', '-t200x200')
    else
      'https://placehold.it/200x200'
    end
  end

  def icon400
    if provider == 'youtube'
      icon100.to_s.gsub('.100x100-', '.400x400-')
    elsif provider == 'soundcloud'
      icon100.to_s.gsub('-large', '-crop')
    else
      'https://placehold.it/400x400'
    end
  end

  # Depends on Miro being initialized with the correct dimensions (200x200)
  def extractColors
    begin
      extractedHSLColors = Miro::DominantColors.new(self.icon200).to_hsl
      extractedHexColors = Miro::DominantColors.new(self.icon200).to_hex
      colors = []
  
      extractedHSLColors.count.times do |index|
          colors[index] = {:hsl => extractedHSLColors[index],
                           :hex => extractedHexColors[index]}
      end
  
      # Sort colors based on a combined score of saturation and lightness
      colors.sort_by! { |color| [color[:hsl][1] + color[:hsl][2]] }
      colors = colors.map {|color| color[:hex]}
      colors.reverse!
  
      # Store the extracted colors
      colors.each_with_index do |color, index|
        self["color#{index+1}"] = color
      end
  
      # Pad remaining colors if less than 4 were returned
      colorsLeft = 4 - colors.count
      colorsLeft.times do |index|
        self["color#{colors.count + index}"] = colors.last
      end
  
      self.save
    rescue
    end
  end

end
