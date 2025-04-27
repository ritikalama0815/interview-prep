'use server';

import { db } from "@/firebase/admin";




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