import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, Clock, ChevronRight, Heart, Share2, Bookmark } from 'lucide-react';
import './BlogPostComp.css';

/**
 * Format date to a readable format with improved localization
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Use browser's locale or default to English
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate estimated read time based on content length
 * @param {string} content - Content to calculate read time for
 * @returns {string} - Formatted read time
 */
const calculateReadTime = (content) => {
  if (!content) return '5 min read';
  
  // Average reading speed (words per minute)
  const wordsPerMinute = 225;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  
  return `${readTime} min read`;
};

/**
 * Format HTML content with proper sanitization and styling
 * @param {string} content - HTML content to format
 * @returns {string} - Formatted and sanitized HTML content
 */
const formatContent = (content) => {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  } else if (Array.isArray(content)) {
    return content.join('\n\n');
  }
  
  return String(content || '');
};

/**
 * Modern Blog Post Component with enhanced UI/UX
 */
const BlogPostComponent = ({ 
  post = null, 
  isLoading = false, 
  notFound = false, 
  relatedPosts = [],
}) => {
  const [formattedContent, setFormattedContent] = useState('');
  const [readTime, setReadTime] = useState('');
  
  // Format the content and calculate read time
  useEffect(() => {
    if (post?.content) {
      const content = formatContent(post.content);
      setFormattedContent(content);
      
      // Calculate read time if not provided
      if (!post.readTime && !post.read_time) {
        setReadTime(calculateReadTime(content));
      } else {
        setReadTime(post.readTime || post.read_time);
      }
    }
  }, [post]);
  
  // Get image URL from different possible sources
  const imageUrl = post?.imageUrl || post?.image_url || '';
  
  // Handle loading state with improved spinner
  if (isLoading) {
    return (
      <div className="blog-post-loading">
        <div className="blog-post-spinner"></div>
      </div>
    );
  }
  
  // Handle not found state with improved UI
  if (notFound) {
    return (
      <div className="blog-post-not-found">
        <h1 className="blog-post-not-found-title">Article Not Found</h1>
        <p className="blog-post-not-found-message">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/blog" className="blog-post-back-link">
          <ArrowLeft className="blog-post-back-icon" />
          Back to Articles
        </Link>
      </div>
    );
  }
  
  // If we don't have a post, don't render anything
  if (!post) return null;

  return (
    <article className="blog-post">
      {/* Header with back button */}
      <div className="blog-post-header">
        <Link to="/blog" className="blog-post-back-link">
          <ArrowLeft className="blog-post-back-icon" />
          Back to Articles
        </Link>
      </div>
      
      {/* Post title with minimalist typography */}
      <h1 className="blog-post-title">{post.title}</h1>
      
      {/* Post metadata with enhanced visual design */}
      <div className="blog-post-meta">
        <span className="blog-post-category">{post.category}</span>
        
        <div className="blog-post-details">
          <div className="blog-post-date">
            <Calendar className="blog-post-meta-icon" />
            <span>{formatDate(post.date || post.created_at)}</span>
          </div>
          
          <div className="blog-post-read-time">
            <Clock className="blog-post-meta-icon" />
            <span>{readTime}</span>
          </div>
        </div>
        
        {post.published === false && (
          <span className="blog-post-draft-badge">Draft</span>
        )}
      </div>
      
      {/* Author information with enhanced styling */}
      <div className="blog-post-author">
        {post.authorImage ? (
          <img 
            src={post.authorImage}
            alt={`Photo of ${post.author}`}
            className="blog-post-author-image"
          />
        ) : (
          <div className="blog-post-author-placeholder">
            {post.author && post.author.charAt(0)}
          </div>
        )}
        <div className="blog-post-author-info">
          <div className="blog-post-author-name">{post.author}</div>
          <div className="blog-post-author-title">Author</div>
        </div>
      </div>
      
      {/* Featured image with improved container and hover effects */}
      {imageUrl && (
        <div className="blog-post-featured-image-container">
          <img 
            src={imageUrl} 
            alt={post.title}
            className="blog-post-featured-image"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Main content with improved typography and spacing */}
      <div className="blog-post-content">
        {typeof formattedContent === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        ) : (
          <p className="blog-post-paragraph">{String(formattedContent || '')}</p>
        )}
      </div>
      
      {/* Tags with improved styles */}
      {post.tags && post.tags.length > 0 && (
        <div className="blog-post-tags">
          {post.tags.map((tag) => (
            <Link key={tag} to={`/blog/tag/${tag}`} className="blog-post-tag">
              {tag}
            </Link>
          ))}
        </div>
      )}
      
      {/* Related posts with improved card design */}
      {relatedPosts.length > 0 && (
        <div className="blog-post-related">
          <h2 className="blog-post-related-title">Similar Articles</h2>
          <div className="blog-post-related-grid">
            {relatedPosts.map(relatedPost => (
              <div key={relatedPost.id} className="blog-post-related-card">
                <Link to={`/blog/${relatedPost.id}`} className="blog-post-related-image-link">
                  {relatedPost.imageUrl || relatedPost.image_url ? (
                    <img 
                      src={relatedPost.imageUrl || relatedPost.image_url} 
                      alt={relatedPost.title}
                      className="blog-post-related-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="blog-post-related-image-placeholder">
                      {relatedPost.category?.charAt(0) || 'B'}
                    </div>
                  )}
                  {relatedPost.published === false && (
                    <span className="blog-post-related-draft">Draft</span>
                  )}
                </Link>
                <div className="blog-post-related-content">
                  <Link to={`/blog/${relatedPost.id}`} className="blog-post-related-title-link">
                    <h3 className="blog-post-related-card-title">{relatedPost.title}</h3>
                  </Link>
                  <div className="blog-post-related-meta">
                    {formatDate(relatedPost.date || relatedPost.created_at)}
                    <span className="blog-post-related-separator">•</span>
                    {relatedPost.readTime || relatedPost.read_time || '5 min read'}
                  </div>
                  {relatedPost.excerpt && (
                    <p className="blog-post-related-excerpt">{relatedPost.excerpt}</p>
                  )}
                  <Link to={`/blog/${relatedPost.id}`} className="blog-post-related-read-more">
                    Read Article
                    <ChevronRight className="blog-post-related-read-more-icon" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPostComponent;