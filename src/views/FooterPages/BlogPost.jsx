import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import blogPostsData from '../../data/blogPosts.json';
import { Home, Twitter, Facebook, Link as LinkIcon, Mail, Copy, CheckCheck } from 'lucide-react';
import BlogPostComponent from '../../components/Blog/BlogPostComponents';

// Import styles
import './BlogPost.css';

/**
 * Enhanced toast notification implementation
 */
const useToast = () => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  
  const showToast = useCallback((message, type = 'info') => {
    setToast({ visible: true, message, type });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);
  
  return { toast, showToast };
};

/**
 * Enhanced Blog Post Page component with improved UI/UX
 */
const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState('');
  const [isAdmin] = useState(false); // Will be replaced with actual auth logic
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true);
      setNotFound(false);
      
      if (!id) {
        setIsLoading(false);
        navigate('/blog');
        return;
      }
      
      try {
        console.log('Retrieving article with ID:', id);
        
        // Using local data only
        setTimeout(() => {
          const fallbackPost = blogPostsData.find(post => post.id === id);
          if (!fallbackPost) {
            console.log('Article not found in local data');
            setIsLoading(false);
            setNotFound(true);
            return;
          }
          
          setPost(fallbackPost);
          
          // Get related posts from local data with improved criteria
          const related = blogPostsData
            .filter(p => (
              // Match by category or tags
              (p.category === fallbackPost.category || 
               (p.tags && fallbackPost.tags && 
                p.tags.some(tag => fallbackPost.tags.includes(tag)))) && 
              p.id !== id
            ))
            .slice(0, 3);
          setRelatedPosts(related);
          setIsLoading(false);
        }, 800); // Simulate network delay for better UX testing
      } catch (error) {
        console.error('Error loading article:', error);
        setNotFound(true);
        showToast("Error loading article", "error");
        setIsLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [id, navigate, showToast]);
  
  // Handle edit post action
  const handleEditPost = useCallback(() => {
    // Would be implemented with actual admin functionality
    console.log('Edit functionality not yet implemented');
    showToast("Edit functionality not available at the moment", "info");
  }, [showToast]);
  
  // Handle newsletter subscription
  const handleNewsletterSubscribe = useCallback((e) => {
    e.preventDefault();
    // Subscription logic would go here
    console.log('Subscription email:', emailSubscription);
    showToast("Thank you for subscribing to our newsletter!", "success");
    setEmailSubscription('');
  }, [emailSubscription, showToast]);
  
  // Handle copy link to clipboard
  const handleCopyLink = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    showToast("Link copied to clipboard", "success");
    
    // Reset copy success state after 2 seconds
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  }, [showToast]);
  
  // Social sharing handlers
  const handleTwitterShare = useCallback(() => {
    if (!post) return;
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`;
    window.open(url, '_blank');
  }, [post]);
  
  const handleFacebookShare = useCallback(() => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }, []);
  
  const handleEmailShare = useCallback(() => {
    if (!post) return;
    const subject = encodeURIComponent(post.title);
    const body = encodeURIComponent(`I found this interesting article and wanted to share it with you: ${post.title}\n\n${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }, [post]);

  return (
    <Layout>
      <div className="blog-page-container">
        {/* Toast notification */}
        {toast.visible && (
          <div className={`blog-page-toast ${toast.type}`}>
            <p className="toast-message">{toast.message}</p>
          </div>
        )}
        
        {/* {!isLoading && !notFound && post && (
          <div className="blog-page-header">
            <BlogBreadcrumbs postTitle={post.title} />
          </div>
        )} */}
        
        <div className="blog-page-content">
          {/* Blog Post Component */}
          <BlogPostComponent 
            post={post}
            isLoading={isLoading}
            notFound={notFound}
            onEdit={handleEditPost}
            relatedPosts={relatedPosts}
            isAdmin={isAdmin}
          />
          
          {!isLoading && !notFound && post && (
            <>
              {/* Enhanced social sharing section */}
              <div className="blog-page-sharing">
                <h4 className="sharing-title">Share this article</h4>
                <div className="sharing-buttons">
                  <button 
                    className="sharing-button twitter"
                    onClick={handleTwitterShare}
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="sharing-icon" />
                  </button>
                  <button 
                    className="sharing-button facebook"
                    onClick={handleFacebookShare}
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="sharing-icon" />
                  </button>
                  <button 
                    className="sharing-button email"
                    onClick={handleEmailShare}
                    aria-label="Share by email"
                  >
                    <Mail className="sharing-icon" />
                  </button>
                  <button 
                    className="sharing-button copy"
                    onClick={handleCopyLink}
                    aria-label="Copy link"
                  >
                    {copySuccess ? (
                      <CheckCheck className="sharing-icon" />
                    ) : (
                      <Copy className="sharing-icon" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Enhanced newsletter subscription */}
              <div className="blog-page-newsletter">
                <h3 className="newsletter-title">Stay informed</h3>
                <p className="newsletter-description">
                  Subscribe to our newsletter to receive our latest articles
                  and tips directly in your inbox.
                </p>
                <form className="newsletter-form" onSubmit={handleNewsletterSubscribe}>
                  <input
                    type="email"
                    className="newsletter-input"
                    placeholder="Your email address"
                    value={emailSubscription}
                    onChange={(e) => setEmailSubscription(e.target.value)}
                    aria-label="Email"
                    required
                  />
                  <button type="submit" className="newsletter-button">
                    Subscribe
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;