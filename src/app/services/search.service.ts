import { Injectable } from '@angular/core';
import { RecentSearch } from '../models/recentSearch';
import { WeatherMain } from '../models/weather';
import { FavouritesService } from './favourites.service';
import { Constants } from '../Utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  favouritesList: [RecentSearch]| undefined;
  recentList: [RecentSearch]| undefined;

  constructor(private favouriteService : FavouritesService) { }

  setList(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  addToRecentsList(data: WeatherMain): void {   
    this.recentList = JSON.parse(localStorage.getItem(Constants.Recents) || '[]');
    const allSearchs = JSON.parse(localStorage.getItem(Constants.AllCities) || '[]');
    if (this.recentList?.find((item: RecentSearch) => item.cityId === data?.id)) { return; }
    const recent: RecentSearch = {
      cityName: data?.name,
      countryName: data?.sys.country,
      icon: data?.weather[0].icon,
      temp:  (data?.main.temp - 273.15).toFixed(0),
      unit: Constants.CelciusIndicator,
      description: data?.weather[0].description,
      cityId: data?.id,
      isFav : this.favouriteService.isFavouriteCity(data?.id)
    };
    this.recentList?.push(recent);
    this.setList(Constants.Recents, this.recentList);
    if (allSearchs?.find((item: RecentSearch) => item.cityId === data?.id)) { return; }
    allSearchs?.push(recent);
    this.setList(Constants.AllCities, allSearchs);
  }

  getRecentsList(): any{
    if (localStorage.getItem(Constants.Recents)) {
      const recents = localStorage.getItem(Constants.Recents);
      return recents;
    }
  }

  getSearchItem(id : any){
    const allSearchs = JSON.parse(localStorage.getItem(Constants.AllCities) || '[]');
    const searchItem : RecentSearch =  (allSearchs?.find((item: RecentSearch) => item.cityId === id)) ;
    return searchItem;
  }

  removeAllRecents(): void {
    localStorage.setItem(Constants.Recents, '[]');
  }

  getLastSearchedCity(){
    const allSearchs = JSON.parse(localStorage.getItem(Constants.AllCities) || '[]');
    const lastSearched : RecentSearch =  (allSearchs?.splice(-1).pop()) ;
    return lastSearched;
  }
}
