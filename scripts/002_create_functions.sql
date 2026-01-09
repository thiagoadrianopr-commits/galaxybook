-- Function to get post with user info and counts
CREATE OR REPLACE FUNCTION get_posts_with_details()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  image_url TEXT,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  likes_count BIGINT,
  comments_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    prof.username,
    prof.avatar_url,
    p.image_url,
    p.caption,
    p.created_at,
    COALESCE(l.likes_count, 0) AS likes_count,
    COALESCE(c.comments_count, 0) AS comments_count
  FROM posts p
  LEFT JOIN profiles prof ON p.user_id = prof.id
  LEFT JOIN (
    SELECT post_id, COUNT(*) as likes_count
    FROM likes
    GROUP BY post_id
  ) l ON p.id = l.post_id
  LEFT JOIN (
    SELECT post_id, COUNT(*) as comments_count
    FROM comments
    GROUP BY post_id
  ) c ON p.id = c.post_id
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
  posts_count BIGINT,
  followers_count BIGINT,
  following_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM posts WHERE user_id = user_uuid) AS posts_count,
    (SELECT COUNT(*) FROM follows WHERE following_id = user_uuid) AS followers_count,
    (SELECT COUNT(*) FROM follows WHERE follower_id = user_uuid) AS following_count;
END;
$$ LANGUAGE plpgsql;
