Exeter Tech Solutions website

Deployment
----------
This static website is stored in GitHub and deployed through Cloudflare Workers & Pages.

To publish an update:
1. Upload or edit the required files in the GitHub repository.
2. Commit the changes to the main branch.
3. Cloudflare will deploy the new commit automatically.
4. Check the homepage, navigation, pricing page, enquiry form and a deliberately invalid URL after deployment.

Main pages
----------
- Homepage
- About
- Services
- Pricing
- News and community updates
- FAQs
- Contact form
- Terms and booking information
- Privacy notice
- Accessibility information
- Website search

Important configuration
-----------------------
- wrangler.jsonc configures Cloudflare static assets and the custom 404 page.
- robots.txt allows search engines to crawl the public website.
- sitemap.xml lists the public pages.
- The contact form is handled by Formspree and protected by Cloudflare Turnstile.
- A privacy-friendly accessibility control in assets/js/main.js provides larger text, high contrast, extra spacing and underlined-link options across every page.
- search.html and assets/js/search.js provide a browser-based search of the public pages without a third-party search service.

Before changing public claims
-----------------------------
- Keep the DBS wording as "Basic DBS check in progress" until the certificate has been issued.
- Keep prices and service areas consistent across the website, printed materials and customer messages.
- Keep the public business number consistent: 07480 256100.
- Update the privacy notice before adding analytics, advertising cookies, new form providers or other data-processing services.
- Before accepting a binding consumer booking, provide the customer with the business or trading address and the applicable price and cancellation information in a form they can keep.
