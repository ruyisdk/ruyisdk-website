import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";

const slideImages = [
  {
    title: <Translate>RuyiSDK</Translate>,
    subtitle: <Translate>面向RISC-V架构的一体化集成开发环境</Translate>,
    Image: require("@site/static/img/background.jpg").default,
    Links: "docs/intro",
    visibility: "secondaryButtonShow",
    subLinks: "download",
  },
  {
    title: <Translate>RuyiSDK 社区</Translate>,
    subtitle: <Translate>RuyiSDK 社区讨论板块现已开启</Translate>,
    Image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Links: "https://github.com/ruyisdk/ruyisdk/discussions/",
    visibility: "secondaryButtonHide",
  },
  {
    title: <Translate>嘉楠勘智K230D</Translate>,
    subtitle: <Translate>首款基于新32位 RuyiSDK 的AIoT量产芯片</Translate>,
    Image: "https://images.unsplash.com/photo-1532883031962-d3574f99541b?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Links: "/blog/2024/07/30/k230d",
    visibility: "secondaryButtonHide",
  },
];

export default function SlideNews() {
  return (
    <div className={styles.verticalSlideContainer}>
        {slideImages.map((slideImage, index) => (
          <div key={index}>
            <div
              key={index}
              className={styles.divStyle}
              style={{
                backgroundImage: `url(${slideImage.Image})`,
              }}
            >
              <div className={styles.content}>
                <h1 className={styles.title}>{slideImage.title}</h1>
                <h2 className={styles.subtitle}>{slideImage.subtitle}</h2>
                <div className={styles.buttonContainer}>
                  <a href={slideImage.Links} className={styles.primaryButton}>
                    <Translate id="homepage.primarybutton">了解更多</Translate>
                  </a>
                  {slideImage.subLinks && (
                  <a
                    href={slideImage.subLinks}
                    className={slideImage.visibility}
                  >
                    <Translate id="homepage.secondarybutton">
                      现在开始
                    </Translate>
                  </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
