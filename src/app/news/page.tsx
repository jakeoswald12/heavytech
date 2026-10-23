import type { Metadata } from "next";
import { JoinBand, NewsCard, PageHeader } from "@/components/blocks";
import { news } from "@/data/site";

export const metadata: Metadata = {
  title: "News",
  description: "Events, press, podcasts and updates from HeavyTech.",
};

export default function NewsPage() {
  return (
    <>
      <PageHeader label="Field notes" title="News." lede="Events, press, podcasts and progress updates from Fort Wayne." />
      <section className="section-tight wrap">
        <div className="inner news-grid">
          {news.map((n) => (
            <NewsCard key={n.slug} n={n} />
          ))}
        </div>
      </section>
      <JoinBand />
    </>
  );
}
