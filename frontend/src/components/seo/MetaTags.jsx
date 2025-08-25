import React, { useEffect } from 'react'

const MetaTags = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    if (description) {
      metaDescription.content = description
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    if (keywords) {
      metaKeywords.content = keywords
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    if (title) {
      ogTitle.content = title
    }

    let ogDescription = document.querySelector('meta[property="og:description"]')
    if (!ogDescription) {
      ogDescription = document.createElement('meta')
      ogDescription.setAttribute('property', 'og:description')
      document.head.appendChild(ogDescription)
    }
    if (description) {
      ogDescription.content = description
    }

    let ogImage = document.querySelector('meta[property="og:image"]')
    if (!ogImage) {
      ogImage = document.createElement('meta')
      ogImage.setAttribute('property', 'og:image')
      document.head.appendChild(ogImage)
    }
    if (image) {
      ogImage.content = image
    }

    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (!ogUrl) {
      ogUrl = document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      document.head.appendChild(ogUrl)
    }
    if (url) {
      ogUrl.content = url
    } else {
      ogUrl.content = window.location.href
    }

    // Update Twitter Card tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]')
    if (!twitterCard) {
      twitterCard = document.createElement('meta')
      twitterCard.name = 'twitter:card'
      document.head.appendChild(twitterCard)
    }
    twitterCard.content = 'summary_large_image'

    let twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta')
      twitterTitle.name = 'twitter:title'
      document.head.appendChild(twitterTitle)
    }
    if (title) {
      twitterTitle.content = title
    }

    let twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta')
      twitterDescription.name = 'twitter:description'
      document.head.appendChild(twitterDescription)
    }
    if (description) {
      twitterDescription.content = description
    }

    let twitterImage = document.querySelector('meta[name="twitter:image"]')
    if (!twitterImage) {
      twitterImage = document.createElement('meta')
      twitterImage.name = 'twitter:image'
      document.head.appendChild(twitterImage)
    }
    if (image) {
      twitterImage.content = image
    }
  }, [title, description, keywords, image, url])

  return null
}

export default MetaTags