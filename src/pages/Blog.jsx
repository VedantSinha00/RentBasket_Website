import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Seo
        title="Blog"
        description="Tips, stories, and ideas on furnishing your next home in Delhi NCR — without owning any of it."
        path="/blog/"
      />
      <div>
        <Header />
        <main className="w-full bg-white py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
                RentBasket Blog
              </h1>
              <p className="text-muted-foreground font-sans text-sm sm:text-base max-w-md mx-auto">
                Tips, stories, and ideas on furnishing your next home — without owning any of it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="bg-cream rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col gap-4 hover:opacity-90 transition-opacity"
                >
                  <h2 className="font-display font-semibold text-xl text-ink leading-snug">
                    {post.title}
                  </h2>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1">
                    {post.tldr}
                  </p>
                  <div className="flex items-center justify-end pt-2 border-t border-border">
                    <span className="flex items-center gap-1 text-xs font-sans font-bold text-jade-ink">
                      Read more
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
