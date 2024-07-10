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
    title: <Translate>RuyiSDK首次线下Meetup回顾</Translate>,
    Image:
      "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Links: "https://mp.weixin.qq.com/s/wHCKdaZLcEyn7CspkIoEmQ",
    visibility: "secondaryButtonHide",
  },
  {
    title: <Translate>第三期 Meetup 重磅回顾</Translate>,
    Image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    Links: "https://mp.weixin.qq.com/s/7JuZMKcxpENoygn1YfnCLA",
    visibility: "secondaryButtonHide",
  },
];

export default function SlideNews() {
  return (
    <div className="slide-container">
      <Slide>
        {slideImages.map((slideImage, index) => (
          <div key={index}>
            <div
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
                  <a
                    href={slideImage.subLinks}
                    className={slideImage.visibility}
                  >
                    <Translate id="homepage.secondarybutton">
                      现在开始
                    </Translate>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slide>
    </div>
  );
}
