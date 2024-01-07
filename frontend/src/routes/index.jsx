import Button from '@mui/material/Button'

import { MessagesContext } from '../root'
import { useContext } from 'react';

export default function Index() {
    const simpleAddMessage = useContext(MessagesContext).simpleAddMessage;
	return (
        <>
        <Button variant="contained" color="primary" onClick={() => {simpleAddMessage("Hooray", {severity: "error"})}}>
          CLICK ME FOR MESSAGE
        </Button>
        </>
	)
}
