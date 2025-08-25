/**
 * Utility functions for generating structured data (JSON-LD) for SEO
 * 
 * These functions help create properly formatted JSON-LD structured data
 * for various content types according to schema.org specifications
 */

/**
 * Creates structured data for a blog post
 * 
 * @param {Object} params - Blog post parameters
 * @param {string} params.title - Blog post title
 * @param {string} params.description - Blog post description/excerpt
 * @param {string} params.url - Canonical URL of the blog post
 * @param {string} params.imageUrl - Featured image URL
 * @param {string} params.datePublished - ISO date string of publication date
 * @param {string} params.dateModified - ISO date string of last modification date
 * @param {Object} params.author - Author information
 * @param {string} params.author.name - Author name
 * @param {string} params.author.url - Author profile URL
 * @param {string} params.publisher - Publisher name (defaults to site name)
 * @param {string} params.publisherLogoUrl - Publisher logo URL
 * @returns {Object} - JSON-LD structured data object
 */
export const createArticleStructuredData = ({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  author,
  publisher,
  publisherLogoUrl,
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogoUrl,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
};

/**
 * Creates structured data for a website
 * 
 * @param {Object} params - Website parameters
 * @param {string} params.name - Website name
 * @param {string} params.url - Website URL
 * @param {string} params.description - Website description
 * @param {string} params.logoUrl - Website logo URL
 * @returns {Object} - JSON-LD structured data object
 */
export const createWebsiteStructuredData = ({
  name,
  url,
  description,
  logoUrl,
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    url: url,
    description: description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    ...(logoUrl && {
      logo: logoUrl,
    }),
  };
};

/**
 * Creates structured data for a person (author)
 * 
 * @param {Object} params - Person parameters
 * @param {string} params.name - Person's name
 * @param {string} params.url - Person's profile URL
 * @param {string} params.imageUrl - Person's image URL
 * @param {string} params.jobTitle - Person's job title
 * @param {string} params.description - Person's bio/description
 * @param {Array<Object>} params.sameAs - Array of social profile URLs
 * @returns {Object} - JSON-LD structured data object
 */
export const createPersonStructuredData = ({
  name,
  url,
  imageUrl,
  jobTitle,
  description,
  sameAs = [],
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    url: url,
    image: imageUrl,
    jobTitle: jobTitle,
    description: description,
    sameAs: sameAs,
  };
};

/**
 * Creates structured data for breadcrumbs
 * 
 * @param {Array<Object>} items - Breadcrumb items
 * @param {string} items[].name - Item name
 * @param {string} items[].url - Item URL
 * @returns {Object} - JSON-LD structured data object
 */
export const createBreadcrumbStructuredData = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Creates structured data for FAQ page
 * 
 * @param {Array<Object>} faqs - FAQ items
 * @param {string} faqs[].question - Question text
 * @param {string} faqs[].answer - Answer text
 * @returns {Object} - JSON-LD structured data object
 */
export const createFAQStructuredData = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};