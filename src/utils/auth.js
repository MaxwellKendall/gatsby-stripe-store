// manual sign in process https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js#sign-up

import { Auth } from 'aws-amplify';

// Manual Sign Up Process:
const signUpDetails = {
    username: '',
    password: '',
    attributes: {
        email: '',          // optional
        phone_number: '',   // optional - E.164 number convention
        // other custom attributes 
    }
}

export const signUp = async (details = signUpDetails) => {
    try {
        const { user } = await Auth.signUp(details);
        console.log('eyo', user);
        return user;
    } catch (error) {
        console.log('error signing up:', error);
    }
}

export const confirmSignUp = async (username, code) => {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
}

export const signIn = async (username, password) => {
    try {
        const user = await Auth.signIn(username, password);
        return true;
    } catch (error) {
        console.log('error signing in', error);
        return false;
    }
}

export const resendConfirmationCode = async (username) => {
    try {
        await Auth.resendSignUp(username);
        console.log('code resent successfully');
    } catch (err) {
        console.log('error resending code: ', err);
    }
}

export const signOut = async (isGlobal = false) => {
    try {
        if (isGlobal) {
            await Auth.signOut({ global: true });
        }
        else {
            await Auth.signOut();
        }
    } catch (error) {
        console.log('error signing out: ', error);
    }
}
