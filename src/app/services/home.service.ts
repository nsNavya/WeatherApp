import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchService } from './search.service';
import { FavouritesService } from './favourites.service';
import { DropdownCityNames } from '../models/drop-down-city-names';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  url = 'https://api.openweathermap.org/data/2.5/weather?';
  apiKey = "b4dd851fd087a3459d2d4f74a76b5d1b";
  serviceLocation : any;
  isFromSearch = false;
  path: any;
  homeSubject :  Subject<any> = new Subject(); 

  constructor(private http: HttpClient, private searchService: SearchService, private favouritesService : FavouritesService) {}

  setServiceLocation(location : string , isFromSearch : boolean){
      this.serviceLocation = location;
      this.isFromSearch = isFromSearch;
      this.getWeatherForCity();     
  }

  getWeatherForCity() {
    this.path = this.url+ "q="+this.serviceLocation+'&appid='+ this.apiKey;
    this.http.get<any>(this.path).subscribe(data => 
      {
        this.homeSubject.next(data); 
        this.searchService.addToRecentsList(data);    
      });  
  }
  
  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
          resolve({longitude: resp.coords.longitude, latitude: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });
  }

  getCitiesForDropdown(location : string) : Observable<DropdownCityNames> {
    this.path = "https://api.openweathermap.org/geo/1.0/direct?q="+location+"&limit=10&appid="+ this.apiKey;
    const response = this.http.get<DropdownCityNames>(this.path);  
    return response;
  }

  getWeatherforCurrentLocation(latitude: number, longitude: number)
  {   
    this.path = this.url+"lat="+latitude +"&lon="+longitude+'&appid='+ this.apiKey;
    this.http.get<any>(this.path).subscribe(data => 
      {
        this.homeSubject.next(data);      
      });  
  }

  addToFavourites(id : any){
    const favouriteCity = this.searchService.getSearchItem(id);
    this.favouritesService.addToFavouritesList(favouriteCity);
    this.favouritesService.updateSearchFavouriteIcon(id,true);
  }


}

