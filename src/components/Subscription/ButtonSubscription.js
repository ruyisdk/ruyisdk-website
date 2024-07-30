import styles from "./styles.module.css";

// export default function ButtonSubscription() {
//   return (
//     // <form
//     //   style={{
//     //     justifyContent: "left",
//     //     display: "flex",
//     //   }}
//     //   accept-charset="UTF-8" action="https://fabform.io/f/pFPStcS" method="POST"
//     // >
//     //   <input
//     //   className={styles.input}
//     //     type="email"
//     //     placeholder="Your Email"
//     //     name="email"
//     //   />
//     //   <button className={styles.button} type="submit">{"Subscribe"}</button>

//     // </form>

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
        justifyContent: "left",
        display: "flex",
      }}
    >
      <input
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <button type="submit" isLoading={loading} className={styles.button}>
        Subscribe
      </button>
    </form>
  );
}

export default ButtonSubscription;
