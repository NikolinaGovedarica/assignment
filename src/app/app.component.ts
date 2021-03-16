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
    if(localStorage.getItem("collection") === null){
      console.log('nije local storage');
      this.service.getCollection().subscribe((response)=>{
        console.log('Collections are: ', response)
        localStorage.setItem("collection",JSON.stringify(response));
        this.collection = response;
      }, (error)=>{
        console.log('Error is ', error);
      })
    }else{
      this.collection = localStorage.getItem("collection");
    }
    
  }

  getCollectionByIdFromAPI(id){
    if(localStorage.getItem("collection"+id) === null){
      this.service.getCollectionById(id).subscribe((response)=>{
        console.log('Collection id='+ id + ' is: '+ response);
        localStorage.setItem('collection'+id,JSON.stringify(response));
      },(error)=>{
        console.log('Error is ', error);
      }
      )
    }else{
      localStorage.getItem('collection'+id);
    }
    
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
