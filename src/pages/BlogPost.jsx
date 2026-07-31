import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import NotFound from "@/pages/NotFound";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <NotFound />;

  const { title, tldr, bodyHtml } = post;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: tldr,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Seo title={title} description={tldr} path={`/blog/${slug}/`} jsonLd={jsonLd} />
      <div>
        <Header />
        <main className="w-full bg-white py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-jade-ink mb-8 hover:opacity-80"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-ink leading-tight mb-4">
              {title}
            </h1>
            <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed mb-10 bg-cream rounded-2xl p-5">
              {tldr}
            </p>
            <div
              className="prose prose-sm sm:prose-base max-w-none font-sans text-ink [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:font-display [&_h3]:font-semibold"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
