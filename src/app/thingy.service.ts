import { Injectable } from '@angular/core';
import { map, mergeMap, buffer } from 'rxjs/operators';

import { BluetoothCore } from './ble/public_api';
import { Observable, of } from 'rxjs';
import { IResult, Sensor } from './thingy.model';

@Injectable({
  providedIn: 'root'
})

export class ThingyService {

  static GATT_CHARACTERISTIC_BATTERY_LEVEL = 'battery_level';
  static GATT_PRIMARY_SERVICE = 'battery_service';

  static GATT_ENVIRONMENT_SERVICE = 'ef680200-9b35-4933-9b10-52ffa9740042';
  static GATT_CHARACTERISTIC_TEMPERTURE = 'ef680201-9b35-4933-9b10-52ffa9740042'
  static GATT_CHARACTERISTIC_HUMIDITY = 'ef680203-9b35-4933-9b10-52ffa9740042'

  static GATT_MOTION_SERVICE = 'ef680400-9b35-4933-9b10-52ffa9740042';
  static GATT_MOTION_CHAR = 'ef680404-9b35-4933-9b10-52ffa9740042';

  constructor(public ble: BluetoothCore) { }

  service: Observable<void | BluetoothRemoteGATTServer>;

  humidity: BluetoothRemoteGATTCharacteristic;

  getFakeValue() {
    this.ble.fakeNext();
  }

  // this one is not enough for listening to more than one sensor 
  // streamValues() {
  //   return this.ble.streamValues$().pipe(map((value: DataView) => value.getUint8(0)));
  // }

  /// I want to be able to return something like this
   streamValues() {
     return this.ble.streamValues$().pipe(
      map((value: DataView) => {

        // tslint:disable-next-line:no-bitwise
        let w = value.getInt32(0, true) / (1 << 30);
        // tslint:disable-next-line:no-bitwise
        let x = value.getInt32(4, true) / (1 << 30);
        // tslint:disable-next-line:no-bitwise
        let y = value.getInt32(8, true) / (1 << 30);
        // tslint:disable-next-line:no-bitwise
        let z = value.getInt32(12, true) / (1 << 30);

        return {
          w, x, y, z
        };

      }),
      map((value: any) => {
       console.log(value);

       return {
         value,
         type: Sensor.MOTION
       };
     }));

   }

  connect(): Observable<void | BluetoothRemoteGATTServer> {
    try {
      return this.service = this.ble
        .discover$({
          acceptAllDevices: true,
          optionalServices: [
            ThingyService.GATT_MOTION_SERVICE,
            // ThingyService.GATT_MOTION_SERVICE,
            // ThingyService.GATT_ENVIRONMENT_SERVICE
          ]
        });
    } catch (e) {
      console.error('Oops! can not read value from %s');
    }
  }

  getHumidity(t): Observable<number> {
    console.log('Getting GATT_CHARACTERISTIC_HUMIDITY...');

    return t.pipe(
      mergeMap((gatt: BluetoothRemoteGATTServer) => {
        return this.ble.getPrimaryService$(
          gatt,
          ThingyService.GATT_ENVIRONMENT_SERVICE
        );
      }),
      mergeMap((primaryService: BluetoothRemoteGATTService) => {
        return this.ble.getCharacteristic$(
          primaryService,
          ThingyService.GATT_CHARACTERISTIC_HUMIDITY
        );
      }),
      mergeMap((characteristic: BluetoothRemoteGATTCharacteristic) => {
        this.humidity = characteristic;
        return this.ble.readValue$(characteristic);
      }),
      map((value: DataView) => value.getUint8(0))
      // I want to return this one instead 
      // map((value: DataView) => {
      //   return {
      //     value: value.getUint8(0),
      //     type: Sensor.HUMIDITY
      //   };
      // })
    );
  }

  getMotion(t): Observable<number> {
    console.log('Getting GATT_MOTION_SERVICE...');

    return t.pipe(
      mergeMap((gatt: BluetoothRemoteGATTServer) => {
        return this.ble.getPrimaryService$(
          gatt,
          ThingyService.GATT_MOTION_SERVICE
        );
      }),
      mergeMap((primaryService: BluetoothRemoteGATTService) => {
        return this.ble.getCharacteristic$(
          primaryService,
          ThingyService.GATT_MOTION_CHAR
        );
      }),
      mergeMap((characteristic: BluetoothRemoteGATTCharacteristic) => {
        this.humidity = characteristic;
        return this.ble.readValue$(characteristic);
      })
    );
  }

  getTemperature(t): Observable<number> {
    console.log('Getting GATT_CHARACTERISTIC_TEMPERTURE...');

    return t.pipe(
      mergeMap((gatt: BluetoothRemoteGATTServer) => {
        return this.ble.getPrimaryService$(
          gatt,
          ThingyService.GATT_ENVIRONMENT_SERVICE
        );
      }),
      mergeMap((primaryService: BluetoothRemoteGATTService) => {
        return this.ble.getCharacteristic$(
          primaryService,
          ThingyService.GATT_CHARACTERISTIC_TEMPERTURE
        );
      }),
      mergeMap((characteristic: BluetoothRemoteGATTCharacteristic) => {
        return this.ble.readValue$(characteristic);
      }),
      map((value: DataView) => value.getUint8(0))
      // map((value: DataView) => {
      //   return {
      //     value: value.getUint8(0),
      //     type: Sensor.TEMPERATURE
      //   };
      // }
      // )
    );

  }
}
