"use strict";

let mongoDB = undefined;
const COLLECTION_NAME = "driverCode";
const { CustomError } = require("../tools/customError");
const { map, catchError } = require("rxjs/operators");
const { of, Observable, defer } = require("rxjs");

class DriverCodeDA {
  static start$(mongoDbInstance) {
    return Observable.create(observer => {
      if (mongoDbInstance) {
        mongoDB = mongoDbInstance;
        observer.next("using given mongo instance");
      } else {
        mongoDB = require("./MongoDB").singleton();
        observer.next("using singleton system-wide mongo instance");
      }
      observer.complete();
    });
  }

  static incrementAndGet$(businessid) {
    const collection = mongoDB.db.collection(COLLECTION_NAME);
    return defer(() =>
      collection.findOneAndUpdate(
        { _id: businessid },
        {
          $inc: {
            seq: 1
          }
        },
        {
          upsert: true,
          returnOriginal: false,
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value } : undefined)
    );
  }

}
/**
 * @returns {DriverCodeDA}
 */
module.exports = DriverCodeDA;
