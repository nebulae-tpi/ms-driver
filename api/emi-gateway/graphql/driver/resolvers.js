const withFilter = require("graphql-subscriptions").withFilter;
const PubSub = require("graphql-subscriptions").PubSub;
const pubsub = new PubSub();
const { of } = require("rxjs");
const { map, mergeMap, catchError, tap } = require('rxjs/operators');
const broker = require("../../broker/BrokerFactory")();
const RoleValidator = require('../../tools/RoleValidator');
const { handleError$ } = require('../../tools/GraphqlResponseTools');

const INTERNAL_SERVER_ERROR_CODE = 1;
const PERMISSION_DENIED_ERROR_CODE = 2;


function getResponseFromBackEnd$(response) {
  return of(response)
    .pipe(
      map(resp => {
        if (resp.result.code != 200) {
          const err = new Error();
          err.name = 'Error';
          err.message = resp.result.error;
          // this[Symbol()] = resp.result.error;
          Error.captureStackTrace(err, 'Error');
          throw err;
        }
        return resp.data;
      })
    );
}

function log(msg) {
  console.log(`: ${msg}`);
}


module.exports = {

  //// QUERY ///////
  Query: {
    DriverDrivers(root, args, context) {
      const init = Date.now();
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        'ms-driver', 'DriverDrivers', PERMISSION_DENIED_ERROR_CODE,
        'Permission denied',
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR", "DISCIPLINARY-COMMITTEE"]
      )
        .pipe(
          tap(x => {
            const mem = process.memoryUsage();
            log(`MEM = rss=${mem.rss/1000000}, heapTotal=${mem.heapTotal/1000000}, heapUsed=${mem.heapUsed/1000000}, external=${mem.external/1000000}, `);
          }),
          tap(x => log(`TIME_TRACKING.DriverDrivers: rqst`)),
          mergeMap(() =>
            broker.forwardAndGetReply$(
              "Driver",
              "emigateway.graphql.query.driverDrivers",
              { root, args, jwt: context.encodedToken },
              10000
            )
          ),          
          catchError(err => handleError$(err, "driverDrivers")),
          mergeMap(response => getResponseFromBackEnd$(response)),
          tap(x => log(`TIME_TRACKING.DriverDrivers: resp => ${Date.now() - init}`)),
        ).toPromise();
    },
    DriverDriversSize(root, args, context) {
      const init = Date.now();
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        'ms-driver', 'DriverDriversSize', PERMISSION_DENIED_ERROR_CODE,
        'Permission denied',
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR", "DISCIPLINARY-COMMITTEE"]
      )
        .pipe(
          tap(x => log(`TIME_TRACKING.DriverDriversSize: rqst`)),
          mergeMap(() =>
            broker.forwardAndGetReply$(
              "Driver",
              "emigateway.graphql.query.driverDriversSize",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "driverDriversSize")),
          mergeMap(response => getResponseFromBackEnd$(response)),
          tap(x => log(`TIME_TRACKING.DriverDriversSize: resp => ${Date.now() - init}`)),
        ).toPromise();
    },
    DriverDriver(root, args, context) {
      const init = Date.now();
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        'ms-driver', 'DriverDriver', PERMISSION_DENIED_ERROR_CODE,
        'Permission denied',
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR", "DISCIPLINARY-COMMITTEE"]
      )
        .pipe(
          tap(x => log(`TIME_TRACKING.DriverDriver: rqst`)),
          mergeMap(() =>
            broker.forwardAndGetReply$(
              "Driver",
              "emigateway.graphql.query.driverDriver",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "driverDriver")),
          mergeMap(response => getResponseFromBackEnd$(response)),
          tap(x => log(`TIME_TRACKING.DriverDriver: resp => ${Date.now() - init}`)),
        ).toPromise();
    },
    DriverDriverBlocks(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        'ms-driver', 'DriverDriverBlocks',
        PERMISSION_DENIED_ERROR_CODE,
        'Permission denied', ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR", "DISCIPLINARY-COMMITTEE"]
      )
        .pipe(
          mergeMap(() => broker
            .forwardAndGetReply$(
              "Driver",
              "emigateway.graphql.query.driverDriverBlocks",
              { root, args, jwt: context.encodedToken },
              2000
            )),
          catchError(err => handleError$(err, "driverDriverBlocks")),
          mergeMap(response => getResponseFromBackEnd$(response))
        ).toPromise();
    },
  },

  //// MUTATIONS ///////
  Mutation: {
    DriverCreateDriver(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        "Driver", "DriverCreateDriver",
        PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR"]
      )
        .pipe(
          mergeMap(() =>
            context.broker.forwardAndGetReply$(
              "Driver",
              "emigateway.graphql.mutation.driverCreateDriver",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "driverCreateDriver")),
          mergeMap(response => getResponseFromBackEnd$(response))
        ).toPromise();
    },
    DriverUpdateDriverGeneralInfo(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        "Driver", "DriverUpdateDriverGeneralInfo",
        PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR"]
      ).pipe(
        mergeMap(() =>
          context.broker.forwardAndGetReply$(
            "Driver",
            "emigateway.graphql.mutation.driverUpdateDriverGeneralInfo",
            { root, args, jwt: context.encodedToken },
            2000
          )
        ),
        catchError(err => handleError$(err, "updateDriverGeneralInfo")),
        mergeMap(response => getResponseFromBackEnd$(response))
      ).toPromise();
    },
    DriverUpdateDriverState(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        "Driver", "DriverUpdateDriverState",
        PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR"]
      ).pipe(
        mergeMap(() =>
          context.broker.forwardAndGetReply$(
            "Driver",
            "emigateway.graphql.mutation.driverUpdateDriverState",
            { root, args, jwt: context.encodedToken },
            2000
          )
        ),
        catchError(err => handleError$(err, "updateDriverState")),
        mergeMap(response => getResponseFromBackEnd$(response))
      ).toPromise();
    },
    DriverUpdateDriverMembershipState(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        "Driver", "DriverUpdateDriverMembershipState",
        PERMISSION_DENIED_ERROR_CODE, "Permission denied",
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR"]
      ).pipe(
        mergeMap(() =>
          context.broker.forwardAndGetReply$(
            "Driver",
            "emigateway.graphql.mutation.driverUpdateDriverMembershipState",
            { root, args, jwt: context.encodedToken },
            2000
          )
        ),
        catchError(err => handleError$(err, "updateDriverState")),
        mergeMap(response => getResponseFromBackEnd$(response))
      ).toPromise();
    },
    DriverCreateDriverAuth(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        "Driver", "DriverCreateDriverAuth",
        PERMISSION_DENIED_ERROR_CODE, "Permission denied",
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR"]
      )
        .pipe(
          mergeMap(() =>
            context.broker.forwardAndGetReply$(
              "Driver",
              "emigateway.graphql.mutation.driverCreateDriverAuth",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "driverCreateDriverAuth")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    DriverResetDriverPassword(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        "Driver", "DriverResetDriverPassword",
        PERMISSION_DENIED_ERROR_CODE,
        "Permission denied",
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR"]
      )
        .pipe(
          mergeMap(() =>
            context.broker.forwardAndGetReply$(
              "Driver",
              "emigateway.graphql.mutation.driverResetDriverPassword",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "driverResetDriverPassword")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    DriverRemoveDriverAuth(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        "Driver", "DriverRemoveDriverAuth",
        PERMISSION_DENIED_ERROR_CODE, "Permission denied",
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "COORDINATOR","OPERATION-SUPERVISOR"]
      )
        .pipe(
          mergeMap(() =>
            context.broker.forwardAndGetReply$(
              "Driver",
              "emigateway.graphql.mutation.driverRemoveDriverAuth",
              { root, args, jwt: context.encodedToken },
              2000
            )
          ),
          catchError(err => handleError$(err, "driverRemoveDriverAuth")),
          mergeMap(response => getResponseFromBackEnd$(response))
        )
        .toPromise();
    },
    DriverRemoveDriverBlocking(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        "Driver", "DriverRemoveDriverBlocking",
        PERMISSION_DENIED_ERROR_CODE, "Permission denied",
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "DISCIPLINARY-COMMITTEE"]
      ).pipe(
        mergeMap(() =>
          context.broker.forwardAndGetReply$(
            "Driver",
            "emigateway.graphql.mutation.driverRemoveDriverBlocking",
            { root, args, jwt: context.encodedToken },
            2000
          )
        ),
        catchError(err => handleError$(err, "updateDriverState")),
        mergeMap(response => getResponseFromBackEnd$(response))
      ).toPromise();
    },
    DriverInsertDriverBlock(root, args, context) {
      return RoleValidator.checkPermissions$(
        context.authToken.realm_access.roles,
        "Driver", "DriverAddDriverBlocking",
        PERMISSION_DENIED_ERROR_CODE, "Permission denied",
        ["PLATFORM-ADMIN", "BUSINESS-OWNER", "DISCIPLINARY-COMMITTEE"]
      ).pipe(
        mergeMap(() =>
          context.broker.forwardAndGetReply$(
            "Driver",
            "emigateway.graphql.mutation.driverAddDriverBlocking",
            { root, args, jwt: context.encodedToken },
            2000
          )
        ),
        catchError(err => handleError$(err, "updateDriverState")),
        mergeMap(response => getResponseFromBackEnd$(response))
      ).toPromise();
    }

  },


  //// SUBSCRIPTIONS ///////
  Subscription: {
    DriverDriverUpdatedSubscription: {
      subscribe: withFilter(
        (payload, variables, context, info) => {
          return pubsub.asyncIterator("DriverDriverUpdatedSubscription");
        },
        (payload, variables, context, info) => {
          return true;
        }
      )
    },
    DriverDriverBlockAddedSubscription: {
      subscribe: withFilter(
        (payload, variables, context, info) => {
          return pubsub.asyncIterator("DriverDriverBlockAddedSubscription");
        },
        (payload, variables, context, info) => {
          return variables.driverId == payload.DriverDriverBlockAddedSubscription.driverId;
        }
      )
    }
  }
};

//// SUBSCRIPTIONS SOURCES ////

const eventDescriptors = [
  {
    backendEventName: 'DriverDriverUpdatedSubscription',
    gqlSubscriptionName: 'DriverDriverUpdatedSubscription',
    dataExtractor: (evt) => evt.data,// OPTIONAL, only use if needed
    onError: (error, descriptor) => console.log(`Error processing ${descriptor.backendEventName}`),// OPTIONAL, only use if needed
    onEvent: (evt, descriptor) => console.log(`Event of type  ${descriptor.backendEventName} arraived`),// OPTIONAL, only use if needed
  },
  {
    backendEventName: 'DriverBlockAdded',
    gqlSubscriptionName: 'DriverDriverBlockAddedSubscription',
    dataExtractor: (evt) => evt.data,// OPTIONAL, only use if needed
    onError: (error, descriptor) => console.log(`Error processing ${descriptor.backendEventName}`),// OPTIONAL, only use if needed
    onEvent: (evt, descriptor) => console.log(`Event of type  ${descriptor.backendEventName} arraived`),// OPTIONAL, only use if needed
  },
];


/**
 * Connects every backend event to the right GQL subscription
 */
eventDescriptors.forEach(descriptor => {
  broker
    .getMaterializedViewsUpdates$([descriptor.backendEventName])
    .subscribe(
      evt => {
        if (descriptor.onEvent) {
          descriptor.onEvent(evt, descriptor);
        }
        const payload = {};
        payload[descriptor.gqlSubscriptionName] = descriptor.dataExtractor ? descriptor.dataExtractor(evt) : evt.data;
        pubsub.publish(descriptor.gqlSubscriptionName, payload);
      },

      error => {
        if (descriptor.onError) {
          descriptor.onError(error, descriptor);
        }
        console.error(`Error listening ${descriptor.gqlSubscriptionName}`, error);
      },

      () => console.log(`${descriptor.gqlSubscriptionName} listener STOPPED`)
    );
});


