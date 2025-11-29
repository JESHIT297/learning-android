import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

interface ProfileProps {
  user?: {
    firstname: string;
    lastname: string;
    email: string;
    mobile_number: string;
  };
}

export default function Profile({ user }: ProfileProps) {
  const getAvatarUrl = () => {
    if (user?.firstname && user?.lastname) {
      const initials = `${user.firstname}+${user.lastname}`;
      return `https://ui-avatars.com/api/?name=${initials}&size=120&background=007BFF&color=fff&rounded=true`;
    }
    return 'https://ui-avatars.com/api/?name=User&size=120&background=007BFF&color=fff&rounded=true';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: getAvatarUrl() }}
            style={styles.avatar}
          />
        </View>
        
        <Text style={styles.name}>
          {user ? `${user.firstname} ${user.lastname}` : 'Usuario'}
        </Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || 'No disponible'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>Mobile number:</Text>
            <Text style={styles.value}>{user?.mobile_number || 'No disponible'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>Firstname:</Text>
            <Text style={styles.value}>{user?.firstname || 'No disponible'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>Lastname:</Text>
            <Text style={styles.value}>{user?.lastname || 'No disponible'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    padding: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007BFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4ececff',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  label: {
    fontSize: 16,
    color: '#cccccc',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#f4ececff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
});