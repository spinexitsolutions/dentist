import type { DB, Appointment, Patient, Lead, AppointmentStatus, LeadStatus } from "./types";

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const IMG = {
  heroSmile: u("1494790108377-be9c29b29330", 1400),
  clinicWide: u("1629909613654-28e377c37b09", 2400),
  clinic2: u("1629909615184-74f495363b67", 1600),
  clinic3: u("1643660527072-9c702932f606", 1600),
  clinic4: u("1598256989800-fe5f95da9787", 1600),
  reception: u("1519494026892-80bbd2d6fd0d", 1600),
  atWork: u("1588776814546-daab30f310ce", 1600),
  atWork2: u("1606811841689-23dfddce3e95", 1600),
  scan: u("1667133295315-820bb6481730", 1600),
  xray: u("1588776814546-1ffcf47267a5", 1600),
  aligner: u("1609840114035-3c981b782dfe", 1600),
  model: u("1468493858157-0da44aaf1d13", 1600),
  check: u("1606811971618-4486d14f3f99", 1600),
  mask: u("1606265752439-1f18756aa5fc", 1600),
  digital: u("1600170311833-c2cf5280ce49", 1600),
  smile2: u("1580489944761-15a19d654956", 1200),
  smile3: u("1528892952291-009c663ce843", 1200),
  smile4: u("1607990281513-2c110a25bd8c", 1200),
  smile5: u("1531123897727-8f129e1688ce", 1200),
  smile6: u("1507003211169-0a1dd7228f2d", 1200),
  smile7: u("1544005313-94ddf0286df2", 1200),
};

const avatar = (id: string) => u(id, 300);

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

function demoCrm() {
  const people = [
    ["Aarav Mehta", "+91 98200 11223", "aarav.m@example.com", "M"],
    ["Diya Kapoor", "+91 98190 44556", "diya.k@example.com", "F"],
    ["Kabir Shah", "+91 99300 77889", "kabir.s@example.com", "M"],
    ["Ananya Iyer", "+91 98701 22334", "ananya.i@example.com", "F"],
    ["Rohan Desai", "+91 97690 55667", "rohan.d@example.com", "M"],
    ["Meera Nair", "+91 98330 88990", "meera.n@example.com", "F"],
    ["Vihaan Rao", "+91 98922 10101", "vihaan.r@example.com", "M"],
    ["Ishita Bose", "+91 99872 20202", "ishita.b@example.com", "F"],
    ["Arjun Malhotra", "+91 98673 30303", "arjun.m@example.com", "M"],
    ["Saanvi Joshi", "+91 98204 40404", "saanvi.j@example.com", "F"],
  ];
  const services = ["Invisible Aligners", "Teeth Whitening", "Dental Implants", "Smile Makeover", "Root Canal", "Hygiene & Cleaning"];
  const doctors = ["Dr. Naina Verma", "Dr. Aditya Sen", "Dr. Leah Fernandes"];
  const times = ["10:00", "11:30", "13:00", "15:30", "17:00", "18:30"];
  const statuses: AppointmentStatus[] = ["completed", "completed", "confirmed", "pending", "confirmed", "cancelled", "completed", "pending", "no-show", "confirmed"];

  const patients: Patient[] = people.map((p, i) => ({
    id: `pat_${i + 1}`,
    name: p[0],
    phone: p[1],
    email: p[2],
    gender: p[3],
    dob: `19${80 + i}-0${(i % 9) + 1}-1${i % 9}`,
    notes: i % 3 === 0 ? "Prefers evening slots. Mild anxiety — offer headphones." : "",
    tags: i % 2 === 0 ? ["VIP"] : i % 3 === 0 ? ["Aligners"] : [],
    createdAt: addDays(-60 + i * 4).toISOString(),
  }));

  const appointments: Appointment[] = [];
  for (let i = 0; i < 22; i++) {
    const p = patients[i % patients.length];
    const offset = -24 + i * 2;
    const status: AppointmentStatus = offset > 0 ? (i % 4 === 0 ? "pending" : "confirmed") : statuses[i % statuses.length] === "pending" ? "completed" : statuses[i % statuses.length];
    appointments.push({
      id: `apt_${i + 1}`,
      name: p.name,
      phone: p.phone,
      email: p.email,
      service: services[i % services.length],
      doctor: doctors[i % doctors.length],
      date: iso(addDays(offset)),
      time: times[i % times.length],
      notes: i % 5 === 0 ? "First visit — referred by a friend." : "",
      status,
      source: ["Website", "Phone", "Walk-in", "Instagram"][i % 4],
      patientId: p.id,
      createdAt: addDays(offset - 3).toISOString(),
    });
  }

  const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "won", "new", "lost"];
  const leads: Lead[] = [
    ["Priya Sharma", "Pricing for aligners", "Hi, I wanted to know the total cost and duration for invisible aligners. Do you offer EMI?"],
    ["Neil D'Souza", "Implant consultation", "I lost a molar last year. Would like a consultation for an implant this month."],
    ["Tanya Gupta", "Whitening before wedding", "My wedding is in 6 weeks — what whitening plan would you suggest?"],
    ["Rahul Verma", "Kids check-up", "Do you see children? My son is 7 and needs a check-up."],
    ["Zara Khan", "Insurance question", "Is Star Health accepted for root canal treatment?"],
    ["Karan Singh", "Veneers", "Looking for a full smile makeover with veneers. Can I see more cases?"],
  ].map((l, i) => ({
    id: `lead_${i + 1}`,
    name: l[0],
    email: l[0].toLowerCase().replace(/[^a-z]+/g, ".") + "@example.com",
    phone: `+91 98${i}00 ${10000 + i * 1111}`,
    subject: l[1],
    message: l[2],
    status: leadStatuses[i],
    createdAt: addDays(-i * 2).toISOString(),
  }));

  return { patients, appointments, leads };
}

export function createSeed(): DB {
  const crm = demoCrm();
  return {
    settings: {
      brand: {
        name: "Ivory Dental Studio",
        shortName: "Ivory",
        tagline: "Modern dentistry, quietly perfected.",
        accent: "#1769E0",
        pop: "#9FF0DA",
        ink: "#0B1E33",
        paper: "#F4F7FA",
      },
      intro: {
        enabled: true,
        style: "smile",
        line1: "Ivory",
        line2: "Dental Studio",
        duration: 2.6,
        showOncePerSession: true,
      },
      announcement: {
        enabled: true,
        text: "New: same-day digital crowns — book a free 3D scan",
        link: "/book",
      },
      hero: {
        eyebrow: "Dental studio · Bandra West, Mumbai",
        title: "Healthy smiles,",
        highlight: "gently made.",
        titleEnd: "Precision dentistry, designed around you.",
        subtitle:
          "Calm, painless, beautifully engineered dentistry. From a routine clean to a full smile makeover — designed around you, delivered with care.",
        image: IMG.heroSmile,
        wideImage: IMG.clinicWide,
        caption: "Gentle, precise, beautifully calm.",
        variant: "orbit",
        ctaPrimary: "Book a visit",
        ctaSecondary: "Explore treatments",
        rating: "4.9",
        reviews: "2,400+ Google reviews",
      },
      statement: {
        text: "We believe a visit to the dentist should feel less like a procedure and more like a ritual — unhurried, transparent and genuinely painless. Every detail of our studio, from the light to the lasers, is designed to make you smile before we even begin.",
      },
      about: {
        eyebrow: "The studio",
        title: "A clinic that feels like a calm, sunlit lounge.",
        body: "Founded in 2009, Ivory brings together specialists in orthodontics, implantology and cosmetic dentistry under one roof. We combine digital diagnostics, microscope-guided treatment and a hospitality-first approach so that every appointment feels effortless.",
        image: IMG.clinic2,
        image2: IMG.atWork,
        years: "15",
        points: ["Microscope-guided precision", "Same-day digital crowns", "Hospital-grade sterilisation", "Transparent, fixed pricing"],
      },
      cta: {
        title: "Your new smile starts with a single conversation.",
        subtitle: "Book a consultation in under 60 seconds. Free 3D smile scan for first-time visitors.",
        image: IMG.clinic3,
      },
      contact: {
        phone: "+91 98200 12345",
        whatsapp: "919820012345",
        email: "hello@ivorydental.studio",
        address: "12 Pali Hill Road, Bandra West, Mumbai 400050",
        mapQuery: "Pali Hill, Bandra West, Mumbai",
        emergency: "+91 98200 99999",
        hours: [
          { day: "Monday", open: "09:00", close: "20:00", closed: false },
          { day: "Tuesday", open: "09:00", close: "20:00", closed: false },
          { day: "Wednesday", open: "09:00", close: "20:00", closed: false },
          { day: "Thursday", open: "09:00", close: "20:00", closed: false },
          { day: "Friday", open: "09:00", close: "20:00", closed: false },
          { day: "Saturday", open: "10:00", close: "18:00", closed: false },
          { day: "Sunday", open: "00:00", close: "00:00", closed: true },
        ],
      },
      social: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        youtube: "https://youtube.com",
        linkedin: "https://linkedin.com",
      },
      sections: [
        { key: "statement", label: "Statement (scroll text reveal)", enabled: true },
        { key: "services", label: "Treatments", enabled: true },
        { key: "stats", label: "Numbers", enabled: true },
        { key: "about", label: "About the studio", enabled: true },
        { key: "process", label: "Your visit (stacking cards)", enabled: true },
        { key: "gallery", label: "Smile gallery (before / after)", enabled: true },
        { key: "doctors", label: "Doctors", enabled: true },
        { key: "technology", label: "Technology bento", enabled: true },
        { key: "testimonials", label: "Testimonials", enabled: true },
        { key: "pricing", label: "Membership plans", enabled: true },
        { key: "faq", label: "FAQ", enabled: true },
        { key: "blog", label: "Journal", enabled: true },
        { key: "cta", label: "Booking CTA", enabled: true },
        { key: "contact", label: "Visit us", enabled: true },
      ],
      insurers: ["Star Health", "HDFC ERGO", "ICICI Lombard", "Niva Bupa", "Care Health", "Tata AIG", "Aditya Birla"],
      booking: {
        slots: ["09:30", "10:30", "11:30", "12:30", "14:30", "15:30", "16:30", "17:30", "18:30"],
        daysAhead: 21,
        closedWeekdays: [0],
      },
      seo: {
        title: "Ivory Dental Studio — Modern dentistry in Mumbai",
        description:
          "Painless, precise and beautifully designed dental care. Aligners, implants, whitening, smile makeovers and family dentistry in Bandra West, Mumbai.",
      },
    },
    services: [
      {
        id: "svc_1",
        slug: "invisible-aligners",
        title: "Invisible Aligners",
        short: "Straighten your smile discreetly with custom clear aligners.",
        description:
          "Our digitally planned clear aligners gently move your teeth into place without metal brackets. You'll see a 3D preview of your final smile before treatment begins, and swap aligners every two weeks from the comfort of home.",
        icon: "Sparkles",
        image: IMG.aligner,
        price: "From ₹1,20,000",
        duration: "6–18 months",
        featured: true,
        benefits: ["3D smile preview before you start", "Removable & nearly invisible", "Fewer clinic visits", "EMI options available"],
      },
      {
        id: "svc_2",
        slug: "teeth-whitening",
        title: "Teeth Whitening",
        short: "Up to 8 shades brighter in a single, sensitivity-free session.",
        description:
          "Professional LED-activated whitening that is safe for enamel and calibrated to your natural shade. Includes a take-home kit to keep your smile luminous.",
        icon: "Sun",
        image: IMG.smile2,
        price: "From ₹14,000",
        duration: "60 minutes",
        featured: true,
        benefits: ["Results in one visit", "Enamel-safe gel", "Take-home maintenance kit", "Low-sensitivity protocol"],
      },
      {
        id: "svc_3",
        slug: "dental-implants",
        title: "Dental Implants",
        short: "Permanent, natural-looking replacements for missing teeth.",
        description:
          "Guided implant surgery planned on a 3D CBCT scan for millimetre accuracy. Titanium and zirconia options with lifetime implant warranty.",
        icon: "ShieldCheck",
        image: IMG.model,
        price: "From ₹35,000",
        duration: "2–4 visits",
        featured: true,
        benefits: ["Computer-guided placement", "Lifetime implant warranty", "Feels like a natural tooth", "Sedation available"],
      },
      {
        id: "svc_4",
        slug: "smile-makeover",
        title: "Smile Makeover",
        short: "Veneers and digital smile design, tailored to your face.",
        description:
          "We design your new smile digitally, try it on in a mock-up, and then craft ultra-thin porcelain veneers by hand in our partner lab.",
        icon: "Smile",
        image: IMG.scan,
        price: "From ₹18,000 / tooth",
        duration: "2–3 visits",
        featured: true,
        benefits: ["Digital smile design", "Try before you commit", "Hand-crafted porcelain", "Minimal preparation"],
      },
      {
        id: "svc_5",
        slug: "root-canal",
        title: "Painless Root Canal",
        short: "Single-sitting, microscope-guided root canal therapy.",
        description:
          "Rotary instruments, a surgical microscope and computer-controlled anaesthesia let us save your natural tooth in a single, comfortable visit.",
        icon: "Activity",
        image: IMG.mask,
        price: "From ₹6,500",
        duration: "60–90 minutes",
        featured: false,
        benefits: ["Single sitting in most cases", "Microscope precision", "Computer-controlled anaesthesia", "Same-day crown option"],
      },
      {
        id: "svc_6",
        slug: "hygiene-cleaning",
        title: "Hygiene & Cleaning",
        short: "Airflow polishing for a deep, gentle, spa-like clean.",
        description:
          "Guided biofilm therapy uses warm air, water and fine powder to remove plaque and stains gently — no scraping, no discomfort.",
        icon: "Droplets",
        image: IMG.check,
        price: "From ₹2,500",
        duration: "45 minutes",
        featured: false,
        benefits: ["No scraping", "Removes coffee & tea stains", "Gum health screening", "Personal care plan"],
      },
      {
        id: "svc_7",
        slug: "kids-dentistry",
        title: "Kids Dentistry",
        short: "Gentle, playful care that builds lifelong habits.",
        description:
          "A dedicated paediatric suite with ceiling screens, sealants, fluoride therapy and habit coaching for children of every age.",
        icon: "Baby",
        image: IMG.clinic4,
        price: "From ₹1,500",
        duration: "30 minutes",
        featured: false,
        benefits: ["Child-friendly suite", "Preventive sealants", "Habit coaching", "Parents in the room"],
      },
      {
        id: "svc_8",
        slug: "emergency-care",
        title: "Emergency Care",
        short: "Same-day relief for pain, swelling and broken teeth.",
        description:
          "Call our emergency line and we'll see you the same day. Toothache, chipped teeth, lost crowns — we'll get you comfortable fast.",
        icon: "Siren",
        image: IMG.atWork2,
        price: "From ₹1,000",
        duration: "Same day",
        featured: false,
        benefits: ["Same-day appointments", "Dedicated emergency line", "Pain relief first", "Weekend support"],
      },
    ],
    doctors: [
      {
        id: "doc_1",
        name: "Dr. Naina Verma",
        role: "Founder · Cosmetic Dentist",
        bio: "Naina trained in aesthetic dentistry in London and has designed over 3,000 smiles. She leads every smile makeover at Ivory.",
        image: u("1559839734-2b71ea197ec2", 900),
        experience: "15 yrs",
        specialties: ["Veneers", "Smile design", "Whitening"],
      },
      {
        id: "doc_2",
        name: "Dr. Aditya Sen",
        role: "Implantologist",
        bio: "Aditya specialises in guided implant surgery and full-arch rehabilitation, with a focus on minimally invasive techniques.",
        image: u("1612349317150-e413f6a5b16d", 900),
        experience: "12 yrs",
        specialties: ["Implants", "Bone grafting", "Full-arch"],
      },
      {
        id: "doc_3",
        name: "Dr. Leah Fernandes",
        role: "Orthodontist",
        bio: "Leah is a certified Diamond aligner provider who believes great orthodontics should be invisible, comfortable and fast.",
        image: u("1594824476967-48c8b964273f", 900),
        experience: "10 yrs",
        specialties: ["Aligners", "Braces", "Kids ortho"],
      },
      {
        id: "doc_4",
        name: "Dr. Kunal Arora",
        role: "Endodontist",
        bio: "Kunal performs microscope-guided root canals and is known among patients for being the gentlest hands in the city.",
        image: u("1622253692010-333f2da6031d", 900),
        experience: "9 yrs",
        specialties: ["Root canal", "Microsurgery", "Emergency"],
      },
    ],
    testimonials: [
      { id: "t1", name: "Ritika Sharma", role: "Aligners patient", text: "I genuinely look forward to my appointments. The team is warm, the clinic is beautiful and my teeth have never looked better.", rating: 5, avatar: avatar("1438761681033-6461ffad8d80") },
      { id: "t2", name: "Sameer Kulkarni", role: "Implant patient", text: "Painless from start to finish. They showed me the 3D plan before surgery — I knew exactly what was happening at every step.", rating: 5, avatar: avatar("1500648767791-00dcc994a43e") },
      { id: "t3", name: "Aisha Qureshi", role: "Smile makeover", text: "Dr. Naina designed veneers that look completely natural. People keep telling me I look rested — not that I 'had work done'.", rating: 5, avatar: avatar("1531123897727-8f129e1688ce") },
      { id: "t4", name: "Dev Patel", role: "Root canal", text: "I was terrified of root canals. Finished in one sitting and I felt nothing. Wish I'd come here years ago.", rating: 5, avatar: avatar("1506794778202-cad84cf45f1d") },
      { id: "t5", name: "Natasha Rao", role: "Whitening", text: "Six shades whiter in an hour, zero sensitivity. The take-home kit is a lovely touch.", rating: 5, avatar: avatar("1534528741775-53994a69daeb") },
      { id: "t6", name: "Vikram Nair", role: "Family plan", text: "Both my kids actually ask to go to the dentist now. That says everything about this team.", rating: 5, avatar: avatar("1507003211169-0a1dd7228f2d") },
      { id: "t7", name: "Fatima Sheikh", role: "Hygiene", text: "The airflow cleaning is like a spa treatment. No scraping, no bleeding — just a really fresh smile.", rating: 5, avatar: avatar("1544005313-94ddf0286df2") },
      { id: "t8", name: "Arnav Jain", role: "Emergency care", text: "Cracked a tooth on a Saturday night and they saw me Sunday morning. Calm, quick and kind.", rating: 5, avatar: avatar("1545167622-3a6ac756afa4") },
    ],
    gallery: [
      { id: "g1", title: "Porcelain veneers", treatment: "Smile makeover · 2 visits", before: IMG.heroSmile, after: IMG.heroSmile, simulateBefore: true },
      { id: "g2", title: "Clear aligners", treatment: "Aligners · 9 months", before: IMG.smile2, after: IMG.smile2, simulateBefore: true },
      { id: "g3", title: "Whitening", treatment: "LED whitening · 1 hour", before: IMG.smile3, after: IMG.smile3, simulateBefore: true },
      { id: "g4", title: "Composite bonding", treatment: "Bonding · 1 visit", before: IMG.smile4, after: IMG.smile4, simulateBefore: true },
    ],
    faqs: [
      { id: "f1", q: "Is treatment at Ivory really painless?", a: "We use computer-controlled anaesthesia, topical numbing gels and, where needed, conscious sedation. Most patients tell us they felt nothing at all." },
      { id: "f2", q: "Do you offer EMI or payment plans?", a: "Yes. Treatments above ₹20,000 can be split into 0% EMI over 3–12 months with leading banks and fintech partners." },
      { id: "f3", q: "Which insurance providers do you accept?", a: "We work with most major insurers including Star Health, HDFC ERGO, ICICI Lombard and Niva Bupa. Our team handles the paperwork for you." },
      { id: "f4", q: "How long does an aligner treatment take?", a: "Mild cases finish in 6 months; complex cases take up to 18 months. You'll see a 3D preview and an exact timeline at your first consultation." },
      { id: "f5", q: "What should I do in a dental emergency?", a: "Call our emergency line any time. We keep same-day slots open every day for pain, swelling, trauma and broken restorations." },
      { id: "f6", q: "How do you keep the clinic safe and sterile?", a: "We follow hospital-grade, four-stage sterilisation with Class B autoclaves, single-use disposables and HEPA air purification in every suite." },
    ],
    posts: [
      {
        id: "p1",
        slug: "aligners-vs-braces",
        title: "Aligners vs braces: which is right for you?",
        excerpt: "A clear, honest comparison of comfort, cost, speed and results — from an orthodontist.",
        content:
          "Clear aligners and traditional braces can both deliver beautiful, healthy results. The right choice depends on your bite, your lifestyle and how disciplined you can be with wear time.\n\nAligners are removable, nearly invisible and require fewer clinic visits. They work best for patients who can commit to wearing them 22 hours a day.\n\nBraces are fixed, so compliance is never a concern, and they can handle a wider range of complex movements.\n\nAt your consultation we'll scan your teeth in 3D and show you a simulation of both options, so you can make a confident decision.",
        cover: IMG.aligner,
        category: "Orthodontics",
        author: "Dr. Leah Fernandes",
        date: "2026-10-12",
        readTime: "5 min",
        published: true,
      },
      {
        id: "p2",
        slug: "whitening-myths",
        title: "Six teeth-whitening myths, debunked",
        excerpt: "Does whitening damage enamel? Do charcoal toothpastes work? Let's set the record straight.",
        content:
          "Professional whitening, done correctly, does not damage enamel. Our gels are pH balanced and contain desensitising agents.\n\nCharcoal toothpastes are abrasive and can actually wear enamel over time — we don't recommend them.\n\nWhitening only works on natural teeth, so plan any veneers or crowns after whitening to get a perfect shade match.",
        cover: IMG.smile2,
        category: "Cosmetic",
        author: "Dr. Naina Verma",
        date: "2026-09-28",
        readTime: "4 min",
        published: true,
      },
      {
        id: "p3",
        slug: "implant-journey",
        title: "Your dental implant journey, step by step",
        excerpt: "From 3D scan to final crown — here's exactly what to expect, and how long it takes.",
        content:
          "Step one is a 3D CBCT scan, which lets us plan the implant position digitally with millimetre accuracy.\n\nOn surgery day, a custom guide helps us place the implant through a tiny opening — often without stitches.\n\nAfter 8–12 weeks of healing, we attach a custom porcelain crown that's matched to your neighbouring teeth.",
        cover: IMG.model,
        category: "Implants",
        author: "Dr. Aditya Sen",
        date: "2026-09-02",
        readTime: "6 min",
        published: true,
      },
    ],
    plans: [
      { id: "pl1", name: "Essential", price: "₹999", period: "/ month", description: "Preventive care for healthy smiles.", features: ["2 check-ups & cleanings a year", "Digital X-rays included", "10% off all treatments", "Priority booking"], highlighted: false },
      { id: "pl2", name: "Signature", price: "₹1,999", period: "/ month", description: "Our most loved plan for adults.", features: ["Everything in Essential", "Airflow polish every quarter", "1 whitening session a year", "20% off cosmetic treatments", "Emergency visits included"], highlighted: true },
      { id: "pl3", name: "Family", price: "₹3,499", period: "/ month", description: "Cover up to 4 family members.", features: ["Everything in Essential × 4", "Kids sealants & fluoride", "15% off orthodontics", "Dedicated care coordinator"], highlighted: false },
    ],
    stats: [
      { id: "s1", value: 18000, suffix: "+", label: "Smiles transformed" },
      { id: "s2", value: 15, suffix: " yrs", label: "Of quiet excellence" },
      { id: "s3", value: 2400, suffix: "+", label: "Five-star Google reviews" },
      { id: "s4", value: 98, suffix: "%", label: "Say it was painless" },
    ],
    features: [
      { id: "ft1", title: "3D intra-oral scanning", text: "No messy moulds. A 2-minute scan gives us a perfect digital twin of your teeth.", icon: "ScanFace", image: IMG.scan },
      { id: "ft2", title: "Surgical microscopes", text: "25× magnification for precise, conservative treatment.", icon: "Microscope", image: IMG.mask },
      { id: "ft3", title: "Same-day crowns", text: "Designed and milled in-house while you relax.", icon: "Gem", image: IMG.digital },
      { id: "ft4", title: "Low-dose CBCT", text: "3D imaging with up to 80% less radiation.", icon: "Radar", image: IMG.xray },
      { id: "ft5", title: "Laser dentistry", text: "Faster healing, less bleeding, no drills for many procedures.", icon: "Zap", image: IMG.atWork2 },
    ],
    steps: [
      { id: "st1", title: "Consult & 3D scan", text: "A relaxed 30-minute conversation and a 3D scan of your smile. No pressure, no surprises.", image: IMG.scan },
      { id: "st2", title: "Your personalised plan", text: "We walk you through a digital preview, fixed pricing and a clear timeline.", image: IMG.digital },
      { id: "st3", title: "Gentle treatment", text: "Unhurried appointments in private suites — with headphones, blankets and your favourite playlist.", image: IMG.atWork },
      { id: "st4", title: "Aftercare for life", text: "Reminders, check-ins and a care team on WhatsApp whenever you need us.", image: IMG.clinic2 },
    ],
    appointments: crm.appointments,
    patients: crm.patients,
    leads: crm.leads,
    subscribers: [
      { id: "sub1", email: "hello@example.com", createdAt: addDays(-5).toISOString() },
      { id: "sub2", email: "smile@example.com", createdAt: addDays(-2).toISOString() },
    ],
  };
}
