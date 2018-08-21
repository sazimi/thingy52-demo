import { Component, OnInit, NgZone } from '@angular/core';
import { BluetoothCore } from '../ble/public_api';
import { Observable } from 'rxjs';

import { ThingyService } from '../thingy.service';

import { mergeMap } from 'rxjs/operators';
import { IResult, Sensor } from '../thingy.model';

@Component({
  selector: 'th-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent implements OnInit {

  temperature;
  device;
  humidity;
  motion;

  constructor(public _zone: NgZone,
    public _thingyService: ThingyService,
    public ble: BluetoothCore) { }

  ngOnInit() {
    this.streamValues();
    //this.getDeviceStatus();
  }


  // streamValues() {
  //   this._thingyService.streamValues()
  //     .subscribe((result) => this.updateView(result));
  // }

  streamValues() {
    this._thingyService.streamValues().subscribe((value) => {
      // Temp solution 
      const data = {
        value,
        type: Sensor.MOTION
      };

      console.log(value);


      this.updateView(data);
    });
  }



  connect() {
    const t = this._thingyService.connect();
    // this._thingyService.getTemperature(t).subscribe((result) => this.updateView(result));
    // this._thingyService.getHumidity(t).subscribe(this.updateView.bind(this));
    this._thingyService.getMotion(t).subscribe(this.updateView.bind(this));
    this.updateDevice(t);
  }

  updateDevice(thingy: Observable<void | BluetoothRemoteGATTServer>) {
    thingy.subscribe((t: BluetoothRemoteGATTServer) => {
      if (t.connected) {
        this._zone.run(() => {
          this.device = t.device;
        });
      }
    });
  }
  updateView(result: any) {
    // force change detection
    this._zone.run(() => {
      console.log('UPDATING THE VIEW %d', result.value, result.type);
      switch (result.type) {
        case Sensor.HUMIDITY:
          this.humidity = result.value;
          break;
        case Sensor.TEMPERATURE:
          this.temperature = result.value;
          break;
        case Sensor.MOTION:
          this.motion = result.value;
          break;
        default:
          console.log(result);
      }

    });
  }

}
