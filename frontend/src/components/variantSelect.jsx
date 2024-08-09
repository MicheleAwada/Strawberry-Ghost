import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function VariantSelect({ variantState, id, variants, inputProps={}, selectProps={} }) {
    const [variant, setVariant] = variantState;
    const handleChange = (event) => {
		setVariant(event.target.value);
	};

    

    const labelId = `${id}-label`
	return (
		<FormControl sx={{ m: 1, width: "100%" }} size="small">
			<InputLabel id={labelId}>Variant</InputLabel>
			<Select
                labelId={labelId}
				value={variant}
				label={"Variant"}
				onChange={handleChange}
                inputProps={inputProps}
                MenuProps={{ PaperProps: { sx: { maxHeight: "10rem" } } }}
                {...selectProps}
			>
                {variants.map((variant) => (
                    <MenuItem key={variant.id} value={variant.id}>{variant.name}</MenuItem>
                ))}
			</Select>
		</FormControl>
	);
}