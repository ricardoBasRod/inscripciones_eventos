import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

type ThemeId = 'bosque' | 'oceano' | 'arena' | 'esmeralda';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly themes: { id: ThemeId; name: string }[] = [
    { id: 'bosque', name: 'Bosque' },
    { id: 'oceano', name: 'Océano' },
    { id: 'arena', name: 'Arena' },
    { id: 'esmeralda', name: 'Esmeralda' }
  ];

  selectedTheme: ThemeId = 'bosque';
  themeStorageMessage = '';

  ngOnInit(): void {
    try {
      const savedTheme = localStorage.getItem('event-management-theme');
      const theme = this.themes.find(({ id }) => id === savedTheme);
      if (theme) {
        this.selectedTheme = theme.id;
      }
    } catch {
      this.themeStorageMessage = 'El diseño seleccionado solo estará disponible durante esta sesión.';
    }
  }

  changeTheme(event: Event): void {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement)) {
      return;
    }

    const theme = this.themes.find(({ id }) => id === select.value);
    if (!theme) {
      return;
    }

    this.selectedTheme = theme.id;
    this.themeStorageMessage = '';
    try {
      localStorage.setItem('event-management-theme', theme.id);
    } catch {
      this.themeStorageMessage = 'No se pudo guardar el diseño; solo estará disponible durante esta sesión.';
    }
  }
}
