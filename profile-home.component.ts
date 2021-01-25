import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID  } from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedServiceService } from 'src/app/shared/shared.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.css']
})
export class ProfileHomeComponent implements OnInit, OnDestroy {
  isBrowser:boolean = false;

  sentMessage:string;
  private messageSub:Subscription;
  userProfileDataSub:Subscription;
  
  //profile data from get request
  firstName: string;
  lastName:string;
  verifiedUser: boolean;
  profileUsername:string;
  profileBio:string;
  profilePhoto:string;
  coverPhoto:string;
  fullName:string;

  constructor(
    private shared: SharedServiceService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // //subscribe to sent message
    this.messageSub = this.shared.newMessage.subscribe(
      message => {
        this.sentMessage = message;
      }
    ) 
    if(this.isBrowser) {
      //set a timer to clear the sent message after 3 seconds
      setTimeout(() => {
        this.sentMessage = null;
        this.shared.clearMessage()
      }, 3000)
    }

    this.captureProfileData()
    
  }

  captureProfileData() {
    this.route.data.subscribe(
      (data:Data) => {
        //set profile information
        this.firstName = data['profileData'].first_name
        this.lastName = data['profileData'].last_name
        this.fullName = this.firstName + ' ' + this.lastName
        this.verifiedUser = data['profileData'].verifies_user
        this.profileUsername = data['profileData'].profile_username
        this.profileBio = data['profileData'].profile_bio
        
        // version for local host
        // this.profilePhoto = this.profileService.imageApiUrl + data['profileData'].profile_photo
        // this.coverPhoto = this.profileService.imageApiUrl + data['profileData'].cover_photo

        // the version below is used on live server
        this.profilePhoto = data['profileData'].profile_photo
        this.coverPhoto = data['profileData'].cover_photo
      }
    )
  
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe()
  }
}