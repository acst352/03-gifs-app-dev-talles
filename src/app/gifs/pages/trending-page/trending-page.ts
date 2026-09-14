import { Component, inject } from '@angular/core';
import { GifList } from '../../components/gif-list/gif-list';
import { GifService } from '../../services/gifs.service';

@Component({
  selector: 'app-trending-page',
  imports: [GifList],
  templateUrl: './trending-page.html',
})
export default class TrendingPage {
  // Angular detecta si ya hay una instancia creada y la va a inyectar con la data que tenga, sino crea una nueva
  gifService = inject(GifService);

}
