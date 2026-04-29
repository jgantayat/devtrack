import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NzButtonModule, NzIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('devtrack');

    onClick() { console.log('NG-ZORRO is wired up.'); }
}
