import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";

const MeetupList = [
  {
    title: <Translate>RuyiSDK首次线下meetup：北京站</Translate>,
    Image: require("@site/static/img/beijing.webp").default,

    Links: "https://mp.weixin.qq.com/s/wHCKdaZLcEyn7CspkIoEmQ",
  },
  {
    title: (
      <Translate>
        第三期 Meetup 重磅回顾：技术大咖齐聚，精彩不容错过！
      </Translate>
    ),
    Image: require("@site/static/img/640.webp").default,

    Links: "https://mp.weixin.qq.com/s/7JuZMKcxpENoygn1YfnCLA",
  },
];

function Meetup({ Image, title, Links }) {
  return (
    <div className="col col--3">
      <div className="card">
        <div class="card__image">
          <a href={Links}>
            <img src={Image} />
          </a>
        </div>
        <div className="card__body">
          <a href={Links}>
            <h3>{title}</h3>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MeetupCards() {
  return (
    <div className={styles.container}>
      {MeetupList.map((props, idx) => (
        <Meetup key={idx} {...props} />
      ))}
    </div>
  );
}
