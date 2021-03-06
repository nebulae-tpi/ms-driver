const DriverDA = require("../../data/DriverDA");
const DriverKeycloakDA = require("../../data/DriverKeycloakDA");
const TokenKeycloakDA = require("../../data/TokenKeycloakDA");
const { of, interval, forkJoin, throwError } = require("rxjs");
const { take, mergeMap, catchError, map, toArray, tap, mapTo } = require('rxjs/operators');
const { 
  CustomError, 
  DefaultError,   
  USER_MISSING_DATA_ERROR_CODE,
  USERNAME_ALREADY_USED_CODE,
  EMAIL_ALREADY_USED_ERROR_CODE,
  PERMISSION_DENIED_ERROR_CODE,
  INVALID_USERNAME_FORMAT_ERROR_CODE,
  MISSING_BUSINESS_ERROR_CODE,
  USER_UPDATE_OWN_INFO_ERROR_CODE,
  USER_BELONG_TO_OTHER_BUSINESS_ERROR_CODE,
  USER_CREDENTIAL_EXIST_ERROR_CODE,
  USER_NOT_FOUND_ERROR_CODE,
  USER_DOES_NOT_HAVE_AUTH_CREDENTIALS_ERROR_CODE,
  USER_WAS_NOT_DELETED,
  USER_ALREADY_EXIST_IN_BU,
  INVALID_TOKEN_ERROR_CODE
} = require("../../tools/customError");

const context = "Driver";
const userNameRegex = /^[a-zA-Z0-9._@-]{8,}$/;

class DriverValidatorHelper {

  /**
   * Validates if the user can be created checking if the info is valid and the username and email have not been used
   * @param {*} driver 
   * @param {*} authToken 
   * @param {*} roles 
   */
  static checkDriverCreationDriverValidator$(driver, authToken, roles, userMongo) {
    return of({driver, authToken, roles})
    .pipe(
      mergeMap(data => this.checkTokenValidity$().pipe(mapTo(data))),
      tap(data => { if (!data.driver) this.throwCustomError$(USER_MISSING_DATA_ERROR_CODE)}),
      tap(data => { if (!data.driver.businessId) this.throwCustomError$(MISSING_BUSINESS_ERROR_CODE)}),
      //tap(data => this.checkIfUserBelongsToTheSameBusiness(data.driver, data.authToken, 'Driver', data.roles)),
      mergeMap(data => this.checkEmailExistKeycloakOrMongo$(data.driver.generalInfo.email)),
      mergeMap(() => this.verifyIfUserAlreadyExist$({driver, authToken, roles}) ),
      map(() => ({driver, authToken, roles}) )
    );
  }


  /**
   * Validates if the user can be updated checking if the info is valid and the username and email have not been used
   * @param {*} driver 
   * @param {*} authToken 
   * @param {*} roles 
   */
  static checkDriverUpdateDriverValidator$(driver, authToken, roles, userMongo) {
    return of({driver, authToken, roles, userMongo: userMongo})
    .pipe(
      mergeMap(data => this.checkTokenValidity$().pipe(mapTo(data))),
      tap(data => { if (!data.driver) this.throwCustomError$(USER_MISSING_DATA_ERROR_CODE)}),
      tap(data => this.checkIfUserIsTheSameUserLogged(data.driver, authToken)),
      tap(data => this.checkIfUserBelongsToTheSameBusiness(data.userMongo, data.authToken, 'Driver', data.roles)),
      mergeMap(data => this.checkEmailExistKeycloakOrMongo$(data.driver.generalInfo.email, userMongo)),
      mergeMap(() => this.verifyIfUserAlreadyExist$({driver, userMongo }) ),
      map(() => ({driver, authToken, roles, userMongo: userMongo} ))
    );
  }


  /**
   * Validates if the user can update its state
   * @param {*} driver 
   * @param {*} authToken 
   * @param {*} roles 
   */
  static checkDriverUpdateDriverStateValidator$(driver, authToken, roles, userMongo) {
    return of({driver, authToken, roles, userMongo: userMongo})
    .pipe(
      mergeMap(data => this.checkTokenValidity$().pipe(mapTo(data))),
      tap(data => { if (!data.driver) this.throwCustomError$(USER_MISSING_DATA_ERROR_CODE)}),
      tap(data => this.checkIfUserIsTheSameUserLogged(data.driver, authToken, 'Driver')),
      tap(data => this.checkIfUserBelongsToTheSameBusiness(data.userMongo, data.authToken, 'Driver', data.roles)),
    );
  }

  /**
   * Validates if the user can resset its password
   * @param {*} driver 
   * @param {*} authToken 
   * @param {*} roles 
   */
  static checkDriverCreateDriverAuthValidator$(driver, authToken, roles, userMongo) {
    return of({driver, authToken, roles, userMongo: userMongo})
    .pipe(
      mergeMap(data => this.checkTokenValidity$().pipe(mapTo(data))),
      tap(data => { if (!data.driver) this.throwCustomError$(USER_MISSING_DATA_ERROR_CODE)}),
      tap(data => { if (!data.authInput || !data.authInput.username.trim().match(userNameRegex)) this.throwCustomError$(INVALID_USERNAME_FORMAT_ERROR_CODE)}),
      tap(data => { if (!data.userMongo) this.throwCustomError$(USER_NOT_FOUND_ERROR_CODE)}),
      mergeMap(data => this.checkUsernameExistKeycloak$(data.authInput, data.driver.authInput.username).pipe(mapTo(data))),
      tap(data => this.checkIfUserBelongsToTheSameBusiness(data.userMongo, data.authToken, 'Driver', data.roles)),
      tap(data => this.checkIfUserIsTheSameUserLogged(data.driver, authToken)),
      mergeMap(data => this.checkEmailExistKeycloakOrMongo$(userMongo.generalInfo.email, userMongo).pipe(mapTo(data)))
    )
  }

    /**
   * Validates if the user can resset its password
   * @param {*} driver 
   * @param {*} authToken 
   * @param {*} roles 
   */
  static checkDriverUpdateDriverAuthValidator$(driver, authToken, roles, userMongo) {
    return of({driver, authToken, roles, userMongo: userMongo})
    .pipe(
      mergeMap(data => this.checkTokenValidity$().pipe(mapTo(data))),
      tap(data => { if (!data.driver) this.throwCustomError$(USER_MISSING_DATA_ERROR_CODE)}),
      tap(data => { if (!data.userMongo) this.throwCustomError$(USER_NOT_FOUND_ERROR_CODE)}),
      tap(data => this.checkIfUserBelongsToTheSameBusiness(data.userMongo, data.authToken, 'Driver', data.roles)),
      tap(data => this.checkIfUserIsTheSameUserLogged(data.driver, authToken)),
      mergeMap(data => this.checkEmailExistKeycloakOrMongo$(userMongo.generalInfo.email, userMongo).pipe(mapTo(data)))
    )
  }

  static checkDriverRemoveDriverAuthValidator$(driver, authToken, roles, userMongo) {
    return of({driver, authToken, roles, userMongo: userMongo})
    .pipe(
      mergeMap(data => this.checkTokenValidity$().pipe(mapTo(data))),
      tap(data => { if (!data.driver) this.throwCustomError$(USER_MISSING_DATA_ERROR_CODE)}),
      tap(data => { if (!data.userMongo) this.throwCustomError$(USER_NOT_FOUND_ERROR_CODE)}),
      tap(data => { if (!data.userMongo.auth || !data.userMongo.auth.username) this.throwCustomError$(USER_DOES_NOT_HAVE_AUTH_CREDENTIALS_ERROR_CODE)}),
      tap(data => this.checkIfUserBelongsToTheSameBusiness(data.userMongo, data.authToken, 'Driver', data.roles)),
      tap(data => this.checkIfUserIsTheSameUserLogged(data.driver, authToken)),
    );

  }

    /**
     * Check if the user was deleted from Keycloak. If the user exist return an error indicating that the user was not deleted
     * @param {*} userKeycloakId 
     */
    static checkIfUserWasDeletedOnKeycloak$(userKeycloakId){
      return of(userKeycloakId)
      .pipe(
        mergeMap(userKeycloakId => DriverKeycloakDA.getUserByUserId$(userKeycloakId)),
        tap(userKeycloak => { if (userKeycloak) this.throwCustomError$(USER_WAS_NOT_DELETED) })
      );
    }


  static checkIfUserIsTheSameUserLogged(user, authToken) {
    if (user && user.auth && user.auth.userKeycloakId == authToken.sub) {
      return this.throwCustomError$(USER_UPDATE_OWN_INFO_ERROR_CODE);
    }
  }

  /**
   * Checks if the user belongs to the same business of the user that is performing the operation
   * @param {*} userMongo 
   * @param {*} authToken 
   * @param {*} context 
   * @param {*} roles 
   */
  static checkIfUserBelongsToTheSameBusiness(userMongo, authToken, context, roles) {
    if (!userMongo || (!roles["PLATFORM-ADMIN"] && userMongo.businessId != authToken.businessId)){
      this.throwCustomError$(USER_BELONG_TO_OTHER_BUSINESS_ERROR_CODE)
    }
  }


  static checkEmailExistKeycloakOrMongo$(email, userMongo) {
    const emailLowercase = email.toLowerCase();
    return of(emailLowercase)
    .pipe(
      mergeMap(emailLowercase => 
        forkJoin(
          DriverKeycloakDA.getUser$(null, emailLowercase),
          DriverDA.getDriverByEmail$(emailLowercase)
      )),
      mergeMap(([keycloakResult, mongoResult]) => {
        const userKeycloak = this.searchUserKeycloakByEmail(keycloakResult, emailLowercase);
        const userKeycloakId = userMongo && userMongo.auth && userMongo.auth.userKeycloakId ? userMongo.auth.userKeycloakId: undefined;

        //console.log('(keycloakResult && keycloakResult.length > 0 && (!userKeycloakId || userKeycloakId != keycloakResult[0].id)) => ', (keycloakResult && keycloakResult.length > 0 && (!userKeycloakId || userKeycloakId != keycloakResult[0].id)))
        if (userKeycloak && (!userKeycloakId || userKeycloakId != userKeycloak.id)) {
          return this.throwCustomError$(EMAIL_ALREADY_USED_ERROR_CODE);
        }

        //console.log('mongoResult && (!userKeycloakId || userKeycloakId != mongoResult._id) => ', mongoResult && (!userKeycloakId || userKeycloakId != mongoResult._id))
         if (mongoResult && (!userMongo || userMongo._id != mongoResult._id)) {
          return this.throwCustomError$(EMAIL_ALREADY_USED_ERROR_CODE);
        }
        return of(emailLowercase);
      })
    );
  }

  static verifyIfUserAlreadyExist$({driver, userMongo}){
    if(!driver.businessId && userMongo ){
      driver.businessId = userMongo.businessId;
    }
    return DriverDA.findByDocumentId$(driver.generalInfo.documentType, driver.generalInfo.document, driver.businessId )
    .pipe(
      // tap(r => console.log("RESULTADO DE LA BUSQUEDA DEL USUARIO CON LA CEDULE POR BU ES ==> ", r)),
      // tap(r => console.log("EL DRIVER DE LA QUERY ES ==> ", driver)),
      mergeMap(r => ( r && r._id !== driver._id ) ? this.throwCustomError$(USER_ALREADY_EXIST_IN_BU) : of(null) )
    )    
  }

  /**
   * Check token validity
   */
  static checkTokenValidity$(){
    return TokenKeycloakDA.checkTokenValidity$()
    .pipe(
      catchError(error => {
        console.log('An error ocurred checking keycloak token validity: ', error);
        return this.throwCustomError$(INVALID_TOKEN_ERROR_CODE);
      })
    );
  }

  /**
   * Get the userkeycloak with the specified email
   * @param {*} keycloakResult 
   * @param {*} email 
   */
  static searchUserKeycloakByEmail(keycloakResult, email){
    if (keycloakResult && keycloakResult.length > 0) {
      return keycloakResult.find(userKeycloak => userKeycloak.email == email);
    }
    return null;
  }

  static checkUsernameExistKeycloak$(user, username) {
    return DriverKeycloakDA.getUser$(username)
    .pipe(
      mergeMap(keycloakResult => {
        const userKeycloak = this.searchUserKeycloakByUsername(keycloakResult, username);
        if(userKeycloak){
          return this.throwCustomError$(USERNAME_ALREADY_USED_CODE);
        }
         return of(user);
       }
     )
    );
  }

    /**
   * Searches user keycloak by username
   * @param {*} keycloakResult 
   * @param {*} username 
   */
  static searchUserKeycloakByUsername(keycloakResult, username) {
    if (keycloakResult && keycloakResult.length > 0) {
      return keycloakResult.find(userKeycloak => userKeycloak.username.toLowerCase() == username.toLowerCase());
    }
    return null;
  }

  static checkUserEmailExistKeycloak$(user, email) {
    return DriverKeycloakDA.getUser$(null, email)
    .pipe(
      mergeMap(userFound => {
        if(userFound && userFound.length > 0){
           return this.throwCustomError$(EMAIL_ALREADY_USED_ERROR_CODE);
         }
         return of(user);
       }
     )
    );
  }

/**
   * Creates a custom error observable
   * @param {*} errorCode Error code
   */
  static throwCustomError$(errorCode) {
    return throwError(
      new CustomError(
        context,
        'Driver',
        errorCode.code,
        errorCode.description
      )
    );
  }
}

module.exports = DriverValidatorHelper;
