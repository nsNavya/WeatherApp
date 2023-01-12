import { Component, OnInit} from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

import { FavouritesService } from 'src/app/services/favourites.service';
import { SearchService } from 'src/app/services/search.service';
import { RecentSearch } from 'src/app/models/recentSearch';
import { Constants } from 'src/app/Utils/Constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit{
  
  isFavourite: any;
  isFromSearch : any;
  weatherDetails : any;
  weatherData : any; 
  favouriteIcon: any;
  unit : string | any;
  Added = Constants.Added;
  Add = Constants.Add;
  ToFavourite = Constants.ToFavourite;
  cel = Constants.Celcius;
  fer = Constants.Farenhiet;
  
  constructor( public homeService : HomeService, private favouritesService : FavouritesService , private searchService : SearchService){
  }

  ngOnInit(): void {

    this.isFromSearch = this.homeService.isFromSearch;

    if(!this.isFromSearch){
      this.homeService.getPosition().then(pos=>
        {
          this.homeService.getWeatherforCurrentLocation(pos.latitude,pos.longitude);  
        });
      
    }  
    this.homeService.homeSubject.subscribe(
      data=>{
        if(data===null || data===undefined){
          this.homeService.getPosition().then(pos=>
            {
              this.homeService.getWeatherforCurrentLocation(pos.latitude,pos.longitude);  
            });
        }
        this.weatherData = data;
        this.searchService.addToRecentsList(data);  
        this.isFavourite =  this.favouritesService.isFavouriteCity(data?.id);
        this.setUnit();
        this.setFavouriteIcon();       
        this.weatherDetails = [
          { imageSrc: Constants.TemperatureIcon, header: Constants.Temperature, header_val: ((this.weatherData?.main.temp_min - 273.15).toFixed(0)+ Constants.DegreeIndicator+ Constants.HypenIndicator+(this.weatherData?.main.temp_max- 273.15).toFixed(0) + Constants.DegreeIndicator)},   
          { imageSrc: Constants.PrecipitationIcon, header: Constants.Precipitation, header_val: (this.weatherData?.main.feels_like - 273.15).toFixed(2)},     
          { imageSrc: Constants.HumidityIcon, header: Constants.Humidity, header_val: this.weatherData?.main.humidity + Constants.PercentageIndicator},       
          { imageSrc: Constants.WindIcon, header: Constants.Wind, header_val: (this.weatherData?.wind.speed* 2.237).toFixed(2) + Constants.SpeedUnit},       
          { imageSrc: Constants.VisibilityIcon, header: Constants.Visibility, header_val: this.weatherData?.visibility + Constants.SpeedUnit}       
        ];
    
      }, err => {
        if (err.error && err.error.message) {
          alert(err.error.message);
          return;
        }
        alert(Constants.WeatherFailedAlert);
      }, () => {
});   
  }

  toggleFavourites(){
    this.isFavourite = !this.isFavourite;
    this.setFavouriteIcon();
  }

  setFavouriteIcon(){
    if (this.isFavourite) {
      this.favouriteIcon = Constants.FavouriteActiveIcon;
      this.homeService.addToFavourites(this.weatherData?.id);
      const unit : string = (this.unit === this.cel ?  Constants.CelciusIndicator: Constants.FarenhietIndicator);
      const temperature : number = this.changeTemparature(this.weatherData?.main.temp, this.unit);
      this.favouritesService.updateTemparatureAndUint(this.weatherData?.id,temperature, unit )
    } else {
      this.favouriteIcon = Constants.FavouriteIcon;
      this.favouritesService.removeFavouriteItem(this.weatherData?.id);
      this.favouritesService.updateSearchFavouriteIcon(this.weatherData?.id , false);
    }
  }

  changeUnit(unit: string): void {
    if (unit !== this.unit) {
      this.unit = unit;
    }
  }

  changeTemparature(value: number, unit: string): any {
    if (unit === this.cel) {
      return (value - 273.15).toFixed(0);
    } else if (unit === this.fer) {
      return ((value - 273.15) * (9 / 5) + 32).toFixed(0);
    }
  }

  setUnit(){
    var allCities: [RecentSearch] =  JSON.parse(localStorage.getItem(Constants.AllCities) || '[]');
    const cityIndex : number = (allCities?.findIndex((item: RecentSearch) => item.cityId === this.weatherData?.id));
    this.unit= this.cel;
    if (cityIndex > -1) { 
      const addedUnit = allCities[cityIndex].unit;
      if (addedUnit === Constants.CelciusIndicator) {
        this.unit= this.cel;
      } else if (addedUnit === Constants.FarenhietIndicator) {
        this.unit = this.fer;
      }    
    }
  }
}

