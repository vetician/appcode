import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Image,
    Dimensions,
    Modal,
    ScrollView
} from 'react-native';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getPetsByUserId, clearUserPets } from '../../../store/slices/authSlice';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const PET_TYPES = {
    Dog: 'dog',
    Cat: 'cat',
    default: 'paw'
};

const PetCard = ({ pet, onPress }) => {
    if (!pet) return null;

    const getPetIcon = () => {
        return PET_TYPES[pet.species] || PET_TYPES.default;
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.cardImageContainer}>
                {pet?.petPhoto ? (
                    <Image source={{ uri: pet.petPhoto }} style={styles.profileImage} />
                ) : (
                    <View style={styles.profilePlaceholder}>
                        <FontAwesome5
                            name={getPetIcon()}
                            size={32}
                            color="#4E8D7C"
                        />
                    </View>
                )}
            </View>

            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{pet.species}</Text>
                    </View>
                </View>

                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="gender-male-female" size={16} color="#7D7D7D" />
                        <Text style={styles.detailText}>{pet.gender}</Text>
                    </View>
                    {pet.breed && (
                        <View style={styles.detailItem}>
                            <FontAwesome5 name="dna" size={14} color="#7D7D7D" />
                            <Text style={styles.detailText}>{pet.breed}</Text>
                        </View>
                    )}
                </View>

                {pet.dob && (
                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <MaterialIcons name="cake" size={16} color="#7D7D7D" />
                            <Text style={styles.detailText}>
                                {new Date(pet.dob).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.statsContainer}>
                    {pet.weight && <StatItem value={`${pet.weight} kg`} label="Weight" />}
                    {pet.height && <StatItem value={`${pet.height} cm`} label="Height" />}
                    {pet.age && <StatItem value={pet.age} label="Age" />}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const StatItem = ({ value, label }) => (
    <View style={styles.statItem}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const PetListScreen = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const pets = useSelector(state => state.auth?.userPets?.data || []);

    useEffect(() => {
        fetchPets();
        return () => dispatch(clearUserPets());
    }, [dispatch]);

    const fetchPets = async () => {
        try {
            setLoading(true);
            const result = await dispatch(getPetsByUserId()).unwrap();
            if (result.error) throw new Error(result.payload || 'Failed to load pets');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await dispatch(getPetsByUserId());
        } catch (err) {
            setError(err.message);
        } finally {
            setRefreshing(false);
        }
    };

    const handlePetPress = (pet) => {
        setSelectedPet(pet);
        setModalVisible(true);
    };

    if (loading && !refreshing) return <LoadingView />;
    if (error) return <ErrorView error={error} onRetry={() => {
        setError(null);
        dispatch(getPetsByUserId());
    }} />;

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.resultsContainer}>
                <Text style={styles.resultsText}>
                    {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'} Registered
                </Text>
                <TouchableOpacity onPress={handleRefresh}>
                    <MaterialIcons name="refresh" size={24} color="#4E8D7C" />
                </TouchableOpacity>
            </View>

            {pets.length === 0 ? (
                <EmptyState onAddPet={() => router.navigate('/pages/PetDetail')} />
            ) : (
                <>
                    <FlatList
                        data={pets}
                        renderItem={({ item }) => <PetCard pet={item} onPress={() => handlePetPress(item)} />}
                        keyExtractor={(item) => item._id || String(Math.random())}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                    <TouchableOpacity
                        style={styles.addButtonFloating}
                        onPress={() => router.navigate('/pages/PetDetail')}
                    >
                        <MaterialIcons name="add" size={28} color="white" />
                    </TouchableOpacity>
                    {selectedPet && (
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Pet Details</Text>
                                        <TouchableOpacity 
                                            style={styles.modalCloseButton}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <MaterialIcons name="close" size={24} color="#7D7D7D" />
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView 
                                        contentContainerStyle={styles.modalScrollContent}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <View style={styles.modalImageContainer}>
                                            {selectedPet.petPhoto ? (
                                                <Image
                                                    source={{ uri: selectedPet.petPhoto }}
                                                    style={styles.modalImage}
                                                />
                                            ) : (
                                                <View style={styles.modalImagePlaceholder}>
                                                    <FontAwesome5
                                                        name={PET_TYPES[selectedPet.species] || PET_TYPES.default}
                                                        size={60}
                                                        color="#4E8D7C"
                                                    />
                                                </View>
                                            )}
                                        </View>

                                        <View style={styles.modalDetails}>
                                            <View style={styles.modalPetInfo}>
                                                <Text style={styles.modalPetName}>{selectedPet.name}</Text>
                                                <View style={styles.modalPetTypeContainer}>
                                                    <Text style={styles.modalPetType}>{selectedPet.species}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.detailsSection}>
                                                <Text style={styles.sectionTitle}>Basic Information</Text>
                                                <View style={styles.detailRow}>
                                                    <Text style={styles.detailLabel}>Gender:</Text>
                                                    <Text style={styles.detailValue}>{selectedPet.gender}</Text>
                                                </View>
                                                {selectedPet.breed && (
                                                    <View style={styles.detailRow}>
                                                        <Text style={styles.detailLabel}>Breed:</Text>
                                                        <Text style={styles.detailValue}>{selectedPet.breed}</Text>
                                                    </View>
                                                )}
                                                {selectedPet.dob && (
                                                    <View style={styles.detailRow}>
                                                        <Text style={styles.detailLabel}>Date of Birth:</Text>
                                                        <Text style={styles.detailValue}>
                                                            {new Date(selectedPet.dob).toLocaleDateString()}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>

                                            <View style={styles.detailsSection}>
                                                <Text style={styles.sectionTitle}>Physical Characteristics</Text>
                                                {selectedPet.color && (
                                                    <View style={styles.detailRow}>
                                                        <Text style={styles.detailLabel}>Color:</Text>
                                                        <Text style={styles.detailValue}>{selectedPet.color}</Text>
                                                    </View>
                                                )}
                                                {selectedPet.weight && (
                                                    <View style={styles.detailRow}>
                                                        <Text style={styles.detailLabel}>Weight:</Text>
                                                        <Text style={styles.detailValue}>{selectedPet.weight} kg</Text>
                                                    </View>
                                                )}
                                                {selectedPet.height && (
                                                    <View style={styles.detailRow}>
                                                        <Text style={styles.detailLabel}>Height:</Text>
                                                        <Text style={styles.detailValue}>{selectedPet.height} cm</Text>
                                                    </View>
                                                )}
                                            </View>

                                            {selectedPet.location && (
                                                <View style={styles.detailsSection}>
                                                    <Text style={styles.sectionTitle}>Location</Text>
                                                    <View style={styles.detailRow}>
                                                        <Text style={styles.detailLabel}>Address:</Text>
                                                        <Text style={styles.detailValue}>{selectedPet.location}</Text>
                                                    </View>
                                                </View>
                                            )}

                                            {selectedPet.notes && (
                                                <View style={styles.detailsSection}>
                                                    <Text style={styles.sectionTitle}>Additional Notes</Text>
                                                    <Text style={styles.notesText}>{selectedPet.notes}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                    )}
                </>
            )}
        </View>
    );
};

const Header = () => (
    <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
            <ChevronLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View>
            <Text style={styles.headerTitle}>My Pets</Text>
            <Text style={styles.headerSubtitle}>Your registered companions</Text>
        </View>
    </View>
);

const LoadingView = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E8D7C" />
        <Text style={styles.loadingText}>Loading your pets...</Text>
    </View>
);

const ErrorView = ({ error, onRetry }) => (
    <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color="#E74C3C" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
    </View>
);

const EmptyState = ({ onAddPet }) => (
    <View style={styles.emptyContainer}>
        <FontAwesome5 name="paw" size={60} color="#E0E0E0" />
        <Text style={styles.emptyTitle}>No Pets Found</Text>
        <Text style={styles.emptyText}>You haven't registered any pets yet</Text>
        <TouchableOpacity style={styles.addPetButton} onPress={onAddPet}>
            <Text style={styles.addPetButtonText}>Register a Pet</Text>
        </TouchableOpacity>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 16,
        paddingTop: 50
    },
    header: {
        marginBottom: 20,
        paddingHorizontal: 8,
        display: "flex",
        flexDirection: 'row'
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#7D7D7D'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA'
    },
    loadingText: {
        marginTop: 16,
        color: '#4E8D7C',
        fontSize: 16
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F8F9FA'
    },
    errorText: {
        fontSize: 16,
        color: '#E74C3C',
        marginVertical: 20,
        textAlign: 'center'
    },
    retryButton: {
        backgroundColor: '#4E8D7C',
        padding: 12,
        borderRadius: 8,
        marginTop: 10
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600'
    },
    resultsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8
    },
    resultsText: {
        color: '#2C3E50',
        fontSize: 16,
        fontWeight: '600'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#2C3E50',
        marginTop: 16
    },
    emptyText: {
        fontSize: 16,
        color: '#7D7D7D',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24
    },
    addPetButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#4E8D7C',
        borderRadius: 8
    },
    addPetButtonText: {
        color: 'white',
        fontWeight: '600'
    },
    listContainer: {
        paddingBottom: 30
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3
    },
    cardImageContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
        marginRight: 16
    },
    profilePlaceholder: {
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: '#F0F7F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    cardContent: {
        flex: 1
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    petName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        flex: 1,
        marginRight: 10
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#E8F5E9',
        borderColor: '#4E8D7C',
        borderWidth: 1
    },
    typeText: {
        fontSize: 12,
        color: '#4E8D7C',
        fontWeight: '600'
    },
    detailsRow: {
        flexDirection: 'row',
        marginBottom: 8
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 4
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#EEE'
    },
    statItem: {
        alignItems: 'center'
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50'
    },
    statLabel: {
        fontSize: 12,
        color: '#7D7D7D',
        marginTop: 2
    },
    menuButton: {
        marginRight: 20,
        justifyContent: 'center',
        padding: 5
    },
    addButtonFloating: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4E8D7C',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        maxHeight: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        backgroundColor: '#F8F9FA',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
    },
    modalCloseButton: {
        padding: 5,
    },
    modalScrollContent: {
        paddingBottom: 30,
    },
    modalImageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    modalImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#4E8D7C',
    },
    modalImagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#F0F7F4',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#4E8D7C',
    },
    modalDetails: {
        paddingHorizontal: 20,
    },
    modalPetInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalPetName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
    },
    modalPetTypeContainer: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#4E8D7C',
    },
    modalPetType: {
        fontSize: 14,
        color: '#4E8D7C',
        fontWeight: '600',
    },
    detailsSection: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4E8D7C',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 15,
        color: '#7D7D7D',
        fontWeight: '500',
        flex: 1,
    },
    detailValue: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    notesText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});


export default PetListScreen;