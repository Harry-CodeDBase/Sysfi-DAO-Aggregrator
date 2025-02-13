// AdminDeleteUsers.js
import React, { useEffect, useState } from 'react';
import { db } from './Firebase'; // Adjust the import path if necessary
import { useAuth } from '../../hooks/Context'; // Adjust the import path if necessary
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

const AdminDeleteUsers = () => {
  const [users, setUsers] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchUsersWithZeroBalance();
    }
  }, [isAdmin]);

  const fetchUsersWithZeroBalance = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('fundingBalance', '==', 0));
      const usersSnapshot = await getDocs(q);
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      // Delete user from Firestore
      await deleteDoc(doc(db, 'users', userId));

    //  console.log(`User ${userId} deleted successfully.`);
      fetchUsersWithZeroBalance(); // Refresh the list after deletion
    } catch (error) {
     // console.error(`Error deleting user ${userId}: `, error);
    }
  };

  const deleteAllUsers = async () => {
    const usersToDelete = users; // Use the current list of users fetched
    for (const user of usersToDelete) {
      await deleteUser(user.id);
    }
  };

  if (!isAdmin) {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div>
      <h2>Users with Zero Funding Balance</h2>
      <button onClick={deleteAllUsers}>Delete All</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email} - {user.fundingBalance}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDeleteUsers;
