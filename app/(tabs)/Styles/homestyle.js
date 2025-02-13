import { StyleSheet } from 'react-native';

const COLORS = {
  primary: '#1F3A93', // Deep royal blue for a premium look
  secondary: '#007ACC', // A refined, modern blue for accents
  background: '#F4F6F7', // Soft off-white for a subtle contrast
  text: '#2C3E50', // Dark slate for better readability
  subtext: '#7F8C8D', // Muted gray for less prominent text
  white: '#FFFFFF',
  border: '#D5DBDB', // Neutral light gray for borders
  error: '#C0392B', // A slightly muted red for errors
  success: '#27AE60', // Vibrant but professional green for success
  shadow: 'rgba(0, 0, 0, 0.15)',
};

const styles = StyleSheet.create({
  /** General Layout **/
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
   /** Modal **/
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalCloseButton: {
    padding: 6,
  },

  /** Input Fields **/
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top',
  },

  /** Image Upload **/
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00538C',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    
    marginVertical: 12,
  },
  imageUploadText: {
    color: '#00538C',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 5,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  /** Submit Button **/
  submitButton: {
    borderWidth: 1,
    borderColor: '#00538C',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#00538C',
    fontSize: 16,
    fontWeight: 'bold',
  },
 
   /** Department Picker **/
   departmentInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginBottom: 12,
  },
  departmentInputText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 10,
    fontWeight: '500',
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  pickerModalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  departmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  departmentColor: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  departmentOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  pickerModalCloseButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#00538C',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerModalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color:'#00538C' ,
  },
  /** Typography **/
  heading1: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  paragraph: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 5,
  },

  /** Loader **/
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** List & Empty State **/
  listContainer: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 10,
  },

  /** Post Container **/
  postContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  departmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  departmentBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  postDate: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary, // Deep blue for contrast
    marginBottom: 6,
    paddingHorizontal: 10,
  },
  
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border, // Deep blue border
    marginVertical: 10,
  },
  
  postContent: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 20,
  },

  /** Post Actions **/
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 6,
  },

  /** Floating Action Button (FAB) **/
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f33a59',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  /** Form Elements **/
  inputField: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },

  /** Buttons **/
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },

  /** Alerts **/
  alertSuccess: {
    backgroundColor: COLORS.success,
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  alertError: {
    backgroundColor: COLORS.error,
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  alertText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
  },

  /** Card Containers **/
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 8,
  },

  /** Spacing & Layout Helpers **/
  marginBottomSmall: {
    marginBottom: 8,
  },
  marginBottomMedium: {
    marginBottom: 16,
  },
  marginBottomLarge: {
    marginBottom: 24,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  departmentInfo: {
    flexDirection: 'row', // ✅ Icon & text in a row
    alignItems: 'center', // ✅ Vertically aligned
    gap: 6, // ✅ Adds spacing between icon & text
  },
  
  departmentText: {
    fontSize: 16,
    color: '#3f3f3f', // ✅ Professional deep blue color 
    textTransform: 'capitalize'// ✅ Makes it more eye-catching
  },
  
   });

export default styles;
