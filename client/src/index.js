import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return <h1>Welcome to TaskHubly — React Development</h1>;
}

const rootElement = document.getElementById("root");

const root = createRoot(rootElement);

root.render(<App />);
