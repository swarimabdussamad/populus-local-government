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
    position: 'relative',
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
  headerContent: {
    flex: 1,
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
    marginLeft: 35,
  },
  postTitle: {
    fontSize: 17, // Slightly larger for emphasis
    fontWeight: 'bold', // Ensures bold text
    color: '#000', // Black color for a professional look
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  departmentText: {
    fontSize: 16,
    color: '#3f3f3f', // ✅ Professional deep blue color 
    textTransform: 'capitalize'// ✅ Makes it more eye-catching
  },
  postImage: {
    width: '100%', // Make the image take the full width of the container
    height: 200, // Set a fixed height or adjust as needed
    borderRadius: 8, // Optional: Add rounded corners
    marginTop: 10, // Add some spacing above the image
    marginBottom: 10, // Add some spacing below the image
  },
  imagePreviewContainer: {
    marginTop: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
  },
  commentModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    width: '100%',
    paddingTop: 20,
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontWeight: '600',
    color: COLORS.text,
  },
  commentTime: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  commentMessage: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  commentInput: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    color: COLORS.text,
  },
  commentSubmitButton: {
    backgroundColor: COLORS.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSubmitButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  emptyComments: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyCommentsText: {
    marginTop: 16,
    color: COLORS.subtext,
    textAlign: 'center',
  },
  /** Weather Widget **/
  weatherWidget: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 6,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  weatherContent: {
    padding: 16,
  },
  mainWeatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  temperatureContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 54,
  },
  highLowContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  highLowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  highLowText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 2,
    fontWeight: '500',
  },
  conditionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIconContainer: {
    backgroundColor: COLORS.cardBg,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weatherCondition: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  feelsLikeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuItem: {
    backgroundColor: "#1E1E1E", // Dark background color
    paddingVertical: 12, // Vertical padding for better touch experience
    paddingHorizontal: 16, // Horizontal padding for spacing
    borderRadius: 8, // Rounded corners
    marginVertical: 6, // Spacing between menu items
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
  },
  menuItemText: {
    fontSize: 16, // Readable font size
    color: "#FFFFFF", // White text color for contrast
    fontWeight: "bold", // Make text bold
  },
  importResidentButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  importResidentButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
   });

export default styles;