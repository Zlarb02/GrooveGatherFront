import { Component } from '@angular/core';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
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

    // Créer un objet d'options pour la requête fetch
    const requestOptions: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:4200'  // Remplacez par l'URL de votre frontend Angular
      }
    };

    // Effectuer la requête fetch
    fetch("http://localhost:8080/api/v1/files/convert", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        const wavLink = document.getElementById("wavLink") as HTMLAnchorElement;
        const mp3Link = document.getElementById("mp3Link") as HTMLAnchorElement;
        const mp3Audio = document.getElementById("mp3Audio") as HTMLAudioElement;
        const linksDiv = document.getElementById("links") as HTMLDivElement;

        if (wavLink && mp3Link && mp3Audio && linksDiv) {
          wavLink.href = data.wavUrl;
          mp3Link.href = data.mp3Url;
          mp3Audio.src = data.mp3Url;
          linksDiv.style.display = "block";
        } else {
          console.error("One or more elements not found");
        }
      })
      .catch(error => console.error("Error:", error));
  }
}