import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
   
  return (
    <DrawerContentScrollView {...props}>
      {/* Admin Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={24} color="#1b1b7e" />
        <Text style={styles.headerText}>Admin</Text>
      </View>

      {/* Default Drawer Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b1b7e',
  },
});

export default CustomDrawerContent;