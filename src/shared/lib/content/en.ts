import { SITE } from '../site';
import type { SiteContent } from './types';

export const en = {
  why: [
    {
      id: 'turnkey',
      icon: 'Wrench',
      title: 'Full turnkey cycle',
      text: 'From the site visit and design through installation, commissioning, and grid-operator paperwork. One contract, one point of contact, no subcontractors for you to chase down.',
    },
    {
      id: 'equipment',
      icon: 'ShieldCheck',
      title: 'Tier-1 equipment only',
      text: 'Longi and Jinko panels, Deye, Huawei, and Victron inverters. We don’t install unbranded components that come with no warranty and no service five years from now.',
    },
    {
      id: 'blackout',
      icon: 'BatteryCharging',
      title: 'Keeps running through outages',
      text: 'Hybrid systems with a backed-up critical-load circuit keep the house powered when the grid goes down. We design for the realities of the Ukrainian grid, not a catalogue spec sheet.',
    },
    {
      id: 'service',
      icon: 'Headset',
      title: 'Support after handover',
      text: 'Output monitoring, scheduled inspections, and warranty support. You get the direct contact of the engineer who ran your project, not a general support line.',
    },
  ],
  services: [
    {
      id: 'grid-tied',
      icon: 'Sun',
      title: 'Grid-tied solar stations',
      text: 'The fastest payback for daytime-consumption properties. Every generated kilowatt-hour covers your own load first, the surplus goes to the grid.',
    },
    {
      id: 'hybrid',
      icon: 'BatteryCharging',
      title: 'Hybrid stations with storage',
      text: 'Sun by day, battery by night and during outages. The right fit for a private home on an unstable grid.',
    },
    {
      id: 'backup',
      icon: 'PlugZap',
      title: 'Backup power systems',
      text: 'Inverter and batteries with no panels, or a minimal array. A fast fix when the real priority is simply not losing power.',
    },
    {
      id: 'green-tariff',
      icon: 'LineChart',
      title: 'Green-tariff stations',
      text: 'Design, installation, and full paperwork support for selling surplus generation back to the grid.',
    },
    {
      id: 'commercial',
      icon: 'Building2',
      title: 'Commercial properties',
      text: 'Factories, warehouses, hotels, and farms. Sized against your actual load profile, not an average consumption figure.',
    },
    {
      id: 'service-maintenance',
      icon: 'Wrench',
      title: 'Service and upgrades',
      text: 'Maintenance of existing stations, inverter replacement, array expansion, and adding storage to a system already in place.',
    },
  ],
  process: [
    {
      id: 'call',
      title: 'Inquiry and a short call',
      text: 'We confirm property type, consumption, connection phase, and your main goal — savings, backup, or selling surplus.',
    },
    {
      id: 'visit',
      title: 'Site visit',
      text: 'We inspect the roof or plot, measure cable runs, and check the incoming panel. This is where the real numbers come from, not an online calculator.',
    },
    {
      id: 'offer',
      title: 'Design and quote',
      text: 'A layout plan, equipment specification, output forecast, and a transparent line-item quote.',
    },
    {
      id: 'install',
      title: 'Installation and commissioning',
      text: 'Mounting, panel installation, wiring, inverter configuration, and load testing.',
    },
    {
      id: 'docs',
      title: 'Documentation and handover',
      text: 'Acceptance certificates, station passport, and grid-operator paperwork where required. We walk you through the monitoring app.',
    },
    {
      id: 'support',
      title: 'Service and monitoring',
      text: 'We track output, respond to anomalies, and run scheduled inspections for the full warranty term.',
    },
  ],
  stats: [
    { id: 'years', value: '9+', label: 'years in solar energy' },
    { id: 'objects', value: '380+', label: 'stations installed in Lviv and the region' },
    { id: 'power', value: '6.4 MW', label: 'total installed capacity' },
    { id: 'warranty', value: '25', label: 'year panel warranty' },
  ],
  expertise: [
    {
      id: 'design',
      title: 'Designed against a real load profile',
      text: 'We size systems against your actual daily curve — when the pump, water heater, and AC run, and what’s left for overnight — not a national average.',
    },
    {
      id: 'roofs',
      title: 'Complex roofs and mounting',
      text: 'Standing-seam and corrugated metal, slate, bitumen shingle, ballasted flat roofs, and ground mounts. We fit the mounting system to the roof, not the other way around.',
    },
    {
      id: 'grid',
      title: 'Grid-operator paperwork',
      text: 'We know the wiring-diagram, protection, and metering requirements, and package the submission so it clears review the first time.',
    },
    {
      id: 'safety',
      title: 'Electrical safety, no shortcuts',
      text: 'Arc-fault protection, separate AC/DC breakers, proper grounding, and surge protection. Not an optional extra.',
    },
  ],
  testimonials: [
    {
      id: 'placeholder-1',
      author: 'Sample review',
      role: 'Private home, Bryukhovychi',
      text: 'This is placeholder text. Real testimonials will be added once written consent is collected from clients.',
      isPlaceholder: true,
    },
    {
      id: 'placeholder-2',
      author: 'Sample review',
      role: 'Hotel, Lviv',
      text: 'This is placeholder text. Real testimonials will be added once written consent is collected from clients.',
      isPlaceholder: true,
    },
    {
      id: 'placeholder-3',
      author: 'Sample review',
      role: 'Farm, Horodok district',
      text: 'This is placeholder text. Real testimonials will be added once written consent is collected from clients.',
      isPlaceholder: true,
    },
  ],
  faq: [
    {
      id: 'price',
      question: 'Why is the kit price listed but installation given as a range?',
      answer:
        'Because the two differ in how predictable they are. Equipment cost we know exactly — it is listed on each station page. Installation depends on roof type and mounting, the cable run from panels to inverter and inverter to the panel, the state of the incoming service cable, and a dozen things only visible on site. So we publish installation as a range and give the exact figure after a free site visit, rather than quoting it blind.',
    },
    {
      id: 'blackout',
      question: 'Does the station work during a power outage?',
      answer:
        'A grid-tied station doesn’t — by code it shuts down with the grid. A hybrid station with storage does, switching to the backup circuit in a fraction of a second. If backup power is the main goal, we design a dedicated critical-load circuit for it.',
    },
    {
      id: 'payback',
      question: 'How many years until the station pays for itself?',
      answer:
        'For a private home with daytime consumption, expect roughly 5–8 years; a commercial property with steady daytime load is often faster. The exact number depends on tariff, self-consumption share, and system cost. Our calculator estimates payback; the kit price is on each station page.',
    },
    {
      id: 'green-tariff',
      question: 'Is self-consumption or the green tariff better?',
      answer:
        'For most private homes today, self-consumption wins — every kilowatt-hour you use yourself saves the full retail tariff. The green tariff makes sense once generation clearly exceeds consumption. We model both scenarios and show the difference.',
    },
    {
      id: 'roof',
      question: 'Will my roof work?',
      answer:
        'South-facing at a 30–35° pitch performs best, but east-west also works well and gives a flatter output curve through the day. Budget roughly 5–6 m² per kilowatt of panels. If the roof can’t fit the array, we install a ground mount instead.',
    },
    {
      id: 'winter',
      question: 'How much does the station produce in winter?',
      answer:
        'Roughly 20–30% of summer output. Panels still work under cloud cover and are actually more efficient in cold weather — day length is the main factor. We always model output month by month, never as a flat annual average.',
    },
    {
      id: 'installments',
      question: 'Is financing available?',
      answer:
        'Yes — we work with bank installment programs (6–24 months) and energy-efficiency loan programs. Terms depend on the bank and amount; see the Financing page for details.',
    },
    {
      id: 'time',
      question: 'How long does installation take?',
      answer:
        'A 5–15 kW residential station typically installs in 2–4 working days. From contract to commissioning usually runs 2–4 weeks, depending on equipment availability and weather.',
    },
  ],
  brands: [
    {
      id: 'longi',
      name: 'Longi Solar',
      category: 'Solar panels',
      note: 'High-efficiency N-type modules with stable long-term degradation.',
    },
    {
      id: 'jinko',
      name: 'Jinko Solar',
      category: 'Solar panels',
      note: 'A proven Tier-1 manufacturer at a competitive price per watt.',
    },
    {
      id: 'deye',
      name: 'Deye',
      category: 'Hybrid inverters',
      note: 'The workhorse of the Ukrainian market — backup, batteries, flexible configuration.',
    },
    {
      id: 'huawei',
      name: 'Huawei FusionSolar',
      category: 'Inverters and optimizers',
      note: 'Panel-level monitoring and shutdown.',
    },
    {
      id: 'victron',
      name: 'Victron Energy',
      category: 'Backup power',
      note: 'For complex off-grid and hybrid configurations.',
    },
    {
      id: 'pylontech',
      name: 'Pylontech',
      category: 'Battery storage',
      note: 'LiFePO4 batteries rated for 6,000+ cycles.',
    },
  ],
  team: [
    {
      id: 'lead-engineer',
      name: 'Lead Engineer',
      role: 'Design and calculations',
      bio: 'Responsible for system design, inverter selection, and grid-operator compliance.',
      isPlaceholder: true,
    },
    {
      id: 'install-lead',
      name: 'Installation Team Lead',
      role: 'Installation and commissioning',
      bio: 'Certified for electrical safety and work at height, 200+ projects delivered.',
      isPlaceholder: true,
    },
    {
      id: 'service',
      name: 'Service Engineer',
      role: 'Monitoring and support',
      bio: 'Runs diagnostics, scheduled inspections, and warranty claims.',
      isPlaceholder: true,
    },
  ],
  warranty: [
    {
      id: 'panels',
      years: 25,
      title: 'Solar panel warranty',
      text: 'Manufacturer product warranty plus a linear performance warranty — at least 84.8% of rated output at year 25.',
    },
    {
      id: 'inverter',
      years: 5,
      title: 'Inverter warranty',
      text: 'A 5-year base manufacturer warranty, extendable to 10 years on most models.',
    },
    {
      id: 'works',
      years: 1,
      title: 'Installation workmanship warranty',
      text: 'One year on mounting, wiring, and installation work. Callouts within warranty are free.',
    },
  ],
  financing: [
    {
      id: 'bank-installment',
      icon: 'Building2',
      provider: 'Bank installment plan',
      terms: '6–24 months, 0% on part of the amount via partner banks',
      note: 'Applied for in person or online; decisions are usually same-day.',
      isPlaceholder: true,
    },
    {
      id: 'energy-credit',
      icon: 'PiggyBank',
      provider: 'Energy-efficiency loan',
      terms: 'up to 5 years, reduced rate',
      note: 'Suited to combined solutions — a station paired with storage.',
      isPlaceholder: true,
    },
    {
      id: 'staged',
      icon: 'FileCheck2',
      provider: 'Staged payment',
      terms: '50% deposit / 40% before installation / 10% after commissioning',
      note: 'Standard contract terms, no bank involved.',
      isPlaceholder: true,
    },
  ],
  quote: {
    text: 'A solar station isn’t only equipment you buy — it’s also an engineering project. The same kit mounts differently on two different roofs, which is why we name the kit price up front and the installation cost after the visit.',
    author: 'The INVICSOL team',
    authorRole: 'Lviv',
  },
  contact: {
    phone: SITE.phone,
    phoneDisplay: SITE.phoneDisplay,
    email: SITE.email,
    address: 'Lviv, 147 Zelena St.',
    hours: 'Mon–Fri 9:00–18:00, Sat 10:00–15:00',
    telegram: SITE.telegram,
    viber: SITE.viber,
    mapEmbedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=23.98%2C49.80%2C24.09%2C49.87&layer=mapnik&marker=49.8397%2C24.0297',
  },
} satisfies SiteContent;
