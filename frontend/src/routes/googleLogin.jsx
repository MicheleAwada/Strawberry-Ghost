import { GoogleLogin } from '@react-oauth/google';
import { useGoogleOneTapLogin as googleUseGoogleOneTapLogin } from "@react-oauth/google"
import { useContext } from 'react';
import { MessagesContext } from '../root';

import { google_login, set_token } from '../api';
import { UserContext } from '../components/user';

async function handleOnSuccess(credentialResponse, setUser, simpleAddMessage) {
    const response = await google_login(credentialResponse)
    if (response.succeeded) {
        simpleAddMessage("Woohoo, Google Login Succeeded", {severity: "success"})
        set_token(response.response.auth_token)
        setUser({...response.response, is_authenticated: true, is_google_user: true})
    } else {
        simpleAddMessage(response.errorMessage, {severity: "error"})
    }
    
}
function handleOnError(simpleAddMessage) {
    console.error('Google Login Failed');
    simpleAddMessage("Whops, Google Login Failed", {severity: "error"})
}

export function useGoogleOneTapLogin() {
    const { simpleAddMessage } = useContext(MessagesContext)
    const [user, setUser] = useContext(UserContext)

    googleUseGoogleOneTapLogin({
        onSuccess: (cred) => handleOnSuccess(cred, setUser, simpleAddMessage),
        onError: () => handleOnError(simpleAddMessage),
        disabled: user.is_authenticated,
      })
}

export function GoogleButton() {
    const { simpleAddMessage } = useContext(MessagesContext)
    const [_, setUser] = useContext(UserContext)

    return (
        <GoogleLogin onSuccess={(cred) => handleOnSuccess(cred, setUser, simpleAddMessage)}
            onError={() => handleOnError(simpleAddMessage)}
        />
    )
}