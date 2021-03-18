import { Item } from './../item.interface';
import { ArtNode } from './../art-node.interface';
import { AppServiceService } from './../app-service.service';
import { TreeComponent } from './../tree/tree.component';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  static reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  static artForm = new FormGroup({
    title: new FormControl([Validators.required, Validators.minLength(5)]),
    description: new FormControl([Validators.required]),
    url: new FormControl([Validators.required, Validators.minLength(5), Validators.pattern(EditComponent.reg)])
  })

  get staticEditIsClicked(){
    return TreeComponent.editIsClicked;
  }

  get staticArtForm(){
    return EditComponent.artForm;
  }

  constructor(private service: AppServiceService) { }

  ngOnInit(): void {
  }

  saveClicked(){
    console.log(EditComponent.artForm.controls);

    console.log(EditComponent.artForm.controls.url);
    TreeComponent.item.name = EditComponent.artForm.controls['title'].value;
    TreeComponent.item.description = EditComponent.artForm.controls['description'].value;
    TreeComponent.item.url = EditComponent.artForm.controls['url'].value;
    this.changeUpdatedItemInCollection();
  }

  private itemForUpdate: Item;

  changeUpdatedItemInCollection(){
    TreeComponent.collection = JSON.parse(localStorage.getItem("collection")) as ArtNode;
    console.log( TreeComponent.collection );
    const collsInCollection: ArtNode[]= TreeComponent.collection['collection'];
    console.log(collsInCollection);
    var index;
    var index1;
    for(var coll of collsInCollection){
      const collInColl: ArtNode[] = coll.collection;
      for(var c of collInColl){
        if(c.id === TreeComponent.oldNode.id){
          c.name = TreeComponent.item.name;
          index = collInColl.indexOf(c);
          TreeComponent.itemClickedForEdit.name = c.name;
          index1 = collsInCollection.indexOf(coll);
          console.log(index1+ ' ' + index);
          collInColl[index] = TreeComponent.itemClickedForEdit;
          collsInCollection[index1].collection = collInColl;
          TreeComponent.collection.collection = collsInCollection;
          console.log('poslije update-a:' + JSON.stringify(TreeComponent.collection));
          break;
        }
      }
    }
    localStorage.setItem('collection'+TreeComponent.oldNode.id,JSON.stringify(TreeComponent.item));
    TreeComponent.editIsClicked = false;
    TreeComponent.treeControl.expandAll();
    localStorage.setItem('collection',JSON.stringify(TreeComponent.collection));
  }

  previewClicked(){
    TreeComponent.item.name = EditComponent.artForm.controls['title'].value;
    TreeComponent.item.description = EditComponent.artForm.controls['description'].value;
    TreeComponent.item.url = EditComponent.artForm.controls['url'].value;
  }

}
