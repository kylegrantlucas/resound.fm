class CachePostListensCount < ActiveRecord::Migration
  def up
    execute "update posts set listens_count=(select count(*) from listens where post_id=posts.id)"
  end

  def down
  end
end
