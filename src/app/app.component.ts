import { AppServiceService } from './app-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Assignment';
  private collection; 

  constructor(private service: AppServiceService){}
  ngOnInit(){
    this.getDataFromAPI();
    this.getCollectionFromAPI();
  }

  /*
  Test method
  */
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
      this.collection = response;
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

  updateItem(id){
    this.service.updateItem(id).subscribe((response)=>{
      console.log('Item id='+ id + 'updated, response: '+ response);
    },(error)=>{
      console.log('Error is ', error);
    }
    )
  }

  getCollectionData(){
    return this.collection;
  }
}
