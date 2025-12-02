# Blog System Setup Instructions

## Database Setup

### For New Installation:
Run this SQL script in your MySQL database to create the blogs table with likes:

```sql
-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  blog_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(500),
  summary VARCHAR(500),
  is_published TINYINT(1) DEFAULT 1,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_published (is_published),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create blog likes tracking table
CREATE TABLE IF NOT EXISTS blog_likes (
  like_id INT PRIMARY KEY AUTO_INCREMENT,
  blog_id INT NOT NULL,
  user_id INT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (blog_id) REFERENCES blogs(blog_id) ON DELETE CASCADE,
  UNIQUE KEY unique_blog_user (blog_id, user_id),
  UNIQUE KEY unique_blog_ip (blog_id, ip_address),
  INDEX idx_blog_id (blog_id)
);
```

Or run the SQL file directly:
```bash
mysql -u your_username -p your_database_name < backend/database_blogs.sql
```

### For Existing Installation (Migration):
If you already have the blogs table, run the migration:
```bash
mysql -u your_username -p your_database_name < backend/database_blogs_likes_migration.sql
```

## Features Implemented

### Admin Panel (Doctor Dashboard)
- ✅ Navigate to `/doctor-admin/blogs`
- ✅ Add new blog articles with:
  - Title (required)
  - Content (required)
  - Image URL (optional)
  - Summary (optional)
  - Publish status (toggle)
- ✅ Edit existing blogs
- ✅ Delete blogs with confirmation
- ✅ Toggle publish/unpublish status
- ✅ View statistics (views count, created date)
- ✅ Image preview in form

### Public Profile Display
- ✅ Blog tab at `/doctor-profile/:id#blog`
- ✅ Beautiful card layout with images
- ✅ Click to open full blog in modal
- ✅ Shows only published blogs
- ✅ View counter
- ✅ **Like/Unlike functionality** with count
- ✅ Heart icon changes color when liked
- ✅ Like tracking by user or IP address
- ✅ Framer Motion animations
- ✅ Responsive design

## API Endpoints

### Protected Routes (require authentication)
- `GET /api/blogs` - Get user's all blogs
- `GET /api/blogs/:id` - Get single blog (increments views)
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `PATCH /api/blogs/:id/toggle-publish` - Toggle publish status

### Public Routes (no authentication)
- `GET /api/public/blogs/doctor/:doctorId` - Get doctor's published blogs
- `POST /api/public/blogs/:id/like` - Toggle like/unlike (tracks by user/IP)
- `GET /api/public/blogs/:id/like-status` - Check if user/IP liked blog

## Testing

1. **Create a blog:**
   - Login as doctor
   - Go to Admin Panel > Blogs
   - Click "Add New Blog"
   - Fill in title, content, and optional image/summary
   - Click "Add Blog"

2. **View blog:**
   - Visit doctor profile page
   - Click "Blog" tab
   - Should see published blogs in card format
   - Click any card to view full content

3. **Edit/Delete:**
   - Go back to admin panel
   - Click "Edit" button on any blog
   - Make changes and save
   - Or click "Delete" to remove

4. **Like blogs:**
   - Visit any blog in the profile
   - Click the heart icon (🤍) to like
   - Heart turns red (❤️) when liked
   - Click again to unlike
   - Like count updates in real-time

## File Structure

```
backend/
├── database_blogs.sql          # Database schema
├── Controllers/
│   └── BlogController.js       # CRUD operations
├── Routes/
│   ├── BlogRoutes.js          # Protected routes
│   └── PublicRoutes.js        # Added public blog endpoint
└── server.js                   # Routes integrated

heallk/src/
├── doctorAdminPanel/
│   ├── Blogs.jsx              # Admin blog management
│   ├── DoctorAdminDashboard.jsx  # Added blogs route
│   └── Navbar.jsx             # Added blogs menu item
├── doctor_profile/
│   └── BlogSection.jsx        # Public blog display
└── Pages/
    └── DoctorProfile.jsx      # Added blog tab
```

## Notes

- Blogs are tied to user accounts via `user_id` foreign key
- Deleting a user will cascade delete their blogs
- Only published blogs appear on public profile
- View counter increments when viewing individual blog
- **Like system tracks by user ID (if logged in) or IP address (if anonymous)**
- **Users can only like each blog once**
- **Clicking like again will unlike the blog**
- Image URLs are validated on error (fallback to placeholder)
