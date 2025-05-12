import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TranslateHtmlService } from '../services/translate-html.service';

@Component({
  selector: 'app-helpcomp',
  templateUrl: './helpcomp.component.html',
  styleUrls: ['./helpcomp.component.css'],
  standalone: true,  
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class HelpcompComponent {
  message: string | null = null;
  times:number = 0;
  constructor(private location: Location,
        private translateHtmlService: TranslateHtmlService,
  ) {} 

  // Array di risposte
  responses: string[] = [
    'www.chatGPT.com',
    'Chiedi allo staff',
    'Hai provato a riavviare?',
    'Spegni e riaccendi',
    'Chiedi a Mario',
    '118?',
    'Prova a spegnere',
    'Google?',
    'Prova a chiedere a Siri',
    'Fai un reset',
    'Controlla il router',
    'Controlla le impostazioni',
    'Ricarica la pagina',
    'Prova il cavo',
    'Cambia password',
    'Disabilita firewall',
    'Riavvia tutto',
    'Fatti un caffè',
    'Modalità provvisoria',
    'Vai su Reddit',
    'Riprova dopo',
    'Non è colpa tua',
    'C’è sempre un’altra opzione',
    'Non ti preoccupare, succede a tutti',
    'Fai due passi',
    'Domanda al supporto',
    'Fai una ricerca',
    'Speriamo vada',
    'Vai a dormire e riprova',
    'Server is Busy.',
    '?',
    '42.'
  ];

  ngOnInit() {

      const savedLanguage = localStorage.getItem('preferredLanguage');
      console.log('Saved Language:', savedLanguage); 

      if (savedLanguage) {
        console.log("Language found in localStorage:", savedLanguage);
        this.translateHtmlService.translateElements(savedLanguage);
      } else {
        console.log("No language found, setting to default");
        this.translateHtmlService.translateElements('en'); 
      }
  }
  
  onHelpClick(): void {
    const randomIndex = Math.floor(Math.random() * this.responses.length);
    this.message = this.responses[randomIndex];
    this.times++;
  

    if (this.times === 10) {
      const extraLongResponse = `🤖 Ho visto che forse hai davvero bisogno di aiuto. Ti darò qualche consiglio utile allora: Prova a disconnetterti da qualsiasi rete Wi-Fi disponibile, esegui un reset completo, poi aspetta 10 secondi e riprova. In alternativa, chiedi a Mario, oppure rilassati. A volte le cose si aggiustano da sole.`;
      this.message = extraLongResponse;
    }
    else if (this.times === 20)
    {
      const extraLongResponse = `🤖 Non trovi quello che cerchi? il mio consiglio è di tentare una strada diversa!`;
      this.message = extraLongResponse;

    }
    else if (this.times > 30)
    {
      const extraLongResponse = `🤖 500 ServerERROR`;
      this.message = extraLongResponse;

    }
    this.openModal();
  }

  openModal(): void {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'flex';
    }


    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  closeModal(): void {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  goBack(): void {
    this.location.back(); 
  }
}
