import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSWWithAutoUpdate } from "./lib/swUpdate";

createRoot(document.getElementById("root")!).render(<App />);

// Register the service worker and auto-reload users when a new build ships
registerSWWithAutoUpdate();
