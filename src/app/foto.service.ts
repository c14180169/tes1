import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory, Plugins } from '@capacitor/core';

const { Camera, Storage, Filesystem } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class FotoService {

  public dataFoto : Photo[] = [];
  private keyFoto : string = "foto";

  constructor() { }

  public async tambahFoto(){
    const foto = await Camera.getPhoto ({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality : 100
    });

    const fileFoto = await this.simpanFoto(foto);
    this.dataFoto.unshift(fileFoto);

    Storage.set({
      key : this.keyFoto,
      value : JSON.stringify(this.dataFoto)
    });

    this.simpanFoto(foto);
  }

  public async simpanFoto(foto : CameraPhoto){
    const base64Data = await this.readAsBase64(foto);

    const namaFile = new Date().getTime() + '.jpeg';
    const simpanFile = await Filesystem.writeFile({
      path : namaFile,
      data : base64Data,
      directory : FilesystemDirectory.Data
    });

    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    const dataFoto = new File([blob],foto.path, {
      type : "image/jpeg"
    })

    return {
      filePath : namaFile,
      webViewPath : foto.webPath,
      dataImage : dataFoto,
      selected : false
    }
  }

  public async loadFoto(){
    const listFoto = await Storage.get({
      key : this.keyFoto
    });
    this.dataFoto = JSON.parse(listFoto.value) || [];

    for(let foto of this.dataFoto){
      const readFile = await Filesystem.readFile({
        path : foto.filePath,
        directory : FilesystemDirectory.Data
      });
      foto.webViewPath = `data:image/jpeg:base64, ${readFile.data}`;

      const response = await fetch(foto.webViewPath);
      const blob = await response.blob();

      foto.dataImage = new File([blob], foto.filePath, {
        type : "image/jpeg"
      });
    }
  }

  private async readAsBase64(foto : CameraPhoto){
    const response = await fetch(foto.webPath);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string; 
  }

  convertBlobToBase64 = (blob : Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    }
    reader.readAsDataURL(blob);
  });
}

export interface Photo{
  filePath : string;
  webViewPath : string;
  dataImage : File;
  selected : Boolean;
}