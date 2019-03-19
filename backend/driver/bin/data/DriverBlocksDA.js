"use strict";

let mongoDB = undefined;
const COLLECTION_NAME = "driverBlocks";
const { CustomError } = require("../tools/customError");
const { map, catchError } = require("rxjs/operators");
const { of, Observable, defer } = require("rxjs");

class DriverBlocksDA {
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

  static findBlocksByDriver$(driverId) {
    const collection = mongoDB.db.collection(COLLECTION_NAME);
    const query = {
      driverId: driverId
    };
    return defer(() => collection
      .find(query)
      .toArray()
    )
  }

  static removeBlockFromDriver$({driverId, blockKey}){
    const collection = mongoDB.db.collection(COLLECTION_NAME);
    return defer(() => collection.deleteMany({driverId: driverId, key: blockKey}))
  }

  static addBlockToDriver$({driverId, blockKey, user, startTime, endTime, notes}){
    const collection = mongoDB.db.collection(COLLECTION_NAME);
    return defer(() => collection.insertOne({key: blockKey, driverId, user, startTime, endTime, notes}))
    .pipe(
      catchError(err => {
        if(err.code == 11000){
          console.log(err.message);
          return of(null);
        }
        return throwError(err);
        
      })
    )
  }

  static findAllExpiredBlocks$(timestamp){
    const collection = mongoDB.db.collection(COLLECTION_NAME);
    const query = { endTime: { $lte: timestamp } };
    return mongoDB.extractAllFromMongoCursor$(collection.find(query));
  }

}
/**
 * @returns {DriverBlocksDA}
 */
module.exports = DriverBlocksDA;
