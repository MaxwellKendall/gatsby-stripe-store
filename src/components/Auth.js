// TODO: https://docs.amplify.aws/lib/auth/social/q/platform/js#setup-frontend

import React, { useContext, useEffect, useState } from "react"
import Amplify, { Hub, Auth } from 'aws-amplify';
import { AmplifySignOut } from "@aws-amplify/ui-react";

import awsconfig from '../aws-exports';
import GlobalState from "../store";
import { confirmSignUp, resendConfirmationCode, signIn, signUp } from "../utils/auth";

Amplify.configure(awsconfig);

const emptyForm = {
    email: '',
    pw: '',
    pw2: '',
    code: ''
}

const pwValidator = new RegExp(/"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"/);

const passwordValidator = (s1, s2) => {
    return (
        s1 === s2 &&
        pwValidator.test(s1)
    )
}

const AuthPortal = () => {
    const { store, dispatch } = useContext(GlobalState);
    const [emailLoginStatus, setEmailLoginStatus] = useState(''); // login/register/confirm
    const [{ code, email, pw, pw2 }, updateForm] = useState(emptyForm);
    const [loginError, setLoginError] = useState(false);

    useEffect(() => {
        // get the user if signed in
        Auth.currentAuthenticatedUser()
            .then(user => {
                console.log('logging user in... ', user);
                dispatch({ type: 'LOGIN_USER', email: user.attributes.email })
            })
            .catch((err) => {
                console.error('err fetching authenticated user: ', err);
            })

        // subscribe to all events
        Hub.listen('auth', (resp) => {
            const { payload: { data, event } } = resp;
            if (event === 'signIn' || event === 'cognitoHostedUI') {
                console.info('logging in via federated login....', resp)
                setLoginError(false);
            }
            else if (event === 'signOut') {
                dispatch({ type: 'LOGOUT_USER' });
                setLoginError(false);
            }
        });
    }, [])

    const handleSignIn = async (e) => {
        if (e) {
            e.preventDefault();
        }
        if (emailLoginStatus === 'register') {
            const user = await signUp({ username: email, password: pw, attributes: { email } })
            setEmailLoginStatus('confirm')
        }
        else {
            const user = await signIn(email, pw);
            if (user) {
                dispatch({ type: 'LOGIN_USER', email });
                setEmailLoginStatus('');
                setLoginError(false);
            }
            else {
                setLoginError(true);
            }
        }
    }

    const handleConfirmationCode = async (e) => {
        e.preventDefault();
        const user = await confirmSignUp(email, code)
        handleSignIn();
    }

    const handleUpdateForm = (e, key) => {
        e.persist();
        updateForm({
            email,
            pw,
            pw2,
            code,
            [key]: e.target.value
        })
    }

    const handleResendCode = async () => {
        await resendConfirmationCode(email)
    }

  return (
      <>
        {store.user.email && <span>Signed in as {store.user.email}</span>}
        {store.user.email && <AmplifySignOut />}
        {!store.user.email && !emailLoginStatus && (
            <div>
                <button className="w-full" onClick={() => Auth.federatedSignIn({ provider: 'Facebook' })}>Sign in with Facebook</button>
                <button className="w-full" onClick={() => Auth.federatedSignIn({ provider: 'Google' })}>Sign in with Google</button>  
                <button className="w-full" onClick={() => setEmailLoginStatus('login')}>Sign in with Email</button>
                <button className="w-full" onClick={() => setEmailLoginStatus('register')}>Create Account</button>
            </div>
        )}
        {emailLoginStatus && emailLoginStatus !== 'confirm' && (
              <form onSubmit={handleSignIn}>
                  {loginError && <span>There was an error, try again.</span>}
                  <fieldset className="w-full">
                    <label className="mr-5">Email:</label>
                    <input className="border" type="email" value={email} onChange={(e) => handleUpdateForm(e, 'email')} />
                  </fieldset>
                  <fieldset className="w-full">
                    <label className="mr-5">Password:</label>
                    {emailLoginStatus === 'register' && <span className="w-full">Must contain at least 8 characters, 1 number, 1 uppercase letter, and one of these special characters !%*?&</span>}
                    <input className="border" type="password" value={pw} onChange={(e) => handleUpdateForm(e, 'pw')} />
                    {emailLoginStatus === 'register' && (
                        <>
                            <input className="border" type="password" value={pw2} onChange={(e) => handleUpdateForm(e, 'pw2')} />
                        </>
                    )}

                  </fieldset>
                <button className="border w-full p-5" type="submit" disabled={emailLoginStatus === 'register' ? passwordValidator(pw, pw2) : false}>{emailLoginStatus === 'login' ? 'Login' : 'Sign Up'}</button>  
            </form>
          )}
          {emailLoginStatus === 'confirm' && (
              <form onSubmit={handleConfirmationCode}>
                  <input type="text" value={code} onChange={(e) => handleUpdateForm(e, 'code')} />
                  <button className="border w-full p-5" type="submit" disabled={false}>Confirm</button> 
                  <button className="border w-full p-5" disabled={code.length !== 6} onClick={handleResendCode}>Resend Confirmation Code</button>  
              </form>
          )}
    </>
  )
}


export default AuthPortal;
