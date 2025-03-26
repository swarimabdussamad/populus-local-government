import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Table, Row, Rows } from 'react-native-table-component';
import * as XLSX from 'xlsx';
import { API_URL } from '@/constants/constants';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Column mapping for Excel import
const COLUMN_MAPPING = {
  'Name': 'name',
  'Date of Birth': 'dateOfBirth',
  'Gender': 'gender',
  'Email': 'email',
  'Income': 'income',
  'House Details': 'houseDetails',
  'Ward Number': 'wardNumber',
  'Self Government type': 'selfGovType',
  'Locality': 'locality',
  'District': 'district',
  'Mobile Number': 'mobileNo',
  'Aadhaar Number': 'aadhaarNo',
  'Ration ID': 'rationId',
  'Is Owner Home': 'isOwnerHome',
  'Latitude': 'latitude',       // Add these new fields
  'Longitude': 'longitude',
};

const REQUIRED_COLUMNS = [
  'Name', 'Date of Birth', 'Gender', 'Email', 'House Details', 
  'Ward Number', 'Self Government type', 'Locality', 'District', 'Mobile Number', 
  'Aadhaar Number', 'Ration ID'
];

interface ResidentData {
  name: string;
  dateOfBirth: string; 
  gender: string;
  email: string;
  income: string;
  houseDetails: string;
  wardNumber: string;
  selfGovType: string;
  locality: string;
  district: string;
  mobileNo: string;
  aadhaarNo: string;
  rationId: string;
  isOwnerHome: string;
  // Generated fields
  photo: string;
  mappedHouse: string;
  username: string;
  password: string;
  
  // Add index signature to allow string indexing
  [key: string]: string;
}

const columnWidths: { [key: string]: number } = {
  name: 150,
  dateOfBirth: 120,
  gender: 80,
  email: 200,
  mobileNo: 120,
  aadhaarNo: 150,
  rationId: 120,
  district: 120,
  place: 120,
  username: 120,
  photo: 150,
  mappedHouse: 200,
  income: 100,
  houseDetails: 100,
  wardNumber: 100,
  locality: 120,
  isOwnerHome: 100,
};

interface ValidationError {
  row: number;
  column: string;
  message: string;
}

const { width } = Dimensions.get('window');

const ImportResident: React.FC = () => {
  const router = useRouter();
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ResidentData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState<'all' | 'errors'>('all');

  // Select Excel file from device
  const pickExcelFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      copyToCacheDirectory: true
    });
    
    if (result.canceled) {
      return;
    }
    
    // Reset states
    setParsedData([]);
    setValidationErrors([]);
    setTableData([]);
    setTableHeaders([]);
    setSuccessCount(0);
    setFailCount(0);
    
    setFileSelected(result.assets[0].name);
    
    // Log the file name for additional debugging
    console.log('Selected File:', result.assets[0].name);
    
    parseExcelFile(result.assets[0].uri);
  } catch (error) {
    console.error('Error picking document:', error);
    Alert.alert('Error', 'Could not select the file');
  }
};
  // Parse the Excel file
  const parseExcelFile = async (fileUri: string) => {
    setIsLoading(true);
    try {
      // Read the file
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Check if required columns exist
      const firstRow = jsonData[0] as any;

      // Debug: Log column names
      console.log('Columns in Excel file:', Object.keys(firstRow));
      console.log('Raw Row Data:', JSON.stringify(Row, null, 2));
      const normalizeColumnName = (name: string) => {
        return name.trim().toLowerCase().replace(/\s+/g, ' ');
      };

      // Check if required columns exist
      const missingColumns = REQUIRED_COLUMNS.filter(col => {
        const normalizedCol = normalizeColumnName(col);
        return !Object.keys(firstRow).some(excelCol => 
          normalizeColumnName(excelCol) === normalizedCol
        );
      });
      
      if (missingColumns.length > 0) {
        Alert.alert(
          'Missing Columns', 
          `The following required columns are missing: ${missingColumns.join(', ')}. Please check your Excel file.`
        );
        setFileSelected(null);
        setIsLoading(false);
        return;
      }
      const convertExcelDate = (serial: number): string => {
        // Excel's epoch starts on January 1, 1900
        const epoch = new Date(1900, 0, 1);
        // Subtract 1 because Excel considers 1/1/1900 as day 1
        const date = new Date(epoch.getTime() + (serial - 1) * 86400 * 1000);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };
      
      // Process and transform data
      const processedData = jsonData.map((row: any) => {
        // Map Excel columns to our data model
        // Create the resident object with explicit field mapping
  const residentData: ResidentData = {
    // Map all fields explicitly to avoid any naming issues
    name: row['Name']?.toString() || '',
    dateOfBirth: row['Date of Birth'] ? convertExcelDate(row['Date of Birth']) : '',
    gender: row['Gender']?.toString() || '',
    email: row['Email']?.toString() || '',
    income: row['Income']?.toString() || '',
    houseDetails: row['House Details ']?.toString() ||
      row['house details']?.toString() || 
      row['houseDetails']?.toString() || 
      row['House_Details']?.toString() || 
      row['house_details']?.toString() || 
      row['Household Details']?.toString() || 
      'Not specified',
    
    wardNumber: row['Ward Number']?.toString() || '',
    selfGovType: row['Self Government type']?.toString() || '',
    locality: row['Locality']?.toString() || '',
    district: row['District']?.toString() || '',
    mobileNo: row['Mobile Number']?.toString() || '',
    aadhaarNo: row['Aadhaar Number']?.toString() || '',
    rationId: row['Ration ID']?.toString() || '',
    isOwnerHome: row['Is Owner Home']?.toString() || 'No',
    latitude: row['Latitude']?.toString() || '10.7867',
    longitude: row['Longitude']?.toString() || '76.6548',
    photo: 'https://res.cloudinary.com/dnwlvkrqs/image/upload/v1709756169/default_profile_s5lwlz.png',
    mappedHouse: `Latitude: ${parseFloat(row['Latitude'] || '10.7867').toFixed(12)}, Longitude: ${parseFloat(row['Longitude'] || '76.6548').toFixed(12)}`,
    // Generated fields
    username: '',
    password: ''
  };
        // Object.entries(COLUMN_MAPPING).forEach(([excelCol, dataField]) => {
        //   if (excelCol in row) { // Skip houseDetails since we already set it
        //     if (dataField === 'dateOfBirth' && typeof row[excelCol] === 'number') {
        //       residentData[dataField] = convertExcelDate(row[excelCol]);
        //     } else {
        //       residentData[dataField] = row[excelCol]?.toString() || '';
        //     }
        //   }
        // });
        
        // Generate username based on name and mobile
        const namePart = (residentData.name || '').toLowerCase().replace(/\s+/g, '_').substring(0, 10);
        const mobilePart = (residentData.mobileNo || '').substring(0, 4);
        residentData.username = `${namePart}_${mobilePart}`;
        
        // Generate a random password
        residentData.password = Math.random().toString(36).substring(2, 10) + 
                             Math.random().toString(36).substring(2, 10).toUpperCase() + 
                             '!@#$%^&*'.charAt(Math.floor(Math.random() * 8));
        
        // Default values for required fields
        residentData.photo = 'https://res.cloudinary.com/dnwlvkrqs/image/upload/v1709756169/default_profile_s5lwlz.png';
        // residentData.mappedHouse = JSON.stringify({
        //   latitude: 10.7867,  // Default to center of Kerala
        //   longitude: 76.6548
        // });
        
        return residentData as ResidentData;
      });
      
      setParsedData(processedData);
      
      // Validate the data
      const errors = validateData(processedData);
      setValidationErrors(errors);
      
      // Prepare table data for preview
      prepareTableData(processedData, errors);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      Alert.alert('Error', 'Could not parse the Excel file. Please check the file format.');
      setFileSelected(null);
      setIsLoading(false);
    }
  };
  
  // Validate the imported data
  const validateData = (data: ResidentData[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    data.forEach((resident, rowIndex) => {
      // Validate name
      if (!resident.name) {
        errors.push({ row: rowIndex, column: 'Name', message: 'Name is required' });
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(resident.email)) {
        errors.push({ row: rowIndex, column: 'Email', message: 'Invalid email format' });
      }
      
      // Validate mobile number
      const mobileRegex = /^[2-9]\d{9}$/;
      if (!mobileRegex.test(resident.mobileNo)) {
        errors.push({ row: rowIndex, column: 'Mobile Number', message: 'Invalid 10-digit mobile number' });
      }
      
      // Validate Aadhaar number
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(resident.aadhaarNo)) {
        errors.push({ row: rowIndex, column: 'Aadhaar Number', message: 'Invalid 12-digit Aadhaar number' });
      }
      
      // Validate Ration ID
      const rationRegex = /^\d{10}$/;
      if (!rationRegex.test(resident.rationId)) {
        errors.push({ row: rowIndex, column: 'Ration ID', message: 'Invalid 10-digit Ration ID' });
      }
    });
    
    return errors;
  };
  
  // Prepare table data for preview
  const prepareTableData = (data: ResidentData[], errors: ValidationError[]) => {
    if (data.length === 0) return;
    
    // Get all keys from the first record
    const allKeys = Object.keys(data[0]);
    const displayKeys = [
      'name', 'email', 'mobileNo', 'aadhaarNo', 'rationId', 'district', 'place', 'username'
    ];
    
    setTableHeaders(['Row', ...allKeys]);
    
    // Create rows for table
    const rows = data.map((resident, index) => {
      // Check if this row has any errors
      const rowErrors = errors.filter(err => err.row === index);
      const hasErrors = rowErrors.length > 0;
      
      // If viewing only errors and this row has none, skip it
      if (previewMode === 'errors' && !hasErrors) {
        return null;
      }
      
      return [
        String(index + 1),
        ...allKeys.map(key => {
          const value = resident[key] || '';
          // Check if this cell has an error
          const cellError = rowErrors.find(err => 
            COLUMN_MAPPING[err.column as keyof typeof COLUMN_MAPPING] === key
          );
          
          return cellError ? `❌ ${value}` : value;
        })
      ];
    }).filter(Boolean) as string[][];
    
    setTableData(rows);
  };
  const showRowErrors = (rowIndex: number) => {
    const errorsForRow = validationErrors.filter(err => err.row === rowIndex);
    
    if (errorsForRow.length === 0) {
      Alert.alert(
        'No Validation Errors',
        `Row ${rowIndex + 1} has no validation errors.`
      );
      return;
    }
    
    const errorMessages = errorsForRow.map(err => 
      `• Column "${err.column}": ${err.message}`
    ).join('\n\n');
    
    Alert.alert(
      `Validation Errors for Row ${rowIndex + 1}`,
      errorMessages,
      [{ text: 'OK' }]
    );
  };
  // Toggle between all data and errors only
  const togglePreviewMode = () => {
    const newMode = previewMode === 'all' ? 'errors' : 'all';
    setPreviewMode(newMode);
    prepareTableData(parsedData, validationErrors);
  };
  
  // Submit data to server
  const handleSubmit = async () => {
    if (validationErrors.length > 0) {
      Alert.alert(
        'Validation Errors',
        `There are ${validationErrors.length} validation errors. Please correct them before submitting.`
      );
      return;
    }
    
    if (parsedData.length === 0) {
      Alert.alert('Error', 'No data to submit');
      return;
    }
    
    setIsSubmitting(true);
    setSuccessCount(0);
    setFailCount(0);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        setIsSubmitting(false);
        return;
      }
      
      const batchSize = 10;
      let successCount = 0;
      let failCount = 0;
      let detailedErrors: {name: string, errorMessage: string}[] = [];
      
      for (let i = 0; i < parsedData.length; i += batchSize) {
        const batch = parsedData.slice(i, i + batchSize);
        
        const results = await Promise.all(
          batch.map(async (resident) => {
            try {
              const formattedResident = {
                ...resident,
                dateOfBirth: formatDate(resident.dateOfBirth)
              };
              
              const response = await fetch(`${API_URL}/government/adding_residents`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formattedResident),
              });
              
              // Parse the response body
              const responseData = await response.json();
              
              if (!response.ok) {
                // Throw an error with details from the server
                throw new Error(
                  responseData.message || 
                  `Failed to register ${resident.name}` || 
                  'Unknown error occurred'
                );
              }
              
              return { 
                success: true, 
                name: resident.name 
              };
            } catch (error) {
              console.error(`Error registering ${resident.name}:`, error);
              return { 
                success: false, 
                name: resident.name, 
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          })
        );
        
        // Process results
        results.forEach(result => {
          if (result.success) {
            successCount++;
          } else {
            failCount++;
            detailedErrors.push({
              name: result.name,
              errorMessage: result.errorMessage || 'Unknown error'
            });
          }
        });
        
        // Update UI
        setSuccessCount(successCount);
        setFailCount(failCount);
      }
      
      setIsSubmitting(false);
      
      if (failCount === 0) {
        Alert.alert(
          'Success',
          `All ${successCount} residents were successfully registered.`,
          [{ text: 'OK', onPress: () => {
            setParsedData([]);
            setFileSelected(null);
            setValidationErrors([]);
            setTableData([]);
            setTableHeaders([]);
            router.push('/home');
          }}]
        );
      } else {
        // Show detailed error dialog
        Alert.alert(
          'Registration Errors',
          `${successCount} residents were successfully registered. ${failCount} registrations failed.`,
          [
            {
              text: 'View Errors',
              onPress: () => {
                // Create a detailed error message
                const errorDetails = detailedErrors.map(
                  (error, index) => `${index + 1}. ${error.name}: ${error.errorMessage}`
                ).join('\n\n');
                
                Alert.alert(
                  'Detailed Registration Errors',
                  errorDetails,
                  [{ text: 'OK' }]
                );
              }
            },
            { text: 'Dismiss' }
          ]
        );
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSubmitting(false);
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'An error occurred while submitting the data.'
      );
    }
  };
  
  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      // Handle different date formats
      let date;
      
      // Check if it's Excel's serial number format
      if (!isNaN(Number(dateString))) {
        // Convert Excel serial date to JS date
        date = new Date(Math.round((Number(dateString) - 25569) * 86400 * 1000));
      } else {
        // Try parsing as regular date string
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return dateString; // Return as is if parsing fails
      }
      
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } catch (e) {
      return dateString; // Return as is if any error occurs
    }
  };

  // Add this function to handle the download
  const downloadTemplate = async () => {
    const templateUrl = 'https://docs.google.com/spreadsheets/d/1F1hqGHIKbtGUEbktLVcMUbTdWc5XvJg8/edit?usp=drive_link&ouid=105719840336689489096&rtpof=true&sd=true';

    try {
      // Open the URL in the user's browser
      await Linking.openURL(templateUrl);
      Alert.alert('Success', 'Template opened in your browser.');
    } catch (error) {
      console.error('Error downloading template:', error);
      Alert.alert('Error', 'Could not open the template. Please try again.');
    }
  };
  
  // Effect to update table when preview mode changes
  useEffect(() => {
    if (parsedData.length > 0) {
      prepareTableData(parsedData, validationErrors);
    }
  }, [previewMode]);

  // Function to display all columns and their values for a row
  const showAllColumnsForRow = (rowIndex: number) => {
    if (rowIndex < 0 || rowIndex >= parsedData.length) return;
    
    const resident = parsedData[rowIndex];
    const allDetails = Object.entries(resident).map(([key, value]) => {
      return `${key}: ${value}`;
    }).join('\n');
    
    Alert.alert(
      `Details for Row ${rowIndex + 1}`,
      allDetails
    );
  };

  return (
    <LinearGradient 
      colors={['#f0f4f8', '#ffffff']} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Ionicons name="cloud-upload-outline" size={48} color="#2c3e50" />
          <Text style={styles.headerTitle}>Bulk Resident Import</Text>
        </View>
  
        <View style={styles.instructionCard}>
          <View style={styles.instructionStep}>
            <Ionicons name="download-outline" size={24} color="#3498db" />
            <Text style={styles.instructionText}>Download Excel Template</Text>
          </View>
          <View style={styles.instructionStep}>
            <Ionicons name="document-text-outline" size={24} color="#2ecc71" />
            <Text style={styles.instructionText}>Fill in Resident Details</Text>
          </View>
          <View style={styles.instructionStep}>
            <Ionicons name="cloud-upload-outline" size={24} color="#e74c3c" />
            <Text style={styles.instructionText}>Upload Completed File</Text>
          </View>
  
          <TouchableOpacity 
            style={styles.templateButton} 
            onPress={downloadTemplate}
          >
            <Text style={styles.templateButtonText}>Download Template</Text>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity 
          style={styles.uploadCard} 
          onPress={pickExcelFile}
          disabled={isLoading || isSubmitting}
        >
          <Ionicons 
            name="cloud-upload" 
            size={48} 
            color={fileSelected ? "#2ecc71" : "#3498db"} 
          />
          <Text style={styles.uploadText}>
            {fileSelected ? `Selected: ${fileSelected}` : 'Upload Excel File'}
          </Text>
        </TouchableOpacity>
  
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Processing Data...</Text>
          </View>
        )}
  
        {parsedData.length > 0 && !isLoading && (
          <View style={styles.dataCard}>
            <View style={styles.dataHeader}>
              <Text style={styles.dataHeaderText}>
                {parsedData.length} Residents Found
              </Text>
              {validationErrors.length > 0 && (
                <View style={styles.errorHeaderContainer}>
                  <Text style={styles.errorHeaderText}>
                    {validationErrors.length} Validation Errors
                  </Text>
                  <TouchableOpacity 
                    style={styles.errorToggle} 
                    onPress={togglePreviewMode}
                  >
                    <Text style={styles.errorToggleText}>
                      {previewMode === 'all' ? 'Show Only Errors' : 'Show All Rows'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
  
            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  {tableHeaders.map((header, index) => (
                    <View
                      key={`header-${index}`}
                      style={[styles.tableHeaderCell, { width: columnWidths[header] || 120 }]}
                    >
                      <Text style={styles.tableHeaderText}>{header}</Text>
                    </View>
                  ))}
                </View>
  
                {/* Table Rows */}
                {tableData.map((row, rowIndex) => {
                  const originalRowIndex = parseInt(row[0]) - 1;
                  const hasErrors = validationErrors.some(err => err.row === originalRowIndex);
                  
                  return (
                    <TouchableOpacity
                      key={`row-${rowIndex}`}
                      style={[
                        styles.tableRow,
                        hasErrors && styles.errorRow
                      ]}
                      onPress={() => showRowErrors(originalRowIndex)}
                    >
                      {row.map((cell, cellIndex) => {
                        const isErrorCell = cell.startsWith('❌');
                        const cellValue = isErrorCell ? cell.substring(2) : cell;
                        
                        return (
                          <View
                            key={`cell-${cellIndex}`}
                            style={[
                              styles.tableCell, 
                              { width: columnWidths[tableHeaders[cellIndex]] || 120 },
                              isErrorCell && styles.errorCell
                            ]}
                          >
                            <Text 
                              style={[
                                styles.tableCellText,
                                isErrorCell && styles.errorCellText
                              ]} 
                              numberOfLines={1} 
                              ellipsizeMode="tail"
                            >
                              {cellValue}
                            </Text>
                          </View>
                        );
                      })}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
  
            {/* Error summary */}
            {validationErrors.length > 0 && (
              <View style={styles.errorSummary}>
                <Text style={styles.errorSummaryTitle}>Validation Error Summary:</Text>
                {Array.from(new Set(validationErrors.map(e => e.column))).map(column => {
                  const count = validationErrors.filter(e => e.column === column).length;
                  return (
                    <Text key={column} style={styles.errorSummaryItem}>
                      • {count} error(s) in {column}
                    </Text>
                  );
                })}
              </View>
            )}
  
            <TouchableOpacity 
              style={[
                styles.submitButton,
                validationErrors.length > 0 && styles.disabledButton
              ]} 
              onPress={handleSubmit}
              disabled={validationErrors.length > 0 || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Registering...' : 'Register All Residents'}
              </Text>
              {validationErrors.length > 0 && (
                <Text style={styles.submitButtonErrorText}>
                  ({validationErrors.length} errors must be fixed first)
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingTop: 50,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: 12,
  },
  instructionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#34495e',
  },
  templateButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  templateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3498db',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#3498db',
  },
  dataCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dataHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  errorHeaderText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f8ff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeaderCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003366',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  tableCellText: {
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorHeaderContainer: {
    alignItems: 'flex-end',
  },
  errorToggle: {
    marginTop: 4,
  },
  errorToggleText: {
    color: '#3498db',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  errorRow: {
    backgroundColor: '#fff0f0',
  },
  errorCell: {
    backgroundColor: '#ffdddd',
  },
  errorCellText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  errorSummary: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff0f0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorSummaryTitle: {
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
  },
  errorSummaryItem: {
    color: '#c0392b',
    marginLeft: 8,
    marginBottom: 4,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  submitButtonErrorText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ImportResident;