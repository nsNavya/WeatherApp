import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from './Utils/Constants';
import { DropdownCityNames } from './models/drop-down-city-names';
import { HomeService } from './services/home.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public navLinks: any[];
  activeLinkIndex = -1; 
  public selectedLink:any;
  location : any;
  date: any;
  isDropDownVisible = false;
  cities : DropdownCityNames|undefined;

  constructor(
    private homeService : HomeService,
    private router: Router) {
    this.navLinks = Constants.NavigationLinks;
  }

  ngOnInit(): void {
    this.router.events.subscribe((res:any) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
    this.date = Date.now();
    this.tabClicked(this.navLinks[0]);
  }

  tabClicked(link : any){
      this.selectedLink = link;
  }

  setLocation(event : Event){
    this.isDropDownVisible = true;
    this.location = (<HTMLInputElement>event.target).value;
  }

  getLocationDetails(location :any ){
     this.homeService.setServiceLocation(location,true);  
     if (this.router.url !== Constants.HomeUrl) {
      this.router.navigate([Constants.Home]);
      this.tabClicked(this.navLinks[0]);
    }
  } 

  getCityNames(city : any){
   this.homeService.getCitiesForDropdown(city.value).subscribe(data => {
    this.cities = data;
    });
  }

  getWeatherByPosition(latitude : any, longitude: any){
    this.homeService.getWeatherforCurrentLocation(latitude,longitude);
    this.navigatToHome();
  }

  getWeatherByCityName(cityName : string ){
    this.homeService.setServiceLocation(cityName,true);  
    this.navigatToHome();
  }

   navigatToHome(){
    if (this.router.url !== Constants.HomeUrl) {
      this.router.navigate([Constants.Home]);
      this.tabClicked(this.navLinks[0]);
   }
 } 
}
