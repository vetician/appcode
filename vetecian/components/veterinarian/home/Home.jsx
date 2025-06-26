import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { HeartPulse, PawPrint, Stethoscope, Syringe, CalendarClock, Menu } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const { user } = useSelector(state => state.auth);
    const navigation = useNavigation();

    const stats = [
        { icon: HeartPulse, label: 'Patients', value: '24', color: '#34C759' },
        { icon: PawPrint, label: 'Appointments', value: '12', color: '#FF9500' },
        { icon: Stethoscope, label: 'Surgeries', value: '3', color: '#007AFF' },
    ];

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                    <Menu size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.greeting}>Hello, Dr. {user?.name || 'Veterinarian'}!</Text>
                    <Text style={styles.subtitle}>Welcome to your veterinary dashboard</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                {stats.map((stat, index) => (
                    <View key={index} style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                            <stat.icon size={24} color={stat.color} />
                        </View>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={styles.actionIcon}>
                            <Syringe size={24} color="#007AFF" />
                        </View>
                        <Text style={styles.actionTitle}>New Treatment</Text>
                        <Text style={styles.actionDescription}>Record a new treatment for a patient</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={styles.actionIcon}>
                            <CalendarClock size={24} color="#34C759" />
                        </View>
                        <Text style={styles.actionTitle}>Schedule</Text>
                        <Text style={styles.actionDescription}>View today's appointments</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.recentActivity}>
                <Text style={styles.sectionTitle}>Recent Patients</Text>
                <View style={styles.activityList}>
                    <View style={styles.activityItem}>
                        <View style={styles.activityDot} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Max (Golden Retriever)</Text>
                            <Text style={styles.activityTime}>Annual checkup - 10:00 AM</Text>
                        </View>
                    </View>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#34C759' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Whiskers (Persian Cat)</Text>
                            <Text style={styles.activityTime}>Vaccination - 11:30 AM</Text>
                        </View>
                    </View>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#FF9500' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Rocky (German Shepherd)</Text>
                            <Text style={styles.activityTime}>Post-op followup - 2:00 PM</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

// Keep all the existing styles exactly as they were
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
    },
    menuButton: {
        marginRight: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 24,
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    quickActions: {
        padding: 24,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    actionIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#007AFF20',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    actionDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    recentActivity: {
        padding: 24,
        paddingTop: 0,
    },
    activityList: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
        marginRight: 16,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 14,
        color: '#666',
    },
});