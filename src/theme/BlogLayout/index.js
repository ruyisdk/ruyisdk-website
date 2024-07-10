import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import BlogSidebar from "@theme/BlogSidebar";
import useRouteContext from "@docusaurus/useRouteContext";

export default function BlogLayout(props) {
  const { sidebar, toc, children, ...layoutProps } = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  const { plugin } = useRouteContext();

  if (plugin.id === "biweekly") {
    return (
      <Layout {...layoutProps}>
        <div className="container margin-vert--lg">
          <div class="hero hero--secondary" style={{ height: "10em" }}>
            <div class="container">
              <h1 class="hero__title">RuyiSDK 双周报</h1>
              <p class="hero__subtitle">每两周获得最新开发进展</p>
            </div>
          </div>
          <div className="container" style={{ marginTop: "20px" }}>
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
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout {...layoutProps}>
        <div className="container margin-vert--lg">
          <div class="hero hero--primary" style={{ height: "10rem" }}>
            <div class="container">
              <h1 class="hero__title">博客</h1>
              <p class="hero__subtitle">随时看到来自 RuyiSDK 团队的重大消息</p>
            </div>
          </div>
          <div className="container" style={{ marginTop: "20px" }}>
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
        </div>
      </Layout>
    );
  }
}
