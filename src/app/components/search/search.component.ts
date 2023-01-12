import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { RecentSearch } from 'src/app/models/recentSearch';
import { FavouritesService } from 'src/app/services/favourites.service';
import { HomeService } from 'src/app/services/home.service';
import { SearchService} from 'src/app/services/search.service';
import { Constants } from 'src/app/Utils/Constants';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{

  searchedData : any;
  isDialogOpen : boolean;
  SearchMessage : string= Constants.SearchMessage;
  ClearAllMessage = Constants.ClearAllMessage;
  SearchRemoveAlert = Constants.SearchRemoveAlert;
  NoSearchResults = Constants.NoSearchResults;
  Yes = Constants.Yes;
  No = Constants.No;

  constructor(private router: Router, public homeService : HomeService ,private favouritesService : FavouritesService,  private searchService: SearchService,private appComponent: AppComponent)
  {
    this.isDialogOpen = false;
    this.appComponent.selectedLink = this.appComponent.navLinks[2];
    this.searchedData = JSON.parse(this.searchService.getRecentsList());
  }

  ngOnInit(): void {  
  
  }

  toggleFavourites(id:number , isFav: boolean){
    this.updateLists(id , !isFav);
  }

  getIcon(isFav : boolean){
      if(isFav)  return Constants.FavouriteActiveIcon ; else  return Constants.FavouriteIcon;
  }

  updateLists(id:number  , isFavourite: boolean){
    if (isFavourite) {
      this.homeService.addToFavourites(id);
    } else {
      this.favouritesService.removeFavouriteItem(id);
    }
    this.favouritesService.updateSearchFavouriteIcon(id , isFavourite);
    this.searchedData = JSON.parse(this.searchService.getRecentsList());
  }

  getLocationDetails(location : string){
    this.homeService.setServiceLocation(location,true);  
    if (this.router.url !== Constants.HomeUrl) {
      this.router.navigate([Constants.Home]);
    }
    this.appComponent.selectedLink = this.appComponent.navLinks[0];
 } 

 clearAll(): void {
  this.searchService.removeAllRecents();
  this.searchedData = JSON.parse(this.searchService.getRecentsList());
 }

}
