import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  
  isOpenMobile = input<boolean>(false);
  collapsed = input<boolean>(false);
  
  closeMobile = output<void>();

  currentUser = this.accountService.currentUser;

  navItems = computed(() => {
    const role = this.currentUser()?.role;
    if (role === 'Admin') {
      return [
        { label: 'Dashboard', icon: 'layout-dashboard', route: '/dashboard' },
        { label: 'Tickets', icon: 'ticket', route: '/tickets' },
        { label: 'Users', icon: 'users', route: '/users' }
      ];
    }
    return [
      { label: 'My Tickets', icon: 'ticket', route: '/tickets' }
    ];
  });

  logout() {
    this.accountService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  onBackdropClick() {
    this.closeMobile.emit();
  }

  onItemClick() {
    this.closeMobile.emit();
  }
}
