import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import VerifiedVeterinarians from './VerifiedVeterinarians';
import UnverifiedVeterinarians from './UnverifiedVeterinarians';
import VerifiedClinics from './VerifiedClinics';
import UnverifiedClinics from './UnverifiedClinics';
import apiService from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("verified-veterinary");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    verifiedVets: 0,
    unverifiedVets: 0,
    verifiedClinics: 0,
    unverifiedClinics: 0,
  });

  // Categories configuration
  const categories = [
    {
      id: "verified-veterinary",
      name: "Verified Veterinary",
      icon: "UserCheck",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "unverified-veterinary",
      name: "Unverified Veterinary",
      icon: "UserX",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      id: "verified-clinic",
      name: "Verified Clinic",
      icon: "Users",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      id: "unverified-clinic",
      name: "Unverified Clinic",
      icon: "Crown",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
  ];

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [verifiedVets, unverifiedVets, verifiedClinics, unverifiedClinics] = await Promise.all([
        apiService.getVerifiedVeterinarians(),
        apiService.getUnverifiedVeterinarians(),
        apiService.getVerifiedClinics(),
        apiService.getUnverifiedClinics(),
      ]);

      setStats({
        verifiedVets: verifiedVets.count || 0,
        unverifiedVets: unverifiedVets.count || 0,
        verifiedClinics: verifiedClinics.count || 0,
        unverifiedClinics: unverifiedClinics.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Get category stats
  const getCategoryStats = (category) => {
    switch (category) {
      case "verified-veterinary":
        return stats.verifiedVets;
      case "unverified-veterinary":
        return stats.unverifiedVets;
      case "verified-clinic":
        return stats.verifiedClinics;
      case "unverified-clinic":
        return stats.unverifiedClinics;
      default:
        return 0;
    }
  };

  // Render active component
  const renderActiveComponent = () => {
    switch (activeCategory) {
      case "verified-veterinary":
        return <VerifiedVeterinarians />;
      case "unverified-veterinary":
        return <UnverifiedVeterinarians />;
      case "verified-clinic":
        return <VerifiedClinics />;
      case "unverified-clinic":
        return <UnverifiedClinics />;
      default:
        return <VerifiedVeterinarians />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        getCategoryStats={getCategoryStats}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader 
          activeCategory={activeCategory}
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredCount={getCategoryStats(activeCategory)}
          totalCount={getCategoryStats(activeCategory)}
        />

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;