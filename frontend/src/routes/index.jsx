import { useContext } from "react";
import { MessagesContext } from "../main";

import Header from "../components/header";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Index() {
	const simpleAddMessage = useContext(MessagesContext);
	return (
		<Box>
			<Header />
		</Box>
	);
}
