import { Injectable } from '@angular/core';
import { RecentSearch } from '../models/recentSearch';
import { WeatherMain } from '../models/weather';
import { Constants } from '../Utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  favouritesList: [RecentSearch]| undefined;
 
  constructor() {
    
  }

  
  setList(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  addToFavouritesList(data: RecentSearch): void {   
    this.favouritesList = JSON.parse(localStorage.getItem(Constants.Favourites) || '[]');  
    if(data===null ||data=== undefined){return;}
    if (this.favouritesList?.find((item: RecentSearch) => item.cityId === data?.cityId)) { return; }
    data.isFav = true;
    this.favouritesList?.push(data);
    this.setList(Constants.Favourites, this.favouritesList);  
  }

  getFavouritesList(): any{
    if (localStorage.getItem(Constants.Favourites)) {
      const recents = localStorage.getItem(Constants.Favourites);
      return recents;
    }
  }

  removeAllFavourites(): void {
    localStorage.setItem(Constants.Favourites, '[]');
    var searchList : [RecentSearch] = JSON.parse(localStorage.getItem(Constants.Recents) || '[]');
    var allCities: [RecentSearch] =  JSON.parse(localStorage.getItem(Constants.AllCities) || '[]');
    for(var i=0;i<searchList.length;i++){
      searchList[i].isFav = false;
    }
    for(var i=0;i<allCities.length;i++){
      allCities[i].isFav = false;
    }
    this.setList(Constants.Recents, searchList);
    this.setList(Constants.AllCities, allCities);
  }

  removeFavouriteItem(id : number){
    const allFavourites = JSON.parse(localStorage.getItem(Constants.Favourites) || '[]');
    const index  =  (allFavourites?.findIndex((item: RecentSearch) => item.cityId === id)) ;
    if (index > -1) { 
      allFavourites.splice(index, 1);
    }   
    this.setList(Constants.Favourites, allFavourites);   
  }

  updateSearchFavouriteIcon(id:number , isFavourite : boolean){
    var searchList : [RecentSearch] = JSON.parse(localStorage.getItem(Constants.Recents) || '[]');
    var allCities: [RecentSearch] =  JSON.parse(localStorage.getItem(Constants.AllCities) || '[]');
    const searchIndex : number = (searchList?.findIndex((item: RecentSearch) => item.cityId === id));
    const cityIndex : number = (allCities?.findIndex((item: RecentSearch) => item.cityId === id));
    if (searchIndex > -1) { 
      searchList[searchIndex].isFav = isFavourite;
      this.setList(Constants.Recents, searchList);
    }    
    if (cityIndex > -1) { 
      allCities[cityIndex].isFav = isFavourite;
      this.setList(Constants.AllCities, allCities);
    }    
  }

  isFavouriteCity(id: number): boolean {
    const allFavourites: any = JSON.parse(localStorage.getItem(Constants.Favourites) || '[]');
    const favouriteId  =  (allFavourites?.findIndex((item: RecentSearch) => item.cityId === id)) ;
    if (favouriteId > -1) {
        return true;
      } else {
        return false;
      }
    } 

  updateTemparatureAndUint(id:number, value: number, unit: string){
    var searchList : [RecentSearch] = JSON.parse(localStorage.getItem(Constants.Recents) || '[]');
    var allFavourites : [RecentSearch]  =JSON.parse(localStorage.getItem(Constants.Favourites) || '[]'); 
    var allCities: [RecentSearch] =  JSON.parse(localStorage.getItem(Constants.AllCities) || '[]');
    const searchIndex : number = (searchList?.findIndex((item: RecentSearch) => item.cityId === id));
    const favIndex : number = (allFavourites?.findIndex((item: RecentSearch) => item.cityId === id));
    const cityIndex : number = (allCities?.findIndex((item: RecentSearch) => item.cityId === id));
    if (searchIndex > -1) { 
      searchList[searchIndex].temp = value.toString();
      searchList[searchIndex].unit = unit;
      this.setList(Constants.Recents, searchList);
    }    
    if (favIndex > -1) { 
      allFavourites[favIndex].temp = value.toString();
      allFavourites[favIndex].unit = unit;
      this.setList(Constants.Favourites, allFavourites);
    }  
    if (cityIndex > -1) { 
      allCities[cityIndex].temp =value.toString();
      allCities[cityIndex].unit = unit;
      this.setList(Constants.AllCities, allCities);
    }    
  }
}
