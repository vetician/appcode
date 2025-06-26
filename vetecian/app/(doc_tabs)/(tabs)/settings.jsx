import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, Shield, Palette, Globe, CircleHelp as HelpCircle, ChevronRight, Stethoscope, PawPrint, ClipboardList, FileText } from 'lucide-react-native';

export default function Settings() {
  const { user } = useSelector(state => state.auth);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);

  const settingsGroups = [
    {
      title: 'Clinic Preferences',
      items: [
        {
          icon: Bell,
          title: 'Appointment Reminders',
          subtitle: 'Notify clients about upcoming appointments',
          type: 'switch',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: Stethoscope,
          title: 'Emergency Alerts',
          subtitle: 'Receive urgent case notifications',
          type: 'switch',
          value: emergencyAlertsEnabled,
          onToggle: setEmergencyAlertsEnabled,
        },
        {
          icon: Palette,
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          type: 'switch',
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          icon: Globe,
          title: 'Language',
          subtitle: 'English (US)',
          type: 'navigate',
        },
      ],
    },
    {
      title: 'Medical Records',
      items: [
        {
          icon: ClipboardList,
          title: 'Record Templates',
          subtitle: 'Manage your medical record templates',
          type: 'navigate',
        },
        {
          icon: FileText,
          title: 'Prescription Defaults',
          subtitle: 'Set your default prescription options',
          type: 'navigate',
        },
      ],
    },
    {
      title: 'Security & Support',
      items: [
        {
          icon: Shield,
          title: 'Privacy Settings',
          subtitle: 'Manage patient data privacy',
          type: 'navigate',
        },
        {
          icon: HelpCircle,
          title: 'Veterinary Support',
          subtitle: 'Get help with medical cases',
          type: 'navigate',
        },
      ],
    },
  ];

  const renderSettingItem = (item, index) => (
    <TouchableOpacity key={index} style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <item.icon size={20} color="#007AFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.settingAction}>
        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#e1e5e9', true: '#007AFF' }}
            thumbColor="#fff"
          />
        ) : (
          <ChevronRight size={20} color="#666" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Clinic Settings</Text>
        <Text style={styles.subtitle}>Manage your veterinary practice preferences</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {user?.name?.charAt(0).toUpperCase() || 'D'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Dr. {user?.name || 'Veterinarian'}</Text>
              <Text style={styles.userEmail}>{user?.specialization || 'General Practitioner'}</Text>
            </View>
          </View>
        </View>

        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupContainer}>
              {group.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}

        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Practice Information</Text>
          <View style={styles.appInfoContainer}>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Software Version</Text>
              <Text style={styles.appInfoValue}>2.4.1</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>License</Text>
              <Text style={styles.appInfoValue}>VET-2024</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// All styles remain exactly the same as in the original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 24,
  },
  userSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    marginBottom: 32,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  settingsGroup: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  groupContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingAction: {
    marginLeft: 16,
  },
  appInfo: {
    marginTop: 16,
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  appInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  appInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  appInfoLabel: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  appInfoValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});