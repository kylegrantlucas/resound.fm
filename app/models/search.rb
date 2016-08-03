class Search
  attr_accessor :users, :tags

  def initialize(opts)
    @users = opts[:users]
    @tags = opts[:tags]
  end
end