import { FormGroup, FormControl } from '@angular/forms';
import { AppServiceService } from './../app-service.service';
import { Component, Input} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';

/**
 * Art data with nested structure.
 * Each node has a name, id, type and an optional list of children.
 */
interface ArtNode {
  id:string;
  type:string;
  name: string;
  collection?: ArtNode[];
}
/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  visible: boolean;
  id: string;
}

interface Item{
  id:string;
  name:string;
  type:string;
  url:string;
  description:string;
}

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent{

  artForm = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    url: new FormControl()
  })

  editIsClicked: boolean;
  selection;
  selections = [{name:'All', value: true},  {name:'Painting', value: false},{name:'Potery', value: false}];
  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<ArtNode, FlatNode>;
  dataSource: MatTreeFlatDataSource<ArtNode, FlatNode>;
  collection: ArtNode;
  TREE_NODE: ArtNode[];
  ALL_TREE_NODE: ArtNode[];
  PAINTING_TREE_NODE: ArtNode[];
  POTTERY_TREE_NODE: ArtNode[];
  itemClicked:boolean = false;

  item: Item;

  private _transformer = (node: ArtNode, level: number) => {
    return {
      expandable: !!node.collection && node.collection.length > 0,
      name: node.name,
      level: level,
      visible: true,
      id: node.id
    };
  }
  loaded: boolean = false;
  ok: boolean = false;  

  constructor(private service: AppServiceService) {
    this.treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.collection);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.getData();
    this.editIsClicked = false;
  }

  getData(){
    if(localStorage.getItem("collection") === null){
      this.service.getCollection().subscribe((response)=>{
        this.collection = response as ArtNode;
        this.TREE_NODE = [this.collection];
        this.ALL_TREE_NODE = [this.collection];
        this.takePotteries(this.TREE_NODE);
        this.takePaintings(this.TREE_NODE);
        this.dataSource.data=this.TREE_NODE;
        console.log(this.POTTERY_TREE_NODE);
        console.log(this.PAINTING_TREE_NODE);
        localStorage.setItem("collection",JSON.stringify(response));
      }, (error)=>{
        console.log('Error is ', error);
      })
    }else{
      this.collection = JSON.parse(localStorage.getItem("collection")) as ArtNode;
      this.TREE_NODE = [this.collection];
      this.ALL_TREE_NODE = [this.collection];
      this.takePotteries(this.TREE_NODE);
      this.takePaintings(this.TREE_NODE);
      this.dataSource.data=this.TREE_NODE;
      console.log(this.POTTERY_TREE_NODE);
      console.log(this.PAINTING_TREE_NODE);
    }
    
  }

   hasChild = (_: number, node: FlatNode) => node.expandable;
   
   onSelectionChange($event): void {
     console.log($event);
    let radioValue = event.target['value'];
    if(radioValue === 'All'){
      this.dataSource.data=this.ALL_TREE_NODE;
      this.selections[0].value=true;
      this.selections[1].value=false;
      this.selections[2].value=false;
    }else if (radioValue === 'Painting'){
      this.dataSource.data=this.PAINTING_TREE_NODE;
      this.selections[0].value=false;
      this.selections[1].value=false;
      this.selections[2].value=true;
    }else{
      this.dataSource.data=this.POTTERY_TREE_NODE;
      this.selections[0].value=false;
      this.selections[1].value=true;
      this.selections[2].value=false;
    }
    this.oldNode = null;
  }

  takePotteries(TREE_NODE: ArtNode[]){
    for(let data of TREE_NODE){
      if(!(data.type === 'potery')){
        this.takePotteries(data['collection'] as ArtNode[]);
      }else{
        if(this.POTTERY_TREE_NODE === undefined){
          this.POTTERY_TREE_NODE = [data];
        }else{
          if(!this.POTTERY_TREE_NODE.includes(data)){
            this.POTTERY_TREE_NODE.push(data);
          }
        }
        
      }

    }
  }

  takePaintings(TREE_NODE: ArtNode[]){
    for(let data of TREE_NODE){
      if(!(data.type === 'painting')){
        this.takePaintings(data['collection'] as ArtNode[]);
      }else{
        if(this.PAINTING_TREE_NODE === undefined){
          this.PAINTING_TREE_NODE = [data];
        }else{
          if(!this.PAINTING_TREE_NODE.includes(data)){
            this.PAINTING_TREE_NODE.push(data);
          }
        }
        
      }

    }
  }

  saveClicked(){
    this.item.name = this.artForm.controls['title'].value;
    this.item.description = this.artForm.controls['description'].value;
    this.item.url = this.artForm.controls['url'].value;
    localStorage.setItem('collection'+this.oldNode.id,JSON.stringify(this.item));
    this.editIsClicked = false;
  }
  previewClicked(){
    this.item.name = this.artForm.controls['title'].value;
    this.item.description = this.artForm.controls['description'].value;
    this.item.url = this.artForm.controls['url'].value;
  }

  itemForEdit: Item;
  editClicked(){
    if(localStorage.getItem("collection"+this.oldNode.id) === null){
        console.log("nije local storage za by id");
        this.service.getCollectionById(this.oldNode.id).subscribe((response)=>{
        localStorage.setItem('collection'+this.oldNode.id,JSON.stringify(response));
        this.itemForEdit = response as Item;
        this.editIsClicked = true;
      },(error)=>{
        console.log('Error is ', error);
      })
    }else{
      this.itemForEdit = JSON.parse(localStorage.getItem('collection'+this.oldNode.id)) as Item;
      this.editIsClicked = true;
    }
    this.artForm.controls['title'].setValue(this.itemForEdit.name);
    this.artForm.controls['description'].setValue(this.itemForEdit.description);
    this.artForm.controls['url'].setValue(this.itemForEdit.url);

  }

  oldNode: FlatNode;
  onItemClicked(node){
    console.log(node);
    if(!(node.expandable as boolean)){
      if(!(this.oldNode === undefined || this.oldNode === null)){
        document.getElementById(this.oldNode.id).style.color= 'black';
      }
      if(localStorage.getItem("collection"+node.id) === null){
        console.log("nije local storage za by id");
      this.service.getCollectionById(node.id).subscribe((response)=>{
        console.log('Collection id='+ node.id + ' is: '+ JSON.stringify(response));
        localStorage.setItem('collection'+node.id,JSON.stringify(response));
        this.item = response as Item;
        console.log('Item', this.item);
        this.itemClicked = true;
        //this.nodeClicked.backgroudColor("blue");
        console.log(node);
        this.changeColor(node.id);
        this.oldNode = node as FlatNode;
      },(error)=>{
        console.log('Error is ', error);
      }
      )
      }else{
        this.item = JSON.parse(localStorage.getItem('collection'+node.id)) as Item;
          console.log('Item', this.item);
          this.itemClicked = true;
          //this.nodeClicked.backgroudColor("blue");
          console.log(node);
          this.changeColor(node.id);
          this.oldNode = node as FlatNode;
      }
    
    }

  }
  changeColor(id) {
    document.getElementById(id).style.color= 'blue';
}
  
}
