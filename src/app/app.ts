import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BirdIdentify } from './bird-identify/bird-identify';

@Component({
  selector: 'app-root',
  imports: [BirdIdentify],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bird-frontend';


}
