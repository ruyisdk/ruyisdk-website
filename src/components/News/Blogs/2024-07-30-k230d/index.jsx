import React from "react";

import ArticlePage from "../ArticlePage";

import * as MainEn from "./mdx/main.en.mdx";
import * as MainZhHans from "./mdx/main.zh-Hans.mdx";

const CONTENT = {
  "zh-Hans": MainZhHans,
  en: MainEn,
};

export default function K230DBlogArticle() {
  return <ArticlePage contentMap={CONTENT} />;
}
