import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContactService, Contact } from '../../services/contact.service';
import { ToastService } from '../../services/toast.service';
import { LucideEye, LucideSquarePen, LucideTrash2, LucideEllipsisVertical } from '@lucide/angular';

@Component({
  selector: 'app-contact-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideEye, LucideSquarePen, LucideTrash2, LucideEllipsisVertical],
  templateUrl: './contact-manager.component.html',
  styleUrl: './contact-manager.component.css'
})
export class ContactManagerComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  
  isLoading = false;
  isSaving = false;
  isDrawerOpen = false;
  showDeleteModal = false;

  contactForm!: FormGroup;
  searchQuery = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  editingContactId: string | null = null;
  deletingContactId: string | null = null;
  selectedContactForView: Contact | null = null;
  showViewModal = false;
  activeDropdownId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private toastService: ToastService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadContacts();
  }

  private initForm() {
    this.contactForm = this.fb.group({
      first_name: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z\\s]+$'),
        Validators.minLength(2)
      ]],
      last_name: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z\\s]+$'),
        Validators.minLength(2)
      ]],
      emailId: ['', [
        Validators.required, 
        Validators.email
      ]],
      age: ['', [
        Validators.required, 
        Validators.min(1), 
        Validators.max(120),
        Validators.pattern('^[0-9]+$')
      ]],
      gender: ['', [
        Validators.required
      ]],
      mobilenumber: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{10}$')
      ]],
      pan_no: ['', [
        Validators.required, 
        Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
      ]],
      adhaar_no: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{12}$')
      ]],
      status: [true]
    });
  }

  loadContacts() {
    this.isLoading = true;
    this.contactService.getAll().subscribe({
      next: (data) => {
        this.contacts = data.reverse();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching contacts:', err);
        this.toastService.error('Failed to load contacts. Please verify mockapi connectivity.');
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredContacts = this.contacts.filter(contact => {
      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        contact.first_name.toLowerCase().includes(q) ||
        contact.last_name.toLowerCase().includes(q) ||
        contact.emailId.toLowerCase().includes(q);

      let matchesStatus = true;
      if (this.statusFilter === 'active') {
        matchesStatus = contact.status === true;
      } else if (this.statusFilter === 'inactive') {
        matchesStatus = contact.status === false;
      }

      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  openAddDrawer() {
    this.editingContactId = null;
    this.contactForm.reset({ status: true, gender: '' });
    this.isDrawerOpen = true;
  }

  openEditDrawer(contact: Contact) {
    if (!contact.id) return;
    this.isLoading = true;
    this.contactService.getById(contact.id).subscribe({
      next: (data) => {
        this.editingContactId = data.id || null;
        this.contactForm.patchValue({
          first_name: data.first_name,
          last_name: data.last_name,
          emailId: data.emailId,
          age: data.age,
          gender: data.gender,
          mobilenumber: data.mobilenumber,
          pan_no: data.pan_no?.toUpperCase(),
          adhaar_no: data.adhaar_no,
          status: data.status
        });
        this.isDrawerOpen = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching contact by ID:', err);
        this.toastService.error('Failed to fetch contact details.');
        this.isLoading = false;
      }
    });
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.editingContactId = null;
  }

  saveContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.toastService.warning('Please correct the validation errors in the form.');
      return;
    }

    this.isSaving = true;
    const formValue = this.contactForm.value;
    
    const contactData: Contact = {
      first_name: formValue.first_name.trim(),
      last_name: formValue.last_name.trim(),
      emailId: formValue.emailId.trim().toLowerCase(),
      age: Number(formValue.age),
      gender: formValue.gender,
      mobilenumber: Number(formValue.mobilenumber),
      pan_no: formValue.pan_no.trim().toUpperCase(),
      adhaar_no: formValue.adhaar_no.toString().trim(),
      status: formValue.status
    };

    if (this.editingContactId) {
      this.contactService.update(this.editingContactId, contactData).subscribe({
        next: () => {
          this.toastService.success('Contact updated successfully!');
          this.loadContacts();
          this.closeDrawer();
          this.isSaving = false;
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to update contact.');
          this.isSaving = false;
        }
      });
    } else {
      this.contactService.create(contactData).subscribe({
        next: () => {
          this.toastService.success('Contact created successfully!');
          this.loadContacts();
          this.closeDrawer();
          this.isSaving = false;
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to create contact.');
          this.isSaving = false;
        }
      });
    }
  }

  confirmDelete(id: string | undefined) {
    if (id) {
      this.deletingContactId = id;
      this.showDeleteModal = true;
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingContactId = null;
  }

  deleteContact() {
    if (!this.deletingContactId) return;

    this.isLoading = true;
    this.contactService.delete(this.deletingContactId).subscribe({
      next: () => {
        this.toastService.success('Contact deleted successfully.');
        this.loadContacts();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to delete contact.');
        this.isLoading = false;
        this.closeDeleteModal();
      }
    });
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedContactForView = null;
  }

  viewContact(id: string | undefined) {
    if (!id) return;
    this.isLoading = true;
    this.contactService.getById(id).subscribe({
      next: (data) => {
        this.selectedContactForView = data;
        this.showViewModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error viewing contact detail:', err);
        this.toastService.error('Failed to load contact profile detail.');
        this.isLoading = false;
      }
    });
  }

  toggleDropdown(id: string | undefined, event: Event) {
    if (!id) return;
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  @HostListener('document:click')
  closeAllDropdowns() {
    this.activeDropdownId = null;
  }

}
