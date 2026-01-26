import { Fragment, useState, useEffect } from "react";
import {
	Input,
} from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";

const useDebounce = (value, delay, onStart, onComplete, st_focused) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		if ( st_focused ) {
			if ( typeof( onStart ) === "function" ) {
				onStart();
			}
			const handler = setTimeout(() => {
				if  ( typeof( onComplete ) === "function" ) {
					onComplete();
				}
				setDebouncedValue(value);
			}, delay);

			return () => {
				clearTimeout(handler);
			};
		}
	}, [value, delay, onStart, onComplete, st_focused]);

	return debouncedValue;
};

const DebouncedInput = props => {
	let {
		onChange,
		delay=500,
		endElement,
		placeholder,
		width,
		onStart,
		onComplete,
		startVal,
	} = props;

	const [st_focused,sst_focused] = useState(false);
  const [st_value, sst_value] = useState(startVal || "");
  const debouncedValue = useDebounce(st_value, delay, onStart, onComplete, st_focused);

  useEffect(() => {
		if ( st_focused ) {
			onChange(debouncedValue);
		}
  }, [debouncedValue, onChange, st_focused]);

	useEffect(()=>{
		if ( !st_focused ) {
			sst_value(startVal);
		}
	},[startVal,st_focused]);

	let renderInput = ()=>{
		return (
			<Input
				value={st_value}
				onChange={(e) => sst_value(e.target.value)}
				placeholder={placeholder}
				width={width || null}
				onFocus={()=>sst_focused(true)}
				onBlur={()=>sst_focused(false)}
			/>
		);
	}; // renderInput

  return (
		<Fragment>
			{
				endElement ? (
					<InputGroup
						width="100%"
						endElement={endElement}
					>
						{renderInput()}
					</InputGroup>
				) : (
					<Fragment>
						{renderInput()}
					</Fragment>
				)
			}
		</Fragment>
  );
};

export default DebouncedInput;