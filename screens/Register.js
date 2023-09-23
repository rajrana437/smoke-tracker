import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore"

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, `${name.replace(/ /g, "")}@yopmail.com`, phone)
                .then((userCredential) => {
                    const userID = userCredential.user.uid;

                    setDoc(doc(db, "users", `${userID}`), {
                        phone,
                        name
                    }).then(() => {
                        console.log("User document successfully written!");
                        navigation.navigate('Smoke Tracker');
                    }).catch((error) => {
                        console.error("Error writing user document: ", error);
                    });
                })
                .catch((error) => {
                    alert('Signup Error, try again!')

                    console.log('Error during user creation in Auth: ', error);
                });
        } catch (error) {
            console.log('Error during user registration process: ', error);
            alert('Signup Error, try again!')
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/cig.png')} // Replace with the actual path to your logo
                style={styles.logo}
            />


            <TextInput
                label="Name"
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
                theme={{
                    colors: { primary: '#FFD700' },
                    roundness: 10, // Set border radius for TextInput
                }}
            />

            <TextInput
                label="Phone"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                style={styles.input}
                theme={{
                    colors: { primary: '#FFD700' },
                    roundness: 10, // Set border radius for TextInput
                }}
                keyboardType='numeric'
            />


            <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                theme={{ colors: { primary: 'white' } }}
            >
                Register
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#333', // Background color for the screen (cigarette-themed color)
    },
    logo: {
        width: 130, // Adjust the width and height as needed
        height: 100,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white', // Text color
    },
    input: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 10, // Rounded corners for input fields
        backgroundColor: 'rgba(255,255,255,0.3)', // Background color for input fields
    },
    button: {
        marginTop: 20,
        width: '100%',
        borderRadius: 10, // Rounded corners for the button
        backgroundColor: '#FFD700', // Button background color (cigarette-themed color)
    },
});

export default RegisterScreen;
