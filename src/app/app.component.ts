import { AppServiceService } from './app-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'flex-tutorial';
  
  constructor(private service: AppServiceService){}
  ngOnInit(){
    this.getDataFromAPI();
    this.getCollectionFromAPI();
  }

  getDataFromAPI(){
    this.service.getData().subscribe((response)=>{
      console.log('Response from API is ', response);
    }, (error)=>{
      console.log('Error is ', error);
    });
  }

  getCollectionFromAPI(){
    this.service.getCollection().subscribe((response)=>{
      console.log('Collections are: ', response)
    }, (error)=>{
      console.log('Error is ', error);
    })
  }

  getCollectionByIdFromAPI(id){
    this.service.getCollectionById(id).subscribe((response)=>{
      console.log('Collection id='+ id + ' is: '+ response);
    },(error)=>{
      console.log('Error is ', error);
    }
    )
  }
}
