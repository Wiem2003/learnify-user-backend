# LearnHub — Angular

**Master New Skills Online — Anytime, Anywhere.**  
Join over 50,000+ students learning from world-class mentors. Transform your career with industry-leading courses.

## What is LearnHub

LearnHub is an **Angular** single-page application for an online learning platform. It showcases courses, mentors, community, testimonials, and pricing. The UI uses **Bootstrap 5** and the same design as the original template, now built with Angular 19 and standalone components.

## Getting Started

1. Clone or download the repository.
2. Install dependencies: `npm install`
3. Run the development server: `npm start` (or `ng serve`)
4. Open your browser at `http://localhost:4200`

## Build

- Development: `ng build` or `npm run build`
- Production: `ng build --configuration production`

Output is in `dist/learnhub`.

## Tech Stack

- **Angular 19** (standalone components, control flow)
- **Bootstrap 5** (styles + JS for navbar and modal)
- **SCSS** (Bootstrap variables + custom theme)
- **Routing** with anchor scrolling for in-page sections

## Project Structure

```
src/
├── app/
│   ├── app.component.ts      # Root component
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── components/            # Reusable UI components
│   │   ├── navbar/
│   │   ├── hero/
│   │   ├── courses/
│   │   ├── mentor/
│   │   ├── group/
│   │   ├── testimonials/
│   │   ├── pricing/
│   │   ├── footer/
│   │   └── get-started-modal/
│   └── pages/
│       └── home/              # Home page (all sections)
├── assets/                    # Images, SCSS partials
├── index.html
├── main.ts
└── styles.scss                # Global Bootstrap + custom styles
```

## Features

- **Navbar** with smooth scroll and active section highlight
- **Hero** with CTA and video link (GLightbox optional)
- **Courses** grid with data-driven cards
- **Mentors** section
- **Group / Community** CTA
- **Testimonials**
- **Pricing** plans with “Get Started” opening the modal
- **Footer** with links and social icons
- **Get Started** modal (Bootstrap) for sign-up

## Requirements

- Node.js 18+
- npm or yarn

## Support

- Contact: [Codescandy](https://codescandy.com/contact-us/)
