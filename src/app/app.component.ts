import { Component } from '@angular/core';

@Component({
  selector: 'th-root',
  template: `
  <div class="container">
    <th-info-card></th-info-card>
  </div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'thingy52-demo';
}
