// app/(drawer)/internships/status.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { internshipApi } from '../../../src/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define interface for application data structure
interface Application {
  id: number | string;
  company_name?: string;
  companyName?: string;
  vacancy_title?: string;
  vacancyTitle?: string;
  applied_date?: string;
  appliedDate?: string;
  university_supervisor_approval?: string;
  universitySupervisorApproval?: string;
  company_approval?: string;
  companyApproval?: string;
  is_started?: boolean;
  isStarted?: boolean;
}

export default function ApplicationStatusScreen() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setError(null);
      // Replace 'current_student_id' with your actual logged-in student context later
      const data = await internshipApi.getMyApplications('current_student_id');
      setApplications(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchApplications();
  }, []);

  const handleStartInternship = async (applicationId: number | string) => {
    try {
      await internshipApi.startInternship(applicationId);
      Alert.alert(
        "Internship Started! 🚀", 
        "Your placement is now active. Weekly logbooks and reporting modules have been unlocked.",
        [{ text: "Go to Logbooks", onPress: () => router.push('/(drawer)/logbooks') }]
      );
      fetchApplications(); 
    } catch (err: any) {
      Alert.alert("Action Failed", err.message || 'Could not start internship');
    }
  };

  const renderBadge = (status: string = 'Pending') => {
    let color = '#f59e0b'; // Pending
    let bg = '#fef3c7';
    if (status === 'Approved') { color = '#10b981'; bg = '#d1fae5'; }
    if (status === 'Rejected') { color = '#ef4444'; bg = '#fee2e2'; }

    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={[styles.badgeText, { color }]}>{status}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading application tracker...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application & Approval Tracker</Text>
      <Text style={styles.subtitle}>Dual approval from your University Supervisor and Host Company is required to unlock your internship.</Text>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No active applications found.</Text>
            <TouchableOpacity style={styles.browseBtn} onPress={() => router.back()}>
              <Text style={styles.browseBtnText}>Browse Available Vacancies</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const supervisorStatus = item.university_supervisor_approval || item.universitySupervisorApproval;
          const companyStatus = item.company_approval || item.companyApproval;
          const bothApproved = supervisorStatus === 'Approved' && companyStatus === 'Approved';
          const isStarted = item.is_started || item.isStarted;

          return (
            <View style={styles.card}>
              <View style={styles.cardTopRow}>
                <Text style={styles.companyTitle}>{item.company_name || item.companyName}</Text>
                <Text style={styles.dateText}>Applied: {item.applied_date || item.appliedDate}</Text>
              </View>
              <Text style={styles.positionTitle}>{item.vacancy_title || item.vacancyTitle}</Text>

              <View style={styles.approvalsContainer}>
                <View style={styles.approvalRow}>
                  <Text style={styles.approvalLabel}>University Supervisor:</Text>
                  {renderBadge(supervisorStatus)}
                </View>

                <View style={styles.approvalRow}>
                  <Text style={styles.approvalLabel}>Host Company:</Text>
                  {renderBadge(companyStatus)}
                </View>
              </View>

              {isStarted ? (
                <View style={styles.activeBanner}>
                  <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                  <Text style={styles.activeBannerText}>Internship Active & In Progress</Text>
                </View>
              ) : bothApproved ? (
                <TouchableOpacity 
                  style={styles.startButton} 
                  onPress={() => handleStartInternship(item.id)}
                >
                  <Ionicons name="play-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.startButtonText}>Start Internship</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.waitingText}>⏳ Waiting for complete dual approvals to unlock.</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#666', fontSize: 14 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4, marginBottom: 16 },
  errorBanner: { backgroundColor: '#fee2e2', padding: 10, borderRadius: 8, marginBottom: 12 },
  errorText: { color: '#ef4444', fontSize: 12, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  companyTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  dateText: { fontSize: 11, color: '#888' },
  positionTitle: { fontSize: 13, color: '#555', marginTop: 2, marginBottom: 12 },
  approvalsContainer: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 10, marginBottom: 12 },
  approvalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  approvalLabel: { fontSize: 13, color: '#444' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  startButton: { backgroundColor: '#10b981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8 },
  startButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  activeBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d1fae5', padding: 10, borderRadius: 8 },
  activeBannerText: { color: '#065f46', fontWeight: '600', marginLeft: 6, fontSize: 13 },
  waitingText: { fontSize: 11, color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { color: '#666', fontSize: 14, marginTop: 10, marginBottom: 16 },
  browseBtn: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  browseBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 }
});