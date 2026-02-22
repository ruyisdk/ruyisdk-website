import styles from "./styles.module.css";

const demoBoardData = [
  {
    title: "从ruyisdk开始上手开发板"
  },
  {
    title: "milkv duo开发板",
    links: "docs/intro",
  },
  {
    title: "RuyiSDK 社区RuyiSDK 社区RuyiSDK 社区",
    links: "https://github.com/ruyisdk/ruyisdk/discussions/",
  },
  {
    title: "更多开发板",
    links: "/home"
  },
];

const exampleData = [
  {
    title: "典型应用场景"
  },
  {
    title: "milkv duo开发板",
    links: "docs/intro",
  },
  {
    title: "RuyiSDK 社区RuyiSDK 社区RuyiSDK 社区",
    links: "https://github.com/ruyisdk/ruyisdk/discussions/",
  },
  {
    title: "更多案例",
    links: "/blog"
  },
];

const DemoList = ({ data }) => {

  return (
    <div style={{ width: "100%", margin: "0 0 0.5rem 0", padding: "0 0.5rem", }}>
      <div style={{ borderRadius: "0", backgroundColor: "aliceblue", border: 'none', padding: "24px" }}>
        <div className={styles.container}>
          <div className={styles.rowContainer}>
            <div className={styles.cardSmall} style={{ position: "relative", backgroundColor: "white", border: "1px solid #f0f0f0", padding: "24px" }}>
              <span className={styles.cardFontSize}>
                {data[0].title}
              </span>
            </div>
            <div className={styles.cardLarge} style={{ position: "relative", backgroundColor: "white", border: "1px solid #f0f0f0", padding: "24px" }}>
              <span className={styles.cardFontSize}>
                {data[1].title}
              </span>
              <a className={styles.buttonStyle} href={data[1].links} style={{ color: "#0d4977", textDecoration: "none" }}>进入</a>
            </div>
          </div>
          <div className={styles.rowContainer}>
            <div className={styles.cardLarge} style={{ position: "relative", backgroundColor: "white", border: "1px solid #f0f0f0", padding: "24px" }}>
              <span className={styles.cardFontSize}>
                {data[2].title}
              </span>
              <a className={styles.buttonStyle} href={data[2].links} style={{ color: "#0d4977", textDecoration: "none" }}>进入</a>
            </div>
            <div className={styles.cardSmall} style={{ position: "relative", backgroundColor: "#2d88c9", border: "none", padding: "24px" }}>
              <span className={styles.cardFontSize} style={{ color: "white" }}>
                {data[3].title}
              </span>
              <a className={styles.buttonStyle} href={data[3].links} style={{ background: "rgb(255,255,255,0)", color: "white", textDecoration: "none" }}> 进入</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DemoDisplay = () => {
  return (
    <div className={styles.container} style={{ display: "flex", alignItems: "center", flexDirection: "column" }} >
      <DemoList data={demoBoardData} />

      <DemoList data={exampleData} />
    </div>
  );
};

export default DemoDisplay;