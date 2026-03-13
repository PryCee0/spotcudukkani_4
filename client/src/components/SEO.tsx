import { useEffect } from "react";

interface ProductSchemaProps {
  name: string;
  description?: string | null;
  image?: string | null;
  category: string;
  url: string;
}

interface BlogPostSchemaProps {
  title: string;
  description?: string | null;
  image?: string | null;
  datePublished: string;
  dateModified?: string;
  url: string;
  author?: string;
}

// v6.0: Product JSON-LD Schema
export function ProductSchema({ name, description, image, category, url }: ProductSchemaProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description: description || `${name} - Spotçu Dükkanı İstanbul ikinci el ${category}`,
      image: image || "https://spotcudukkani.com/logo.png",
      brand: {
        "@type": "Brand",
        name: "Spotçu Dükkanı",
      },
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "TRY",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "LocalBusiness",
          name: "Spotçu Dükkanı",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Özbey Caddesi No: 59, Fikirtepe",
            addressLocality: "Kadıköy",
            addressRegion: "İstanbul",
            postalCode: "34773",
            addressCountry: "TR",
          },
        },
      },
      category,
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = `product-schema-${name.replace(/\s+/g, "-")}`;
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(script.id);
      if (existing) existing.remove();
    };
  }, [name, description, image, category, url]);

  return null;
}

// v6.0: BlogPosting JSON-LD Schema
export function BlogPostSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  url,
  author = "Spotçu Dükkanı",
}: BlogPostSchemaProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description: description || title,
      image: image || "https://spotcudukkani.com/logo.png",
      datePublished,
      dateModified: dateModified || datePublished,
      author: {
        "@type": "Organization",
        name: author,
        url: "https://spotcudukkani.com",
      },
      publisher: {
        "@type": "Organization",
        name: "Spotçu Dükkanı",
        logo: {
          "@type": "ImageObject",
          url: "https://spotcudukkani.com/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = `blog-schema-${title.replace(/\s+/g, "-")}`;
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(script.id);
      if (existing) existing.remove();
    };
  }, [title, description, image, datePublished, dateModified, url, author]);

  return null;
}

// v6.0: Dynamic meta tags helper
export function useMetaTags(tags: Record<string, string>) {
  useEffect(() => {
    const originalValues: Record<string, string | null> = {};

    Object.entries(tags).forEach(([name, content]) => {
      let meta: HTMLMetaElement | null = null;

      if (name.startsWith("og:") || name.startsWith("article:")) {
        meta = document.querySelector(`meta[property="${name}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("property", name);
          document.head.appendChild(meta);
        }
      } else {
        meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", name);
          document.head.appendChild(meta);
        }
      }

      if (meta) {
        originalValues[name] = meta.getAttribute("content");
        meta.setAttribute("content", content);
      }
    });

    // Update title if provided
    const originalTitle = document.title;
    if (tags.title) {
      document.title = tags.title;
    }

    return () => {
      if (tags.title) {
        document.title = originalTitle;
      }
      Object.entries(originalValues).forEach(([name, originalValue]) => {
        const meta = name.startsWith("og:") || name.startsWith("article:")
          ? document.querySelector(`meta[property="${name}"]`)
          : document.querySelector(`meta[name="${name}"]`);
        if (meta && originalValue !== null) {
          meta.setAttribute("content", originalValue);
        }
      });
    };
  }, [JSON.stringify(tags)]);
}
