import styles from "./styles.module.css";

import React, { useState } from "react";

import { translate } from "@docusaurus/Translate";

import jsonp from "jsonp";

function isValidEmail(email) {
  // Simple RFC-like validation for common email formats
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ButtonSubscription() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // Prevent submitting invalid emails
    const valid = isValidEmail(email);
    if (!valid) {
      return;
    }

    setLoading(true);
    // Note: use '&' in JS string (not HTML entity) and encode the email
    const url =
      "https://ruyisdk.us13.list-manage.com/subscribe/post?u=553607139703751354f0f8c72&id=07fe20b41c&f_id=002d3ee3f0"; // you can use .env file to replace this
    jsonp(
      `${url}&EMAIL=${encodeURIComponent(email)}`,
      { param: "c" },
      (err, data) => {
        if (err) {
          alert(
            translate({
              id: "subscription.failed",
              message: "订阅失败，请重试。",
            }),
          );
        } else if (data && data.msg) {
          alert(data.msg);
        } else {
          alert(
            translate({
              id: "subscription.responseReceived",
              message: "已收到订阅响应。",
            }),
          );
        }
        setLoading(false);
      }
    );
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {/* input background: default when empty, stronger red while invalid, stronger green when valid */}
      <input
        type="email"
        value={email}
        placeholder={translate({ id: "subscription.emailPlaceholder", message: "请输入邮箱" })}
        aria-label={translate({ id: "subscription.emailAriaLabel", message: "邮箱地址" })}
        onChange={(e) => setEmail(e.target.value)}
        className={`${styles.input} ${
          email.length === 0
            ? ""
            : isValidEmail(email)
            ? styles.inputValid
            : styles.inputInvalid
        }`}
        style={{
          flex: "1 1 auto",
          minWidth: 0, // allow input to shrink properly in flex container
        }}
      />
      {
        // compute disabled state so style can reflect it
      }
      {(() => {
        const disabled = loading || !isValidEmail(email);
        return (
          <button
            type="submit"
            disabled={disabled}
            className={styles.button}
          >
            {loading
              ? translate({ id: "subscription.submitting", message: "提交中..." })
              : translate({ id: "subscription.subscribe", message: "订阅" })}
          </button>
        );
      })()}
    </form>
  );
}

export default ButtonSubscription;
