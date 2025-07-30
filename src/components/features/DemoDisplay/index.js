import { Button, Card, ConfigProvider, Divider, Flex, Image } from "antd";
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
    <ConfigProvider theme={{
      components: {
        Button: {
          defaultActiveColor: "#0d4977",
          defaultActiveBorderColor: "#0d4977",
          defaultHoverBorderColor: "#0d4977",
          defaultHoverColor: "#0d4977"
        },
      },
    }}>
      <div style={{ width: "100%", margin: "0 0 0.5rem 0", padding: "0 0.5rem", }}>
        <Card style={{ borderRadius: "0", backgroundColor: "aliceblue", border: 'none' }}>
          <div className={styles.container}>
            <div className={styles.rowContainer}>
              <Card className={styles.cardSmall} >
                <span className={styles.cardFontSize}>
                  {data[0].title}
                </span>
              </Card>
              <Card className={styles.cardLarge} >
                <span className={styles.cardFontSize}>
                  {data[1].title}
                </span>
                <Button className={styles.buttonStyle} color="geekblue" href={data[1].links}>进入</Button>
              </Card>
            </div>
            <div className={styles.rowContainer}>
              <Card className={styles.cardLarge} >
                <span className={styles.cardFontSize}>
                  {data[2].title}
                </span>
                <Button className={styles.buttonStyle} color="geekblue" href={data[2].links}>进入</Button>
              </Card>
              <Card className={styles.cardSmall} style={{ backgroundColor: "#2d88c9", border: "none" }} >
                <span className={styles.cardFontSize} style={{ color: "white" }}>
                  {data[3].title}
                </span>
                <Button className={styles.buttonStyle} href={data[3].links} style={{ background: "rgb(255,255,255,0)", color: "white" }}> 进入</Button>
              </Card>
            </div>
          </div>
        </Card>
      </div>

    </ConfigProvider>
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