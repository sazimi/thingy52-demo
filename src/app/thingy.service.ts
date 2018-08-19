import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';

import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';

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

  service;
  getFakeValue() {
    this.ble.fakeNext();
  }

  getDevice() {
    return this.ble.getDevice$();
  }

  streamValues() {
    // call this method to get a stream of values emitted by the device
    return this.ble.streamValues$().pipe(map((value: DataView) => value.getUint8(0)));
  }

  getTempurture() {
    console.log('Getting Tempurture Service...');

    try {
      this.service = this.ble
        .discover$({
          acceptAllDevices: true,
          optionalServices: [
            ThingyService.GATT_PRIMARY_SERVICE,
            ThingyService.GATT_MOTION_SERVICE,
            ThingyService.GATT_ENVIRONMENT_SERVICE
          ]
        });


      return this.service.pipe(
        mergeMap((gatt: BluetoothRemoteGATTServer) => {
          return this.ble.getPrimaryService$(
            gatt,
            ThingyService.GATT_ENVIRONMENT_SERVICE
          );
        }),
        mergeMap((primaryService: BluetoothRemoteGATTService) => {
          console.log('Primary:', primaryService)
          return this.ble.getCharacteristic$(
            primaryService,
            ThingyService.GATT_CHARACTERISTIC_TEMPERTURE
          );
        }),
        mergeMap((characteristic: BluetoothRemoteGATTCharacteristic) => {
          return this.ble.readValue$(characteristic);
        }),
        map((value: DataView) => value.getUint8(0))
      );
    } catch (e) {
      console.error('Oops! can not read value from %s');
    }
  }
}
