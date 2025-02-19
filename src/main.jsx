import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import Providers from "./components/Providers.jsx"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Providers>
			<BrowserRouter>
				<App></App>
			</BrowserRouter>
		</Providers>
	</StrictMode>,
);