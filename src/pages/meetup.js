import React from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Translate, { translate } from "@docusaurus/Translate";
import MeetupCards from "@site/src/components/MeetupCards";

export default function Hello() {
  return (
    <Layout title="Meetup" description="Meetup Page">
      <div className="hero hero--primary">
        <div className="container ">
          <Heading as="h1" className="hero__title">
            RuyiSDK Meetup
          </Heading>
          <p className="hero__subtitle">
            <Translate id="meetup">我们近期举办的活动</Translate>
          </p>
        </div>
      </div>
      <MeetupCards />
    </Layout>
  );
}
