require 'spec_helper'

describe BeatstreamText do

  it 'should extract array of usernames' do
    #TODO handle usernames with hyphens ex. robert-long (reject them completely?)

    matches = BeatstreamText::extract_mentioned_usernames('@robert @matt @tim@tyler lorem ipsum  @robert.long @42dude.12')
    matches.should eq(['robert', 'matt', 'tim', 'tyler', 'robert.long', '42dude.12'])
  end
end