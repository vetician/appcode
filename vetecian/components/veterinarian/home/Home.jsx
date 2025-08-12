// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { useSelector } from 'react-redux';
// import { HeartPulse, PawPrint, Stethoscope, Syringe, CalendarClock, Menu } from 'lucide-react-native';
// import { DrawerActions } from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';

// export default function Home() {
//     const { user } = useSelector(state => state.auth);
//     const navigation = useNavigation();

//     const stats = [
//         { icon: HeartPulse, label: 'Patients', value: '24', color: '#34C759' },
//         { icon: PawPrint, label: 'Appointments', value: '12', color: '#FF9500' },
//         { icon: Stethoscope, label: 'Surgeries', value: '3', color: '#007AFF' },
//     ];

//     const openDrawer = () => {
//         navigation.dispatch(DrawerActions.openDrawer());
//     };

//     return (
//         <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
//                     <Menu size={24} color="#1a1a1a" />
//                 </TouchableOpacity>
//                 <View>
//                     <Text style={styles.greeting}>Hello, Dr. {user?.name || 'Veterinarian'}!</Text>
//                     <Text style={styles.subtitle}>Welcome to your veterinary dashboard</Text>
//                 </View>
//             </View>

//             <View style={styles.statsContainer}>
//                 {stats.map((stat, index) => (
//                     <View key={index} style={styles.statCard}>
//                         <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
//                             <stat.icon size={24} color={stat.color} />
//                         </View>
//                         <Text style={styles.statValue}>{stat.value}</Text>
//                         <Text style={styles.statLabel}>{stat.label}</Text>
//                     </View>
//                 ))}
//             </View>

//             <View style={styles.quickActions}>
//                 <Text style={styles.sectionTitle}>Quick Actions</Text>
//                 <View style={styles.actionsGrid}>
//                     <TouchableOpacity style={styles.actionCard}>
//                         <View style={styles.actionIcon}>
//                             <Syringe size={24} color="#007AFF" />
//                         </View>
//                         <Text style={styles.actionTitle}>New Treatment</Text>
//                         <Text style={styles.actionDescription}>Record a new treatment for a patient</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity style={styles.actionCard}>
//                         <View style={styles.actionIcon}>
//                             <CalendarClock size={24} color="#34C759" />
//                         </View>
//                         <Text style={styles.actionTitle}>Schedule</Text>
//                         <Text style={styles.actionDescription}>View today's appointments</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <View style={styles.recentActivity}>
//                 <Text style={styles.sectionTitle}>Recent Patients</Text>
//                 <View style={styles.activityList}>
//                     <View style={styles.activityItem}>
//                         <View style={styles.activityDot} />
//                         <View style={styles.activityContent}>
//                             <Text style={styles.activityTitle}>Max (Golden Retriever)</Text>
//                             <Text style={styles.activityTime}>Annual checkup - 10:00 AM</Text>
//                         </View>
//                     </View>
//                     <View style={styles.activityItem}>
//                         <View style={[styles.activityDot, { backgroundColor: '#34C759' }]} />
//                         <View style={styles.activityContent}>
//                             <Text style={styles.activityTitle}>Whiskers (Persian Cat)</Text>
//                             <Text style={styles.activityTime}>Vaccination - 11:30 AM</Text>
//                         </View>
//                     </View>
//                     <View style={styles.activityItem}>
//                         <View style={[styles.activityDot, { backgroundColor: '#FF9500' }]} />
//                         <View style={styles.activityContent}>
//                             <Text style={styles.activityTitle}>Rocky (German Shepherd)</Text>
//                             <Text style={styles.activityTime}>Post-op followup - 2:00 PM</Text>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//         </ScrollView>
//     );
// }

// // Keep all the existing styles exactly as they were
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 24,
//         paddingTop: 60,
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e1e5e9',
//     },
//     menuButton: {
//         marginRight: 20,
//     },
//     greeting: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#1a1a1a',
//         marginBottom: 4,
//     },
//     subtitle: {
//         fontSize: 16,
//         color: '#666',
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         padding: 24,
//         gap: 16,
//     },
//     statCard: {
//         flex: 1,
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#e1e5e9',
//     },
//     statIcon: {
//         width: 48,
//         height: 48,
//         borderRadius: 24,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     statValue: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#1a1a1a',
//         marginBottom: 4,
//     },
//     statLabel: {
//         fontSize: 14,
//         color: '#666',
//     },
//     quickActions: {
//         padding: 24,
//         paddingTop: 0,
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#1a1a1a',
//         marginBottom: 16,
//     },
//     actionsGrid: {
//         flexDirection: 'row',
//         gap: 16,
//     },
//     actionCard: {
//         flex: 1,
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         borderWidth: 1,
//         borderColor: '#e1e5e9',
//     },
//     actionIcon: {
//         width: 48,
//         height: 48,
//         backgroundColor: '#007AFF20',
//         borderRadius: 24,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 16,
//     },
//     actionTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#1a1a1a',
//         marginBottom: 8,
//     },
//     actionDescription: {
//         fontSize: 14,
//         color: '#666',
//         lineHeight: 20,
//     },
//     recentActivity: {
//         padding: 24,
//         paddingTop: 0,
//     },
//     activityList: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         borderWidth: 1,
//         borderColor: '#e1e5e9',
//     },
//     activityItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 20,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e1e5e9',
//     },
//     activityDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: '#007AFF',
//         marginRight: 16,
//     },
//     activityContent: {
//         flex: 1,
//     },
//     activityTitle: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: '#1a1a1a',
//         marginBottom: 4,
//     },
//     activityTime: {
//         fontSize: 14,
//         color: '#666',
//     },
// });


















import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { HeartPulse, PawPrint, Stethoscope, Syringe, CalendarClock, Menu, Zap, BarChart2, Bell, FileText, Cloud, Shield } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

export default function Home() {
    const { user } = useSelector(state => state.auth);
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const stats = [
        { icon: HeartPulse, label: 'Patients', value: '24', color: '#34C759' },
        { icon: PawPrint, label: 'Appointments', value: '12', color: '#FF9500' },
        { icon: Stethoscope, label: 'Surgeries', value: '3', color: '#007AFF' },
    ];

    const upcomingFeatures = [
        { icon: BarChart2, title: 'Advanced Analytics', description: 'Detailed practice insights', progress: 65, color: '#5856D6' },
        { icon: Cloud, title: 'Cloud Backup', description: 'Automatic patient data sync', progress: 40, color: '#5AC8FA' },
        { icon: Shield, title: 'Security Upgrade', description: 'Enhanced data protection', progress: 80, color: '#4CD964' },
    ];

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <Animated.ScrollView style={[styles.container, { opacity: fadeAnim }]} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                    <Menu size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.greeting}>Hello, Dr. {user?.name || 'Veterinarian'}!</Text>
                    <Text style={styles.subtitle}>Welcome to your veterinary dashboard</Text>
                </View>
                {/* <TouchableOpacity style={styles.notificationButton}>
                    <Bell size={22} color="#1a1a1a" />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity> */}
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
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    {/* <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.actionIcon, { backgroundColor: '#007AFF20' }]}>
                            <Syringe size={24} color="#007AFF" />
                        </View>
                        <Text style={styles.actionTitle}>New Treatment</Text>
                        <Text style={styles.actionDescription}>Record a new treatment for a patient</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.actionIcon, { backgroundColor: '#34C75920' }]}>
                            <CalendarClock size={24} color="#34C759" />
                        </View>
                        <Text style={styles.actionTitle}>Schedule</Text>
                        <Text style={styles.actionDescription}>View today's appointments</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.upcomingFeatures}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Coming Soon</Text>
                    {/* <TouchableOpacity>
                        <Text style={styles.seeAll}>View Roadmap</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={styles.featuresGrid}>
                    {upcomingFeatures.map((feature, index) => (
                        <View key={index} style={[styles.featureCard, { borderLeftColor: feature.color }]}>
                            <View style={styles.featureHeader}>
                                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                                    <feature.icon size={20} color={feature.color} />
                                </View>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                            </View>
                            <Text style={styles.featureDescription}>{feature.description}</Text>
                            <View style={styles.progressContainer}>
                                <View style={[styles.progressBar, { width: `${feature.progress}%`, backgroundColor: feature.color }]} />
                            </View>
                            <Text style={styles.progressText}>{feature.progress}% complete</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.recentActivity}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Patients</Text>
                    {/* <TouchableOpacity>
                        <Text style={styles.seeAll}>View All</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={styles.activityList}>
                    <View style={styles.activityItem}>
                        <View style={styles.activityDot} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Max (Golden Retriever)</Text>
                            <Text style={styles.activityTime}>Annual checkup - 10:00 AM</Text>
                        </View>
                        <FileText size={18} color="#8E8E93" />
                    </View>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#34C759' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Whiskers (Persian Cat)</Text>
                            <Text style={styles.activityTime}>Vaccination - 11:30 AM</Text>
                        </View>
                        <FileText size={18} color="#8E8E93" />
                    </View>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#FF9500' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Rocky (German Shepherd)</Text>
                            <Text style={styles.activityTime}>Post-op followup - 2:00 PM</Text>
                        </View>
                        <FileText size={18} color="#8E8E93" />
                    </View>
                </View>
            </View>

            <View style={styles.promoBanner}>
                <Zap size={24} color="#FF9500" />
                <View style={styles.promoText}>
                    <Text style={styles.promoTitle}>New Features Coming Next Month!</Text>
                    <Text style={styles.promoDescription}>AI-assisted diagnosis and telemedicine capabilities</Text>
                </View>
            </View>
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuButton: {
        marginRight: 20,
    },
    notificationButton: {
        marginLeft: 'auto',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30',
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#8E8E93',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#8E8E93',
    },
    quickActions: {
        padding: 20,
        paddingTop: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    seeAll: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 13,
        color: '#8E8E93',
        lineHeight: 18,
    },
    upcomingFeatures: {
        padding: 20,
        paddingTop: 0,
    },
    featuresGrid: {
        gap: 12,
    },
    featureCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    featureHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    featureDescription: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 12,
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        marginBottom: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: '#8E8E93',
    },
    recentActivity: {
        padding: 20,
        paddingTop: 0,
    },
    activityList: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
        marginRight: 12,
    },
    activityTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    activityTime: {
        fontSize: 13,
        color: '#8E8E93',
    },
    promoBanner: {
        margin: 20,
        marginTop: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    promoText: {
        flex: 1,
        marginLeft: 12,
    },
    promoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    promoDescription: {
        fontSize: 13,
        color: '#8E8E93',
    },
});