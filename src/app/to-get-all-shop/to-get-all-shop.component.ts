import { Component, OnInit, ViewChild } from '@angular/core';
import { ShopService } from '../service/shop.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { Store, select } from '@ngrx/store';
import * as shopActions from "../Store/Actions/shop.actions";
import { getShopsLoading, getShops, getErrors } from '../Store/Reducer/shop.reducer';
import {MatDialog} from "@angular/material";
import { InfoShopComponent } from '../info-shop/info-shop.component';
import { returnPostShop } from '../service/shop.interface';

@Component({
  selector: 'app-to-get-all-shop',
  templateUrl: './to-get-all-shop.component.html',
  styleUrls: ['./to-get-all-shop.component.sass']
})
export class ToGetAllShopComponent implements OnInit {
  /* displayed Columns */
  displayedColumns: string[] = [
    'owner_name',
    'area',
    'street', 
    "alley", 
    "license_date", 
    "license_end_date", 
    'star'
  ];
  storageDataTable;
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private shopService: ShopService, private store: Store<any>, private dialog:MatDialog) { }
  ngOnInit() {

  /*  dispatch to the store to get data in table */
  this.store.dispatch(new shopActions.LoadShops());

  if (typeof(Storage) !== "undefined") {
    if(localStorage.getItem("AllProductData2")) {
      this.dataSource = new MatTableDataSource(JSON.parse(localStorage.getItem("AllProductData2")));
      this.dataSource.paginator = this.paginator;
    }
  }

    
   this.store.pipe(select(getShopsLoading)).subscribe(data => {
     if(data == false) {
        this.store.pipe(select(getShops)).subscribe(data => {
          console.log(data);
        if (typeof(Storage) !== "undefined") {
              localStorage.setItem("AllProductData2", JSON.stringify(data));
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
          } else {
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
          }
        })
     }
   })
   this.store.pipe(select(getErrors)).subscribe((data) => {
     if(data.status == null && data.message == "") {
       // default
     } else if(data.status == 0) {
      localStorage.setItem("AllProductData2", "");
      alert(data.message)
     } else if(data.status === 401) {
      localStorage.setItem("AllProductData2", "");
      alert("apis Unauthorized");
    } else {
      localStorage.setItem("AllProductData2", "");
       alert("UnExpected error")
     }

   })

  }
  /* open Dialog the info shop */
  openDialog(data) {
    
    const dialogRef = this.dialog.open(InfoShopComponent, {
      data: {infoShops: data}
    });
    
  }
  /* Filter the table */
  applyFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

}
