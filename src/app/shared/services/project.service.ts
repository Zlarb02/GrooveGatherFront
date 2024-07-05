import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import type { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  http = inject(HttpClient)

  mockProjects: Project[] = [
    {
      "name": "Touch the Sky",
      "genres": ["Rock", "Rock progressif", "Funk"],
      "description": "Tempo de 97, signature rythmique 4:4. Tonalité : LA mineur, j'ai composé les parties guitare et basses et je recherche quelqu'un pour faire la partie basse slap svp",
      "date": "1/1/2023",
      "likes": 101,
      "skillsMissing": ["Guitare", "Batterie", "Composition"],
      "skillsPresent": ["Basse", "Slap", "Composition"],
      "color": "red"
    },
    {
      "name": "Whispering Winds",
      "genres": ["Ambient", "Experimental"],
      "description": "Une mélodie atmosphérique qui évoque des vents soufflants à travers des paysages célestes. Les harmonies sont douces et évocatrices, invitant à la contemplation et à la paix intérieure. J'ai composé les parties principales et recherche quelqu'un pour ajouter des textures sonores et des effets spéciaux.",
      "date": "2/15/2024",
      "likes": 84,
      "skillsMissing": ["Sound design", "Mixage", "Mastering"],
      "skillsPresent": ["Clavier", "Synthétiseur", "Composition"],
      "color": "blue"
    },
    {
      "name": "Rythmes de la Nuit",
      "genres": ["Latin jazz", "Salsa"],
      "description": "Un voyage dans les rues animées de La Havane. Les rythmes sont envoûtants, mêlant salsa et jazz latin. J'ai créé les lignes de piano et de percussion et je cherche à enrichir le son avec des cuivres et des instruments à percussion traditionnels.",
      "date": "4/20/2023",
      "likes": 62,
      "skillsMissing": ["Trompette", "Congas", "Enregistrement"],
      "skillsPresent": ["Piano", "Percussions", "Composition"],
      "color": "green"
    },
    {
      "name": "Beyond the Horizon",
      "genres": ["Ambient", "Electronic"],
      "description": "Une exploration sonore des vastes espaces et des horizons infinis. Les synthétiseurs créent des atmosphères oniriques et mystérieuses. J'ai conçu les couches sonores principales et je cherche à ajouter des effets d'écho et des textures sonores pour enrichir l'expérience auditive.",
      "date": "6/10/2023",
      "likes": 78,
      "skillsMissing": ["Sound design", "Effets spéciaux", "Production"],
      "skillsPresent": ["Synthétiseur", "Clavier", "Composition"],
      "color": "orange"
    },
    {
      "name": "Echoes of Solitude",
      "genres": ["Folk", "Indie"],
      "description": "Une ballade mélancolique qui reflète la solitude et l'introspection. Les guitares acoustiques et les harmonies vocales captivent l'auditeur dans une atmosphère intimiste. J'ai écrit les paroles et les arrangements et je recherche un percussionniste pour enrichir la texture rythmique.",
      "date": "8/5/2023",
      "likes": 91,
      "skillsMissing": ["Batterie", "Percussions", "Enregistrement"],
      "skillsPresent": ["Guitare acoustique", "Chant", "Composition"],
      "color": "pink"
    },
    {
      "name": "Lumières de la Ville",
      "genres": ["Pop", "Electro"],
      "description": "Une exploration des lumières vibrantes et de l'énergie des métropoles modernes. Les rythmes sont dynamiques, mêlant des éléments de pop et d'électro. J'ai créé les lignes de synthé et de basse et je recherche un batteur pour apporter une rythmique puissante et percutante.",
      "date": "10/30/2023",
      "likes": 79,
      "skillsMissing": ["Batterie", "Mixage", "Mastering"],
      "skillsPresent": ["Synthétiseur", "Basse", "Composition"],
      "color": "purple"
    },
    {
      "name": "Voix de l'Âme",
      "genres": ["Soul", "R&B"],
      "description": "Une exploration des émotions profondes et des histoires de l'âme humaine à travers la musique soul et R&B. Les mélodies sont riches en harmonies vocales et en arrangements de cuivres. J'ai écrit les paroles et les lignes de chant et je recherche un trompettiste pour ajouter des accents brillants.",
      "date": "12/15/2023",
      "likes": 85,
      "skillsMissing": ["Trompette", "Enregistrement", "Production"],
      "skillsPresent": ["Chant", "Piano", "Composition"],
      "color": "red"
    },
    {
      "name": "Transe Électrique",
      "genres": ["Techno", "House"],
      "description": "Une exploration des rythmes hypnotiques et des basses profondes de la musique électronique. Les textures sonores et les boucles rythmiques créent une atmosphère de transe. J'ai créé les motifs de synthé et de batterie et je cherche à enrichir le mixage avec des effets spatiaux et des filtres.",
      "date": "2/20/2024",
      "likes": 71,
      "skillsMissing": ["Mixage", "Effets spéciaux", "Mastering"],
      "skillsPresent": ["Synthétiseur", "Batterie électronique", "Composition"],
      "color": "blue"
    },
    {
      "name": "Cascades de Couleurs",
      "genres": ["Chillwave", "Ambient"],
      "description": "Une palette de couleurs sonores qui évoque des paysages naturels et des visions oniriques. Les harmonies sont douces et enveloppantes, invitant à la relaxation et à la méditation. J'ai créé les couches de synthé et de piano et je cherche à enrichir l'expérience sonore avec des effets de réverbération et de delay.",
      "date": "4/5/2023",
      "likes": 82,
      "skillsMissing": ["Mixage", "Effets spéciaux", "Production"],
      "skillsPresent": ["Synthétiseur", "Piano", "Composition"],
      "color": "green"
    },
    {
      "name": "Résonance Urbaine",
      "genres": ["Hip-hop", "Trap"],
      "description": "Une immersion dans l'énergie urbaine et les pulsations des rues. Les beats sont puissants, mêlant des éléments de hip-hop et de trap. J'ai créé les lignes de basse et de batterie et je recherche un beatmaker pour ajouter des loops et des samples percutants.",
      "date": "6/25/2023",
      "likes": 95,
      "skillsMissing": ["Beatmaking", "Enregistrement", "Mastering"],
      "skillsPresent": ["Basse", "Batterie", "Composition"],
      "color": "pink"
    },
    {
      "name": "Océan de Tranquillité",
      "genres": ["Ambient", "New age"],
      "description": "Une exploration sonore des profondeurs apaisantes de l'océan. Les harmonies sont douces et flottantes, évoquant la sérénité et la paix intérieure. J'ai créé les textures de synthé et de cordes et je recherche un flûtiste pour ajouter des mélodies aériennes.",
      "date": "8/10/2023",
      "likes": 88,
      "skillsMissing": ["Flûte", "Enregistrement", "Mixage"],
      "skillsPresent": ["Synthétiseur", "Violoncelle", "Composition"],
      "color": "orange"
    },
    {
      "name": "Éclats de Lumière",
      "genres": ["Pop", "Rock"],
      "description": "Une explosion d'énergie et de lumière à travers des mélodies pop-rock vibrantes. Les guitares électriques et les refrains puissants créent une ambiance électrisante. J'ai écrit les paroles et les lignes de guitare et je recherche un batteur pour apporter une rythmique dynamique.",
      "date": "10/5/2023",
      "likes": 87,
      "skillsMissing": ["Batterie", "Enregistrement", "Production"],
      "skillsPresent": ["Guitare électrique", "Chant", "Composition"],
      "color": "purple"
    },
    {
      "name": "Mirage de Glace",
      "genres": ["Electro", "Chill-out"],
      "description": "Une exploration des paysages glacés et des ambiances froides à travers la musique électronique. Les beats sont lents et enveloppants, créant une atmosphère de contemplation et de tranquillité. J'ai conçu les couches de synthé et de batterie et je cherche à ajouter des effets sonores et des samples de nature.",
      "date": "12/20/2023",
      "likes": 81,
      "skillsMissing": ["Mixage", "Effets spéciaux", "Sound design"],
      "skillsPresent": ["Synthétiseur", "Batterie électronique", "Composition"],
      "color": "blue"
    },
    {
      "name": "Éclats de Rire",
      "genres": ["Pop", "Indie"],
      "description": "Une célébration de la joie et de l'insouciance à travers des mélodies pop enjouées et des refrains entraînants. Les guitares acoustiques et les rythmes festifs invitent à danser et à sourire. J'ai écrit les paroles et les lignes de guitare et je recherche un batteur pour renforcer le groove.",
      "date": "2/1/2024",
      "likes": 94,
      "skillsMissing": ["Batterie", "Enregistrement", "Mixage"],
      "skillsPresent": ["Guitare acoustique", "Chant", "Composition"],
      "color": "red"
    },
    {
      "name": "Nuances de Gris",
      "genres": ["Trip hop", "Experimental"],
      "description": "Une exploration des nuances subtiles et des atmosphères sombres à travers des rythmes trip-hop et des textures expérimentales. Les samples et les boucles créent une ambiance introspective et captivante. J'ai créé les motifs de basse et de percussions et je cherche à enrichir le mixage avec des effets sonores et des filtres.",
      "date": "4/15/2023",
      "likes": 77,
      "skillsMissing": ["Mixage", "Effets spéciaux", "Production"],
      "skillsPresent": ["Basse", "Percussions", "Composition"],
      "color": "purple"
    },
    {
      "name": "Harmonies Célestes",
      "genres": ["Ambient", "New age"],
      "description": "Une exploration des harmonies célestes et des paysages intérieurs à travers la musique ambient et new age. Les synthétiseurs créent des textures immersives et relaxantes, invitant à l'introspection et à la méditation. J'ai créé les couches sonores principales et je recherche un guitariste pour ajouter des accents mélodiques.",
      "date": "6/30/2023",
      "likes": 89,
      "skillsMissing": ["Guitare", "Enregistrement", "Mastering"],
      "skillsPresent": ["Synthétiseur", "Piano", "Composition"],
      "color": "pink"
    },
    {
      "name": "Explorations Souterraines",
      "genres": ["Techno", "Minimal"],
      "description": "Une plongée profonde dans les beats minimalistes et les textures sonores de la musique techno. Les rythmes sont hypnotiques et enveloppants, créant une atmosphère de danse et d'exploration. J'ai conçu les motifs de synthé et de batterie et je cherche à enrichir le mixage avec des effets spatiaux et des filtres.",
      "date": "8/20/2023",
      "likes": 83,
      "skillsMissing": ["Mixage", "Effets spéciaux", "Mastering"],
      "skillsPresent": ["Synthétiseur", "Batterie électronique", "Composition"],
      "color": "orange"
    },
    {
      "name": "Voyages Éphémères",
      "genres": ["Ambient", "Experimental"],
      "description": "Une exploration sonore des voyages intérieurs et des paysages sonores éphémères. Les harmonies sont douces et flottantes, évoquant des émotions et des histoires invisibles. J'ai créé les textures de synthé et de percussion et je cherche à ajouter des éléments vocaux pour enrichir l'expérience auditive.",
      "date": "10/10/2023",
      "likes": 86,
      "skillsMissing": ["Chant", "Enregistrement", "Production"],
      "skillsPresent": ["Synthétiseur", "Percussions", "Composition"],
      "color": "green"
    },
    {
      "name": "Échos du Passé",
      "genres": ["Folk", "Indie"],
      "description": "Une ballade mélancolique qui reflète les souvenirs du passé et les moments perdus. Les guitares acoustiques et les harmonies vocales captivent l'auditeur dans une atmosphère intime et nostalgique. J'ai écrit les paroles et les lignes de guitare et je recherche un percussionniste pour enrichir la texture rythmique.",
      "date": "12/5/2023",
      "likes": 92,
      "skillsMissing": ["Batterie", "Percussions", "Enregistrement"],
      "skillsPresent": ["Guitare acoustique", "Chant", "Composition"],
      "color": "red"
    },
    {
      "name": "Aurores Boréales",
      "genres": ["Ambient", "Electronic"],
      "description": "Une exploration des lumières mystiques et des paysages sonores électroniques. Les synthétiseurs créent des atmosphères vibrantes et énergiques, invitant à un voyage cosmique. J'ai conçu les motifs de synthé et de basse et je cherche à enrichir l'expérience auditive avec des effets sonores spatiaux et des textures sonores profondes.",
      "date": "2/15/2024",
      "likes": 80,
      "skillsMissing": ["Mixage", "Effets spéciaux", "Mastering"],
      "skillsPresent": ["Synthétiseur", "Basse", "Composition"],
      "color": "blue"
    },
    {
      "name": "Soleil Couchant",
      "genres": ["Chill-out", "Lounge"],
      "description": "Une célébration de la fin de journée à travers des mélodies chillout et lounge. Les rythmes sont détendus et envoûtants, créant une ambiance de relaxation et de détente. J'ai créé les motifs de piano et de synthé et je cherche à enrichir l'expérience sonore avec des instruments à vent et des effets de réverbération.",
      "date": "4/1/2023",
      "likes": 76,
      "skillsMissing": ["Saxophone", "Enregistrement", "Production"],
      "skillsPresent": ["Piano", "Synthétiseur", "Composition"],
      "color": "green"
    }
  ]

  sendProjects() {

    return this.http.post<Project[]>('http://localhost:8080/api/v1/projects', this.mockProjects)
      .pipe(
        catchError(error => {
          if (error.status === 500) {
            console.table(this.mockProjects);
            return of(this.mockProjects);
          }
          throw error;
        })
      );
  }

  getProjects() {
    return this.http.get<Project[]>('https://groovegather-api.olprog-a.fr/api/v1/projects')
      .pipe(
        catchError(error => {
          if (error.status === 500) {
            return of(this.mockProjects);
          }
          throw error;
        })
      );
  }

  getProjectById() {

  }
}
