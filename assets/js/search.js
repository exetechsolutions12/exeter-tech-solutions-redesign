const searchPages = [
  { title: 'Home', url: 'index.html', description: 'Friendly local technology help at home and in the community.', keywords: 'computer phone tablet wifi printer setup accounts files backup NHS experience local areas' },
  { title: 'About Cam', url: 'about.html', description: 'My background, experience and approach to patient technology support.', keywords: 'Cam Cameron NHS primary care digital transformation DBS insured ICO community no jargon' },
  { title: 'Services', url: 'services.html', description: 'Home visits, troubleshooting, setup, digital confidence and support for organisations.', keywords: 'virus malware data transfer wifi printer Microsoft 365 software email accounts cloud small business' },
  { title: 'Digital-confidence support', url: 'services.html#confidence', description: 'Patient one-to-one help with everyday technology, adapted to your pace and needs.', keywords: 'older people disabled beginner learning phone tablet apps photos email video calls online forms accessibility scams passwords notes' },
  { title: 'Community and charity support', url: 'services.html#community', description: 'Friendly digital-confidence sessions, drop-ins and small-group guidance.', keywords: 'charity organisation community group supported living workshop session digital inclusion' },
  { title: 'Pricing', url: 'pricing.html', description: 'Clear guide prices for visits, digital-confidence help and other work.', keywords: 'cost price £45 hour additional time £20 malware £50 transfer £40 quote' },
  { title: 'Frequently asked questions', url: 'faq.html', description: 'Answers about bookings, visits, prices, safety and what to expect.', keywords: 'FAQ appointment availability payment cancellation guarantee travel remote' },
  { title: 'News and updates', url: 'news.html', description: 'Service announcements and local community updates.', keywords: 'news launch update community announcement' },
  { title: 'Contact me', url: 'contact.html', description: 'Send an enquiry, email, call or text Exeter Tech Solutions.', keywords: 'contact enquiry form telephone mobile 07480 256100 email info' },
  { title: 'Terms and booking information', url: 'terms.html', description: 'How quotes, appointments, cancellations, payment and support work.', keywords: 'terms booking contract quote cancellation consumer rights payment liability guarantee' },
  { title: 'Privacy notice', url: 'privacy.html', description: 'How personal information is collected, used, protected and retained.', keywords: 'privacy data ICO Formspree Cloudflare rights retention cookies' },
  { title: 'Accessibility', url: 'accessibility.html', description: 'Website accessibility, display controls and support adjustments.', keywords: 'large text contrast spacing underline links keyboard screen reader zoom disability adjustment WCAG' }
];

const form = document.querySelector('#site-search-form');
const input = document.querySelector('#site-search');
const status = document.querySelector('#search-status');
const results = document.querySelector('#search-results');

function renderSearch(query) {
  const cleanQuery = query.trim();
  results.replaceChildren();
  if (!cleanQuery) {
    status.textContent = 'Enter a word or phrase to search the website.';
    return;
  }
  const words = cleanQuery.toLocaleLowerCase('en-GB').split(/\s+/).filter(Boolean);
  const matches = searchPages.filter((page) => {
    const searchable = `${page.title} ${page.description} ${page.keywords}`.toLocaleLowerCase('en-GB');
    return words.every((word) => searchable.includes(word));
  });
  status.textContent = matches.length === 1 ? '1 result found.' : `${matches.length} results found.`;
  if (!matches.length) {
    const message = document.createElement('p');
    message.className = 'notice';
    message.append('I could not find a matching page. Try fewer words or ');
    const link = document.createElement('a');
    link.href = 'contact.html';
    link.textContent = 'contact me';
    message.append(link, ' and describe what you need help with.');
    results.append(message);
    return;
  }
  matches.forEach((page) => {
    const article = document.createElement('article');
    article.className = 'search-result';
    const heading = document.createElement('h2');
    const link = document.createElement('a');
    link.href = page.url;
    link.textContent = page.title;
    heading.append(link);
    const description = document.createElement('p');
    description.textContent = page.description;
    article.append(heading, description);
    results.append(article);
  });
}

const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
input.value = initialQuery;
renderSearch(initialQuery);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = input.value.trim();
  const url = query ? `search.html?q=${encodeURIComponent(query)}` : 'search.html';
  window.history.replaceState({}, '', url);
  renderSearch(query);
});
