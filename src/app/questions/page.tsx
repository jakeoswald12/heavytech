import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Founder questions",
  description: "Open questions from the HeavyTech market research, for discussion with the founders.",
  robots: { index: false, follow: false },
};

const groups: { title: string; questions: string[] }[] = [
  {
    title: "Go-to-market and first buyers",
    questions: [
      "The research says rental companies should be the main buyer and distributor of OEM CTLs. Is that your thesis too? Have you thought about it, and do you have reasons to believe it’s true or false?",
      "Agriculture is the biggest user of CTLs, followed by fleets, construction and landscaping. Why wouldn’t farmers, contractors or landscapers want this?",
      "Shouldn’t a new, unproven product start with a niche of individual buyers who are willing to experiment? A rental company buying a whole fleet might be the most cautious about something unproven.",
      "Would a rental company actually prefer a hybrid, or does it make their maintenance, training and parts harder? Do rental companies really only want diesel?",
      "Do you have a plan for buy-backs, guaranteed residual values or anything like that? Rental companies may hesitate to buy when there’s no used market to tell them what the machines will be worth later.",
    ],
  },
  {
    title: "Electric vs. hybrid, and the real edge",
    questions: [
      "Do you think fully electric will ever take off in America the way it has in China? Only about 250 units sold in 2023, and only about 100 electric CTLs in all of North America, all to rental companies. That looks like barely a market yet.",
      "Bobcat, Volvo, Case and New Holland already sell battery-electric compacts, so there’s competition in a tiny market. Are you expecting the market to take off, or is electric not really your edge, and it’s the swappable powertrain instead?",
      "There’s no hybrid CTL in the U.S. market. Why do you think no one is building one, when so many companies are building electric?",
      "Why isn’t Kubota, the #1 builder, doing electric or hybrid at all?",
      "What exactly is the powertrain: a diesel engine with electric hydraulics, fully electric, or a choice of configurations?",
    ],
  },
  {
    title: "Price and unit economics",
    questions: [
      "What does a typical CTL cost today, both diesel and electric?",
      "What MSRP do you expect to sell at, including early on when you’re building in very small numbers?",
      "How do you compete on price with something like a diesel Kubota, given that everyone building electric is at small scale with no economies of scale?",
    ],
  },
  {
    title: "Right to repair",
    questions: [
      "The 2026 Deere settlement opens its repair tools for 10 years. If the law changes and every OEM has to support right to repair, doesn’t that edge go away? How are you thinking about how long it lasts?",
    ],
  },
  {
    title: "Product roadmap",
    questions: [
      "Why a forklift instead of a mini excavator, which looks like the clear #2 behind CTLs? Have you considered a mini ex?",
      "Defense: is the concept vehicle on the website still part of the plan, or have you moved away from it?",
      "Autonomy: is the hardware on the roof for remote control or for full autonomy? What’s the realistic timeline for rolling it out on the machines?",
    ],
  },
];

export default function QuestionsPage() {
  let n = 0;
  return (
    <>
      <PageHeader
        label="Working notes"
        title="Questions."
        lede="Open questions from the market research, to talk through with the founders."
      />
      {groups.map((g, i) => (
        <section key={g.title} className={`section-tight wrap ${i % 2 ? "band" : ""}`}>
          <div className="inner split" style={{ alignItems: "start" }}>
            <div className="split-copy">
              <span className="label">[ {String(i + 1).padStart(2, "0")} ]</span>
              <h2 className="display h-m">{g.title}</h2>
            </div>
            <ol className="q-list">
              {g.questions.map((q) => {
                n += 1;
                return (
                  <li key={q}>
                    <span className="label">Q{String(n).padStart(2, "0")}</span>
                    <p>{q}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ))}
    </>
  );
}
