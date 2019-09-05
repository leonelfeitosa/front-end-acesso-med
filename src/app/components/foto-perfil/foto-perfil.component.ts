import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-foto-perfil',
  templateUrl: './foto-perfil.component.html',
  styleUrls: ['./foto-perfil.component.scss']
})
export class FotoPerfilComponent implements OnInit {

  @ViewChild('image') image: ElementRef;
  editing: boolean = false;
  selectedFile: File;
  @Output() fotoEdited = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  fotoEditada(){
    this.fotoEdited.emit(true);
  }

  receiveFile(event) {
    this.selectedFile = event.target.files.item(0);
    let reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.image.nativeElement.src = reader.result;
      this.image.nativeElement.style.backgroundColor = 'white';
    }
    this.fotoEditada();
  }

  getFile(){
    return this.selectedFile;
  }

}
