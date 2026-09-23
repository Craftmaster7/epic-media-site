EPIC MEDIA NETWORKS — WEBSITE
=============================

HOW TO PREVIEW
  Unzip, then open index.html in any browser. No server needed.

HOW TO PUBLISH
  Upload the entire folder (all .html files plus the assets, css and js folders) to any web host
  (Netlify, Vercel, GoDaddy, Bluehost, etc.). index.html is the homepage.

THE ONE FILE TO EDIT:  js/config.js
  formAccessKey  -> Free account at https://web3forms.com. Paste the Access Key so "Request a callback"
                    emails every lead to you. Until then, the form opens the visitor's email app pre-filled.
  schedulerUrl   -> Paste a Calendly (or similar) link so "Schedule a call" opens your booking page.
                    Until then, that button dials the phone number.
  leadEmail / phone -> Contact details used across the site.

PAGES
  index.html          Homepage (3D hero, seat toggle, customizer)
  restaurants.html    For restaurant owners
  advertisers.html    For local businesses
  installations.html  Gallery
  about.html          About / team
  privacy.html        Privacy policy (have your attorney review)

NOTES
  - Team photos for Scott, David and Nikki currently load from the old site. Copy them into assets/team/
    and update the three <img> tags in about.html so the page no longer depends on the old site.
  - Google Fonts (Bebas Neue, Libre Franklin) load from Google. Works offline with a fallback font.
  - The 3D scenes need WebGL (any modern browser). A flat image is shown automatically if it's unavailable.

BACKGROUND CATALOGS
  assets/wood/         99 wood samples from the ABC "Background Ideas" catalog, named by their code (412.jpg = #412).
  js/catalog.js        The wood list (with images embedded) and all 1,089 PANTONE Color Bridge codes with CMYK-derived
                       colors. Lead emails include the exact code the customer picked, e.g. "Wood #412" or "PANTONE 186".
