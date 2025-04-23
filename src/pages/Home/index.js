/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import styles from "./styles.module.css";
import SlideNews from "../../components/SlideNews";
import DemoDisplay from "../../components/DemoDisplay";

function Hero() {
  return (
    <div className={styles.container} style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "100%" }}>
      <SlideNews />
      {/* <DemoDisplay></DemoDisplay> */}
    </div>
  );

  // return (
  //   <div className={styles.container}>
  //     <div className="slide-container">
  //       <Slide>
  //         {slideImages.map((slideImage, index) => (
  //           <div key={index}>
  //             <div
  //               className={styles.divStyle}
  //               style={{
  //                 backgroundImage: `url(${slideImage.url})`,
  //               }}
  //             >
  //               {<h1 className={styles.title}>{slideImage.title}</h1>}
  //               <a href={slideImage.link} className={styles.infobutton}>
  //                 查看详情
  //               </a>
  //             </div>
  //           </div>
  //         ))}
  //       </Slide>
  //       <div className={styles.content}>
  //         {/* <h1 className={styles.title}>
  //           <Translate id="homepage.title">RuyiSDK</Translate>
  //         </h1>
  //         <h2 className={styles.subtitle}>
  //           <Translate id="homepage.subtitle">
  //             面向RISC-V架构的一体化集成开发环境
  //           </Translate>
  //         </h2> */}
  //         <div className={styles.buttonContainer}>
  //           <a href="download" className={styles.primaryButton}>
  //             <Translate id="homepage.primarybutton">现在开始</Translate>
  //           </a>
  //           <a href="docs/intro" className={styles.secondaryButton}>
  //             <Translate id="homepage.secondarybutton">了解更多</Translate>
  //           </a>
  //         </div>
  //         {/* <div className={styles.invContainer}>
  //           <p class="text--semibold">
  //             <Translate id="homepage.inevitable">
  //               RISC-V is inevitable!
  //             </Translate>
  //           </p>
  //           <a href="#inv" class="btn btn-link text-info">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               viewBox="0 0 512 512"
  //               width="50"
  //               height="50"
  //               fill="white"
  //             >
  //               <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z" />
  //             </svg>
  //           </a>
  //         </div> */}
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default function Home() {
  return <Hero />;
}
