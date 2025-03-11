import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { API_URL } from '@/constants/constants';

type MapStackParamList = {
  Map: undefined;
  HouseDetails: { houseDetails: string };
  
};

type HouseDetailsRouteProp = RouteProp<MapStackParamList, 'HouseDetails'>;

type HouseData = {
  _id: string;
  aadhaarNo: string;
  dateOfBirth: string;
  district: string;
  gender: string;
  houseDetails: string;
  locality: string;
  mobileNo: string;
  name: string;
  place: string;
  rationId: string;
};

const HouseDetails: React.FC = () => {
  const route = useRoute<HouseDetailsRouteProp>();
  const { houseDetails } = route.params;
  const [data, setData] = useState<HouseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/government/housedetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ houseDetails }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response:', result);
        setData(result.data); // Use result.data as per the response structure
      } catch (err) {
        console.error('Error while fetching house details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [houseDetails]);

  const renderItem = ({ item }: { item: HouseData }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDetail}>Aadhaar: {item.aadhaarNo}</Text>
      <Text style={styles.cardDetail}>DOB: {item.dateOfBirth}</Text>
      <Text style={styles.cardDetail}>Gender: {item.gender}</Text>
      <Text style={styles.cardDetail}>District: {item.district}</Text>
      <Text style={styles.cardDetail}>Locality: {item.locality}</Text>
      <Text style={styles.cardDetail}>Mobile: {item.mobileNo}</Text>
      <Text style={styles.cardDetail}>Place: {item.place}</Text>
      <Text style={styles.cardDetail}>rationId: {item.rationId}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No Data Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>House Details</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cardDetail: {
    fontSize: 14,
    marginVertical: 2,
    color: '#555',
  },
});

export default HouseDetails;