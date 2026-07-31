import { Helmet } from "react-helmet-async";

const SITE_NAME = "RentBasket";
const SITE_URL = "https://home.rentbasket.com";

/**
 * Per-route <head> tags. The build's index.html still carries the default
 * title/description as a fallback for the very first paint and for any route
 * that doesn't render one of these.
 */
const Seo = ({ title, description, keywords, path, jsonLd }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Rent Furniture & Appliances in Delhi NCR`;
  const canonical = path ? `${SITE_URL}${path}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
