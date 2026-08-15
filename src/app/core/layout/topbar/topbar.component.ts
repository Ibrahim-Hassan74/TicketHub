import { Component, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);

  openMobileMenu = output<void>();
  toggleCollapse = output<void>();

  currentUser = this.accountService.currentUser;
  
  isDropdownOpen = false;

  userInitials = computed(() => {
    const name = this.currentUser()?.displayName || '';
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  roleIndicatorClass = computed(() => {
    const role = this.currentUser()?.role;
    switch (role) {
      case 'Admin': return 'bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.5)]';
      case 'SupportAgent': return 'bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.5)]';
      case 'Customer': return 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]';
      default: return 'bg-slate-500 dark:bg-slate-400';
    }
  });

  onOpenMobileMenu() {
    this.openMobileMenu.emit();
  }
  
  onToggleCollapse() {
      this.toggleCollapse.emit();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    this.accountService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
