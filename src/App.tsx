import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import { useStyle } from "./useStyle";

function App() {
  const [color, setColor] = useState("#282c34");
  const App = useStyle`text-align: center;`;
  const AppHeader = useStyle`
    background-color: ${color};
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  `;
  return (
    <div className={App}>
      <header className={AppHeader}>
        <img src={logo} className="App-logo" alt="logo" />
        <p
          onClick={(event) => {
            setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
          }}
        >
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
