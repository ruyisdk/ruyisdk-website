import React from "react";

import ArticlePage from "../ArticlePage";

import * as MainDe from "./mdx/main.de.mdx";
import * as MainEn from "./mdx/main.en.mdx";
import * as MainZhHans from "./mdx/main.zh-Hans.mdx";

const CONTENT = {
  "zh-Hans": MainZhHans,
  en: MainEn,
  de: MainDe,
};

export default function Box64WpsOfficePocArticle() {
  return <ArticlePage contentMap={CONTENT} />;
}
