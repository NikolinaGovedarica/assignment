import { EditComponent } from './../edit/edit.component';
import { TreeComponent } from './../tree/tree.component';
import { AppServiceService } from './../app-service.service';
import { Item } from './../item.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  constructor(private service: AppServiceService) { }

  ngOnInit(): void {
  }

  itemForEdit: Item;
  editClicked(){
    new PreviewComponent(this.service);
    if(localStorage.getItem("collection"+TreeComponent.oldNode.id) === null){
        console.log("nije local storage za by id");
        this.service.getCollectionById(TreeComponent.oldNode.id).subscribe((response)=>{
        localStorage.setItem('collection'+TreeComponent.oldNode.id,JSON.stringify(response));
        this.itemForEdit = response as Item;
        TreeComponent.editIsClicked = true;
      },(error)=>{
        console.log('Error is ', error);
      })
    }else{
      this.itemForEdit = JSON.parse(localStorage.getItem('collection'+TreeComponent.oldNode.id)) as Item;
      TreeComponent.editIsClicked = true;
    }
    EditComponent.artForm.controls['title'].setValue(this.itemForEdit.name);
    EditComponent.artForm.controls['description'].setValue(this.itemForEdit.description);
    EditComponent.artForm.controls['url'].setValue(this.itemForEdit.url);

  }

  get staticItemClicked(){
    return TreeComponent.itemClicked;
  }

  get staticItem(){
    return TreeComponent.item;
  }

  get staticEditIsClicked(){
    return TreeComponent.editIsClicked;
  }
}
