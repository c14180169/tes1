import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { FotoService } from '../foto.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  dataStorage : FileStorage[] = [];

  constructor(
    private afStorage : AngularFireStorage,
    public fotoService : FotoService,
    private router : Router
  ) {}


  async ionViewWillEnter(){
    await this.fotoService.loadFoto();
    this.fetchData();
  }

  navigate(){
    this.router.navigate(['tab4/', 'tab4']);
  }

  fetchData(){
    this.dataStorage = [];
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll().then((res) => {
      res.items.forEach((itemRef) =>{
        itemRef.getDownloadURL().then(url => {
          itemRef.getMetadata().then(meta=>{
            this.dataStorage.unshift({
              urlImage : url,
              filename : meta.name         
            });
          })
        })
        console.log(this.dataStorage);
      })
    }).catch((error) => {
      console.log(error);
    })
  }

}

export interface FileStorage{
  urlImage : string;
  filename : string;
}

