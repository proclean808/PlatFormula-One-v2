import { useState } from "react";

interface LinkItem {
  label: string;
  url: string;
  desc: string;
  tag?: string;
}

interface Section {
  id: string;
  title: string;
  icon: string;
  color: string;
  borderColor: string;
  links: LinkItem[];
}

const SECTIONS: Section[] = [
  {
    id: "yc",
    title: "Y Combinator",
    icon: "◈",
    color: "text-orange-400",
    borderColor: "border-orange-800",
    links: [
      { label: "Apply to YC", url: "https://www.ycombinator.com/apply", desc: "Submit your application to the world's top accelerator", tag: "Apply" },
      { label: "Startup School", url: "https://www.startupschool.org", desc: "Free 10-week program for early-stage founders", tag: "Learn" },
      { label: "YC Library", url: "https://www.ycombinator.com/library", desc: "Essays, videos, and guides from YC partners", tag: "Content" },
      { label: "Co-Founder Matching", url: "https://www.ycombinator.com/cofounder-matching", desc: "Find your technical or business co-founder", tag: "Network" },
      { label: "SAFE Documents", url: "https://www.ycombinator.com/documents", desc: "Standard financing docs used by thousands of startups", tag: "Legal" },
      { label: "YC RFS", url: "https://www.ycombinator.com/rfs", desc: "Requests for Startups — problems YC wants solved", tag: "Ideas" },
      { label: "Hacker News", url: "https://news.ycombinator.com", desc: "The founder and builder community hub", tag: "Community" },
      { label: "YC YouTube", url: "https://www.youtube.com/c/ycombinator", desc: "Talks, office hours, and founder stories", tag: "Video" },
    ],
  },
  {
    id: "techstars",
    title: "Techstars",
    icon: "◉",
    color: "text-blue-400",
    borderColor: "border-blue-800",
    links: [
      { label: "Techstars Programs", url: "https://www.techstars.com", desc: "Global network of accelerator programs across industries", tag: "Apply" },
      { label: "Alchemist Accelerator", url: "https://www.alchemistaccelerator.com", desc: "Top program for enterprise-focused seed-stage startups", tag: "Apply" },
      { label: "Berkeley SkyDeck", url: "https://skydeck.berkeley.edu", desc: "UC Berkeley's official accelerator — hybrid model", tag: "Apply" },
      { label: "AngelPad", url: "https://angelpad.com", desc: "Hands-on seed accelerator with small cohorts", tag: "Apply" },
      { label: "Founder Institute", url: "https://fi.co", desc: "Pre-seed accelerator with global network", tag: "Apply" },
    ],
  },
  {
    id: "accelerators",
    title: "Other Accelerators",
    icon: "◆",
    color: "text-emerald-400",
    borderColor: "border-emerald-800",
    links: [
      { label: "500 Global", url: "https://500.co", desc: "Global VC and accelerator for early-stage companies", tag: "Apply" },
      { label: "Plug and Play", url: "https://www.plugandplaytechcenter.com", desc: "Innovation platform across 50+ industry verticals", tag: "Apply" },
      { label: "HAX", url: "https://hax.co", desc: "Hard tech venture firm — SF and Shenzhen", tag: "Apply" },
    ],
  },
  {
    id: "investors",
    title: "Venture Capital",
    icon: "◇",
    color: "text-purple-400",
    borderColor: "border-purple-800",
    links: [
      { label: "AngelList", url: "https://www.angellist.com", desc: "Connect with angels and syndicates", tag: "Raise" },
      { label: "a16z", url: "https://a16z.com", desc: "Andreessen Horowitz — seed to growth stage", tag: "VC" },
      { label: "Sequoia Capital", url: "https://www.sequoiacap.com", desc: "One of the most influential VC firms globally", tag: "VC" },
      { label: "First Round Capital", url: "https://firstround.com", desc: "Top seed firm with the First Round Review", tag: "VC" },
      { label: "Lightspeed", url: "https://lsvp.com", desc: "Enterprise, fintech, and consumer focus", tag: "VC" },
      { label: "Greylock", url: "https://greylock.com", desc: "Enterprise software and consumer internet", tag: "VC" },
      { label: "Bessemer", url: "https://www.bvp.com", desc: "AI, cloud, and healthcare focus", tag: "VC" },
      { label: "Founders Fund", url: "https://foundersfund.com", desc: "Revolutionary technology companies", tag: "VC" },
      { label: "Kleiner Perkins", url: "https://www.kleinerperkins.com", desc: "Storied firm with iconic portfolio", tag: "VC" },
    ],
  },
  {
    id: "founder",
    title: "Founder Network",
    icon: "◎",
    color: "text-pink-400",
    borderColor: "border-pink-800",
    links: [
      { label: "Jonathan Behrendt — LinkedIn", url: "https://linkedin.com/in/Jonathan-Behrendt", desc: "Connect with the founder of PlatFormula.ONE", tag: "Connect" },
      { label: "Follow on LinkedIn", url: "https://linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=jonathan-behrendt", desc: "Follow for updates on PlatFormula.ONE", tag: "Follow" },
      { label: "Email Jonathan", url: "mailto:Jonathan@Behrendterprizes.com", desc: "Jonathan@Behrendterprizes.com", tag: "Email" },
    ],
  },
];

const TAG_COLORS: Record<string, string> = {
  Apply: "bg-orange-900 text-orange-300",
  Learn: "bg-blue-900 text-blue-300",
  Content: "bg-purple-900 text-purple-300",
  Network: "bg-emerald-900 text-emerald-300",
  Legal: "bg-gray-700 text-gray-300",
  Ideas: "bg-yellow-900 text-yellow-300",
  Community: "bg-pink-900 text-pink-300",
  Video: "bg-red-900 text-red-300",
  Raise: "bg-teal-900 text-teal-300",
  VC: "bg-indigo-900 text-indigo-300",
  Connect: "bg-emerald-900 text-emerald-300",
  Follow: "bg-blue-900 text-blue-300",
  Email: "bg-gray-700 text-gray-300",
};

export default function Community() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const displayed = activeSection ? SECTIONS.filter(s => s.id === activeSection) : SECTIONS;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Community</h1>
          <p className="text-gray-400 text-sm mt-1">High-signal resources, accelerators, investors, and founder connections.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveSection(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeSection === null ? "bg-purple-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>All</button>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(activeSection === s.id ? null : s.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeSection === s.id ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              <span className={s.color}>{s.icon}</span> {s.title}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {displayed.map(section => (
            <div key={section.id} className={`bg-gray-900 border ${section.borderColor} rounded-xl p-5`}>
              <h2 className={`text-lg font-semibold ${section.color} mb-4 flex items-center gap-2`}>
                <span>{section.icon}</span> {section.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.links.map(link => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="group block bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg p-3 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`text-sm font-medium ${section.color} group-hover:underline`}>{link.label}</span>
                      {link.tag && <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${TAG_COLORS[link.tag] || "bg-gray-700 text-gray-300"}`}>{link.tag}</span>}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{link.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-900 border border-gray-700 rounded-xl text-center">
          <p className="text-sm text-gray-400">
            Built by{" "}
            <a href="https://linkedin.com/in/Jonathan-Behrendt" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Jonathan Behrendt</a>
            {" · "}
            <a href="mailto:Jonathan@Behrendterprizes.com" className="text-emerald-400 hover:underline">Jonathan@Behrendterprizes.com</a>
            {" · "}
            <span className="text-gray-500">(415) 695-4606</span>
          </p>
        </div>
      </div>
    </div>
  );
}