export const locale = {
  lang: 'es',
  data: {
    undefined: 'Indefinido',
    DRIVER: {
      DRIVER_FILTERS: {
        SHOW_BLOCKED: 'Bloqueados',
        SHOW_INACTIVE: 'Inactivos'
      },
      CREATE_BLOCK: 'Crear Bloqueo',
      BLOCK_TYPE: 'Tipo de Bloqueo',
      BLOCK_DURATION: 'Duración de bloqueo',
      BLOCK_COMMENTS: 'Comentarios',
      DETAIL_HEADER_NAME: 'CONDUCTOR',
      DETAIL_HEADER_NEW: 'Nuevo Conductor',
      TITLE: 'Conductor',
      FILTER: 'Filtros',
      NAME: 'Nombre',
      LASTNAME: 'Apellido',
      DOCUMENT: 'Documento',
      DOCUMENT_ID: 'Documento Identificación',
      CREATION_DATE: 'Fecha Creación',
      CREATOR_USER: 'Creado Por',
      RESET_FILTER: 'Limpiar Filtro',
      FILTER_SELECTED_BUSINESS: 'Filtrar por unidad de negocio seleccionada',
      CREATION_TIMESTAMP: 'Creado',
      LAST_MODIFICATION_TIMESTAMP: 'Modificado',
      MODIFIER_USER: 'Modificado por',
      ADD_NEW: 'Agregar Nuevo',
      DETAILS: {
        TABS: {
          GENERAL_INFO: 'Información General',
          BLOCKS: 'Bloqueos',
          MEMBERSHIP: 'Membresía',
          CREDENTIALS: 'Credenciales'
        },
        NO_HAVE_BLOCKS: 'El Conductor No Tiene Bloqueos',
        CREATED_BY: 'Creado Por',
        CREATED_IN: 'Creado',
        EDITED_BY: 'Editado Por',
        EDITED_IN: 'Editado',
        GENDER: 'Género',
        GENDER_MALE: 'Masculino',
        GENDER_FEMALE: 'Femenino',
        PMR_TITLE: 'PMR',
        PMR: 'Movilidad Reducida',
        GENERAL_INFO: 'Información General',
        ENABLED: 'Activo',
        DISABLED: 'Desactivado',
        NAME: 'Nombre',
        LASTNAME: 'Apellido',
        DESCRIPTION: 'Descripción',
        DOCUMENT_TYPE: 'Tipo Documento',
        DOCUMENT_TYPES: {
          CC: 'Cédula de Ciudadania',
          PASSPORT: 'Pasaporte'
        },
        BLOCK_TYPES: {
          BREACH_SERVICE: 'Incumplimiento del servicio',
          BREACH_AGREEMENT: 'Incumplimiento de acuerdo empresarial',
          DOORMAN_COMPLAINT: 'Queja del portero'
        },
        BLOCK_COMMENT_REQUIRED: 'Comentario requerido',
        BLOCK_COMMENT_MIN_LENGTH_ERROR: 'Se requieren al menos 50 caracteres',
        BLOCK_COMMENT_MAX_LENGTH_ERROR: 'Comenterio demasiado largo',
        BLOCK_EXIST: 'El conductor ya posee un bloqueo de este tipo',
        DOCUMENT: 'Documento',
        EMAIL: 'Email',
        PHONE: 'Teléfono',
        DOCUMENT_TYPE_REQUIRED: 'Tipo Documento Requerido',
        DOCUMENT_REQUIRED: 'Documento Requerido',
        NAME_REQUIRED: 'Nombre Requerido',
        LASTNAME_REQUIRED: 'Apellido Requerido',
        EMAIL_REQUIRED: 'Email Requerido',
        PHONE_REQUIRED: 'Teléfono Requerido',
        EMAIL_FORMAT: 'Formato de Email Inválido',
        MEMBERSHIP_STATE: 'Estado de la Membresía',
        GENDER_REQUIRED: 'Género Requerido',
        USERNAME: 'Nombre de Usuario',
        NEW_PASSWORD: 'Nueva Contraseña',
        PASSWORD_CONFIRMATION: 'Confirmar Contraseña',
        TEMPORARY: 'Temporal',
        CREATE_AUTH: 'Crear Credencial de Autenticación',
        RESET_AUTH: 'Cambiar Credencial de Autenticación',
        USERNAME_REQUIRED: 'Nombre de Usuario Requerido',
        NEW_PASSWORD_REQUIRED: 'Nueva Contraseña Requerida',
        INVALID_USERNAME_FORMAT: 'El nombre de usuario debe contener como mínimo 8 caracteres y solo puede estar compuesto por números, letras, puntos y guiones.',
        INVALID_PASSWORD: 'Contraseña Inválida',
        PASSWORD_CONFIRMATION_REQUIRED: 'Confirmación de Contraseña Requerida',
        NOT_EQUIVALENT_PASSWORD: 'La contraseña de Verificación no Coincide.',
        REMOVE_USER_AUTH: 'Eliminar credenciales',
        LANGUAGES_TITLE: 'Otros Idiomas',
        LANGUAGES: {
          english: 'Inglés'
        }
      },
      BLOCKED: 'Bloqueos',
      BLOCKS: {
        KEY: 'Bloqueo',
        NOTES: 'Notas',
        START_TIME: 'Fecha de Inicio',
        END_TIME: 'Fecha de expiración',
        ACTIONS: 'Acciones',
        USER: 'Responsable'
      },
      ACTIVE: 'Activo',
      CREATE: 'Crear',
      SAVE: 'Guardar',
      UPDATE: 'Guardar',
      UPDATE_TITLE: 'Actualizar',
      UPDATE_MESSAGE: '¿Estás seguro que desea realizar la modificación?',
      CREATE_TITLE: 'Creación',
      CREATE_MESSAGE: '¿Estás seguro que desea realizar la creación?',
      CANCEL: 'Cancelar',
      ENTITY_UPDATED: 'Conductor Actualizado',
      ENTITY_CREATED: 'Conductor Creado',
      CLOSE: 'Cerrar',
      WAIT_OPERATION: 'Operación en proceso, en caso de no recibir respuesta, verificar si los cambios realizados fueron aplicados exitosamente.',
      SELECT_BUSINESS: 'Debe seleccionar una unidad de negocio antes de realizar la creación.',
      ERROR_OPERATION: 'Error Realizando Operación',
      RESET_PASSWORD: 'Cambiar Contraseña'
    },
    ERRORS: {
      1: 'Error Interno de Servidor',
      2: 'Permiso Denegado.',
      15001: 'Error Interno de Servidor',
      20001: 'Error Interno de Servidor',
      20002: 'Permiso Denegado.',
      20010: 'Datos Faltantes del Usuario',
      20011: 'El nombre de usuario ya está siendo usado',
      20012: 'Nombre de usuario invalido, el nombre de usuario debe contener como mínimo 8 caracteres.',
      20014: 'El email ya está siendo usado',
      20015: 'Permiso denegado, no es posible actualizar la información de su propio usuario',
      20016: 'Permiso denegado, no tiene permisos para actualizar un usuario perteneciente a otra unidad de negocio',
      20017: 'Credenciales autenticación invalidas',
      20018: 'Usuario ya tiene registrada credenciales de autenticación',
      20019: 'Usuario no encontrado',
      20020: 'El usuario no tiene credenciales de autenticación',
      20021: 'El Conductor no ha sido eliminado',
      20022: 'El conductor ya existe en esta unidad de negocio',
    }
  }
};
