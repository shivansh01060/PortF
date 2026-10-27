export type StackItem = { mark: string; name: string };
export type StackGroup = { title: string; accent: string; items: StackItem[]; note?: string };

// grouped for the About section; every technology here was already in the original orb list
export const stack: StackGroup[] = [
  { title: "Frontend", accent: "#61dafb", items: [
    { mark: "Re", name: "React.js" }, { mark: "TS", name: "TypeScript" }, { mark: "Tw", name: "Tailwind CSS" },
  ] },
  { title: "Backend", accent: "#7cc35f", items: [
    { mark: "No", name: "Node.js" }, { mark: "Ex", name: "Express.js" }, { mark: "API", name: "REST APIs" },
  ] },
  { title: "Databases", accent: "#6f9ee0", items: [
    { mark: "Mo", name: "MongoDB" }, { mark: "Pg", name: "PostgreSQL" }, { mark: "Sb", name: "Supabase" },
  ] },
  { title: "AI", accent: "#c084fc", items: [{ mark: "AI", name: "Generative AI" }],
    note: "Catalog generator trained on 10,000+ records" },
];

export type Work = { n: string; type: string; date?: string; title: string; role?: string; desc: string; tags: string[]; link?: string };

export const work: Work[] = [
  { n: "01", type: "EXPERIENCE · INTERN", date: "SEP – DEC 2026", title: "SunSolarOne", role: "Software Development Engineering Intern",
    desc: "SDE intern on a business management platform covering leads, proposals, invoices, payments, inventory and customer portals. UI fixes, manual QA, security testing and end-to-end journey validation.",
    tags: ["Frontend", "QA", "Security Testing", "Product"] },
  { n: "02", type: "FREELANCE · FULL-STACK + UI/UX", title: "Aim Divine Educational Overseas", role: "Full-Stack Web Developer & UI/UX Designer",
    desc: "Designed, built and deployed a multi-page study-abroad consultancy site with a global destination explorer, seven country pages, student journeys and WhatsApp enquiry paths.",
    tags: ["Responsive UI", "Destination Explorer", "Deployment"] },
  { n: "03", type: "FREELANCE · WEBSITE", date: "MAR 2026", title: "ASPC Spices", role: "Website Development & Maintenance",
    desc: "Designed and built the official business website, then optimised load speed with code and image compression. Ongoing maintenance and client-led iterations.",
    tags: ["Web Design", "Performance", "Maintenance"], link: "https://aspcspices.in" },
  { n: "04", type: "PROJECT · MERN STACK", title: "Business Management Portal",
    desc: "Full-stack portal with an AI catalog generator for 10,000+ products, 15+ REST APIs and core API responses under 300 ms. Models trained on an 80:20 split.",
    tags: ["MongoDB", "Express", "React", "Node.js", "AI"], link: "https://github.com/shivansh01060" },
  { n: "05", type: "PROJECT · FINTECH", title: "DebtWise",
    desc: "Personal finance and debt platform tracking income, expenses, loans, savings and goals. Supabase Auth, PostgreSQL storage and API responses under 250 ms.",
    tags: ["React", "Node.js", "PostgreSQL", "Supabase"], link: "https://github.com/shivansh01060" },
];

export const EMAIL = "shivanshnarayan.sn@gmail.com";
export const PHONE_TEL = "+917398300725";
export const PHONE_LABEL = "+91 73983 00725";
