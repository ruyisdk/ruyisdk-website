import React from "react";

import ArticlePage from "../ArticlePage";

import * as MainEn from "./mdx/main.en.mdx";
import * as MainZhHans from "./mdx/main.zh-Hans.mdx";

const CONTENT = {
  "zh-Hans": MainZhHans,
  en: MainEn,
};

export default function Th1520BlogArticle() {
  return <ArticlePage contentMap={CONTENT} />;
}
