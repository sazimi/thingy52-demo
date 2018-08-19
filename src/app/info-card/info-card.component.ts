import { Component, OnInit, NgZone } from '@angular/core';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';

import { ThingyService } from '../thingy.service';

@Component({
  selector: 'th-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent implements OnInit {

  tempurture;
  device: BluetoothDevice;

  constructor(public _zone: NgZone,
    public _thingyService: ThingyService,
    public ble: BluetoothCore) { }

  ngOnInit() {
    this.streamValues();
    //this.getDeviceStatus();
  }

  streamValues() {
    this._thingyService.streamValues().subscribe(this.updateView.bind(this));
    // const n = this.getFakeValue();
    // console.log('Fakeeeeeeee',n);
  }

  getDeviceStatus() {
    this._thingyService.service.subscribe(
      (device) => {
        debugger;
        if (device) {
          this.device = device;
        }
      }
    );
  }

  getTemperture() {
    this._thingyService.getTempurture().subscribe(() => {
      this.updateView.bind(this);
    }
    );
  }

  connect() {
    console.log('I am connected');
  }

  updateView(value) {
    // force change detection
    this._zone.run(() => {
      console.log('Reading battery level %d', value);
      this.tempurture = '' + value;

      console.log(this.tempurture);
    });
  }

}
