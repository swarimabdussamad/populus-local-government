import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
<<<<<<< HEAD
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
=======
    weatherCard: {
      backgroundColor: '#fff',
      margin: 16,
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    weatherContent: {
      flexDirection: 'row',
      padding: 16,
      justifyContent: 'space-between',
      alignItems: 'center',
>>>>>>> 8da352803febadf838a30b378bef37290094de30
    },
    weatherLeft: {
      flex: 1,
    },
    weatherTemp: {
<<<<<<< HEAD
      fontSize: 32,
=======
      fontSize: 36,
>>>>>>> 8da352803febadf838a30b378bef37290094de30
      fontWeight: 'bold',
      color: '#333',
    },
    weatherLocation: {
<<<<<<< HEAD
      fontSize: 14,
      color: '#666',
      marginTop: 4,
=======
      fontSize: 16,
      color: '#666',
>>>>>>> 8da352803febadf838a30b378bef37290094de30
    },
    weatherRight: {
      alignItems: 'center',
    },
    weatherCondition: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
<<<<<<< HEAD
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
=======
    weatherFooter: {
      borderTopWidth: 1,
      borderTopColor: '#eee',
      padding: 12,
      alignItems: 'flex-end',
    },
    postsList: {
      padding: 16,
    },
    postContainer: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    alertPost: {
      borderLeftWidth: 4,
      borderLeftColor: '#dc3545',
    },
    postHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    postTypeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    postTypeIndicatorText: {
      fontSize: 14,
      fontWeight: '600',
    },
    postContent: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
    },
    postImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginTop: 12,
    },
    postTimestamp: {
      fontSize: 12,
      color: '#666',
      marginTop: 12,
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      backgroundColor: '#6200ee',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
    postTypeOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    postTypeContainer: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
>>>>>>> 8da352803febadf838a30b378bef37290094de30
      padding: 16,
    },
    postTypeButton: {
      flexDirection: 'row',
      alignItems: 'center',
<<<<<<< HEAD
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    postTypeText: {
      marginLeft: 8,
=======
      padding: 16,
      gap: 12,
    },
    postTypeText: {
>>>>>>> 8da352803febadf838a30b378bef37290094de30
      fontSize: 16,
      color: '#333',
    },
    postModalContainer: {
      flex: 1,
      backgroundColor: '#fff',
<<<<<<< HEAD
      padding: 16,
=======
>>>>>>> 8da352803febadf838a30b378bef37290094de30
    },
    postModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
<<<<<<< HEAD
      marginBottom: 16,
    },
    postModalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
=======
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    postModalTitle: {
      fontSize: 18,
      fontWeight: '600',
>>>>>>> 8da352803febadf838a30b378bef37290094de30
    },
    postModalSubmit: {
      paddingVertical: 8,
      paddingHorizontal: 16,
<<<<<<< HEAD
      borderRadius: 8,
      backgroundColor: '#6200ee',
=======
      backgroundColor: '#6200ee',
      borderRadius: 20,
>>>>>>> 8da352803febadf838a30b378bef37290094de30
    },
    postModalSubmitDisabled: {
      backgroundColor: '#ccc',
    },
    postModalSubmitText: {
      color: '#fff',
<<<<<<< HEAD
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
=======
      fontWeight: '600',
    },
    postModalContent: {
      flex: 1,
      padding: 16,
    },
    postModalInput: {
      fontSize: 16,
      minHeight: 120,
      marginTop: 16,
      padding: 0,
    },
    attachmentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      gap: 8,
    },
    attachmentButtonText: {
      fontSize: 16,
      color: '#666',
    },
    attachmentPreview: {
      marginTop: 16,
      position: 'relative',
    },
    attachmentImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
    },
    removeAttachment: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 12,
    },
    reactionContainer: {
      flexDirection: 'row',
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#eee',
      paddingTop: 12,
    },
    reactionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    reactionCount: {
      marginLeft: 4,
      color: '#666',
      fontSize: 14,
    },
    department: {
      fontSize: 14,
      color: '#666',
      marginLeft: 'auto',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
    },
    messageInput: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 15,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: '#f9f9f9',
    },
    deptSelectorContainer: {
        marginBottom: 20,
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
      },
      deptList: {
        paddingHorizontal: 4,
      },
      deptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
      },
      deptButtonSelected: {
        backgroundColor: '#6200ee',
        borderColor: '#6200ee',
      },
      deptButtonText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
      },
      deptButtonTextSelected: {
        color: '#fff',
      },
      emergencyContainer: {
        marginBottom: 20,
      },
      emergencyOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
      },
      emergencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: '#fff',
      },
      emergencyButtonSelected: {
        backgroundColor: '#fff',
      },
      emergencyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
      },
      emergencyButtonText: {
        fontSize: 14,
        color: '#333',
      },
      container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
      },
      weatherCard: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      },
      weatherText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
      },
      weatherDetail: {
        fontSize: 16,
        color: '#fff',
        marginTop: 4,
      },
      createPostContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
      },
      createPostButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 4,
      },
      createPostButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
      },
      postList: {
        paddingBottom: 16,
      },
      postCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
      },
      postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#333',
      },
      postMessage: {
        fontSize: 16,
        marginVertical: 8,
        color: '#666',
      },
      postFooter: {
        fontSize: 14,
        color: '#aaa',
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingText: {
        fontSize: 16,
        color: '#555',
        marginTop: 8,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
      },
      input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
      },
      textArea: {
        height: 100,
        textAlignVertical: 'top',
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
      },
      modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      emptyText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 32,
      },
   
 
    
  
  });

export default styles;
>>>>>>> 8da352803febadf838a30b378bef37290094de30
