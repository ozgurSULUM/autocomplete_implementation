import { useState } from "react";

import styles from "/src/styles/app.module.css";

import CharacterAutocomplete from "./components/CharacterAutocomplete";

function App() {
  const [multipleValue, setMultipleValue] = useState<CharacterInfo[]>([]);
  const [singleValue, setSingleValue] = useState<CharacterInfo | null>(null);

  return (
    <main className={styles.mainContainer}>
      <div style={{ width: 320 }}>
        <label htmlFor="single-select-autocomplete">
          single-select-autocomplete
        </label>
        <CharacterAutocomplete
          inputId="single-select-autocomplete"
          value={singleValue}
          multiple={false}
          onChange={(newChars) => setSingleValue(newChars)}
        />
      </div>
      <div style={{ width: 600 }}>
        <label htmlFor="multi-select-autocomplete">
          multi-select-autocomplete
        </label>
        <CharacterAutocomplete
          inputId={"multi-select-autocomplete"}
          value={multipleValue}
          multiple={true}
          onChange={(newChars) => setMultipleValue(newChars)}
        />
      </div>
    </main>
  );
}

export default App;
