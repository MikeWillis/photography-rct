import { Fragment, useState, useEffect } from "react";
import {
	Input,
} from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const DebouncedInput = props => {
	let {
		onChange,
		delay = 500,
		endElement,
		placeholder,
	} = props;

  const [st_value, sst_value] = useState("");
  const debouncedValue = useDebounce(st_value, delay);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

	let renderInput = ()=>{
		return (
			<Input
				value={st_value}
				onChange={(e) => sst_value(e.target.value)}
				placeholder={placeholder}
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