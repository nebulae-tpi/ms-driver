export const locale = {
  lang: 'en',
  data: {
    undefined: 'Undefined',
    DRIVER: {
      DRIVER_FILTERS: {
        SHOW_BLOCKED: 'Blocked',
        SHOW_INACTIVE: 'Inactive'
      },
      BLOCK_DETAILS: 'Block Details',
      CREATE_BLOCK: 'Create Block',
      REMOVE_BLOCK_TITLE: 'Remove Block',
      REMOVE_BLOCK_MSG: 'Are you sure you want to remove the block?',
      BLOCK_TYPE: 'Block Type',
      BLOCK_DURATION: 'Block Duration',
      BLOCK_COMMENTS: 'Comments',
      BLOCK_RESPONSIBLE_USER: 'Responsible',
      BLOCK_START_TIME: 'Start Time',
      BLOCK_END_TIME: 'Start Time',
      DETAIL_HEADER_NAME: 'Driver',
      DETAIL_HEADER_NEW: 'New Driver',
      TITLE: 'Drivers',
      FILTER: 'Filter',
      NAME: 'Name',
      LASTNAME: 'Lastname',
      DOCUMENT: 'Document',
      DOCUMENT_ID: 'Document ID',
      CREATION_DATE: 'Creation Date',
      CREATOR_USER: 'Created by',
      RESET_FILTER: 'Reset Filter',
      FILTER_SELECTED_BUSINESS: 'Filter by Selected Business Unit',
      CREATION_TIMESTAMP: 'Created',
      LAST_MODIFICATION_TIMESTAMP: 'Modified',
      MODIFIER_USER: 'Modified by',
      ADD_NEW: 'Add New',
      DETAILS: {
        TABS: {
          GENERAL_INFO: 'General Info',
          BLOCKS: 'Blocks',
          MEMBERSHIP: 'Membership',
          CREDENTIALS: 'Credentials'
        },
        NO_HAVE_BLOCKS: 'Driver without blocks',
        CREATED_BY: 'Created By',
        CREATED_IN: 'Created',
        EDITED_BY: 'Edited By',
        EDITED_IN: 'Edited',
        GENDER: 'Gender',
        GENDER_MALE: 'Male',
        GENDER_FEMALE: 'Female',
        PMR_TITLE: 'PRM',
        PMR: 'Reduced Mobility',
        GENERAL_INFO: 'General Info',
        ENABLED: 'Enabled',
        DISABLED: 'Disabled',
        NAME: 'Name',
        LASTNAME: 'Lastname',
        DESCRIPTION: 'Description',
        DOCUMENT_TYPE: 'Document type',
        DOCUMENT_TYPES: {
          CC: 'Citizenship Card',
          PASSPORT: 'Passport'
        },
        BLOCK_TYPES: {
          BREACH_SERVICE: 'Breach of service',
          BREACH_AGREEMENT: 'Breach of agreement',
          DOORMAN_COMPLAINT: 'Doorman complaint',
          BAD_DISCIPLINARY_BEHAVIOR_QR5: 'Bad Behavior (QR5)',
          STOLEN_SERVICE: 'Stolen Service',
          MECHANICAL_PROBLEMS: 'Mechanical problems',
          OTHER: 'Other'
        },
        BLOCK_COMMENT_REQUIRED: 'Comments field required',
        BLOCK_COMMENT_MIN_LENGTH_ERROR: 'Comments require at least 10 caracters',
        BLOCK_COMMENT_MAX_LENGTH_ERROR: 'Very long comment',
        BLOCK_EXIST: 'Driver already have this block type',
        DOCUMENT: 'Document',
        EMAIL: 'Email',
        PHONE: 'Phone',
        DOCUMENT_TYPE_REQUIRED: 'Document Type Required',
        DOCUMENT_REQUIRED: 'Document Required',
        NAME_REQUIRED: 'Name Required',
        LASTNAME_REQUIRED: 'Lastname Required',
        EMAIL_REQUIRED: 'Email Required',
        PHONE_REQUIRED: 'Phone Required',
        EMAIL_FORMAT: 'Invalid Email Format',
        MEMBERSHIP_STATE: 'Membership State',
        GENDER_REQUIRED: 'Gender Required',
        USERNAME: 'Username',
        NEW_PASSWORD: 'New Password',
        PASSWORD_CONFIRMATION: 'Confirm New Password',
        TEMPORARY: 'Temporary',
        CREATE_AUTH: 'Create Auth Credential',
        RESET_AUTH: 'Change Auth Credential',
        USERNAME_REQUIRED: 'Username Required',
        NEW_PASSWORD_REQUIRED: 'Password Required',
        INVALID_USERNAME_FORMAT: 'The username must contain at least 8 characters and be composed by numbers, letters, periods and hyphens.',
        INVALID_PASSWORD: 'The password must be at least 8 characters and consist of numbers, letters or period (.)',
        PASSWORD_CONFIRMATION_REQUIRED: 'Confirm Passowrd Required',
        NOT_EQUIVALENT_PASSWORD: 'The Verification Password Does Not Match.',
        REMOVE_USER_AUTH: 'Remove Auth Credential',
        LANGUAGES_TITLE: 'Other Languages',
        LANGUAGES: {
          english: 'English'
        }
      },
      BLOCKED: 'Bloqueos',
      BLOCKS: {
        KEY: 'Block',
        NOTES: 'Notes',
        START_TIME: 'Start Date',
        END_TIME: 'Expiration Date',
        ACTIONS: 'Actions',
        USER: 'responsible'
      },
      ACTIVE: 'Active',
      CREATE: 'Create',
      SAVE: 'Save',
      UPDATE: 'Save',
      UPDATE_TITLE: 'Update',
      UPDATE_MESSAGE: 'Are you sure you want to make the modification?',
      CREATE_TITLE: 'Creation',
      CREATE_MESSAGE: '¿Are you sure you want to make the creation?',
      CANCEL: 'Cancel',
      ENTITY_UPDATED: 'Driver Updated',
      ENTITY_CREATED: 'Driver Created',
      CLOSE: 'Close',
      WAIT_OPERATION: 'Operation in process, in case of not receiving an answer, verify if the changes made were applied successfully.',
      SELECT_BUSINESS: 'You must select a business unit before performing the creation.',
      ERROR_OPERATION: 'Error Performing Operation',
      RESET_PASSWORD: 'Change Password'
    },
    ERRORS: {
      1: 'Internal Server Error',
      2: 'Permission Denied',
      20001: 'Internal Server Error',
      20002: 'Permission Denied',
      20010: 'User Missing Data',
      20011: 'The Username is Already Used',
      20012: 'Invalid username, the username must contain at least 8 characters.',
      20014: 'The Email is Already Used',
      20015: 'Permission denied, it is not possible to update your own users information',
      20016: 'Permission denied, you dont have the permission to update an user that belongs to another business unit',
      20017: 'Invalid Auth Credentials',
      20018: 'User Already Has Auth Credentials',
      20019: 'User Was Not Found',
      20020: 'User Does Not Have Auth Credentials',
      20021: 'Driver was not deleted',
      20022: 'The driver already exist in this business unit',
    },
  }
};
