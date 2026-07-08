import styles from "./page.module.css";

// Update this number each time you ship a new app.
const SHIPPED_COUNT = 2;

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <p className={styles.label}>Apps shipped by Jake</p>
        <p className={styles.count}>{SHIPPED_COUNT}</p>
      </section>
    </main>
  );
}
