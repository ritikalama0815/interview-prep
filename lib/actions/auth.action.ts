'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 7 * 24 * 60 * 60;


/**
 * This function is responsible for handling the sign up process for a new user.
 *
 * @param {SignUpParams} params - An object containing the necessary parameters for signing up.
 * @param {string} params.uid - The unique identifier for the user.
 * @param {string} params.name - The name of the user.
 * @param {string} params.email - The email of the user.
 *
 * @returns {Promise<{success: boolean, error?: string}>} - A promise that resolves to an object containing the success status and, if applicable, an error message.
 * If the sign up is successful, the returned object will have `success: true`.
 * If the sign up fails due to an email already being in use, the returned object will have `success: false` and `error: 'Email already in use'`.
 */

export async function signUp(params: SignUpParams){
    const {uid, name, email,} = params;
    try {

        const userRecord = await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return {
                success: false,
                error: 'User already exists',
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'User created successfully',
        }
        
    } catch (error: any) {
        console.error("Error signing up:", error);

        if(error.code === 'auth/email-already-exists'){
            return {
                success: false,
                error: 'Email already in use',
            }
        }
        return {
            success: false,
            error: 'An unknown error occurred',
        };
    }
}

/**
 * Handles the sign-in process for an existing user.
 *
 * @param params - An object containing the necessary parameters for signing in.
 * @param params.email - The email of the user.
 * @param params.idToken - The Firebase ID token of the user.
 *
 * @returns {Promise<{success: boolean, message: string}>} - A promise that resolves to an object containing the success status and a message.
 * If the sign-in is successful, the returned object will have `success: true` and `message: 'User created successfully'`.
 * If the sign-in fails due to a non-existent user, the returned object will have `success: false` and `message: 'User doesn't exist'`.
 * If the sign-in fails due to an unknown error, the returned object will have `success: false` and `message: 'Failed to sign in'`.
 */
export async function signIn(params: SignInParams){
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email); 
        if(!userRecord){
            return{
                success:false,
                message: 'User doesn\'t exist'
            }
        }
        await setSessionCookie(idToken);
    } catch (error) {
        console.log(error);
        return{
            success:false,
            message: 'Failed to sign in'
        }
    }
}

/**
 * Sets a session cookie for the authenticated user.
 *
 * @param {string} idToken - The Firebase ID token of the authenticated user.
 *
 * This function creates a session cookie using the provided Firebase ID token.
 * The session cookie is set with the following properties:
 * - Expires in one week.
 * - HttpOnly flag is set to true.
 * - Secure flag is set based on the environment (production or not).
 * - Path is set to '/'.
 * - SameSite is set to 'lax'.
 *
 * @returns {Promise<void>} - A promise that resolves when the session cookie is set.
 */
export async function setSessionCookie(idToken: string): Promise<void> {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    });
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
}

/**
 * Retrieves the currently authenticated user from the session cookie.
 *
 * @returns {Promise<User | null>} - A promise that resolves to the currently authenticated user,
 * or `null` if no user is authenticated.
 *
 * The function first checks if a session cookie exists. If it does, it verifies the session cookie
 * using Firebase's `verifySessionCookie` method. If the verification is successful, it retrieves
 * the user's data from Firestore using the user's unique identifier (UID). If the user exists,
 * it returns the user object with the UID included. If any error occurs during the process,
 * the function logs the error and returns `null`.
 */
export async function getCurrentUser(): Promise<User | null> {
    const cookiestore = await cookies();
    const sessionCookie = cookiestore.get('session')?.value;
    if(!sessionCookie){
        return null;
    }
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if(!userRecord.exists){
            return null;
        }
        return{
            ...userRecord.data(), 
            id: userRecord.id,
        }as User;
    } catch (error) {
        console.log(error);
        return null;
        
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    
    return !! user; // Return true if user is authenticated, false otherwise.
}

export async function getInterViewByUserId(userId: string): Promise<Interview[] |null>{
    const interviews = await db.collection('interviews').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] |null>{

    const{userId, limit=20} = params;
    const interviews = await db.collection('interviews').where('finalized', '==', true).where('userId', '!=', userId).limit(limit).get();
    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}