import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { collection, addDoc, Timestamp, doc, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Ionicons from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = ({navigation}) => {
    const [cigaretteCount, setCigaretteCount] = useState('');
    const [cigarettePrice, setCigarettePrice] = useState(''); // Changed to a number
    const [entries, setEntries] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [currentUser, setCurrentUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        // Load user's existing entries when the component mounts
        if (currentUser) {
            const loadEntries = async () => {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const entryCollectionRef = collection(userDocRef, 'entries');
                    
                    // Use a query to get the documents in the 'entries' collection
                    const querySnapshot = await getDocs(entryCollectionRef);
                    
                    const loadedEntries = [];
                    querySnapshot.forEach((doc) => {
                        loadedEntries.push({ id: doc.id, ...doc.data() });
                    });
    
                    setEntries(loadedEntries);
                } catch (error) {
                    console.error('Error loading entries:', error);
                }
            };
    
            loadEntries();
        }
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await auth.signOut().then(res => {
                AsyncStorage.clear();

                navigation.navigate('Register');
            }).catch(error => {
                console.log(error);
            })

            // Navigate to the register screen
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    const handleAddEntry = async () => {
        if (cigaretteCount && cigarettePrice && !isNaN(parseFloat(cigarettePrice))) {
            const newEntry = {
                count: cigaretteCount,
                price: parseFloat(cigarettePrice), // Ensure that price is a valid number
                timestamp: Timestamp.now(),
            };

            try {
                // Get the user's document reference
                const userDocRef = doc(db, 'users', currentUser.uid);

                // Add the new entry to a subcollection named 'entries'
                const entryCollectionRef = collection(userDocRef, 'entries');
                await addDoc(entryCollectionRef, newEntry);

                setEntries([...entries, newEntry]);
                setCigaretteCount('');
                setCigarettePrice('');
                setIsButtonDisabled(true);
            } catch (error) {
                console.error('Error adding entry:', error);
            }
        } else {
            if (!entries.length) return;
            let singleCig = entries.find(e => e.count === "1");
            const newEntry = {
                count: singleCig.count,
                price: parseFloat(singleCig.price),
                timestamp: Timestamp.now(),
            };

            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const entryCollectionRef = collection(userDocRef, 'entries');
                await addDoc(entryCollectionRef, newEntry);

                setEntries([...entries, newEntry]);
                setCigaretteCount('');
                setCigarettePrice('');
                setIsButtonDisabled(true);
            } catch (error) {
                console.error('Error adding entry:', error);
            }
        }
    };

    // Calculate total cigarettes and total price
    const totalCigarettes = entries.reduce((total, entry) => total + Number(entry.count), 0);
    const totalPrice = entries.reduce((total, entry) => total + entry.price * Number(entry.count), 0);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
            <View style={styles.headingContainer}>

                <Text style={styles.title}>Cigarette Tracker</Text>

            <Ionicons name="logout" size={27} color="white" style={styles.logoutButton} onPress={handleLogout} />
            </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        label="No. of Cigarettes"
                        value={cigaretteCount}
                        onChangeText={(text) => {
                            setCigaretteCount(text);
                            setIsButtonDisabled(!(text && cigarettePrice));
                        }}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <TextInput
                        label="Price per Cigarette"
                        value={cigarettePrice}
                        onChangeText={(text) => {
                            setCigarettePrice(text);
                            setIsButtonDisabled(!(text && cigaretteCount));
                        }}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                </View>
                <ScrollView
                    style={styles.entriesContainer}
                    contentContainerStyle={styles.entriesContent}
                >
                    {entries.map((entry, index) => (
                        <View key={index} style={styles.entry}>
                            <Text style={styles.entryText}>Cigarettes: {entry.count}</Text>
                            <Text style={styles.entryText}>Price: ${entry.price.toFixed(2)}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total Cigarettes: {totalCigarettes}</Text>
                    <Text style={styles.totalText}>Total Price: ${totalPrice.toFixed(2)}</Text>
                </View>
                <Button
                    mode="contained"
                    onPress={handleAddEntry}
                    style={styles.addButton}
                    // disabled={isButtonDisabled}
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
    logoutButton: {

    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

export default HomeScreen;
