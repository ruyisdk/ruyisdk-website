import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";

const FeatureList = [
  {
    title: <Translate>ruyi 包管理器</Translate>,
    Svg: require("@site/static/img/undraw_coding_re_iv62.svg").default,
    description: (
      <Translate>
        在线软件源和管理工具集中存储了 RISC-V
        集成开发环境所需的编译工具链、调试工具、模拟器、运行环境、文档、代码、工具、target系统镜像等内容以及用于与在线软件源交互的工具。
      </Translate>
    ),
  },
  {
    title: <Translate>ruyi IDE</Translate>,
    Svg: require("@site/static/img/undraw_code_review_re_woeb.svg").default,
    description: (
      <Translate>
        一个专门用来开发能够运行在 RISC-V
        架构设备上的软件和应用的工具箱。可以帮助开发者编写和测试自己的程序，用户无需为环境搭建耗费精力。
      </Translate>
    ),
  },
  {
    title: <Translate>社区</Translate>,
    Svg: require("@site/static/img/undraw_sharing_knowledge_03vp.svg").default,
    description: (
      <Translate>
        社区提供文档和教程、论坛和技术讨论区等功能，目的是为 RISC-V
        开发者提供一个开放的交流平台，提供互助式技术支持和资源共享，聚集 RISC-V
        开发者并推动 RISC-V 生态系统的发展。
      </Translate>
    ),
  },
  {
    title: <Translate>开放源代码</Translate>,
    Svg: require("@site/static/img/undraw_open_source_-1-qxw.svg").default,
    description: (
      <Translate>
        我们的代码完全开源，意味着每个人都可以在许可证允许的条件下查看、使用、修改和共享它。无论你是开发者、学生、爱好者还是企业，都可以自由地参与到我们的项目中，共同构建更好的
        RuyiSDK。欢迎加入我们的社区，一起推动开源的发展！
      </Translate>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--6")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features} id="inv">
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
