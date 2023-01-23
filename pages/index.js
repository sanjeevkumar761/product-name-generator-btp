import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [productDescription, setproductDescription] = useState("");
  const [productSeedWords, setproductSeedWords] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    //console.log(JSON.stringify({ productDescription: productDescription, productSeedWords: productSeedWords  }));
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productDescription: productDescription, productSeedWords: productSeedWords  }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setproductDescription("");
      setproductSeedWords("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/app-indicator.svg" />
      </Head>

      <main className={styles.main}>
        <img src="/app-indicator.svg" className={styles.icon} />
        <h3>Generate product names</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="productDescription"
            placeholder="Enter a product description e.g., A home milkshake maker"
            value={productDescription}
            onChange={(e) => setproductDescription(e.target.value)}
          />
          <input
            type="text"
            name="productSeedWords"
            placeholder="Enter comma-separated product seed words e.g., fast, healthy, compact"
            value={productSeedWords}
            onChange={(e) => setproductSeedWords(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
