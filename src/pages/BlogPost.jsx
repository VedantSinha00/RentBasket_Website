import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";

const blogs = {
  "why-renting-furniture-is-better-than-furnished-homes": {
    title: "Why Renting Furniture is Better Than Furnished Homes",
    subtitle: "Comfort, flexibility, and total peace of mind — discover the smarter way to set up your home.",
    date: "August 5, 2026",
    content: {
      intro: [
        "Moving into a new place in Delhi NCR? The classic decision you'll face is: Do I rent a fully furnished home, or do I rent an unfurnished space and get furniture separately?",
        "On the surface, furnished homes seem like a time-saver. But once you settle in, the cracks begin to show — quite literally. From outdated furniture to arguments over repairs, the reality can be far from peaceful.",
        "Here's why more professionals, couples, and students are choosing furniture rental over furnished homes — and how platforms like RentBasket are making life easier."
      ],
      sections: [
        {
          icon: "🎯",
          title: "Pick What You Need",
          text: "Furnished homes come with a \"take it or leave it\" setup. But what if you don't need that extra table, or you prefer a work desk over a dressing table? With renting, you can curate your space based on your lifestyle — be it remote work, gaming, minimalism, or family needs. Rent a bed, a fridge, a microwave, or even a 6-seater dining table — all on your terms."
        },
        {
          icon: "✅",
          title: "Premium Quality, No Compromise",
          text: "Let's be honest — furniture in most furnished homes is there just to tick a box. You deserve better. When you rent, you get professionally maintained, modern, and clean furniture that's actually comfortable and functional. Plus, it's regularly inspected and sanitized — no surprises, no creaky chairs."
        },
        {
          icon: "💰",
          title: "Save Money & Stay Flexible",
          text: "Furnished homes often include a hefty markup. Why pay extra for a setup you didn't choose? Renting furniture lets you save big by only paying for what you need. RentBasket offers affordable monthly plans, with no long-term commitment. Whether you're staying for 6 months or 2 years, renting makes your finances lighter and your life simpler."
        },
        {
          icon: "🔧",
          title: "No Owner Drama = True Peace of Mind",
          text: "Furnished homes often come with baggage: Who's responsible when the fridge breaks? Will the owner fix the sofa tear before Diwali? How long will the geyser stay broken? These conversations are awkward, unpredictable, and frustrating. With furniture rental, you cut out the middleman. Maintenance is handled by professionals, replacements are quick, and you're never left waiting.",
          bullets: [
            "Who's responsible when the fridge breaks?",
            "Will the owner fix the sofa tear before Diwali?",
            "How long will the geyser stay broken?"
          ]
        },
        {
          icon: "🛠️",
          title: "Experience the Power of Professional Services",
          text: "Perhaps the biggest advantage of renting furniture is this: It's professionally managed. No landlord moods. No last-minute rule changes. No emotional guilt trips. Renting furniture offers a structured, seamless experience with clear policies, transparent pricing, and responsive support — all designed to give you maximum comfort with zero stress."
        }
      ],
      conclusion: {
        text1: "Choosing a furnished home means compromising on choice, quality, and control. Choosing to rent furniture means freedom, affordability, and peace of mind.",
        text2: "So if you're settling into Delhi NCR, make the smarter choice. Skip the landlord headaches — and start your journey with a partner that truly values your comfort."
      }
    }
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const blog = blogs[slug];

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-semibold text-foreground mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary px-6 py-2 rounded-lg">Back to Home</Link>
        </div>
      </div>
    );
  }

  const { title, subtitle, date, content } = blog;

  return (
    <div className="min-h-screen bg-background">
      <main className="section-container py-12 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>

        <article className="space-y-8">
          <div className="space-y-4">
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-foreground leading-tight">
              {title}
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            <p className="text-lg text-muted-foreground font-medium">
              {subtitle}
            </p>
            <p className="text-sm text-muted-foreground">Published on {date}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground/85 font-sans leading-relaxed">
            <section className="space-y-4">
              {content.intro.map((paragraph, idx) => (
                <p key={idx} className="text-base sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="space-y-6 pt-4">
              {content.sections.map((section, idx) => (
                <div key={idx} className="space-y-3 p-6 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                  <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span> {section.title}
                  </h2>
                  {section.bullets ? (
                    <>
                      <p className="text-base sm:text-lg font-medium mb-3">Furnished homes often come with baggage:</p>
                      <ul className="space-y-2 text-base sm:text-lg ml-4">
                        {section.bullets.map((bullet, bidx) => (
                          <li key={bidx} className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-base sm:text-lg mt-4">
                        {section.text}
                      </p>
                    </>
                  ) : (
                    <p className="text-base sm:text-lg">
                      {section.text}
                    </p>
                  )}
                </div>
              ))}
            </section>

            <section className="space-y-6 pt-8 border-t border-border/50">
              <div className="space-y-4">
                <h2 className="font-display font-semibold text-3xl text-foreground">
                  Final Word: Your Comfort, Your Call
                </h2>
                <p className="text-base sm:text-lg">
                  {content.conclusion.text1.split(" means ")[0]} means <span className="font-semibold">{content.conclusion.text1.split(" means ")[1]}</span>.
                </p>
                <p className="text-base sm:text-lg">
                  {content.conclusion.text2}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  to="/catalog"
                  className="inline-block px-8 py-3 rounded-lg bg-blue-100 text-blue-900 hover:bg-blue-200 transition-colors font-semibold hover:shadow-lg"
                >
                  👉 Explore Flexible Furniture & Appliance Rentals
                </Link>
              </div>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
