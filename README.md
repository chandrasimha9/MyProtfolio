# CHANDRA SIMHA — Cinematic Developer Portfolio

An award-winning, Awwwards-level personal portfolio website engineered for **G Raja Chandra Simha Yadav** (CHANDRA SIMHA), Full-Stack Web Developer & AI Developer.

---

## 🌟 Key Features & Architectural Highlights

1. **Cinematic Hero Video Integration**:
   - Features Chandra Simha's personal cinematic introductory video (`public/videos/chandra-hero.mp4`).
   - High-fidelity video poster extraction (`public/images/chandra-hero-poster.jpg`).
   - Automatic muted playback with fallback play button.
   - Interactive sound toggle with live audio wave visualization.
   - Original black-and-white cinematic grading (`grayscale contrast-125 brightness-90`).
   - **Responsive Mobile Cropping**: Focal positioning (`object-[50%_20%]`) prioritizing Chandra's face and upper body on mobile devices.

2. **Personal Brand Identity & Resume**:
   - Extracted verified credentials from actual professional resume.
   - Downloadable PDF resume (`public/resume/Resume.pdf`).
   - Zero invented information: exact email (`chandrasimha66018@gmail.com`), phone (`+91 6301081817`), college, CGPA, and project details.

3. **12 Cinematic Portfolio Sections**:
   - **Section 01 — Cinematic Preloader**: Full-screen entrance with progress indicator and GSAP reveal.
   - **Section 02 — Navigation**: Fixed glass navbar with active section indicator, theme toggle, and mobile menu.
   - **Section 03 — Hero**: Edge-to-edge video canvas with oversized typography.
   - **Section 04 — About Me**: Academic bio, core focus, and animated statistics (9.0 CGPA, 100+ LeetCode, 3 Projects, 2 Internships).
   - **Section 05 — Technical Skills**: Categorized toolkits across Python, React, FastAPI, MySQL, AI/ML, and Core CS.
   - **Section 06 — Projects**: Selected work (CampusGPT, FraudShield AI, Hospital Management System) with interactive architecture flow drawers.
   - **Section 07 — Internship Experience**: Vertical timeline with glowing nodes for Infosys Springboard Tech and EchoBrains.
   - **Section 08 — Education**: Academic timeline (B.Tech CSE 9.0 CGPA, Narayana 8.8, Yashoda Garden 9.2).
   - **Section 09 — Achievements**: 100+ LeetCode Problems Solved showcase.
   - **Section 10 — Horizontal Scroll**: Pinned GSAP ScrollTrigger statement ("FROM IDEAS TO INTELLIGENT DIGITAL SOLUTIONS").
   - **Section 11 — Contact**: Direct email, call, clipboard copy with confetti celebration, and inquiry form.
   - **Section 12 — Footer**: Branding, quick links, and dynamic copyright year.

4. **Design System & Motion**:
   - Dark mode default (`#090A0F`, `#11131B`, `#171A24`, `#648CFF`).
   - Functional light mode toggle (`#F8F9FC`, `#FFFFFF`, `#245BDB`).
   - Smooth inertia scrolling powered by Lenis + GSAP ScrollTrigger ticker synchronization.
   - Custom magnetic cursor for desktop users.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Motion & Scroll**: GSAP 3, GSAP ScrollTrigger, Framer Motion, Lenis Smooth Scroll
- **Icons**: Lucide React
- **Enhancements**: Canvas Confetti, React Intersection Observer

---

## 🚀 Running the Project

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the website.

### Production Build & Launch
```bash
npm run build
npm start
```
The optimized production build compiles with zero errors and prerenders all pages as static HTML.
