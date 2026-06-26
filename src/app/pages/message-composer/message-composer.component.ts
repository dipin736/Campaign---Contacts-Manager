import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

interface Attribute {
  name: string;
  placeholder: string;
}

@Component({
  selector: 'app-message-composer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-composer.component.html',
  styleUrl: './message-composer.component.css'
})
export class MessageComposerComponent {
  imageUrl = '';
  videoUrl = '';
  documentUrl = '';
  latitude = 0;
  longitude = 0;


  variable1 = '';
  variable2 = '';


  yesPayload = '';
  noPayload = '';
  unsubscribePayload = '';
  visitWebsiteParam = '';


  activeVariableIndex: 1 | 2 | null = null;
  searchQuery = '';
  activeTab: 'standard' | 'custom' = 'standard';

  standardAttributes = [
    'First name',
    'Last name',
    'Address',
    'City',
    'Country',
    'Gender'
  ];

  customAttributes = [
    'Company Name',
    'Account Number',
    'Last Purchase Date',
    'Loyalty Tier'
  ];

  constructor(private toastService: ToastService) {}

  togglePopover(index: 1 | 2, event: Event) {
    event.stopPropagation();
    if (this.activeVariableIndex === index) {
      this.activeVariableIndex = null;
    } else {
      this.activeVariableIndex = index;
      this.searchQuery = '';
      this.activeTab = 'standard';
    }
  }

  closePopover() {
    this.activeVariableIndex = null;
  }

  setTab(tab: 'standard' | 'custom') {
    this.activeTab = tab;
  }

  get filteredAttributes(): string[] {
    const list = this.activeTab === 'standard' ? this.standardAttributes : this.customAttributes;
    if (!this.searchQuery.trim()) return list;
    return list.filter(attr => attr.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  selectAttribute(attr: string) {
    const placeholder = `{{${attr}}}`;
    if (this.activeVariableIndex === 1) {
      this.variable1 = this.variable1 + placeholder;
    } else if (this.activeVariableIndex === 2) {
      this.variable2 = this.variable2 + placeholder;
    }
    this.closePopover();
    this.toastService.info(`Inserted variable attribute: ${attr}`);
  }

  onCancel() {
    this.imageUrl = '';
    this.videoUrl = '';
    this.documentUrl = '';
    this.latitude = 0;
    this.longitude = 0;
    this.variable1 = '';
    this.variable2 = '';
    this.yesPayload = '';
    this.noPayload = '';
    this.unsubscribePayload = '';
    this.visitWebsiteParam = '';
    this.toastService.info('Form customization cleared.');
  }

  onSave() {

    if (this.latitude < -90 || this.latitude > 90) {
      this.toastService.error('Latitude must be between -90 and 90');
      return;
    }
    if (this.longitude < -180 || this.longitude > 180) {
      this.toastService.error('Longitude must be between -180 and 180');
      return;
    }

    const payload = {
      template: {
        name: 'Diwali Sale',
        id: '5796525651493',
        type: 'Text and Rich Media',
        language: 'English'
      },
      header: {
        imageUrl: this.imageUrl,
        videoUrl: this.videoUrl,
        documentUrl: this.documentUrl,
        location: {
          latitude: this.latitude,
          longitude: this.longitude
        }
      },
      message: {
        variable1: this.variable1,
        variable2: this.variable2
      },
      buttons: {
        yesPayload: this.yesPayload,
        noPayload: this.noPayload,
        unsubscribePayload: this.unsubscribePayload,
        visitWebsiteParam: this.visitWebsiteParam
      }
    };

    console.log('Saved Msg', payload);
    this.toastService.success('Message configuration saved successfully!');
  }
}
