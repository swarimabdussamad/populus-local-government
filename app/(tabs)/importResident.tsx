import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Table, Row, Rows } from 'react-native-table-component';
import * as XLSX from 'xlsx';
import { API_URL } from '@/constants/constants';
import * as Linking from 'expo-linking';

// Column mapping for Excel import
const COLUMN_MAPPING = {
  'Name': 'name',
  'Date of Birth': 'dateOfBirth',
  'Gender': 'gender',
  'Email': 'email',
  'Income': 'income',
  'House Details': 'houseDetails',
  'Ward Number': 'wardNumber',
  'Place': 'place',
  'Locality': 'locality',
  'District': 'district',
  'Mobile Number': 'mobileNo',
  'Aadhaar Number': 'aadhaarNo',
  'Ration ID': 'rationId',
  'Is Owner Home': 'isOwnerHome'
};

const REQUIRED_COLUMNS = [
  'Name', 'Date of Birth', 'Gender', 'Email', 'House Details', 
  'Ward Number', 'Place', 'Locality', 'District', 'Mobile Number', 
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
  place: string;
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
        const residentData: Partial<ResidentData> = {};
        
        Object.entries(COLUMN_MAPPING).forEach(([excelCol, dataField]) => {
          if (excelCol in row) {
            // Convert Excel serial dates to readable format
            if (dataField === 'dateOfBirth' && typeof row[excelCol] === 'number') {
              residentData[dataField] = convertExcelDate(row[excelCol]);
            } else {
              residentData[dataField] = row[excelCol]?.toString() || '';
            }
            
          }
        });
        
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
        residentData.mappedHouse = JSON.stringify({
          latitude: 10.7867,  // Default to center of Kerala
          longitude: 76.6548
        });
        
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
          
          return value;
        })
      ];
    }).filter(Boolean) as string[][];
    
    setTableData(rows);
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
      // Process in batches of 10 to avoid overwhelming the server
      const batchSize = 10;
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < parsedData.length; i += batchSize) {
        const batch = parsedData.slice(i, i + batchSize);
        
        const results = await Promise.all(
          batch.map(async (resident) => {
            try {
              // Format date if needed
              const formattedResident = {
                ...resident,
                dateOfBirth: formatDate(resident.dateOfBirth)
              };
              
              const response = await fetch(`${API_URL}/user/resident_signup`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedResident),
              });
              
              if (!response.ok) {
                throw new Error(`Failed to register ${resident.name}`);
              }
              
              return { success: true };
            } catch (error) {
              console.error(`Error registering ${resident.name}:`, error);
              return { success: false };
            }
          })
        );
        
        // Update counts
        results.forEach(result => {
          if (result.success) {
            successCount++;
          } else {
            failCount++;
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
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset the form or redirect
                setParsedData([]);
                setFileSelected(null);
                setValidationErrors([]);
                setTableData([]);
                setTableHeaders([]);
                router.push('/home'); // Redirect to home screen
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Partial Success',
          `${successCount} residents were successfully registered. ${failCount} registrations failed.`
        );
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'An error occurred while submitting the data.');
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
    const templateUrl = 'https://docs.google.com/spreadsheets/d/1F1hqGHIKbtGUEbktLVcMUbTdWc5XvJg8/edit?usp=sharing&ouid=105719840336689489096&rtpof=true&sd=true'; // Replace with your template URL

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
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Adding Group Resident Registration</Text>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>Instructions:</Text>
          <Text style={styles.instructionText}>
            1. Download the Excel template using the button below.
          </Text>
          <Text style={styles.instructionText}>
            2. Fill in the resident details in the Excel sheet.
          </Text>
          <Text style={styles.instructionText}>
            3. Upload the completed Excel file.
          </Text>
          <Text style={styles.instructionText}>
            4. Review the data and fix any validation errors.
          </Text>
          <Text style={styles.instructionText}>
            5. Submit to register all residents at once.
          </Text>

          <TouchableOpacity style={styles.button} onPress={downloadTemplate}>
            <Text style={styles.buttonText}>Download Template</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upload Excel File</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickExcelFile}
            disabled={isLoading || isSubmitting}
          >
            <Text style={styles.uploadButtonText}>
              {fileSelected ? fileSelected : 'Select Excel File'}
            </Text>
          </TouchableOpacity>

          {isLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#003366" />
              <Text style={styles.loaderText}>Parsing data...</Text>
            </View>
          )}

          {parsedData.length > 0 && !isLoading && (
            <>
              <View style={styles.dataInfoContainer}>
                <Text style={styles.dataInfoText}>
                  {parsedData.length} residents found in file
                </Text>
                {validationErrors.length > 0 && (
                  <Text style={styles.errorInfoText}>
                    {validationErrors.length} validation errors found
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={togglePreviewMode}
                >
                  <Text style={styles.toggleButtonText}>
                    {previewMode === 'all' ? 'Show Errors Only' : 'Show All Data'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Custom Table with clickable rows */}
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
                  {tableData.map((row, rowIndex) => (
                    <TouchableOpacity
                      key={`row-${rowIndex}`}
                      style={styles.tableRow}
                      onPress={() => showAllColumnsForRow(parseInt(row[0]) - 1)}
                    >
                      {row.map((cell, cellIndex) => (
                        <View
                          key={`cell-${cellIndex}`}
                          style={[styles.tableCell, { width: columnWidths[tableHeaders[cellIndex]] || 120 }]}
                        >
                          <Text style={styles.tableCellText} numberOfLines={1} ellipsizeMode="tail">
                            {cell}
                          </Text>
                        </View>
                      ))}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {validationErrors.length > 0 && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorTitle}>Validation Errors:</Text>
                  {validationErrors.map((error, index) => (
                    <View key={`error-${index}`} style={styles.errorItem}>
                      <Text style={styles.errorText}>
                        <Text style={styles.errorBold}>Row {error.row + 1}</Text>: {error.column} - {error.message}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {tableData.length === 0 && previewMode === 'errors' && (
                <Text style={styles.noErrorsText}>No validation errors found!</Text>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (validationErrors.length > 0 || isSubmitting) && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={validationErrors.length > 0 || isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Register All Residents'}
                </Text>
              </TouchableOpacity>

              {isSubmitting && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    Progress: {successCount + failCount} / {parsedData.length}
                  </Text>
                  <Text style={styles.successText}>Success: {successCount}</Text>
                  {failCount > 0 && (
                    <Text style={styles.failText}>Failed: {failCount}</Text>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003366',
  },
  instructionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#003366',
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003366',
  },
  button: {
    backgroundColor: '#003366',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#666',
    fontSize: 16,
  },
  loaderContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loaderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  dataInfoContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  dataInfoText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '600',
  },
  errorInfoText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
    marginTop: 4,
  },
  tableContainer: {
    marginBottom: 16,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003366',
    paddingHorizontal: 8,
  },
  tableCellText: {
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    fontSize: 14,
  },
  tableRowText: {
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  toggleButtonText: {
    color: '#333',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#003366',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  progressContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 4,
  },
  successText: {
    fontSize: 14,
    color: '#28a745',
  },
  failText: {
    fontSize: 14,
    color: '#dc3545',
  },
  noErrorsText: {
    textAlign: 'center',
    color: '#28a745',
    fontSize: 16,
    marginVertical: 16,
  },
  
    errorContainer: {
      marginTop: 16,
      padding: 12,
      backgroundColor: '#fff3f3',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ffcccc',
    },
    errorTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#dc3545',
      marginBottom: 8,
    },
    errorItem: {
      marginBottom: 4,
    },
    errorText: {
      fontSize: 14,
      color: '#dc3545',
    },
    errorBold: {
      fontWeight: 'bold',
    },
  
});


export default ImportResident;