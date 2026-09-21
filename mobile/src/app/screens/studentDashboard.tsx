import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function DashboardScreen() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    // Clear the stored session token
    await AsyncStorage.removeItem('user_token');
    // Redirect back to login screen
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{title:'', headerShown:true,headerStyle:{backgroundColor:'#1025A2'},
      headerTintColor: '#fff',
          headerLeft: () => (
            <TouchableOpacity onPress={toggleSidebar} style={{ marginLeft: 10 }}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          ),
    }} />
      <View style={styles.blueheaderbackground}>
        <Text style={styles.whitetexts}>WELCOME BACK</Text>
        <Text style={styles.moretexts}>SOPHIA MATANO</Text>
        <Text style={styles.moretexts}>BSC COMPUTER SCIENCE-BSC100034/33967</Text>
        
      </View>
      <View style={styles.activeCard}>
        <View style={styles.innercard}>
          <Text style={styles.blactTexts}>NEXORA COMPANY</Text>
          <Text style={styles.blueTexts}>ACTIVE</Text>
        </View>
        <Text style={styles.roleTexts}>SOFTWARE DEVELOPMENT INTERN</Text>

      </View>
      <View style={styles.supervisorcard}>
        <Text style={styles.roleTexts}>SUPERVISOR: </Text>
        <Text style={styles.blueTexts}>JOHN DOE</Text>

      </View>
      <View style={styles.grid}>
        <View style={styles.logbookssubmittedcard}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statText}>Logbooks submitted</Text>
        </View>
        <View style={styles.logbookssubmittedcard}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statText}>Awaiting feedback</Text>
        </View>

      </View>

       <View style={styles.grid}>
        <View style={styles.logbookssubmittedcard}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statText}>Logbooks submitted</Text>
        </View>
        <View style={styles.logbookssubmittedcard}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statText}>Awaiting feedback</Text>
        </View>

      </View>
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={() => console.log('Submit logbook clicked')}
      >
        <Ionicons name="document-text-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.submitButtonText}>Submit logbook</Text>
      </TouchableOpacity>
    <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Internship progress</Text>
          <Text style={styles.progressPercentage}>40%</Text>
        </View>

        {/* Progress Bar Track and Fill */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '40%' }]} />
        </View>

        <Text style={styles.progressFooterText}>Ends 30 Nov 2026</Text>
      </View>
      

    
      {/* --- SIDEBAR OVERLAY COMPONENT --- */}
      {isSidebarOpen && (
        <View style={styles.sidebarOverlay}>
          {/* The Navigation Panel */}
          <View style={styles.sidebarContainer}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Student Menu</Text>
              <TouchableOpacity onPress={toggleSidebar}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Clickable Options */}
            <TouchableOpacity 
              style={styles.sidebarItem} 
              onPress={() => { toggleSidebar(); console.log('Profile clicked'); }}
            >
              <Ionicons name="person-outline" size={20} color="#1025A2" style={styles.menuIcon} />
              <Text style={styles.sidebarItemText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sidebarItem} 
              onPress={() => { toggleSidebar(); console.log('Logbooks clicked'); }}
            >
              <Ionicons name="book-outline" size={20} color="#1025A2" style={styles.menuIcon} />
              <Text style={styles.sidebarItemText}>My Logbooks</Text>
            </TouchableOpacity>

            <TouchableOpacity    style={styles.sidebarItem} onPress={()=>{toggleSidebar();console.log('internships clicked');}}
            >
              <Ionicons name= "document-text-outline" size={20}color="#1025A2" style={styles.menuIcon}/>
              <Text style={styles.sidebarItemText}>Internships</Text>


            </TouchableOpacity >
            <TouchableOpacity    style={styles.sidebarItem} onPress={()=>{toggleSidebar();console.log('reports clicked');}}
            >
              <Ionicons name= "document-text-outline" size={20}color="#1025A2" style={styles.menuIcon}/>
              <Text style={styles.sidebarItemText}>My Reports</Text>


            </TouchableOpacity >

            <TouchableOpacity 
              style={styles.sidebarItem} 
              onPress={() => { toggleSidebar(); handleLogout(); }}
            >
              <Ionicons name="log-out-outline" size={20} color="#ff3b30" style={styles.menuIcon} />
              <Text style={[styles.sidebarItemText, { color: '#ff3b30' }]}>Log Out</Text>
            </TouchableOpacity>
          </View>

          {/* Semi-transparent backdrop to close sidebar when tapped outside */}
          <TouchableOpacity 
            style={styles.backdrop} 
            activeOpacity={1} 
            onPress={toggleSidebar} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#1025A2', // Matches your deep blue theme
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  blueheaderbackground:{
    backgroundColor: '#1025A2', // Deep blue
    height: SCREEN_HEIGHT * 0.28, // Roughly a quarter of the screen height
    paddingTop: 45,
  paddingHorizontal: 20,
  },
  topBar:{
    flexDirection:'row',
    backgroundColor:'#1025A2',
    justifyContent: 'flex-end',
    marginBottom: 5,
    
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: '75%',
    backgroundColor: '#fff',
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 1001,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1025A2',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 15,
  },
  sidebarItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  whitetexts:{
    color:'#fff',
    fontSize:20,
    fontWeight:'bold'
  },
  moretexts:{
    color:'#fff',
    fontSize:15,
    fontWeight:'normal'},

  activeCard:{
    backgroundColor:'#fff',
    marginHorizontal: 20,
    marginTop: -35, // Pulls the card up halfway into the blue header
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    },
  innercard:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    },
    blactTexts:{
      color:'#000',
      fontSize:20,
      fontWeight:'bold',
    },
    blueTexts:{
      color:'#1025A2',
      fontSize:20,
      fontWeight:'bold',
    },

    roleTexts:{
      color:'#000',
      fontSize:16,
      fontWeight:'normal',
      marginBottom: 20
    
    },
  supervisorcard:{
    flexDirection: 'row',
    padding:10,
    justifyContent:'center'
  },
  grid:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginHorizontal:20,
    marginBottom:5,


  },
  logbookssubmittedcard:{
    backgroundColor: '#fff',
    width: '48%', // Makes two cards fit side-by-side with a small gap
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%', // Makes two cards fit side-by-side with a small gap
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1025A2',
    marginBottom: 4,
  },
  statText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  progressCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 30, // Extra spacing at the bottom of the scrollable area
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1025A2',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#e5e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1025A2', // Matches your deep blue theme
    borderRadius: 4,
  },
  progressFooterText: {
    fontSize: 12,
    color: '#666',
  },
    
});