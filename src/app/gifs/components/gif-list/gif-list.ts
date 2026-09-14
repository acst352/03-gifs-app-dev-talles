import { Component, input } from '@angular/core';
import { GifListItem } from './gif-list-item/gif-list-item';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gifs-gif-list',
  imports: [GifListItem],
  templateUrl: './gif-list.html',
})
export class GifList {
  gifs = input.required<Gif[]>();
}
