import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  mobileSidebarOpen = false;
  
  private readonly SIDEBAR_STATE_KEY = 'ticketHub_sidebar_collapsed';

  ngOnInit() {
    const savedState = localStorage.getItem(this.SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      this.sidebarCollapsed = savedState === 'true';
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem(this.SIDEBAR_STATE_KEY, String(this.sidebarCollapsed));
  }
}
