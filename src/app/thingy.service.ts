import { Injectable } from '@angular/core';
import { map, mergeMap, buffer } from 'rxjs/operators';

import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
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

  static GATT_MOTION_SERVICE = 'ef680200-9b35-4933-9b10-52ffa9740042';

  constructor(public ble: BluetoothCore) { }

  service: Observable<void | BluetoothRemoteGATTServer>;

  humidity: BluetoothRemoteGATTCharacteristic;

  getFakeValue() {
    this.ble.fakeNext();
  }

  // this one is not enough for listening to more than one sensor 
  streamValues() {
    return this.ble.streamValues$().pipe(map((value: DataView) => value.getUint8(0)));
  }

  /// I want to be able to return something like this
  // streamValues() {
  //   return this.ble.streamValues$().pipe(map((value: DataView) => {
  //     return {
  //       value: value.getUint8(0),
  //       type: Sensor.TEMPERATURE
  //     }
  //   }));

  // }

  

  connect(): Observable<void | BluetoothRemoteGATTServer> {
    try {
      return this.service = this.ble
        .discover$({
          acceptAllDevices: true,
          optionalServices: [
            ThingyService.GATT_PRIMARY_SERVICE,
            ThingyService.GATT_MOTION_SERVICE,
            ThingyService.GATT_ENVIRONMENT_SERVICE
          ]
        });
    } catch (e) {
      console.error('Oops! can not read value from %s');
    }
  }

  getHumidity(thingy): Observable<IResult> {
    console.log('Getting ENVIRONMENT Service...');

    return thingy.pipe(
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
      //   }
      // })
    );
  }

  getTemperature(thingy): Observable<IResult> {
    console.log('Getting ENVIRONMENT Service...');

    return thingy.pipe(
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
    //   map((value: DataView) => {
    //     return {
    //       value: value.getUint8(0),
    //       type: Sensor.TEMPERATURE
    //     }
    //   }
    //   )
    );

  }
}
