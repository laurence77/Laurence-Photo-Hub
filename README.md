# Laurence Photo Hub

Production-grade mobile and web app for private premium event media sharing with Apple Glass aesthetic.

## 🚀 Live Demo

### Public Site
- **URL**: [https://laurence77.github.io/Laurence-Photo-Hub/](https://laurence77.github.io/Laurence-Photo-Hub/)
- **Description**: Main landing page with features, gallery, and public events

### Admin Panel
- **URL**: [https://laurence77.github.io/Laurence-Photo-Hub/#/admin](https://laurence77.github.io/Laurence-Photo-Hub/#/admin)
- **Username**: `laurence@laurence`
- **Password**: `12345`
- **Description**: B2B/B2C management system with analytics, settings, and administrative controls

### User Login
- **URL**: [https://laurence77.github.io/Laurence-Photo-Hub/](https://laurence77.github.io/Laurence-Photo-Hub/)
- **Username**: `laurence@laurence`
- **Password**: `12345`
- **Description**: User dashboard with event access and photo management

## Overview

Build a comprehensive photo sharing platform with clean whites, subtle translucency, soft gradients, elegant motion, San Francisco typography, and high contrast focus states. Support iOS, Android, and web platforms.

## Core Features

### Events & Permissions
- **Roles**: Organizer, photographer, guest
- **Per-event permissions**: view, upload, moderate, download, share
- **Privacy**: Private by default
- **Access methods**: QR codes, NFC tags, links, or invite codes

### Media Management
- **Formats**: Photos and short videos with HEIC, ProRAW, HDR support
- **Upload**: Background uploads, resumable transfers, client-side compression
- **Processing**: Server-side optimization, perceptual deduplication

### Real-time Features
- Live photo wall
- AI-generated highlights reel
- Slideshow with music
- Reactions and comment threads
- Smart moderation queue

### Privacy & Security
- End-to-end encryption (at rest and in transit)
- Organizer-controlled retention policies
- One-tap access revoke
- Optional watermarking
- View-only mode
- Per-event audit logs
- Scoped JWT tokens
- Device keychain storage
- Biometric authentication

## Architecture

### Mobile
- **Framework**: React Native
- **Native features**: Photos access, AirDrop, WiFi Direct, Bluetooth, Share Sheet

### Web
- **Framework**: Next.js with App Router
- **Features**: Server Actions, Web Share API, PWA capabilities

### Backend Options
**Option A**: Firebase (Auth, Firestore, Cloud Functions, GCS) + Cloudflare CDN
**Option B**: Supabase (Auth, Postgres, Storage, RLS) + S3-compatible storage

### AI Pipeline
- On-device: Core ML or MediaPipe for face clustering, quality scoring
- Server-side: Python workers for highlight selection and processing

### Monitoring
- OpenTelemetry
- Sentry error tracking
- Basic product analytics

## Sharing & Export

1. **Native sharing**: AirDrop (iOS/visionOS), WiFi Direct/Nearby Share (Android)
2. **Cross-platform**: Web Share API, deep links, QR codes, NFC tags
3. **Cloud exports**: iCloud Drive, Google Drive, Dropbox, OneDrive
4. **Secure packages**: Time-boxed signed URLs with optional PIN and watermarks
5. **Offline support**: LAN hub mode for venues without internet

## Monetization

### Subscription Plans
- **Free**: Basic features with limits
- **Pro**: Extended storage and features
- **Teams**: Organization management and white-label options

### Payment Integration
- **Global**: Stripe
- **Africa**: Paystack (Nigeria, Ghana, South Africa)
- **Mobile**: Apple In-App Purchase, Google Play Billing
- **Features**: Trials, metered storage, coupons, VAT handling

### Unified Billing
Single domain model supporting multiple payment providers with identical subscription semantics.

## Data Models

### Core Entities
- User, Organization, Event, Membership
- MediaAsset, Comment, Reaction, SharePackage
- BillingCustomer, Subscription, Invoice, AuditEntry

### Key Fields
**MediaAsset**: id, event_id, uploader_id, type, formats, ai_tags, faces_hash, blurhash, storage_key, checksum, timestamps, access_policy

**SharePackage**: signed_url, scopes, watermark, pin_hash, max_views, expiration

## Quality Assurance

### Testing Requirements
1. Payment integration testing (Stripe/Paystack sandbox)
2. Cross-platform sharing functionality
3. Network resilience (200 photos on poor connection)
4. Security (signed URLs, PIN protection)
5. Accessibility and internationalization
6. GDPR compliance (data export, right to be forgotten)

### Test Coverage
- Unit tests: billing service, link signing, media pipeline
- E2E tests: complete user flows from event creation to sharing

## Future Roadmap

1. **Enhanced capture**: Guest camera overlay with quality hints
2. **AI features**: Private copilot for curation and duplicate detection
3. **Venue integration**: TV slideshow casting for events
4. **Marketplace**: Professional photographer platform with escrow
5. **Enterprise**: SSO, brand kits, white-label solutions
6. **Communication**: SMS/WhatsApp invites via Twilio/Termii
7. **Content licensing**: Revenue sharing for public events
8. **Privacy tools**: On-device face/badge redaction