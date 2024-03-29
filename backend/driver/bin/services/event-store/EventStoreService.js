"use strict";
const { of, from, concat } = require("rxjs");
const eventSourcing = require("../../tools/EventSourcing")();
const { DriverES } = require("../../domain/driver");
const { CronJobES } = require("../../domain/cronjob");
const { map, switchMap, filter, mergeMap, concatMap } = require('rxjs/operators');
/**
 * Singleton instance
 */
let instance;
/**
 * Micro-BackEnd key
 */
const mbeKey = "ms-driver_mbe_driver";

class EventStoreService {
  constructor() {
    this.functionMap = this.generateFunctionMap();
    this.subscriptions = [];
    this.aggregateEventsArray = this.generateAggregateEventsArray();
  }

  /**
   * Starts listening to the EventStore
   * Returns observable that resolves to each subscribe agregate/event
   *    emit value: { aggregateType, eventType, handlerName}
   */
  start$() {
    //default error handler
    const onErrorHandler = error => {
      console.error("Error handling  EventStore incoming event", error);
      process.exit(1);
    };
    //default onComplete handler
    const onCompleteHandler = () => {
      () => console.log("EventStore incoming event subscription completed");
    };
    console.log("EventStoreService starting ...");

    return from(this.aggregateEventsArray).pipe(
      map(aggregateEvent => ({ ...aggregateEvent, onErrorHandler, onCompleteHandler })),
      map(params => this.subscribeEventHandler(params))
    );      
  }

  /**
   * Stops listening to the Event store
   * Returns observable that resolves to each unsubscribed subscription as string
   */
  stop$() {
    return from(this.subscriptions).pipe(
      map(subscription => {
        subscription.subscription.unsubscribe();
        return `Unsubscribed: aggregateType=${aggregateType}, eventType=${eventType}, handlerName=${handlerName}`;
      })
    );
  }

  /**
     * Create a subscrition to the event store and returns the subscription info     
     * @param {{aggregateType, eventType, onErrorHandler, onCompleteHandler}} params
     * @return { aggregateType, eventType, handlerName  }
     */
  subscribeEventHandler({ aggregateType, eventType, onErrorHandler, onCompleteHandler }) {
    const handler = this.functionMap[eventType];
    const subscription =
      //MANDATORY:  AVOIDS ACK REGISTRY DUPLICATIONS
      eventSourcing.eventStore.ensureAcknowledgeRegistry$(aggregateType).pipe(
        mergeMap(() => eventSourcing.eventStore.getEventListener$(aggregateType, mbeKey, false)),
        filter(evt => evt.et === eventType),
        mergeMap(evt => concat(
          handler.fn.call(handler.obj, evt),
          //MANDATORY:  ACKWOWLEDGE THIS EVENT WAS PROCESSED
          eventSourcing.eventStore.acknowledgeEvent$(evt, mbeKey),
        ))
      )
        .subscribe(
          (evt) => {
            // console.log(`EventStoreService: ${eventType} process: ${evt}`);
          },
          onErrorHandler,
          onCompleteHandler
        );
    this.subscriptions.push({ aggregateType, eventType, handlerName: handler.fn.name, subscription });
    return { aggregateType, eventType, handlerName: `${handler.obj.name}.${handler.fn.name}` };
  }

  /**
  * Starts listening to the EventStore
  * Returns observable that resolves to each subscribe agregate/event
  *    emit value: { aggregateType, eventType, handlerName}
  */
  syncState$() {
    return from(this.aggregateEventsArray).pipe(
      concatMap(params => this.subscribeEventRetrieval$(params))
    )
  }


  /**
   * Create a subscrition to the event store and returns the subscription info     
   * @param {{aggregateType, eventType, onErrorHandler, onCompleteHandler}} params
   * @return { aggregateType, eventType, handlerName  }
   */
  subscribeEventRetrieval$({ aggregateType, eventType }) {
    const handler = this.functionMap[eventType];
    //MANDATORY:  AVOIDS ACK REGISTRY DUPLICATIONS
    return eventSourcing.eventStore.ensureAcknowledgeRegistry$(aggregateType).pipe(
      switchMap(() => eventSourcing.eventStore.retrieveUnacknowledgedEvents$(aggregateType, mbeKey)),
      filter(evt => evt.et === eventType),
      concatMap(evt => concat(
        handler.fn.call(handler.obj, evt),
        //MANDATORY:  ACKWOWLEDGE THIS EVENT WAS PROCESSED
        eventSourcing.eventStore.acknowledgeEvent$(evt, mbeKey)
      ))
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  /////////////////// CONFIG SECTION, ASSOC EVENTS AND PROCESSORS BELOW     //////////////
  ////////////////////////////////////////////////////////////////////////////////////////

  generateFunctionMap() {
    return {
      DriverCreated: {
        fn: DriverES.handleDriverCreated$,
        obj: DriverES
      },
      DriverCodeAdded: {
        fn: DriverES.handleDriverCodeAdded$,
        obj: DriverES
      },
      DriverGeneralInfoUpdated: {
        fn: DriverES.handleDriverGeneralInfoUpdated$,
        obj: DriverES
      },
      DriverStateUpdated: {
        fn: DriverES.handleDriverStateUpdated$,
        obj: DriverES
      },
      DriverMembershipStateUpdated: {
        fn: DriverES.handleDriverMembershipStateUpdated$,
        obj: DriverES
      },
      DriverAuthCreated: {
        fn: DriverES.handleDriverAuthCreated$,
        obj: DriverES 
      },
      DriverAuthDeleted: {
        fn: DriverES.handleDriverAuthDeleted$,
        obj: DriverES 
      },
      DriverBlockRemoved: {
        fn: DriverES.handleDriverBlockRemoved$,
        obj: DriverES
      },
      DriverBlockAdded: {
        fn: DriverES.handleDriverBlockAdded$,
        obj: DriverES
      },
      // cronjob
      PeriodicFiveMinutes: {
        fn: CronJobES.handlePeriodicFiveMinutes$,
        obj: CronJobES
      },
      AssignDriverCode: {
        fn: CronJobES.handleAssignDriverCode$,
        obj: CronJobES
      },

    };
  }

  /**
  * Generates a map that assocs each AggretateType withs its events
  */
  generateAggregateEventsArray() {
    return [
      {
        aggregateType: "Driver",
        eventType: "DriverCreated"
      },
      {
        aggregateType: "Driver",
        eventType: "DriverGeneralInfoUpdated"
      },
      {
        aggregateType: "Driver",
        eventType: "DriverStateUpdated"
      },
      {
        aggregateType: "Driver",
        eventType: "DriverMembershipStateUpdated"
      },
      {
        aggregateType: "Driver",
        eventType: "DriverAuthCreated"
      },
      {
        aggregateType: "Driver",
        eventType: "DriverAuthDeleted"
      },
      {
        aggregateType: "Driver",
        eventType: "DriverBlockRemoved"
      },
      {
        aggregateType: "Driver",
        eventType: "DriverBlockAdded"
      },
      {
        aggregateType: "Driver",
        eventType: "DriverCodeAdded"
      },
      // cronjob
      { aggregateType: "Cronjob", eventType: "PeriodicFiveMinutes" },
      { aggregateType: "Cronjob", eventType: "AssignDriverCode" },
    ]
  }
}

/**
 * @returns {EventStoreService}
 */
module.exports = () => {
  if (!instance) {
    instance = new EventStoreService();
    console.log("NEW  EventStore instance  !!");
  }
  return instance;
};

