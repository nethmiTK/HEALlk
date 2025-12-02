const { query } = require("../config/database");

// GET all blogs for logged-in user (admin panel)
exports.getBlogs = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: true, blogs: [] });
    }
    
    const userId = req.user.id;
    const sql = `SELECT * FROM blogs WHERE user_id = ? ORDER BY created_at DESC`;
    const results = await query(sql, [userId]);
    
    return res.json({
      success: true,
      blogs: results,
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// GET single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const sql = `SELECT b.*, u.full_name as author_name FROM blogs b 
                 LEFT JOIN users u ON b.user_id = u.user_id 
                 WHERE b.blog_id = ?`;
    const results = await query(sql, [blogId]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    // Increment view count
    await query(`UPDATE blogs SET views = views + 1 WHERE blog_id = ?`, [blogId]);
    
    return res.json({
      success: true,
      blog: results[0],
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({ message: "Failed to fetch blog" });
  }
};

// GET blogs by doctor ID (public)
exports.getBlogsByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const sql = `SELECT b.*, u.full_name as author_name FROM blogs b 
                 LEFT JOIN users u ON b.user_id = u.user_id 
                 WHERE b.user_id = ? AND b.is_published = 1 
                 ORDER BY b.created_at DESC`;
    const results = await query(sql, [doctorId]);
    
    return res.json({
      success: true,
      blogs: results,
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// ADD new blog
exports.addBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, image, summary, is_published } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    
    const sql = `INSERT INTO blogs (user_id, title, content, image, summary, is_published) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    await query(sql, [userId, title, content, image, summary, is_published ? 1 : 0]);
    
    return res.json({ success: true, message: "Blog added successfully" });
  } catch (err) {
    console.error("Insert Error:", err);
    return res.status(500).json({ message: "Failed to add blog" });
  }
};

// UPDATE blog
exports.updateBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;
    const { title, content, image, summary, is_published } = req.body;
    
    const sql = `UPDATE blogs SET title=?, content=?, image=?, summary=?, is_published=? 
                 WHERE blog_id=? AND user_id=?`;
    
    const result = await query(sql, [title, content, image, summary, is_published ? 1 : 0, blogId, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    return res.json({ success: true, message: "Blog updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json({ message: "Failed to update blog" });
  }
};

// DELETE blog
exports.deleteBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;
    
    const sql = `DELETE FROM blogs WHERE blog_id=? AND user_id=?`;
    const result = await query(sql, [blogId, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    return res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ message: "Failed to delete blog" });
  }
};

// TOGGLE publish status
exports.togglePublish = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;
    
    const sql = `UPDATE blogs SET is_published = NOT is_published WHERE blog_id=? AND user_id=?`;
    await query(sql, [blogId, userId]);
    
    return res.json({ success: true, message: "Publish status updated" });
  } catch (err) {
    console.error("Toggle Error:", err);
    return res.status(500).json({ message: "Failed to update status" });
  }
};

// LIKE/UNLIKE blog
exports.toggleLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user?.id || null;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Check if already liked
    const checkSql = userId 
      ? `SELECT * FROM blog_likes WHERE blog_id=? AND user_id=?`
      : `SELECT * FROM blog_likes WHERE blog_id=? AND ip_address=?`;
    
    const identifier = userId || ipAddress;
    const existing = await query(checkSql, [blogId, identifier]);
    
    if (existing.length > 0) {
      // Unlike
      const deleteSql = userId
        ? `DELETE FROM blog_likes WHERE blog_id=? AND user_id=?`
        : `DELETE FROM blog_likes WHERE blog_id=? AND ip_address=?`;
      await query(deleteSql, [blogId, identifier]);
      await query(`UPDATE blogs SET likes = likes - 1 WHERE blog_id=?`, [blogId]);
      
      return res.json({ success: true, liked: false, message: "Unliked" });
    } else {
      // Like
      const insertSql = `INSERT INTO blog_likes (blog_id, user_id, ip_address) VALUES (?, ?, ?)`;
      await query(insertSql, [blogId, userId, ipAddress]);
      await query(`UPDATE blogs SET likes = likes + 1 WHERE blog_id=?`, [blogId]);
      
      return res.json({ success: true, liked: true, message: "Liked" });
    }
  } catch (err) {
    console.error("Like Error:", err);
    return res.status(500).json({ message: "Failed to process like" });
  }
};

// CHECK if user liked blog
exports.checkLikeStatus = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user?.id || null;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    const checkSql = userId 
      ? `SELECT * FROM blog_likes WHERE blog_id=? AND user_id=?`
      : `SELECT * FROM blog_likes WHERE blog_id=? AND ip_address=?`;
    
    const identifier = userId || ipAddress;
    const result = await query(checkSql, [blogId, identifier]);
    
    return res.json({ success: true, liked: result.length > 0 });
  } catch (err) {
    console.error("Check Like Error:", err);
    return res.status(500).json({ message: "Failed to check like status" });
  }
};
