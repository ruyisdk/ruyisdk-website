import styles from "./styles.module.css";


import React, { useState } from "react";

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
          alert("Subscription failed. Please try again.");
        } else if (data && data.msg) {
          alert(data.msg);
        } else {
          alert("Subscription response received.");
        }
        setLoading(false);
      }
    );
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      {/* input background: default when empty, stronger red while invalid, stronger green when valid */}
      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        aria-label="Email address"
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
        style={{
          flex: "1 1 auto",
          minWidth: 0, // allow input to shrink properly in flex container
          backgroundColor:
            email.length === 0
              ? undefined
              : isValidEmail(email)
              ? "#dfffe0" // more pronounced green
              : "#ffdede", // more pronounced red
          borderColor: email.length === 0 ? undefined : isValidEmail(email) ? "#2ecc71" : "#ff4d4d",
          boxShadow:
            email.length === 0
              ? undefined
              : isValidEmail(email)
              ? "0 0 0 4px rgba(46,204,113,0.08)"
              : "0 0 0 4px rgba(255,77,77,0.08)",
          transition: "background-color 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
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
            style={{
              flex: "0 0 auto",
              whiteSpace: "nowrap",
              opacity: disabled ? 0.6 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "opacity 160ms ease, transform 120ms ease",
            }}
          >
            {loading ? "Submitting..." : "Subscribe"}
          </button>
        );
      })()}
    </form>
  );
}

export default ButtonSubscription;
