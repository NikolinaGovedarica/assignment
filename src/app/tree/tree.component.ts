import { ArtNode } from './../art-node.interface';
import { FlatNode } from './../flat-node.interface';
import { Item } from '../item.interface';
import { FormBuilder } from '@angular/forms';
import { AppServiceService } from './../app-service.service';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit{

  ngOnInit(){
    TreeComponent.treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.collection);
    TreeComponent.dataSource = new MatTreeFlatDataSource(TreeComponent.treeControl, this.treeFlattener);
    this.getData();
    TreeComponent.editIsClicked = false;
  }
   reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  static editIsClicked: boolean = false;
  selection;
  selections = [{name:'All', value: true},  {name:'Painting', value: false},{name:'Potery', value: false}];
  static treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<ArtNode, FlatNode>;
  static dataSource: MatTreeFlatDataSource<ArtNode, FlatNode>;
  static collection: ArtNode;
  static TREE_NODE: ArtNode[];
  static PAINTING_TREE_NODE: ArtNode[];
  static POTTERY_TREE_NODE: ArtNode[];
  static itemClicked:boolean = false;

  static item: Item;
  static first: boolean =  false;

  get staticEditIsClicked() {
    return TreeComponent.editIsClicked;
  }

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

  constructor(private service: AppServiceService, private fb: FormBuilder) {
    
  }

  getData(){
    if(localStorage.getItem("collection") === null){
      this.service.getCollection().subscribe((response)=>{

        TreeComponent.collection = response as ArtNode;
        TreeComponent.TREE_NODE = [TreeComponent.collection];
        
        TreeComponent.dataSource.data=TreeComponent.TREE_NODE;

        localStorage.setItem("collection",JSON.stringify(response));
      }, (error)=>{
        console.log('Error is ', error);
      })
    }else{
      TreeComponent.collection = JSON.parse(localStorage.getItem("collection")) as ArtNode;

      TreeComponent.TREE_NODE = [TreeComponent.collection];

      TreeComponent.dataSource.data=TreeComponent.TREE_NODE;
    }
    
  }

   hasChild = (_: number, node: FlatNode) => node.expandable;

  takePotteries(){
    this.service.getItemsByType('potery').subscribe((response)=>{
      console.log('potery: '+response);
      TreeComponent.POTTERY_TREE_NODE = response as ArtNode[];   
    }, (error)=>{
      console.log('Error is ', error);
    })
  }

  takePaintings(){
    this.service.getItemsByType('painting').subscribe((response)=>{
      TreeComponent.PAINTING_TREE_NODE = response as ArtNode[];   
    }, (error)=>{
      console.log('Error is ', error);
    })
  }

  onSelectionChange($event): void {
    console.log($event);
   let radioValue = event.target['value'];
   if(radioValue === 'All'){
     TreeComponent.dataSource.data=TreeComponent.TREE_NODE;
     this.selections[0].value=true;
     this.selections[1].value=false;
     this.selections[2].value=false;
     TreeComponent.treeControl.expandAll();
   }else if (radioValue === 'Painting'){
    this.service.getItemsByType('painting').subscribe((response)=>{
      TreeComponent.PAINTING_TREE_NODE = response as ArtNode[]; 
      TreeComponent.dataSource.data=TreeComponent.PAINTING_TREE_NODE;  
    }, (error)=>{
      console.log('Error is ', error);
    })
     this.selections[0].value=false;
     this.selections[1].value=false;
     this.selections[2].value=true;
   }else{
    this.service.getItemsByType('potery').subscribe((response)=>{
      console.log('potery: '+response);
      TreeComponent.POTTERY_TREE_NODE = response as ArtNode[];
      TreeComponent.dataSource.data=TreeComponent.POTTERY_TREE_NODE;
   
    }, (error)=>{
      console.log('Error is ', error);
    })
     this.selections[0].value=false;
     this.selections[1].value=true;
     this.selections[2].value=false;
   }
   TreeComponent.oldNode = null;
 }

  get staticTreeControl(){
    return TreeComponent.treeControl;
  }
  
  get staticDataSource(){
    return TreeComponent.dataSource;
  }


  static itemClickedForEdit: Item;
  static oldNode: FlatNode;
  onItemClicked(node){
    console.log(node);
    if(!(node.expandable as boolean)){
      if(!(TreeComponent.oldNode === undefined || TreeComponent.oldNode === null)){
        document.getElementById(TreeComponent.oldNode.id).style.color= 'black';
      }
      if(localStorage.getItem("collection"+node.id) === null){
        console.log("nije local storage za by id");
      this.service.getCollectionById(node.id).subscribe((response)=>{
        console.log('Collection id='+ node.id + ' is: '+ JSON.stringify(response));
        localStorage.setItem('collection'+node.id,JSON.stringify(response));
        TreeComponent.item = response as Item;
        console.log('Item', TreeComponent.item);
        TreeComponent.itemClicked = true;
        TreeComponent.itemClickedForEdit = TreeComponent.item;
        //this.nodeClicked.backgroudColor("blue");
        console.log(node);
        this.changeColor(node.id);
        TreeComponent.oldNode = node as FlatNode;
      },(error)=>{
        console.log('Error is ', error);
      }
      )
      }else{
        TreeComponent.item = JSON.parse(localStorage.getItem('collection'+node.id)) as Item;
          console.log('Item', TreeComponent.item);
          TreeComponent.itemClicked = true;
          TreeComponent.itemClickedForEdit = TreeComponent.item;
          //this.nodeClicked.backgroudColor("blue");
          console.log(node);
          this.changeColor(node.id);
          TreeComponent.oldNode = node as FlatNode;
      }
    
    }

  }
  changeColor(id) {
    document.getElementById(id).style.color= 'blue';
  }

  
}
