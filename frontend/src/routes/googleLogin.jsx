import { GoogleLogin } from '@react-oauth/google';
import { useGoogleOneTapLogin as googleUseGoogleOneTapLogin } from "@react-oauth/google"
import { useContext } from 'react';
import { MessagesContext } from '../root';

import { google_login, set_token } from '../api';
import { UserContext } from '../components/user';

async function handleOnSuccess(credentialResponse, setUser, simpleAddMessage) {

    console.log(credentialResponse);
    const response = await google_login(credentialResponse)
    if (response.succeeded) {
        simpleAddMessage("Woohoo, Google Login Succeeded", {severity: "success"})
        set_token(response.response.auth_token)
        setUser({...response.response, is_authenticated: true, is_google_user: true})
    } else {
        simpleAddMessage("Whops, Google Login Failed", {severity: "error"})
    }
    console.log("response of google login")
    console.log(response)
    
}
function handleOnError(simpleAddMessage) {

    console.error('Google Login Failed');
    simpleAddMessage("Whops, Google Login Failed", {severity: "error"})
}

export function useGoogleOneTapLogin() {
    const { simpleAddMessage } = useContext(MessagesContext)
    const [_, setUser] = useContext(UserContext)

    googleUseGoogleOneTapLogin({
        onSuccess: (cred) => handleOnSuccess(cred, setUser, simpleAddMessage),
        onError: () => handleOnError(simpleAddMessage),
      })
}

export function GoogleButton() {
    const { simpleAddMessage } = useContext(MessagesContext)

    return (
        <GoogleLogin />
    )
}