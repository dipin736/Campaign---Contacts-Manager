# Campaign & Contacts Manager

A modern, premium administrative portal built in Angular 17. This application serves as a dashboard for marketing operations, allowing managers to compose rich promotional messages and manage client contact directories with full data validation and remote database integration.

---

## Core Modules

### 1. Contact Directory (`/contacts`)
- **Profile Management**: Full CRUD operations for client profiles (First Name, Last Name, Email, Age, Gender, Mobile).
- **Tax & Identity Verification**: Inputs with custom regex validation for official Indian identifiers:
  - **PAN Card**: Format validation (`ABCDE1234F`).
  - **Aadhaar Card**: 12-digit numeric UID validation.
- **Search & Filters**: Instant name/email search and status filtering (All, Active, Inactive).
- **Detail View**: Interactive modal popups to view individual profile card details.

### 2. Message Composer (`/message-composer`)
- **Template Customization**: Live customizer for rich media campaigns (Diwali Sale Promo).
- **Media Previews**: Supports image URL, video URL (.mp4), and document URL (.pdf) attachments with automatic visual previews inside a mock phone screen.
- **Dynamic Variables**: Interactive popover search to insert standard and custom profile placeholders into the message template text.
- **Location Tagging**: Precise coordinate (latitude/longitude) verification.

---

## Technical Stack

- **Framework**: Angular 17 (utilizing Standalone Components, Signals, and reactive architectures).
- **Forms**: Reactive Forms API with advanced sync validators.
- **Icons**: `@lucide/angular` standalone components for vector visuals.
- **Styling**: Pure CSS design system with custom variables, smooth transitions, skeleton loaders, and responsive layouts.
- **API**: Configured for remote asynchronous RESTful operations.

---

## Getting Started

### Installation
```bash
npm install
```

### Running Locally
```bash
npm start
# or
ng serve
```
Open [http://localhost:4200](http://localhost:4200) to view the portal in your browser.

### Build Production Bundle
```bash
npm run build
# or
ng build
```
Build assets will be outputted to the `dist/angular-assignment` directory.
