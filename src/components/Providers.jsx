import { Provider as ChakraProvider } from "./ui/provider";
import { Provider as ReduxProvider } from 'react-redux';

import { store } from "../redux/store";

const Providers = props=>{
	return (
		<ChakraProvider>
			<ReduxProvider store={store}>
				{props.children}
			</ReduxProvider>
		</ChakraProvider>
	);
};

export default Providers;