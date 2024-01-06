import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"

import { createContext, useState } from "react";

function getLastKey(dict) {
	if (!dict) {
		return -1;
	}
	const keys = Object.keys(dict);
	const last_key = keys[keys.length - 1] ;
	return last_key;
}


function simpleMakeMessage(
    content,
	sx,
	messages,
	setMessages,
) {

	const key = getLastKey(messages) + 1; //doesnt exist yet

	function dismissMessage() {
		setMessages((prevList) => {
			const newList = { ...prevList };
			delete newList[key];
			return newList;
		});
	}

	const timeout = setTimeout(dismissMessage, 7500);

	function dismissNow() {
		clearTimeout(timeout);
		dismissMessage();
	}

	return (
		<Alert sx={sx} key={key} onClose={dismissNow}>{content}</Alert>
	);
}
function addMessageToMessages(dict, value) {
	const last_key = getLastKey(dict);
	const new_dict = { ...dict, [last_key + 1]: value };
	return new_dict;
}

function addMessageWithSetMessage(messageElement, setMessages) {
	setMessages((prevList) =>
		addMessageToMessages({ ...prevList }, messageElement)
	);
}

export function geAllMessages(messages, setMessages) {
	const addMessage = (message) =>
		addMessageWithSetMessage(message, setMessages);
	const simpleAddMessage = (content = "", sx = {}) =>
		addMessage(
			simpleMakeMessage(content, sx, messages, setMessages)
		);

	return { simpleAddMessage, addMessage };
}

const MessagesContext = createContext();

export default function ProvideAndRenderMessages({children, ...props}) {
    const [messages, setMessages] = useState({});
	return (
		<MessagesContext.Provider value={geAllMessages(messages,setMessages).simpleAddMessage}>
            <Stack
                {...props}
                sx={{
                    position: "fixed",
                    top: "1rem",
                    right: "1rem",
					width: '20rem',
					gap: 1,
                    zIndex: 10000,
                }}
                id="messagesStack"
            >
                {Object.keys(messages)
                    .reverse()
                    .map((message) => messages[message])}
            </Stack>
            {children}
        </MessagesContext.Provider>
	);
}

export { MessagesContext };