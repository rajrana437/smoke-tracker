import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';

const HomeScreen = () => {
    const [cigaretteCount, setCigaretteCount] = useState('');
    const [cigarettePrice, setCigarettePrice] = useState(0); // Changed to a number
    const [entries, setEntries] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleAddEntry = () => {
        if (cigaretteCount && cigarettePrice && !isNaN(parseFloat(cigarettePrice))) {
            const newEntry = {
                count: cigaretteCount,
                price: parseFloat(cigarettePrice), // Ensure that price is a valid number
            };
            setEntries([...entries, newEntry]);
            setCigaretteCount('');
            setCigarettePrice('');
            setIsButtonDisabled(true);
        }
    };


    // Calculate total cigarettes and total price
    const totalCigarettes = entries.reduce((total, entry) => total + Number(entry.count), 0);
    const totalPrice = entries.reduce((total, entry) => total + (entry.price * Number(entry.count)), 0);

    // Get today's date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Display today's date */}
                <Text style={styles.dateText}>Date: {formattedDate}</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        label="No. of Cigarettes"
                        value={cigaretteCount}
                        onChangeText={(text) => {
                            setCigaretteCount(text);
                            setIsButtonDisabled(!(text && cigarettePrice));
                        }}
                        style={styles.input}
                        theme={{ colors: { primary: 'white' }, roundness: 10 }}
                    />
                    <TextInput
                        label="Price per Cigarette"
                        value={cigarettePrice.toString()} // Convert to string
                        onChangeText={(text) => {
                            setCigarettePrice(text);
                            setIsButtonDisabled(!(text && cigaretteCount));
                        }}
                        style={styles.input}
                        theme={{ colors: { primary: 'white' }, roundness: 10 }}
                        keyboardType='numeric'
                    />

                </View>

                <ScrollView
                    style={styles.entriesContainer}
                    contentContainerStyle={styles.entriesContent}
                >
                    {entries.map((entry, index) => (
                        <View key={index} style={styles.entry}>
                            <Text style={styles.entryText}>Cigarettes: {entry.count}</Text>
                            <Text style={styles.entryText}>
                                Price: ${entry.price.toFixed(2)} {/* Format price with 2 decimal places */}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Total row */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total Cigarettes: {totalCigarettes}</Text>
                    <Text style={styles.totalText}>Total Price: ${totalPrice.toFixed(2)}</Text>
                </View>

                <Button
                    mode="contained"
                    onPress={handleAddEntry}
                    style={styles.addButton}
                    theme={{ colors: { primary: '#FFD700' } }}
                    disabled={isButtonDisabled}
                >
                    Add
                </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#333', // Background color
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#333', // Background color
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 18,
        color: 'white',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    addButton: {
        width: '100%',
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: '#FFD700',
    },
    entriesContainer: {
        flex: 1,
    },
    entriesContent: {
        paddingVertical: 10,
    },
    entry: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
    },
    entryText: {
        color: 'white',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
    },
    totalText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
