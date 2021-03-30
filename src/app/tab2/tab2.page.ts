import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import { FotoService, Photo } from '../foto.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    public fotoService : FotoService,
    private afStorage : AngularFireStorage,
    public toastController : ToastController
  ) {}

  async ngOnInit(){
    await this.fotoService.loadFoto();
  }

  tambahFoto(){
    this.fotoService.tambahFoto();
  }

  upload(foto : Photo){
    const imgFilePath = `imgStorage/${foto.filePath}`;
    this.afStorage.upload(imgFilePath, foto.dataImage).then(() => {
      this.afStorage.storage.ref().child(imgFilePath).getDownloadURL().then((url) => {
        this.presentToast("Upload Successful");
        foto.selected = false;
      })
    })
  }

  select(foto : Photo){
    console.log("selected");
    if(!foto.selected){
      foto.selected = true;
    }
    else{
      foto.selected = false;
    }
  }

  async presentToast(msg : string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
