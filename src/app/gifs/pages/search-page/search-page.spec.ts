import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import SearchPage from './search-page';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

describe('SearchPage', () => {
  const mockGifs: Gif[] = [
    { id: '1', title: 'cat dancing', url: 'https://example.com/cat.gif' },
    { id: '2', title: 'happy cat', url: 'https://example.com/cat2.gif' },
  ];

  let searchGifsSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    const gifServiceStub = {
      searchGifs: vi.fn().mockReturnValue(of(mockGifs)),
    };
    searchGifsSpy = gifServiceStub.searchGifs;

    await TestBed.configureTestingModule({
      imports: [SearchPage],
      providers: [{ provide: GifService, useValue: gifServiceStub }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should start with an empty gifs signal', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;
    expect(component.gifs()).toEqual([]);
  });

  it('should call GifService.searchGifs with the query on onSearch', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    component.onSearch('cats');

    expect(searchGifsSpy).toHaveBeenCalledTimes(1);
    expect(searchGifsSpy).toHaveBeenCalledWith('cats');
  });

  it('should update the gifs signal with the search result', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    component.onSearch('cats');

    expect(component.gifs()).toEqual(mockGifs);
  });

  it('should replace the gifs signal when a new search returns different items', () => {
    const reducedResult: Gif[] = [mockGifs[0]];
    searchGifsSpy
      .mockReturnValueOnce(of(mockGifs))
      .mockReturnValueOnce(of(reducedResult));

    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    component.onSearch('cats');
    expect(component.gifs()).toEqual(mockGifs);

    component.onSearch('dog');
    expect(component.gifs()).toEqual(reducedResult);
  });
});
