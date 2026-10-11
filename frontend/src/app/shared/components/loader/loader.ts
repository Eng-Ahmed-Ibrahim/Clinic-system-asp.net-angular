import { Component } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  imports: [],
  selector: 'app-loader',
  styleUrl: './loader.css',
  templateUrl: './loader.html',
})
export class Loader {
constructor(public loaderService :LoaderService){}

}
