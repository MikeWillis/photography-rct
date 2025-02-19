import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react";
import { config as siteConfig } from "../../config";

const config = defineConfig({
	globalCss: {
		"html, body": {
			height: "100%",
		},
		html: {
			colorPalette: siteConfig.colorPalette,
		},
	},
	theme: {
		semanticTokens: {
			colors: {
				bg: {
					emphasized: { value: "#e4fbe8" }
				}
			}
		},
	}
})

export const colorSystem = createSystem(defaultConfig, config)