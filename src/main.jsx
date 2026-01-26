import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import ScrollToTop from "./components/myUI/ScrollToTop";
import Providers from "./components/Providers.jsx"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Providers>
			<BrowserRouter>
				<ScrollToTop />
				<App></App>
			</BrowserRouter>
		</Providers>
	</StrictMode>,
);