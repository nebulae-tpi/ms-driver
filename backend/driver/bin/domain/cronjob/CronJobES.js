"use strict";

const { of, forkJoin } = require("rxjs");
const { mergeMap, delay, tap, toArray } = require("rxjs/operators");
const Event = require("@nebulae/event-store").Event;
const eventSourcing = require("../../tools/EventSourcing")();
const MATERIALIZED_VIEW_TOPIC = "emi-gateway-materialized-view-updates";
const DriverBlocksDA = require('../../data/DriverBlocksDA');
const DriverCodeDA = require('../../data/DriverCodeDA');
const DriverDA = require('../../data/DriverDA');

/**
 * Singleton instance
 */
let instance;

class CronJobES {
  constructor() {
    
    // of({})
    // .pipe(
    //   delay(3000),
    //   mergeMap( () => this.generateEventStoreEvent$('PeriodicFiveMinutes', 1, 'Cronjob', 1, {})),
    //   mergeMap(event => eventSourcing.eventStore.emitEvent$(event)),
    //   tap(x => console.log('ENVIADO'))
    // )
    // .subscribe()

  }

    handlePeriodicFiveMinutes$() {
    return forkJoin(
      this.searchExpiredBlocksToRemove$()
    )
  }

  handleAssignDriverCode$({data}) {
    return DriverDA.getDriverListByBusinessId$(data.businessId).pipe(
      mergeMap(driver => {
        return DriverCodeDA.incrementAndGet$(data.businessId).pipe(
          mergeMap(result => {
            return  eventSourcing.eventStore.emitEvent$(new Event({
              eventType: "DriverCodeAdded",
              eventTypeVersion: 1,
              aggregateType: "Driver",
              aggregateId: driver._id,
              data: {driverCode: result.seq},
              user: "SYSTEM"
            }));
          })
        )
      }),
      toArray()
    )
  }

  searchExpiredBlocksToRemove$(){
    return DriverBlocksDA.findAllExpiredBlocks$(Date.now())
    .pipe(
      // tap(block => console.log('BLOCK TO REMOVE ==>', JSON.stringify(block), '\n')),
      mergeMap(block => this.generateEventStoreEvent$('DriverBlockRemoved', 1, 'Driver', block.driverId, {
        blockKey: block.key
      }, 'SYSTEM')),
      mergeMap(event => eventSourcing.eventStore.emitEvent$(event))
    )
  }


  

  generateEventStoreEvent$(eventType, eventVersion, aggregateType, aggregateId, data, user) {
    return of(new Event({
      eventType: eventType,
      eventTypeVersion: eventVersion,
      aggregateType: aggregateType,
      aggregateId: aggregateId,
      data: data,
      user: user
    }))
  }

}

/**
 * @returns {CronJobES}
 */
module.exports = () => {
  if (!instance) {
    instance = new CronJobES();
    console.log(`${instance.constructor.name} Singleton created`);
  }
  return instance;
};
