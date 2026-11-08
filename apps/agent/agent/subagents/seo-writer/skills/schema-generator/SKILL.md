---
name: schema-generator
description: Generates valid Schema.org JSON-LD structured data (FAQPage, HowTo, ItemList, and Offer) to maximize Google rich snippet eligibility and AI search citation.
---

# Schema Generator Skill

Use this skill when generating or validating structured data (JSON-LD) for blog articles, birthday listicles, and single-brand claim guides.

---

## 1. Why Structured Data Matters for AI & SEO

- **Search Engines (Google, Bing)**: Triggers rich snippets (FAQ drop-downs, HowTo cards, Breadcrumbs) in SERP, boosting click-through rates.
- **AI Answer Engines (ChatGPT, Perplexity, Gemini)**: LLMs parse Schema.org graphs to resolve entities, verify facts with 100% semantic certainty, and cite source URLs.

---

## 2. Core Schema Types

### A. `FAQPage` Schema (Used in All Articles)

Every article containing an FAQ section must generate an `FAQPage` schema block:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I claim Starbucks birthday reward without buying anything?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Starbucks Malaysia requires members to purchase any handcrafted beverage to redeem their free slice of cake during their birthday month."
      }
    },
    {
      "@type": "Question",
      "name": "How far in advance must I register before my birthday?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most brands, including Starbucks and FamilyMart, require registering your loyalty account at least 30 days prior to your birthday month to qualify for rewards."
      }
    }
  ]
}
```

### B. `HowTo` Schema (Used for `brand-deep-dive` Guides)

For step-by-step claim tutorials (e.g., how to redeem free movie tickets or claim free food):

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Claim Starbucks Birthday Free Cake",
  "description": "Step-by-step guide to redeeming your complimentary birthday slice of cake via the Starbucks Malaysia app.",
  "totalTime": "PT5M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Download the Mobile App",
      "text": "Download the Starbucks Malaysia mobile application from iOS App Store or Google Play Store and register a Starbucks Rewards account."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Register Birth Date in Advance",
      "text": "Ensure your birth month is updated in your profile at least 30 days prior to your birth month."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Purchase a Handcrafted Drink",
      "text": "Visit any participating Starbucks store during your birth month and order any handcrafted beverage."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Scan Member QR Code",
      "text": "Present your Starbucks mobile member barcode at the counter to redeem your free slice of cake alongside your drink."
    }
  ]
}
```

### C. `ItemList` Schema (Used for `mega-listicle` Roundups)

For top 10/20 roundups and regional directories, indexing each featured brand:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Top Birthday Freebies in Malaysia",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "FamilyMart Free Birthday Sofuto",
      "description": "100% free Sofuto ice cream for MY FamilyMart app members with no minimum spend required."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "GSC Cinemas Free Birthday Movie Tickets",
      "description": "Two complimentary 2D movie tickets during the birthday month for GSC Rewards members."
    }
  ]
}
```

---

## 3. Placement & Formatting Guidelines

1. **Self-Contained `<script>` Tag**: Append the generated JSON-LD directly at the bottom of the article markdown inside an unformatted HTML `<script type="application/ld+json">` block:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        ...
      },
      {
        "@type": "HowTo",
        ...
      }
    ]
  }
</script>
```

2. **Validation Rules**:
   - **No HTML entities in text fields**: Do not escape quotation marks with `&quot;` inside JSON strings; use valid JSON escaping (`\"`).
   - **Match On-Page Text Exactly**: The question text in `FAQPage` must match the H3/H4 question in the Markdown article word-for-word.
   - **Keep Answers Concise**: Keep each `acceptedAnswer.text` under 80 words for optimal snippet display in Google SERP.
