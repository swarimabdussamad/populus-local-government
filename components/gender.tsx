import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  
  
];

const DropdownComponent = ({ value, setValue, error }) => {
  return (
    <View>
      <Dropdown
        style={[styles.dropdown, error ? styles.dropdownError : null]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select gender"
        value={value}
        onChange={(item) => {
          setValue(item.value);
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
  },
  dropdownError: {
    borderColor: 'red',

  },
  placeholderStyle: {
    
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  
    
  },
});
