import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, Clock, ChevronRight } from 'lucide-react';
// import { useAuthState } from '../hooks/use-auth-state';
// import { useAdmin } from '../hooks/use-admin';
import './BlogCard.css';

/**
 * Internal formatDate function to format dates in a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Return formatted date (e.g., "Jan 1, 2023")
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * @typedef {Object} BlogPost
 * @property {string} id
 * @property {string} title
 * @property {string} excerpt
 * @property {string} [content]
 * @property {string} author
 * @property {string} [authorImage]
 * @property {string} date
 * @property {string} category
 * @property {string[]} tags
 * @property {string} [imageUrl]
 * @property {string} [image_url]
 * @property {string} [readTime]
 * @property {string} [read_time]
 * @property {string} [created_at]
 * @property {boolean} [published]
 */

/**
 * @typedef {Object} BlogCardProps
 * @property {BlogPost} post
 * @property {boolean} [isAdminView]
 * @property {Function} [onEdit]
 * @property {Function} [onSave]
 * @property {boolean} [isSaved]
 * @property {string} [className]
 */

/**
 * Blog card component displaying a preview of a blog post
 * @param {BlogCardProps} props - Component props
 * @returns {JSX.Element}
 */
const BlogCard = ({ 
  post, 
  isAdminView = false, 
  onSave, 
  isSaved = false,
  className = '' 
}) => {
  // Handle data from both formats (static data and Supabase)
  const imageUrl = post.imageUrl || post.image_url || '';
  const readTime = post.readTime || post.read_time || '5 min read';
  const dateToShow = post.date || post.created_at || new Date().toISOString();
  
//   const { user } = useAuthState();
//   const { isAdmin } = useAdmin();
  
  // Get the style class for the category
  const getCategoryClass = () => {
    const categories = {
      'Admissions': 'primary',
      'MCAT': 'secondary',
      'Research': 'success',
      'Clinical': 'danger'
    };
    
    return categories[post.category] || 'primary';
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(post);
    }
  };
  
  // Format excerpt to have a consistent length
  const formatExcerpt = (excerpt) => {
    if (!excerpt) return '';
    return excerpt.length > 140 ? excerpt.substring(0, 140) + '...' : excerpt;
  };
  
  return (
    <article 
      className={`blog-card ${!post.published && isAdminView ? 'blog-card-admin-draft' : ''} ${className}`}
      data-testid="blog-card"
    >
      <div className="blog-card-image-container">
        <Link to={`/blog/${post.id}`}>
          <img
            src={imageUrl}
            alt={post.title}
            className="blog-card-image"
            loading="lazy"
            onError={(e) => {
              // Fallback image if the main one fails to load
              e.target.src = 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800';
            }}
          />
        </Link>
        
        <span className={`category-badge ${getCategoryClass()}`}>
          {post.category}
        </span>
        
        {!post.published && isAdminView && (
          <span className="draft-badge">
            Draft
          </span>
        )}
      </div>
      
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <div className="blog-card-meta-item">
            <CalendarIcon className="blog-card-meta-icon h-3.5 w-3.5" />
            <span>{formatDate(dateToShow)}</span>
          </div>
          <span className="blog-card-meta-divider">•</span>
          <div className="blog-card-meta-item">
            <Clock className="blog-card-meta-icon h-3.5 w-3.5" />
            <span>{readTime}</span>
          </div>
        </div>
        
        <Link to={`/blog/${post.id}`}>
          <h3 className="blog-card-title">
            {post.title}
          </h3>
        </Link>
        
        <p className="blog-card-excerpt">
          {formatExcerpt(post.excerpt)}
        </p>
        
        <div className="blog-card-footer">
          <div className="blog-card-author">
            {post.authorImage ? (
              <img 
                src={post.authorImage} 
                alt={post.author} 
                className="blog-card-author-avatar"
              />
            ) : (
              <div className="author-avatar-fallback">
                {post.author.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="blog-card-author-name">{post.author}</span>
          </div>
          
          <div className="blog-card-actions">
            {onSave && (
              <button
                className="blog-card-save-button"
                onClick={handleSave}
                aria-label={isSaved ? "Remove from favorites" : "Save post"}
                data-testid="blog-save-button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            )}
            
            <Link
              to={`/blog/${post.id}`}
              className="blog-card-read-more"
              data-testid="blog-read-more"
            >
              Read More
              <ChevronRight className="blog-card-read-more-icon h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;