import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { FavouritesService } from 'src/app/services/favourites.service';
import { HomeService } from 'src/app/services/home.service';
import { Constants } from 'src/app/Utils/Constants';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit{

    favouritesData : any;
    isDialogOpen: boolean;
    City = Constants.City;
    Cities = Constants.Cities;
    FavouriteIcon = Constants.FavouriteActiveIcon;
    FavouriteMessage = Constants.FavouriteMessage;
    RemoveAllMessage = Constants.RemoveAllMessage;
    FavouriteRemoveAlert = Constants.FavouriteRemoveAlert;
    NoFavouriteResults = Constants.NoFavouriteResults;
    Yes = Constants.Yes;
    No = Constants.No;
    
    constructor(public homeService : HomeService ,private router: Router,  private favouritesService: FavouritesService,private appComponent: AppComponent)
    {
      this.isDialogOpen = false;
      this.appComponent.selectedLink = this.appComponent.navLinks[1];
      this.favouritesData = JSON.parse(this.favouritesService.getFavouritesList());
    }
  
    ngOnInit(): void {     
     
    }

    removeFavourite(id: number){
      this.favouritesService.removeFavouriteItem(id);
      this.favouritesService.updateSearchFavouriteIcon(id , false);
      this.favouritesData = JSON.parse(this.favouritesService.getFavouritesList());
    }

    getLocationDetails(location : string){
      this.homeService.setServiceLocation(location,true);  
      if (this.router.url !== Constants.HomeUrl) {
        this.router.navigate([Constants.Home]);
      }
      this.appComponent.selectedLink = this.appComponent.navLinks[0];
   } 

   removeAll(): void {
    this.favouritesService.removeAllFavourites();
    this.favouritesData = JSON.parse(this.favouritesService.getFavouritesList());
  }

}
