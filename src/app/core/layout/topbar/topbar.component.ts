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

  roleBadgeClass = computed(() => {
    const role = this.currentUser()?.role;
    switch (role) {
      case 'Admin': return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800';
      case 'SupportAgent': return 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800';
      case 'Customer': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
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
