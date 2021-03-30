import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { FotoService } from '../foto.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  path : string;
  check : Boolean = false;
  urlImageStorage : string[] = [];

  constructor(private route : ActivatedRoute,
    private afStorage : AngularFireStorage,
    public fotoService : FotoService
    ) { }


  ngOnInit() {
    let temp = this.route.snapshot.paramMap.get('path');
    this.path = temp;
    if(this.path != null){
      this.check = true;
    }
    
  }

  async ionViewWillEnter(){
    await this.fotoService.loadFoto();
    this.showData();
  }


  showData(){
    this.urlImageStorage = [];
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll().then((res) => {
      res.items.forEach((itemRef) =>{
        itemRef.getDownloadURL().then(url => {
          this.urlImageStorage.unshift(url);
        })     
      })
    }).catch((error) => {
      console.log(error);
    })
  }

}
