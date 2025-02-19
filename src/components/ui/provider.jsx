"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";
import { colorSystem } from "./theme";

export function Provider(props) {	
	return (
		<ChakraProvider value={colorSystem} >
			<ColorModeProvider {...props} />
		</ChakraProvider>
	)
}