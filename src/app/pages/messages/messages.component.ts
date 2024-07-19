import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { NgxFileSaverService } from '@clemox/ngx-file-saver';
import { Api } from '../../shared/models/api';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {

  api = new Api();
  baseUrl = this.api.local;
  wavUrl: string | undefined;
  mp3Url: string | undefined;
  constructor(
    private fileSaver: NgxFileSaverService
  ) { }
  uploadFile() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (!fileInput || !fileInput.files) {
      alert("File input element not found");
      return;
    }

    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a WAV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Options de la requête fetch pour l'upload du fichier
    const requestOptions: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:4200' // Remplacez par l'URL de votre frontend Angular
      }
    };

    // Effectuer la requête fetch pour convertir le fichier WAV en MP3
    fetch("http://localhost:8080/api/v1/files/convert", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        this.wavUrl = `${this.baseUrl}/${data.wavUrl}`;
        this.mp3Url = `${this.baseUrl}/${data.mp3Url}`;

      })
      .catch(error => console.error("Error:", error));
  }

  downloadOriginal() {
    if (this.wavUrl) {
      fetch(this.wavUrl)
        .then(response => response.blob())
        .then(blob => {
          console.table(blob);
          this.fileSaver.saveBlob(blob, 'wav.wav');
        })
        .catch(error => console.error("Error downloading original file:", error));
    } else {
      console.error("WAV URL is not defined");
    }
  }

  downloadConverted() {
    if (this.mp3Url) {
      fetch(this.mp3Url)
        .then(response => response.blob())
        .then(blob => {
          console.table(blob);
          this.fileSaver.saveBlob(blob, 'mp3.wav');
        })
        .catch(error => console.error("Error downloading converted file:", error));
    } else {
      console.error("MP3 URL is not defined");
    }
  }
}