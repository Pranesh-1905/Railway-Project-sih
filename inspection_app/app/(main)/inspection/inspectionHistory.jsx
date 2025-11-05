import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import api from "../../../utils/api";

export default function InspectionHistory() {
  const { componentId } = useLocalSearchParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    async function fetchHistory() {
      try {
        const { data } = await api.get(`/inspection/history/${componentId}`);
        setHistory(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [componentId]);

  const renderHistoryItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.historyCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.6)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.inspectionId}>Inspection #{index + 1}</Text>
          <View style={[
            styles.statusBadge,
            item.status === "DEFECTED" && styles.statusDefected
          ]}>
            <Text style={[
              styles.statusText,
              item.status === "DEFECTED" && styles.statusTextDefected
            ]}>
              {item.status === "OK" ? "✅ OK" : "❌ DEFECTED"}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inspector:</Text>
            <Text style={styles.detailValue}>{item.inspected_by || "N/A"}</Text>
          </View>
          
          {item.defect_type && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Defect Type:</Text>
              <Text style={styles.detailValue}>{item.defect_type}</Text>
            </View>
          )}
          
          {item.comments && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Comments:</Text>
              <Text style={styles.detailValue}>{item.comments}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {item.inspected_at
                ? new Date(item.inspected_at).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>
              {item.inspected_at
                ? new Date(item.inspected_at).toLocaleTimeString()
                : "N/A"}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <Animated.View 
            style={[styles.header, { opacity: fadeAnim }]}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.headerIcon}
            >
              <Text style={styles.headerEmoji}>📋</Text>
            </LinearGradient>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Inspection History</Text>
              <Text style={styles.headerSubtitle}>Component ID: {componentId}</Text>
            </View>
          </Animated.View>

          {/* History List */}
          <FlatList
            data={history}
            keyExtractor={(item) => item.inspection_id || Math.random().toString()}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Animated.View 
                style={[styles.emptyContainer, { opacity: fadeAnim }]}
              >
                <LinearGradient
                  colors={['rgba(30, 41, 59, 0.6)', 'rgba(51, 65, 85, 0.4)']}
                  style={styles.emptyCard}
                >
                  <Text style={styles.emptyIcon}>📋</Text>
                  <Text style={styles.emptyTitle}>No Inspection History</Text>
                  <Text style={styles.emptyText}>
                    This component has not been inspected yet
                  </Text>
                </LinearGradient>
              </Animated.View>
            }
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inspectionId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDefected: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  statusTextDefected: {
    color: '#ef4444',
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
});
