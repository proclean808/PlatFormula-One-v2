import { CalendarDays, Cloud, ExternalLink, Rocket, Sparkles } from 'lucide-react';

type Item={name:string;url:string;description:string;deadline?:string;status?:string;tag?:string};
const accelerator:Item[]=[
{name:'Y Combinator — Winter 2027',url:'https://www.ycombinator.com/apply',description:'San Francisco batch, January–March 2027.',deadline:'Nov 2, 2026 · 8pm PT',status:'Applications open',tag:'$500K standard YC deal'},
{name:'Techstars Anywhere',url:'https://www.techstars.com/accelerators/anywhere',description:'Remote-first North America program; starts Mar 8, 2027.',deadline:'Nov 18, 2026',status:'Applications open',tag:'3-month accelerator'},
{name:'Founder Institute — SF Agentic',url:'https://fi.co/program/san_francisco',description:'AI-agent-focused pre-seed program; kickoff Nov 3, 2026.',deadline:'Early Sep 29 · Final Oct 27, 2026',status:'Applications open',tag:'Agentic program'},
{name:'500 Global Flagship',url:'https://flagship.aplica.500.co/',description:'Palo Alto early-stage flagship accelerator.',status:'Verify current batch before applying',tag:'Flagship'},
{name:'Alchemist Accelerator',url:'https://www.alchemistaccelerator.com/',description:'Enterprise/B2B accelerator with rolling application deadlines.',deadline:'Rolling review',status:'Rolling',tag:'Enterprise + B2B'},
{name:'Berkeley SkyDeck',url:'https://skydeck.berkeley.edu/program/',description:'Batch 23 runs Nov 2, 2026–Apr 15, 2027; $210K investment for cohort startups.',deadline:'Batch 23 closed Aug 21, 2026',status:'Track next batch',tag:'Bay Area'},
];
const aiAccelerators:Item[]=[
{name:'AIAR',url:'https://aiar.co/',description:'White-label objective-driven AI acceleration: value proposition, discovery, validation and MVP.',tag:'Idea → revenue'},
{name:'Simsy AI',url:'https://simsy.ai/startup-ecosystem',description:'Venture-studio platform with application/assessment through ideation, BMC, launch and ecosystem programs.',tag:'110-step playbook'},
{name:'Launchology',url:'https://www.launchology.co/',description:'AI co-founder, self-paced accelerator, founder workspace, pitch assets and investor matching.',tag:'80+ lessons / 10 modules'},
{name:'Mozaiks',url:'https://www.mozaiks.ai/',description:'Agentic runtime plus human review, staged validation, infrastructure, monetization and distribution.',tag:'Build → Monetize → Grow'},
];
const credits:Item[]=[
{name:'NVIDIA Inception',url:'https://www.nvidia.com/en-us/startups/',description:'Free startup program with technical resources, partner offers, investor exposure and GTM benefits.',deadline:'No deadline / no cohorts',status:'Rolling',tag:'AI infrastructure'},
{name:'AWS Activate',url:'https://startups.aws.com/lp/aws-activate-credits?lang=en-US',description:'Founders package $1K; eligible provider-affiliated startups can receive up to $100K.',status:'Applications available',tag:'Cloud credits'},
{name:'Microsoft for Startups',url:'https://www.microsoft.com/en-us/startups',description:'Startup benefits and Azure activation; new application flow moved into Azure in 2026.',status:'Current program',tag:'Azure + AI'},
];
function Card({x}:{x:Item}){return <a href={x.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-purple-500 hover:-translate-y-0.5 transition bg-white/50 dark:bg-slate-800/40"><div className="flex justify-between gap-3"><div className="font-bold">{x.name}</div><ExternalLink className="w-4 h-4 shrink-0"/></div><p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{x.description}</p>{x.deadline&&<div className="mt-3 text-sm font-semibold flex gap-2"><CalendarDays className="w-4 h-4"/>{x.deadline}</div>}<div className="flex flex-wrap gap-2 mt-3">{x.status&&<span className="text-xs rounded-full bg-green-500/10 px-2 py-1">{x.status}</span>}{x.tag&&<span className="text-xs rounded-full bg-purple-500/10 px-2 py-1">{x.tag}</span>}</div></a>}
function Section({title,icon:Icon,items}:{title:string;icon:any;items:Item[]}){return <div className="glass p-6 rounded-2xl"><h3 className="text-2xl font-bold mb-5 flex gap-3 items-center"><Icon className="w-6 h-6 text-purple-500"/>{title}</h3><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{items.map(x=><Card key={x.name} x={x}/>)}</div></div>}
export default function Resources(){return <div className="space-y-7">
 <div><h2 className="text-3xl md:text-4xl font-bold">Live Founder Opportunity Registry</h2><p className="text-slate-500 mt-2">Current programs, deadlines, AI-native accelerator patterns and startup infrastructure. Dates must be re-verified from the linked official source before submission.</p><div className="text-xs text-slate-500 mt-2">Registry refresh: September 19, 2026</div></div>
 <Section title="Applications & Accelerators" icon={Rocket} items={accelerator}/>
 <Section title="AI-Native Accelerator Donor Set" icon={Sparkles} items={aiAccelerators}/>
 <Section title="Credits, Compute & Startup Programs" icon={Cloud} items={credits}/>
 <div className="glass p-6 rounded-2xl"><h3 className="text-xl font-bold">Feature set PlatFormula.ONE should absorb</h3><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">{['Objective-driven founder journey','Customer discovery + experiment design','Persistent founder/company intelligence','AI co-founder with artifact generation','Application assessment + matching','MVP build + deployment','Monetization + payments','Investor matching + pitch assets','Human review + authorization gates','Program/mentor/community layer','GTM + distribution campaigns','Evidence-backed progress tracking'].map(x=><div key={x} className="rounded-lg border p-3 text-sm">{x}</div>)}</div></div>
 </div>}
