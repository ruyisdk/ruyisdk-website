import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import { PageBackground } from "@site/src/components/Home/Background";
import MarkdownCard from "@site/src/components/About/MarkdownCard";

import styles from "./ArticlePage.module.css";

import authorMetadata from "./authors.json";
import tagMetadata from "./tags.json";

function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en || contentMap["zh-Hans"];
}

function resolveAuthorLabel(authorKey) {
  return authorMetadata?.[authorKey]?.name || authorKey;
}

function resolveAuthor(authorKey) {
  return authorMetadata?.[authorKey] || null;
}

function resolveTagLabel(tagKey) {
  return tagMetadata?.[tagKey]?.label || tagKey;
}

export default function ArticlePage({ contentMap }) {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale;
  const MainContentModule = resolveLocalizedContent(contentMap, locale);
  const MainContent = MainContentModule.default || MainContentModule;
  const frontMatter =
    MainContentModule.frontMatter ||
    MainContentModule.metadata?.frontMatter ||
    MainContentModule.metadata ||
    {};
  const title = frontMatter.title || "";
  const authorKeys = Array.isArray(frontMatter.authors) ? frontMatter.authors : [];
  const tagKeys = Array.isArray(frontMatter.tags) ? frontMatter.tags : [];

  return (
    <main className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
      <PageBackground />
      <div className="mx-auto relative z-10 max-w-screen-xl">
        {title && (
          <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {authorKeys.length > 0 && (
              <div className={styles.authorList}>
                {authorKeys.map((authorKey) => {
                  const author = resolveAuthor(authorKey);
                  const name = resolveAuthorLabel(authorKey);

                  return (
                    <div key={authorKey} className={styles.authorCard}>
                      {author?.image_url && (
                        <img
                          src={author.image_url}
                          alt={name}
                          className={styles.authorAvatar}
                        />
                      )}
                      <div className={styles.authorText}>
                        {author?.url ? (
                          <a href={author.url} className={styles.authorName}>
                            {name}
                          </a>
                        ) : (
                          <span className={styles.authorName}>{name}</span>
                        )}
                        {author?.title && (
                          <span className={styles.authorTitle}>{author.title}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className="min-w-0">
          <MarkdownCard className={`overflow-hidden ${styles.articleCard}`}>
            <MainContent />
            {tagKeys.length > 0 && (
              <div className={styles.tags}>
                <p className={styles.tagsTitle}>Tags</p>
                <div className={styles.tagList}>
                  {tagKeys.map((tag) => (
                    <span key={tag} className={styles.chip}>
                      {resolveTagLabel(tag)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </MarkdownCard>
        </div>
      </div>
    </main>
  );
}
