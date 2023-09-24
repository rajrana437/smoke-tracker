import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Button as RNButton } from 'react-native'; // Rename Button to RNButton
import { TextInput, Button, Text, Portal, Modal, IconButton } from 'react-native-paper'; // Import Portal, Modal, and IconButton
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Ionicons from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

const HomeScreen = ({ navigation }) => {
  const [cigaretteCount, setCigaretteCount] = useState('');
  const [cigarettePrice, setCigarettePrice] = useState('');
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]); // State for filtered entries
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Store selected date
  const [showDatePicker, setShowDatePicker] = useState(false); // Control date picker visibility

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
          const q = query(entryCollectionRef, orderBy('timestamp', 'desc'));

          const querySnapshot = await getDocs(q);

          const loadedEntries = [];
          querySnapshot.forEach((doc) => {
            loadedEntries.push({ id: doc.id, ...doc.data() });
          });

          setEntries(loadedEntries);
          setFilteredEntries(loadedEntries); // Initialize filtered entries with all entries
        } catch (error) {
          console.error('Error loading entries:', error);
        }
      };

      loadEntries();
    }
  }, [currentUser]);

  useEffect(() => {
    // Update filtered entries when selectedDate changes
    if (selectedDate) {
      const filtered = entries.filter((entry) => {
        const entryDate = entry.timestamp.toDate();
        return (
          entryDate.getDate() === selectedDate.getDate() &&
          entryDate.getMonth() === selectedDate.getMonth() &&
          entryDate.getFullYear() === selectedDate.getFullYear()
        );
      });
      setFilteredEntries(filtered);
    }
  }, [selectedDate, entries]);

  const handleLogout = async () => {
    try {
      await auth
        .signOut()
        .then((res) => {
          AsyncStorage.clear();
          navigation.navigate('Register');
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAddEntry = async () => {
    if (cigaretteCount && cigarettePrice && !isNaN(parseFloat(cigarettePrice))) {
      const newEntry = {
        count: cigaretteCount,
        price: parseFloat(cigarettePrice),
        timestamp: Timestamp.now(),
      };

      try {
        // Get the user's document reference
        const userDocRef = doc(db, 'users', currentUser.uid);

        // Add the new entry to a subcollection named 'entries'
        const entryCollectionRef = collection(userDocRef, 'entries');
        await addDoc(entryCollectionRef, newEntry);

        setEntries([newEntry, ...entries]);
        setCigaretteCount('');
        setCigarettePrice('');
        setIsButtonDisabled(true);
        setSelectedDate(new Date());
      } catch (error) {
        console.error('Error adding entry:', error);
      }
    } else {
      if (!entries.length) return;
      let singleCig = entries.find((e) => e.count === '1');
      const newEntry = {
        count: singleCig.count,
        price: parseFloat(singleCig.price),
        timestamp: Timestamp.now(),
      };

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const entryCollectionRef = collection(userDocRef, 'entries');
        await addDoc(entryCollectionRef, newEntry);

        setEntries([newEntry, ...entries]);
        setCigaretteCount('');
        setCigarettePrice('');
        setIsButtonDisabled(true);
      } catch (error) {
        console.error('Error adding entry:', error);
      }
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onDateChange = (event, date) => {
    if (event.type === 'dismissed') {
      toggleDatePicker();
      return;
    }
    setSelectedDate(date);
    toggleDatePicker();
  };

  // Calculate total cigarettes and total price
  const totalCigarettes = entries.reduce(
    (total, entry) => total + Number(entry.count),
    0
  );
  const totalPrice = entries.reduce(
    (total, entry) => total + entry.price * Number(entry.count),
    0
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.title}>Cigarette Tracker</Text>
          <Ionicons
            name="logout"
            size={27}
            color="white"
            style={styles.logoutButton}
            onPress={handleLogout}
          />
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
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>Select Date:</Text>

          {showDatePicker ? (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          ) :           <RNButton // Use RNButton for the native date picker button
          title={selectedDate.toLocaleDateString()}
          onPress={toggleDatePicker}
        />}
        </View>
        <ScrollView
          style={styles.entriesContainer}
          contentContainerStyle={styles.entriesContent}
        >
          {filteredEntries.map((entry, index) => (
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
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerLabel: {
    color: 'white',
    marginRight: 10,
  },
  datePickerModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  logoutButton: {},
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
