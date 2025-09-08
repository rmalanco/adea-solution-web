import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBox, faFolder, faPlus, faEdit, faTrash, faEye, faBars,
  faDatabase, faChevronRight, faDownload
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    FontAwesomeModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ADEA Solution - Gestión de Cajas y Expedientes';
  
  // Font Awesome icons
  faBox = faBox;
  faFolder = faFolder;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faBars = faBars;
  faDatabase = faDatabase;
  faChevronRight = faChevronRight;
  faDownload = faDownload;
}
