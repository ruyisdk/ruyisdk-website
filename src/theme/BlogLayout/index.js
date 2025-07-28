import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import BlogSidebar from "@theme/BlogSidebar";
import useRouteContext from "@docusaurus/useRouteContext";
import Translate, { translate } from "@docusaurus/Translate";
import ButtonSubscription from "@site/src/components/community/Subscription/ButtonSubscription";

export default function BlogLayout(props) {
  const { sidebar, toc, children, ...layoutProps } = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  const { plugin } = useRouteContext();

  if (plugin.id === "biweekly") {
    return (
      <Layout {...layoutProps}>
        <div className="container margin-vert--lg">
          <h1 class="hero__title">
            <Translate>RuyiSDK 双周报</Translate>
          </h1>
          <p class="hero__subtitle">
            <Translate>每两周获得最新开发进展</Translate>
            <ButtonSubscription />
          </p>

          <div className="row">
            <BlogSidebar sidebar={sidebar} />
            <main
              className={clsx("col", {
                "col--7": hasSidebar,
                "col--9 col--offset-1": !hasSidebar,
              })}
            >
              {children}
            </main>
            {toc && <div className="col col--2">{toc}</div>}
          </div>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout {...layoutProps}>
        <div className="container margin-vert--lg">
          <h1 class="hero__title">
            <Translate>博客</Translate>
          </h1>
          <p class="hero__subtitle">
            <Translate>随时看到来自 RuyiSDK 团队的重大消息</Translate>
            <ButtonSubscription />
          </p>

          <div className="row">
            <BlogSidebar sidebar={sidebar} />
            <main
              className={clsx("col", {
                "col--7": hasSidebar,
                "col--9 col--offset-1": !hasSidebar,
              })}
            >
              {children}
            </main>
            {toc && <div className="col col--2">{toc}</div>}
          </div>
        </div>
      </Layout>
    );
  }
}
