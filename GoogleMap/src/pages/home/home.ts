import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormControl} from "@angular/forms";
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number;

    contact:string="";
    @ViewChild("search")
    public searchElementRef;

  constructor(public navCtrl: NavController, private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone)  {
      this.zoom = 4;
      this.latitude = 39.8282;
      this.longitude = -98.5795;

      //create search FormControl
      this.searchControl = new FormControl();

      //set current position
      this.setCurrentPosition();

  }
  gosave(){
    console.log(this.contact);
  }
  ionViewDidLoad() {
      //设置谷歌地图默认值
      this.zoom = 4;
      this.latitude = -33.8688;
      this.longitude = 151.2195;

      //创建搜索窗体控件
      this.searchControl = new FormControl();

      //设置当前位置
      this.setCurrentPosition();

      //加载的地方自动完成
      this.mapsAPILoader.load().then(() => {
          let nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
          let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
              types: ["address"]
          });
          autocomplete.addListener("place_changed", () => {
              this.ngZone.run(() => {
                  //获取地点的结果
                  let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                  console.log(place);
                  //验证结果
                  if (place.geometry === undefined || place.geometry === null) {
                      return;
                  }

                  //set latitude, longitude and zoom
                  this.latitude = place.geometry.location.lat();
                  this.longitude = place.geometry.location.lng();
                  this.zoom = 12;
              });
          });
      });
  }

    private setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
            });
        }
    }

}
