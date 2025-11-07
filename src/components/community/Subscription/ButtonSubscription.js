import styles from "./styles.module.css";


import React, { useState } from "react";

import jsonp from "jsonp";

function ButtonSubscription() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url =
      "https://ruyisdk.us13.list-manage.com/subscribe/post?u=553607139703751354f0f8c72&amp;id=07fe20b41c&amp;f_id=002d3ee3f0"; // you can use .env file to replace this
    jsonp(`${url}&EMAIL=${email}`, { param: "c" }, (_, { msg }) => {
      alert(msg);
      setLoading(false);
    });
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
      <input
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
        style={{
          flex: "1 1 auto",
          minWidth: 0, // allow input to shrink properly in flex container
        }}
      />
      <button
        type="submit"
        disabled={loading}
        className={styles.button}
        style={{
          flex: "0 0 auto",
          whiteSpace: "nowrap",
        }}
      >
        {loading ? "Submitting..." : "Subscribe"}
      </button>
    </form>
  );
}

export default ButtonSubscription;
