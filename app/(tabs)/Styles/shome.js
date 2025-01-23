import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    fab: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#6200ee',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
    },
    weatherCard: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#fff',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 3,
    },
    weatherContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
    },
    weatherLeft: {
      flex: 1,
    },
    weatherTemp: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
    },
    weatherLocation: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    weatherRight: {
      alignItems: 'center',
    },
    weatherCondition: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    postTypeOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    postTypeContainer: {
      width: 300,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
    },
    postTypeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    postTypeText: {
      marginLeft: 8,
      fontSize: 16,
      color: '#333',
    },
    postModalContainer: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    postModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    postModalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    postModalSubmit: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: '#6200ee',
    },
    postModalSubmitDisabled: {
      backgroundColor: '#ccc',
    },
    postModalSubmitText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    postModalContent: {
      flex: 1,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
      color: '#333',
    },
    postsList: {
      padding: 16,
    },
    postContainer: {
      padding: 16,
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor: '#fff',
      elevation: 3,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    postDepartment: {
      fontSize: 14,
      color: '#666',
      marginLeft: 8,
      fontWeight: 'bold',
    },
    postTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    postContent: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
    },
    postTimestamp: {
      fontSize: 12,
      color: '#aaa',
    },
    reactionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
      },
      reactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      reactionText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#333',
      },
      postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      deleteButton: {
        padding: 5,
      },
      
  });
export default styles