import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated, Easing, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AlertCircle, ChevronLeft, Heart, Share2, Bookmark } from 'lucide-react-native';
import React, { useRef, useState } from 'react';

const HealthTipsScreen = () => {
    const navigation = useNavigation();
    const [expandedTip, setExpandedTip] = useState(null);
    const [bookmarkedTips, setBookmarkedTips] = useState([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    React.useEffect(() => {
        // Animation on component mount
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const healthTips = [
        {
            id: '1',
            title: 'Summer Pet Care',
            description: 'Keep your pets hydrated and avoid walking them on hot pavement during peak temperatures. Provide plenty of shade and fresh water.',
            extendedInfo: 'Signs of heatstroke include excessive panting, drooling, lethargy, and vomiting. If you suspect heatstroke, move your pet to a cool area immediately and contact your vet.',
            image: 'https://images.unsplash.com/photo-1551290464-66719418ca54?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: '2',
            title: 'Vaccination Reminder',
            description: 'Annual vaccines are due next month. Schedule an appointment with your veterinarian to keep your pet protected.',
            extendedInfo: 'Core vaccines for dogs include rabies, distemper, parvovirus, and adenovirus. For cats: rabies, feline distemper, calicivirus, and herpesvirus.',
            image: 'https://images.unsplash.com/photo-1583511655826-05700442b31f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: '3',
            title: 'Dental Care Routine',
            description: 'Brush your pet\'s teeth regularly to prevent dental disease and bad breath. Use pet-safe toothpaste.',
            extendedInfo: 'Start slowly with finger brushing if your pet is new to dental care. Look for signs of dental issues like red gums, difficulty eating, or excessive drooling.',
            image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: '4',
            title: 'Flea and Tick Prevention',
            description: 'Use veterinarian-recommended flea and tick prevention year-round to protect your pet.',
            extendedInfo: 'Even indoor pets need protection. Watch for excessive scratching, visible insects, or "flea dirt" (black pepper-like specks) in their fur.',
            image: 'https://images.unsplash.com/photo-1551410224-699683e15636?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: '5',
            title: 'Proper Nutrition',
            description: 'Feed your pet age-appropriate, high-quality food in proper portions to maintain a healthy weight.',
            extendedInfo: 'Avoid giving human food that can be toxic (chocolate, grapes, onions, etc.). Consult your vet about your pet\'s specific dietary needs.',
            image: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: '6',
            title: 'Exercise Needs',
            description: 'Ensure your pet gets daily exercise appropriate for their breed, age, and health condition.',
            extendedInfo: 'Dogs typically need 30 minutes to 2 hours of activity daily. Cats benefit from interactive play sessions. Adjust for senior pets or health limitations.',
            image: 'https://images.unsplash.com/photo-1551189013-03a8d43053e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: '7',
            title: 'Grooming Essentials',
            description: 'Regular grooming keeps your pet comfortable and helps you spot potential health issues early.',
            extendedInfo: 'Long-haired pets may need daily brushing. Check skin for lumps, rashes, or parasites during grooming sessions. Don\'t forget nail trims!',
            image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: '8',
            title: 'Pet Proofing Your Home',
            description: 'Remove hazards like toxic plants, small choking objects, and exposed electrical cords.',
            extendedInfo: 'Common household dangers include lilies (toxic to cats), xylitol (in sugar-free gum), and loose strings/ribbons. Keep trash cans secured.',
            image: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: '9',
            title: 'Senior Pet Care',
            description: 'Older pets need more frequent vet checkups and may require diet or routine adjustments.',
            extendedInfo: 'Watch for signs of aging like decreased hearing/vision, stiffness, or behavior changes. Provide orthopedic bedding and easy food/water access.',
            image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: '10',
            title: 'Travel Safety',
            description: 'Secure pets properly in vehicles and never leave them unattended in hot cars.',
            extendedInfo: 'Use crash-tested carriers or harnesses. Bring familiar items to reduce stress. Research pet-friendly stops if traveling long distances.',
            image: 'https://images.unsplash.com/photo-1559681369-e8b09c685cf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
    ];

    const toggleExpand = (id) => {
        setExpandedTip(expandedTip === id ? null : id);
    };

    const toggleBookmark = (id) => {
        if (bookmarkedTips.includes(id)) {
            setBookmarkedTips(bookmarkedTips.filter(tipId => tipId !== id));
        } else {
            setBookmarkedTips([...bookmarkedTips, id]);
        }
    };

    const renderHealthTipCard = ({ item }) => {
        const isExpanded = expandedTip === item.id;
        const isBookmarked = bookmarkedTips.includes(item.id);

        return (
            <Animated.View
                style={[
                    styles.healthTipCard,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {item.image && (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.tipImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.healthTipMainContent}>
                    <View style={styles.healthTipIconRow}>
                        <View style={styles.healthTipIcon}>
                            <AlertCircle size={24} color="#4E8D7C" />
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                onPress={() => toggleBookmark(item.id)}
                                style={styles.actionButton}
                            >
                                <Bookmark
                                    size={20}
                                    color={isBookmarked ? "#FF5A5F" : "#666"}
                                    fill={isBookmarked ? "#FF5A5F" : "none"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Share2 size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.healthTipContent}>
                        <Text style={styles.healthTipTitle}>{item.title}</Text>
                        <Text
                            style={styles.healthTipDescription}
                            numberOfLines={isExpanded ? undefined : 3}
                        >
                            {item.description}
                        </Text>

                        {isExpanded && item.extendedInfo && (
                            <Text style={styles.extendedInfo}>{item.extendedInfo}</Text>
                        )}

                        <TouchableOpacity
                            onPress={() => toggleExpand(item.id)}
                            style={styles.readMoreButton}
                        >
                            <Text style={styles.readMoreText}>
                                {isExpanded ? 'Read Less' : 'Read More'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <ChevronLeft size={28} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Health Tips</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                <Text style={styles.introText}>
                    Keep your pets healthy and happy with these expert tips and recommendations.
                </Text>

                <View style={styles.filterContainer}>
                    <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
                        <Text style={styles.filterButtonTextActive}>All Tips</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterButtonText}>Preventive Care</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterButtonText}>Seasonal</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={healthTips}
                    renderItem={renderHealthTipCard}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={styles.healthTipsContainer}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    headerRightPlaceholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    introText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        lineHeight: 24,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#e8e8e8',
    },
    filterButtonActive: {
        backgroundColor: '#4E8D7C',
    },
    filterButtonText: {
        color: '#666',
        fontSize: 14,
    },
    filterButtonTextActive: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    healthTipsContainer: {
        paddingBottom: 24,
        gap: 20,
    },
    healthTipCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e1e5e9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tipImage: {
        width: '100%',
        height: 150,
    },
    healthTipMainContent: {
        padding: 16,
    },
    healthTipIconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    healthTipIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 6,
    },
    healthTipContent: {
        flex: 1,
    },
    healthTipTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    healthTipDescription: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 12,
    },
    extendedInfo: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        marginBottom: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    readMoreButton: {
        alignSelf: 'flex-start',
    },
    readMoreText: {
        color: '#4E8D7C',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default HealthTipsScreen;