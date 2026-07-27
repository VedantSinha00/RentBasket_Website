import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ product }) => {
  const crumbs = [
    { label: "Home", to: "/" },
    { label: product.category, to: "/catalog" },
  ];

  if (product.subcategory) {
    crumbs.push({ label: product.subcategory, to: "/catalog" });
  }

  return (
    <nav className="section-container py-3 md:py-4">
      <ol className="flex items-center gap-1.5 text-xs md:text-sm flex-wrap">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <Link
              to={crumb.to}
              className="text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              {crumb.label}
            </Link>
            <ChevronRight className="w-3 h-3 text-ink-muted/50" />
          </li>
        ))}
        <li className="text-ink font-semibold truncate max-w-[200px] md:max-w-none">
          {product.name}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
