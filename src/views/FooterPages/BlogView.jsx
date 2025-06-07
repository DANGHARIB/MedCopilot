import React, { useState, useEffect, useMemo } from "react";
import { Search, Home } from "lucide-react";
import BlogCard from "../../components/Blog/BlogCard";
import Layout from "../../components/Layout/Layout";
import blogPostsData from "../../data/blogPosts.json";
import Breadcrumbs from "../../components/UI/Breadcrumbs";
import "./BlogView.css";

/**
 * Custom Button component with different variants
 */
const Button = ({
  children,
  variant = "default",
  onClick,
  className = "",
  icon,
  ...props
}) => {
  const baseClass = "category-button";
  const variantClass =
    variant === "primary"
      ? "category-button-active"
      : "category-button-inactive";

  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      onClick={onClick}
      type="button"
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

/**
 * BlogView Component
 * Redesigned to match Medical School Database layout
 */
const BlogView = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Debounce search input to prevent excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Extract all unique categories from blog posts
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(blogPostsData.map((post) => post.category)),
    ];
    return ["All", ...uniqueCategories.sort()];
  }, []);

  // Filter posts based on search query and selected category
  const filteredPosts = useMemo(() => {
    setIsLoading(true); // Show loading state when filters change

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Short timeout for better UX

    // Filtrer les posts
    const result = blogPostsData.filter((post) => {
      // Filter by search query
      const matchesSearch =
        debouncedQuery === "" ||
        post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (post.tags &&
          post.tags.some((tag) =>
            tag.toLowerCase().includes(debouncedQuery.toLowerCase())
          ));

      // Filter by category
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });

    // Nettoyer le timer lors du démontage
    setTimeout(() => clearTimeout(timer), 300);

    return result;
  }, [debouncedQuery, activeCategory]);

  // Enhanced search handler with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Layout hideHero={true} removeTopSpace={true}>
      <div className="blog-container">
        <Breadcrumbs
          items={[
            {
              label: "Home",
              path: "/",
              icon: <Home size={14} />,
            },
            {
              label: "Blog",
            },
          ]}
        />

        {/* Redesigned Hero Section */}
        <section className="blog-hero">
          <h1 className="blog-title">
            Medical <span className="highlight">School Insights</span>
          </h1>
          <p className="blog-hero-description">
            Expert advice, research findings, and career guidance to help you
            navigate your medical education journey with confidence.
          </p>
        </section>

        {/* Search and Filters Section */}
        <section className="blog-filter-section">
          <div className="blog-search-container">
            <Search className="blog-search-icon" size={18} />
            <input
              type="text"
              className="blog-search-input"
              placeholder="Search articles by title, content, author or tag..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search articles"
            />
          </div>

          <div className="blog-categories-list">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "primary" : "default"}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Main Content Section */}
        <section className="blog-content-section">
          {/* Results count */}
          {!isLoading && (
            <div className="blog-post-count">
              Showing {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "article" : "articles"}
              {activeCategory !== "All" && ` in ${activeCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="blog-loading">
              <div
                className="blog-loading-spinner"
                aria-label="Loading content"
              ></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            // Grid of blog posts
            <div className="blog-posts-grid">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="blog-empty-state">
              <div className="blog-empty-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className="blog-empty-title">No articles found</h3>
              <p className="blog-empty-text">
                Try adjusting your search terms or category filter to find what
                you're looking for.
              </p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default BlogView;
