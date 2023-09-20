import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';

const RegisterScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Phone:', phone);
        console.log('Password:', password);

        navigation.navigate('Smoke Tracker')
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
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
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
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                style={styles.input}
                theme={{
                    colors: { primary: '#FFD700' },
                    roundness: 10, // Set border radius for TextInput
                }}
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
