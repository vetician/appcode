import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Mail,
  MoreVertical,
  Filter,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  // Dummy data - replace with API calls later
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      permitted: true,
      userType: "premium",
      joinDate: "2024-01-15",
      callsCount: 245,
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      permitted: false,
      userType: "basic",
      joinDate: "2024-02-20",
      callsCount: 12,
    },
    {
      id: 3,
      username: "alex_wilson",
      email: "alex@example.com",
      permitted: true,
      userType: "basic",
      joinDate: "2024-01-08",
      callsCount: 89,
    },
    {
      id: 4,
      username: "sarah_johnson",
      email: "sarah@example.com",
      permitted: true,
      userType: "premium",
      joinDate: "2023-12-10",
      callsCount: 567,
    },
    {
      id: 5,
      username: "mike_brown",
      email: "mike@example.com",
      permitted: false,
      userType: "basic",
      joinDate: "2024-03-05",
      callsCount: 3,
    },
    {
      id: 6,
      username: "emma_davis",
      email: "emma@example.com",
      permitted: true,
      userType: "premium",
      joinDate: "2024-01-22",
      callsCount: 334,
    },
    {
      id: 7,
      username: "chris_miller",
      email: "chris@example.com",
      permitted: false,
      userType: "premium",
      joinDate: "2024-02-14",
      callsCount: 78,
    },
    {
      id: 8,
      username: "lisa_garcia",
      email: "lisa@example.com",
      permitted: true,
      userType: "basic",
      joinDate: "2024-01-30",
      callsCount: 156,
    },
    {
      id: 9,
      username: "david_martinez",
      email: "david@example.com",
      permitted: false,
      userType: "basic",
      joinDate: "2024-03-12",
      callsCount: 7,
    },
    {
      id: 10,
      username: "amy_rodriguez",
      email: "amy@example.com",
      permitted: true,
      userType: "premium",
      joinDate: "2023-11-25",
      callsCount: 445,
    },
  ]);

  const [activeCategory, setActiveCategory] = useState("permitted");
  const [searchTerm, setSearchTerm] = useState("");

  // Function to toggle user permission status
  const toggleUserPermission = async (userId) => {
    try {
      // Find the user
      const userToUpdate = users.find((user) => user.id === userId);
      if (!userToUpdate) return;

      // For now, update locally - replace with actual API call
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, permitted: !user.permitted } : user
        )
      );

      console.log(
        `User ${userId} permission toggled to: ${!userToUpdate.permitted}`
      );
    } catch (error) {
      console.error("Error updating user permission:", error);
    }
  };

  // Categories configuration
  const categories = [
  {
    id: "verified-veterinary",
    name: "Verified Veterinary",
    icon: UserCheck,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    id: "unverified-veterinary",
    name: "Unverified Veterinary",
    icon: UserX,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    id: "verified-clinic",
    name: "Verified Clinic",
    icon: Users,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    id: "unverified-clinic",
    name: "Unverified Clinic",
    icon: Crown,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  ];

  // Filter users based on category
  const getFilteredUsers = (category) => {
    switch (category) {
      case "verified-veterinary":
        return users.filter((user) => user.permitted === true);
      case "unverified-veterinary":
        return users.filter((user) => user.permitted === false);
      case "verified-clinic":
        return users.filter((user) => user.userType === "basic");
      case "unverified-clinic":
        return users.filter((user) => user.userType === "premium");
      default:
        return users;
    }
  };

  // Apply search filter
  const filteredUsers = useMemo(() => {
    const categoryUsers = getFilteredUsers(activeCategory);
    if (!searchTerm) return categoryUsers;

    return categoryUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeCategory, searchTerm, users]);

  // Get category stats
  const getCategoryStats = (category) => {
    return getFilteredUsers(category).length;
  };

  const UserCard = ({ user }) => {
    const statusColor = user.permitted
      ? "text-emerald-400 bg-emerald-500/10"
      : "text-red-400 bg-red-500/10";
    const typeColor =
      user.userType === "premium"
        ? "text-purple-400 bg-purple-500/10"
        : "text-blue-400 bg-blue-500/10";

    return (
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-600/50 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                {user.username}
              </h3>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-3 h-3" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
              >
                {user.permitted ? "Permitted" : "Blocked"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Type</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor} capitalize`}
              >
                {user.userType}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Calls</span>
              <span className="text-white font-medium">{user.callsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Joined</span>
              <span className="text-gray-300 text-sm">
                {new Date(user.joinDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => toggleUserPermission(user.id)}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2 ${
              user.permitted
                ? "bg-red-600/20 hover:bg-red-600/30 text-red-400"
                : "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400"
            }`}
          >
            {user.permitted ? (
              <UserX className="w-4 h-4" />
            ) : (
              <UserCheck className="w-4 h-4" />
            )}
            <span>{user.permitted ? "Block User" : "Permit User"}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800/50 border-r border-gray-700/50 backdrop-blur-sm">
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Admin Panel</h1>
              <p className="text-gray-400 text-sm">Call App Management</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            const count = getCategoryStats(category.id);

            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSearchTerm("");
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `${category.bgColor} ${category.borderColor} border`
                    : "hover:bg-gray-700/30"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? category.color : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isActive ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    isActive ? category.color : "text-gray-500"
                  } ${isActive ? category.bgColor : "bg-gray-700/50"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{user?.username}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center space-x-2 p-2 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Settings</span>
            </button>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center space-x-2 p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800/30 border-b border-gray-700/50 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {categories.find((cat) => cat.id === activeCategory)?.name}
                </h2>
                <p className="text-gray-400">
                  Manage and monitor{" "}
                  {categories
                    .find((cat) => cat.id === activeCategory)
                    ?.name.toLowerCase()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                  <Filter className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Showing {filteredUsers.length} of{" "}
                {getCategoryStats(activeCategory)} users
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No users in this category yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;






















// src/pages/AdminDashboard.js
// import React, { useState, useMemo } from "react";
// import Sidebar from "./admin/Sidebar";
// import Header from "./admin/Header";
// import UserGrid from "./admin/UserGrid";
// import { categories } from "../constants/adminCategories";
// import { useAuth } from "../contexts/AuthContext";

// const AdminDashboard = () => {
//   const { user, logout } = useAuth();
//   // Function to generate random user data
//   const generateRandomUsers = (count) => {
//     const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Mike', 'Emma', 'Chris', 'Lisa', 'David', 'Amy', 'Robert', 'Olivia', 'James', 'Sophia', 'William', 'Isabella', 'Benjamin', 'Mia', 'Daniel', 'Charlotte'];
//     const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
//     const domains = ['example.com', 'mail.com', 'test.com', 'demo.com', 'domain.com'];

//     return Array.from({ length: count }, (_, i) => {
//       const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
//       const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
//       const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
//       const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
//       const permitted = Math.random() > 0.3; // 70% chance of being permitted
//       const userType = Math.random() > 0.5 ? 'premium' : 'basic'; // 50/50 chance
//       const joinDate = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
//       const callsCount = Math.floor(Math.random() * 1000);

//       return {
//         id: i + 1,
//         username,
//         email,
//         permitted,
//         userType,
//         joinDate,
//         callsCount
//       };
//     });
//   };

//   // Initialize with random users
//   const [users, setUsers] = useState(generateRandomUsers(20));
//   const [activeCategory, setActiveCategory] = useState("verified-veterinary");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Function to toggle user permission status
//   const toggleUserPermission = async (userId) => {
//     // ... same as before
//   };

//   // Function to filter users based on category
//   const getFilteredUsers = (category) => {
//     switch (category) {
//       case "verified-veterinary":
//         return users.filter((user) => user.permitted === true);
//       case "unverified-veterinary":
//         return users.filter((user) => user.permitted === false);
//       case "verified-clinic":
//         return users.filter((user) => user.userType === "basic");
//       case "unverified-clinic":
//         return users.filter((user) => user.userType === "premium");
//       default:
//         return users;
//     }
//   };

//   // Apply search filter
//   const filteredUsers = useMemo(() => {
//     const categoryUsers = getFilteredUsers(activeCategory);
//     if (!searchTerm) return categoryUsers;

//     return categoryUsers.filter(
//       (user) =>
//         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeCategory, searchTerm, users]);

//   // Get category stats
//   const getCategoryStats = (category) => {
//     return getFilteredUsers(category).length;
//   };

//   // Compute counts for each category
//   const categoryCounts = useMemo(() => {
//     const counts = {};
//     categories.forEach((category) => {
//       counts[category.id] = getCategoryStats(category.id);
//     });
//     return counts;
//   }, [users]);

//   return (
//     <div className="min-h-screen bg-gray-900 flex">
//       <Sidebar
//         activeCategory={activeCategory}
//         setActiveCategory={setActiveCategory}
//         setSearchTerm={setSearchTerm}
//         user={user}
//         logout={logout}
//         getCategoryStats={getCategoryStats}
//       />

//       <div className="flex-1 flex flex-col">
//         <Header
//           activeCategory={activeCategory}
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           categories={categories}
//         />

//         <main className="flex-1 p-6 overflow-auto">
//           <UserGrid
//             users={filteredUsers}
//             toggleUserPermission={toggleUserPermission}
//             searchTerm={searchTerm}
//             activeCategory={activeCategory}
//             categoryCounts={categoryCounts}
//           />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;