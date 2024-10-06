import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MessagesContext } from "./messages";

export default function QuantitySelect({ quantityState = React.useState(1), id, inputProps, selectProps, max=Infinity }) {
	const { simpleAddMessage } = React.useContext(MessagesContext)
	const [quantity, setQuantity] = quantityState;
	const [textInputQuantity, setTextInputQuantity] = React.useState(quantity)
	const isTextInput = (quantity>20)

	const wholeNumberRegex = new RegExp(/^\d+$/);
	function validate(value) {
		if (value==="") {return ""}
		if (!wholeNumberRegex.test(value)) {
			return false
		}
		const partedValue = parseInt(value)

		if (partedValue>max) {
			simpleAddMessage("too much quantity selected", { severity: "warning" })
			return false
		}
		return partedValue
	}
    const handleChange = (value) => {
		// const valid_num = validate(value)
		// if (valid_num===false) {return}
		setQuantity(value);
	};
	const handleChangeTextInputQuantity = (value) => {
		const valid_num = validate(value)
		if (valid_num===false) {return}
		setTextInputQuantity(valid_num)
	}

    const quanitySelections = Array.from({ length: Math.min(max, 21) }, (_, index) => index + 1);

    const labelId = `${id}-label`
	return (
		<>
			{isTextInput ? <Stack flexDirection="row" alignItems="center" justifyContent="flex-start" gap={{xs: "1rem", md:"1rem"}}>
				<TextField inputProps={inputProps} label="Quantity" value={textInputQuantity} onChange={e => handleChangeTextInputQuantity(e.target.value)} />
				{textInputQuantity!== quantity &&	<IconButton onClick={() => {
					if (textInputQuantity==="") {
						simpleAddMessage("Quantity can't be empty", { severity: "warning" })
						return
					}
					handleChange(textInputQuantity)
					}} color="primary">
					<CheckCircleIcon />
				</IconButton>}
			</Stack>
				:
			<FormControl sx={{ m: 1, minWidth: 80 }} size="small">
				<InputLabel id={labelId}>Quantity</InputLabel>
				<Select
							labelId={labelId}
					value={quantity}
					label={"Quantity"}
					onChange={e => {
						handleChange(e.target.value)
						if (e.target.value===21) {
							setTextInputQuantity(21)
						}
					}}
							inputProps={inputProps}
							MenuProps={{ PaperProps: { sx: { maxHeight: "10rem" } } }}
							{...selectProps}
				>
							{quanitySelections.map((quantityNumber) => (
								<MenuItem key={quantityNumber} value={quantityNumber}>{quantityNumber===21 ? "20+" : quantityNumber}</MenuItem>
							))}
				</Select>
			</FormControl>
			}
		</>
	);
}
