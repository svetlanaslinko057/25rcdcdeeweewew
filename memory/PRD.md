# Development OS - Product Requirements Document

## Project Overview
**Name:** Development OS  
**Type:** SaaS Web Platform - Production Machine  
**Tech Stack:** React + FastAPI + MongoDB  
**Date Started:** April 8, 2026  
**Last Updated:** April 8, 2026

## Problem Statement
Development OS is an operating system for managed digital product development. The platform transforms client ideas into structured, controlled product delivery processes through a complete production pipeline.

## Core Architecture

### Web-first Platform Entry (IMPLEMENTED)

**Three Independent Auth Contours:**

1. **Client Flow**
   - `/client/auth` → Sign In / Register / Demo
   - `/client/dashboard` → Projects, Requests, Deliverables
   - `/client/request/new` → Create new request
   - `/client/projects/:id` → Project details

2. **Builder Flow**  
   - `/builder/auth` → Sign In / Register (role selection) / Demo
   - `/developer/dashboard` → Assignments, Work Units, Performance
   - `/tester/dashboard` → Validation Tasks, Issues, History

3. **Admin Flow**
   - `/admin/login` → Admin auth
   - `/admin/dashboard` → Full production control center
   - `/admin/scope-builder/:id` → Scope Builder wizard
   - `/admin/work-unit/:id` → Work Unit with Assignment Panel
   - `/admin/deliverable/:id` → Deliverable Builder

### User Roles
1. **Client** - Creates requests, views projects, approves deliverables
2. **Developer** - Receives assignments, logs work, submits results
3. **Tester** - Validates submissions, reports issues
4. **Admin** - Manages entire production pipeline

## Production Pipeline

```
Client Request (via /client/request/new)
  ↓
Admin: Product Definition (via Scope Builder)
  ↓
Admin: Scope + ScopeItems (via Scope Builder)
  ↓
Admin: WorkUnits (via Scope Builder)
  ↓
Assignment Engine → Developer (scored matching)
  ↓
Developer: WorkLog + Submission
  ↓
Admin: Review
  ↓
Tester: Validation
  ↓
Admin: Deliverable → Client
  ↓
Client: Approval / Support
```

## What's Been Implemented

### Phase 1 - Core Platform
- [x] Landing Page with original design
- [x] Entry Flow (two CTA buttons)

### Phase 2 - Auth Architecture (Current)
- [x] **Client Auth Page** - Sign In / Register / Demo Access
- [x] **Builder Auth Page** - Sign In / Multi-step Register (role + skills) / Demo
- [x] **Admin Login Page** - Auth / Demo Access
- [x] **Full Auth Backend:**
  - `POST /api/auth/register` - Registration with role
  - `POST /api/auth/login` - Email/password login
  - `POST /api/auth/demo` - Quick demo access (creates temp user)
  - `GET /api/auth/me` - Session check
  - `POST /api/auth/logout` - Logout

### Phase 3 - Production Machine
- [x] **Scope Builder** (4-step wizard)
- [x] **Assignment Engine** (scoring system)
- [x] **Deliverable Builder**

### Phase 4 - Dashboards
- [x] **Client Dashboard** - Projects, Requests, Stats
- [x] **Developer Dashboard** - Assignments, Work Units, Performance
- [x] **Tester Dashboard** - Validation Tasks, History
- [x] **Admin Dashboard** - Work Board, Requests, Review Queue, Users

## URL Structure

```
/                     → Landing
/client/auth          → Client Sign In / Register
/client/dashboard     → Client workspace
/client/request/new   → Create request
/client/projects/:id  → Project details

/builder/auth         → Builder Sign In / Register
/developer/dashboard  → Developer workspace
/tester/dashboard     → Tester workspace

/admin/login          → Admin auth
/admin/dashboard      → Admin control center
/admin/scope-builder/:id
/admin/work-unit/:id
/admin/deliverable/:id
```

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Developer work submission flow
- [ ] Admin review workflow UI
- [ ] Tester validation flow
- [ ] Real-time notifications

### P1 - High Priority
- [ ] Password reset flow
- [ ] Email notifications
- [ ] File attachments
- [ ] Client messaging

### P2 - Medium Priority
- [ ] Time tracking reports
- [ ] Project analytics
- [ ] Developer performance metrics
- [ ] Invoice generation

### P3 - Future
- [ ] AI-powered scope estimation
- [ ] Mobile app
- [ ] Telegram Mini App

## Technical Notes
- Auth: Email/password with SHA-256 hashing (upgrade to bcrypt for production)
- Sessions: httpOnly cookies, 7-day expiry (1-day for demo)
- Database: MongoDB with custom IDs
- Assignment: Weighted scoring formula

## URLs
- Frontend: https://auth-platform-20.preview.emergentagent.com
- API: https://auth-platform-20.preview.emergentagent.com/api
