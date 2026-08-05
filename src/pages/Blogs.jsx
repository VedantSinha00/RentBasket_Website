import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

const blogsList = [
  {
    slug: "why-renting-furniture-is-better-than-furnished-homes",
    title: "Why Renting Furniture is Better Than Furnished Homes",
    excerpt: "Comfort, flexibility, and total peace of mind — discover the smarter way to set up your home.",
    date: "August 5, 2026",
    category: "Lifestyle",
    image: "🏠",
  }
];

const Blogs = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="section-container py-12 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-foreground mb-3">
            Blogs
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground">
            Insights, tips, and stories about furniture rental and smart living with RentBasket.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogsList.map((blog) => (
            <Link
              key={blog.slug}
              to={`/blogs/${blog.slug}/`}
              className="group h-full"
            >
              <div className="h-full flex flex-col rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-lg">
                {/* Image/Icon Section */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950/30 dark:to-blue-900/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <span className="text-7xl">{blog.image}</span>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {blog.category}
                    </span>
                  </div>

                  <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="text-muted-foreground text-sm sm:text-base line-clamp-2">
                    {blog.excerpt}
                  </p>

                  <div className="flex-grow"></div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {blog.date}
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {blogsList.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}

        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
            <h3 className="font-display font-semibold text-2xl text-foreground mb-3">
              Have a Story to Share?
            </h3>
            <p className="text-muted-foreground mb-6">
              We'd love to hear your furniture rental experience or tips for comfortable living.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-semibold"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;
