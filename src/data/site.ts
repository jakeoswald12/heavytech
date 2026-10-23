// Site-wide content. Copy is drawn from heavytech.ai and HeavyTech's public interviews.
// Keep claims within what HeavyTech has said publicly: no specs, dates or prices until approved.

export const site = {
  name: "HeavyTech",
  tagline: "Built for work.",
  description:
    "HeavyTech builds hybrid and electric off-highway machines in Fort Wayne, Indiana: easier to own, easier to fix, and super fuel efficient.",
  email: "info@goheavytech.com",
  location: "Fort Wayne, Indiana",
  investorPortal: "https://investors.heavytech.ai/",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/heavytech-inc/" },
    { label: "YouTube", href: "https://www.youtube.com/@HeavyTechInc" },
    { label: "Instagram", href: "https://www.instagram.com/goheavytechai/" },
    { label: "X", href: "https://x.com/GoHeavyTech" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61575822623089" },
  ],
};

// Order matches the order these pages are presented across the site.
export const nav = [
  { href: "/machines/", label: "Machines" },
  { href: "/technology/", label: "Technology" },
  { href: "/ownership/", label: "Ownership" },
  { href: "/news/", label: "News" },
  { href: "/company/", label: "Company" },
];

export type SplatModel = {
  src: string;
  rotX: number;
  rotY: number;
  scale: number;
  y: number;
};

export type Machine = {
  slug: string;
  code: string;
  name: string;
  category: string;
  status: string;
  statusHot?: boolean;
  summary: string;
  intro: string[];
  features: { title: string; body: string }[];
  hero: { src: string; alt: string };
  gallery: { src: string; alt: string; caption: string }[];
  model?: SplatModel;
};

export const machines: Machine[] = [
  {
    slug: "ht-1",
    code: "HT-1",
    name: "HT-1",
    category: "Compact track loader",
    status: "Prototype in build",
    statusHot: true,
    summary:
      "The first HeavyTech machine. Diesel-electric hybrid, electro-hydraulic work functions and a modular digital cab.",
    intro: [
      "HT-1 is a compact track loader designed from a blank sheet around an electric architecture. The first prototype, a diesel-electric hybrid, is being built in Fort Wayne.",
      "Every work function gets its own electric motor and pump, the power source at the back swaps out, and every major component can be reached without a fight.",
    ],
    features: [
      { title: "Interchangeable powertrain", body: "Battery-electric, hybrid or plug-in hybrid. The rear power module swaps, so the machine fits the job instead of the other way around." },
      { title: "Electro-hydraulics", body: "A dedicated electric motor drives each work-function pump. No directional or pressure control valves turning energy into heat." },
      { title: "Modular digital cab", body: "From an open ROPS platform to a lighted canopy or a fully enclosed, climate-controlled cab, with digital controls and panoramic visibility." },
      { title: "Autonomy ready", body: "A sensor module mounts front and back of the cab. Add it or remove it to enable autonomous functions on your terms." },
      { title: "Machine vision", body: "Camera-based machine-state sensing that can read attachment position without traditional sensors, built for operator assistance and automation." },
      { title: "Complete access", body: "Removable panels, swing-out service doors, labeled wiring and modular subsystems. Open diagnostics and full service documentation." },
    ],
    hero: { src: "/images/machines/ctl_main.webp", alt: "HeavyTech HT-1 compact track loader, black chassis with yellow cab" },
    gallery: [
      { src: "/images/machines/ctl_access.webp", alt: "HT-1 with service panels open showing the power module", caption: "Service access" },
      { src: "/images/technology/guts.webp", alt: "HT-1 swappable power module", caption: "Swappable power module" },
    ],
    model: { src: "/models/ht-1.splat", rotX: Math.PI, rotY: Math.PI, scale: 1.25, y: 0.03 },
  },
  {
    slug: "arlo",
    code: "ARLO",
    name: "ARLO",
    category: "Articulated loader",
    status: "In development",
    summary:
      "An articulated, wheeled platform with a telescoping boom for farm, ranch and yard work, on the same swappable powertrain.",
    intro: [
      "ARLO brings the HeavyTech architecture to an articulated, wheeled loader with a telescoping boom: forks, bucket and attachments for the work that happens around barns, yards and job trailers.",
      "It shares the same power modules, electro-hydraulics and open-diagnostics approach as HT-1, so parts, training and service carry across the fleet.",
    ],
    features: [
      { title: "Shared power modules", body: "The same battery-electric, hybrid and plug-in hybrid modules as the rest of the HeavyTech platform." },
      { title: "Telescoping boom", body: "Reach and lift for pallets, bales and material handling, controlled by dedicated electric pumps." },
      { title: "Articulated chassis", body: "Tight turning and low ground disturbance for yards, barns and finished surfaces." },
      { title: "Open diagnostics", body: "The machine tells the technician which subsystem has a problem. No proprietary tools required." },
    ],
    hero: { src: "/images/machines/arlo_base256.webp", alt: "ARLO articulated loader with telescoping boom and pallet forks" },
    gallery: [
      { src: "/images/machines/arlo_base218.webp", alt: "ARLO base chassis with boom raised", caption: "Base chassis" },
      { src: "/images/machines/arlo_main.webp", alt: "ARLO power and hydraulic modules", caption: "Power and hydraulic modules" },
    ],
  },
  {
    slug: "defensex",
    code: "DX",
    name: "DefenseX",
    category: "Off-road & defense platform",
    status: "Concept",
    summary:
      "A tracked, autonomy-ready platform on the HeavyTech hybrid architecture for off-road and defense applications.",
    intro: [
      "DefenseX applies the HeavyTech hybrid architecture to a low-profile tracked platform with a modular top deck for blades, cargo and mission payloads.",
      "Hybrid power gives quiet, electric-only operation when it matters and onboard generation for range, with remote and autonomous operation designed in from day one.",
    ],
    features: [
      { title: "Hybrid range", body: "Electric drive with an onboard generator, so missions aren't limited by a charger." },
      { title: "Modular deck", body: "Configurable top deck for dozer blade, cargo or mission payloads." },
      { title: "Remote and autonomous", body: "Designed for teleoperation and autonomy from the start, not bolted on later." },
      { title: "American made", body: "Designed and built in Fort Wayne, Indiana with domestic components." },
    ],
    hero: { src: "/images/machines/defx1.webp", alt: "DefenseX tracked platform concept with dozer blade" },
    gallery: [
      { src: "/images/machines/defx3.webp", alt: "DefenseX with cargo deck configuration", caption: "Cargo deck" },
      { src: "/images/machines/defx2.webp", alt: "DefenseX with roll bar and blade", caption: "Blade configuration" },
    ],
  },
];

export const powertrains = [
  {
    id: "bev",
    label: "Battery-electric",
    bestFor: "Predictable duty cycles that return to power: warehouses, municipal work, rental fleets, noise- and emissions-sensitive sites.",
    energy: "Onboard battery pack, charged on site.",
    why: "Quiet, zero on-site emissions, lowest energy cost per hour of work.",
  },
  {
    id: "hybrid",
    label: "Hybrid",
    bestFor: "Long days at remote sites with no meaningful electrical infrastructure.",
    energy: "Engine-generator runs in its efficient range while the battery handles peak loads.",
    why: "Electric drive and digital control without betting the day on a charger.",
  },
  {
    id: "phev",
    label: "Plug-in hybrid",
    bestFor: "Mixed work: plug in when power is there, keep running when it isn’t.",
    energy: "Larger battery with an onboard generator for range.",
    why: "Most of the work done on grid energy, with no runtime anxiety.",
  },
];

export type NewsItem = {
  slug: string;
  title: string;
  date: string; // ISO
  kind: "Event" | "Press" | "Podcast" | "Article" | "Video";
  summary: string;
  image: string;
  href: string;
};

const post = (s: string) => `https://www.heavytech.ai/post/${s}`;

export const news: NewsItem[] = [
  { slug: "founders-forge", title: "HeavyTech hosts the first Founders Forge meetup", date: "2025-11-26", kind: "Event", summary: "A community meetup for Northeast Indiana’s builders, innovators and entrepreneurs.", image: "/images/news/founders-forge.webp", href: post("heavytech-hosts-the-first-ever-founders-forge-meetup") },
  { slug: "move-america", title: "Emerging technology at MOVE America 2025", date: "2025-11-26", kind: "Event", summary: "HeavyTech in Detroit at one of the country’s leading mobility, electrification and AI conferences.", image: "/images/news/move-america.webp", href: post("heavytech-showcases-emerging-technology-at-move-america-2025") },
  { slug: "ivt-expo", title: "Hybrid and vision technology at IVT Expo 2025", date: "2025-09-22", kind: "Event", summary: "Showing the latest hybrid and machine-vision work at IVT Expo USA in Chicago-Rosemont.", image: "/images/news/ivt-expo.webp", href: post("heavytech-showcases-next-gen-hybrid-vision-technology-at-ivt-expo-2025") },
  { slug: "power-progress", title: "Featured in Power Progress: “Grinding Off the Rust Belt”", date: "2025-07-01", kind: "Press", summary: "A full-length feature on HeavyTech’s mission, its Fort Wayne roots and its approach to electrification.", image: "/images/news/power-progress.webp", href: post("heavytech-featured-in-power-progress-magazine-grinding-off-the-rust-belt") },
  { slug: "off-highway-conference", title: "Swappable powertrain unveiled at the 2025 Off-Highway Conference", date: "2025-06-23", kind: "Video", summary: "HeavyTech’s CEO presents the interchangeable powertrain platform.", image: "/images/news/off-highway-conf.webp", href: post("heavytech-unveils-swappable-powertrain-platform-at-2025-off-highway-conference") },
  { slug: "nei-podcast", title: "On the NEI Pioneer Podcast", date: "2025-06-23", kind: "Podcast", summary: "Why Northeast Indiana is the right place to build a future-focused industrial company.", image: "/images/news/nei-podcast.webp", href: post("heavytech-featured-on-the-nei-pioneer-podcast-powering-the-future-from-fort-wayne") },
  { slug: "webinar", title: "Live update webinar: progress, traction and what’s ahead", date: "2025-06-23", kind: "Video", summary: "A live LinkedIn update on where HeavyTech stands.", image: "/images/news/webinar.webp", href: post("heavytech-hosts-live-update-webinar-on-linkedin-progress-traction-and-what-s-ahead") },
  { slug: "kickoff-recap", title: "HeavyTech kicks off in Fort Wayne", date: "2025-05-17", kind: "Event", summary: "Investors, industry leaders and community partners at the May 7 launch event.", image: "/images/news/kickoff-recap.webp", href: post("heavytech-kicks-off-innovation-journey-in-fort-wayne") },
];
