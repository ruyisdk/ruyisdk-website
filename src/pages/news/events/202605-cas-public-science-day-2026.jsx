import React from "react";
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import Events from "@site/src/components/News/Events/202605_cas_public_science_day_2026";

export default function EventsPage() {
  const title = translate({
    id: "news.events.scienceDay2026.title",
    message: "RuyiSDK亮相中科院软件所2026年“软件定义未来”公众科学日",
  });
  return (
    <Layout
      title={title}
      description={title}
    >
      <Events />
    </Layout>
  );
}
