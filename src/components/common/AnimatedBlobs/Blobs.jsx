import React from 'react';
import styles from './Blobs.module.css';

const AnimatedBlobs = () => (
  <div className={styles.container} aria-hidden="true">
    <div className={`${styles.blob} ${styles.blob1}`} />
    <div className={`${styles.blob} ${styles.blob2}`} />
    <div className={`${styles.blob} ${styles.blob3}`} />
  </div>
);

export default AnimatedBlobs;
