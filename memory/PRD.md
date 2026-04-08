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

### Entry Flow
Two paths from Landing Page:
1. **"I want to build a product"** → Client Auth → Client Dashboard
2. **"I want to work on projects"** → Builder Auth (skill selection) → Developer/Tester Dashboard

### User Roles
1. **Client** - Creates requests, views projects, approves deliverables
2. **Developer** - Receives assignments, logs work, submits results
3. **Tester** - Validates submissions, reports issues
4. **Admin** - Manages entire production pipeline via Scope Builder & Assignment Engine

## Production Pipeline (IMPLEMENTED)

```
Request (Client)
  ↓
ProductDefinition (Admin via Scope Builder)
  ↓
Scope + ScopeItems (Admin via Scope Builder)
  ↓
WorkUnits (Admin via Scope Builder)
  ↓
Assignment Engine → Developer
  ↓
WorkLog + Submission (Developer)
  ↓
Review (Admin)
  ↓
Validation → Tester
  ↓
Deliverable → Client
  ↓
Approval / Support
```

## What's Been Implemented

### Phase 1 - Core Platform (April 8, 2026)
- [x] Landing Page with original design + Entry Flow
- [x] Quick Auth (email-based, session cookies)
- [x] Client/Developer/Tester/Admin Dashboards
- [x] New Request Page

### Phase 2 - Production Machine (April 8, 2026)
- [x] **SCOPE BUILDER** - 4-step flow:
  - Step 1: Product Overview (type, goal, audience, timeline)
  - Step 2: Scope Items (features with auto-generation hints)
  - Step 3: Work Units (breakdown with hour estimates)
  - Step 4: Review & Launch (creates ProductDefinition, Scope, ScopeItems, WorkUnits, Project)

- [x] **ASSIGNMENT ENGINE** - Developer scoring system:
  - Skill match (30%)
  - Level score (20%)
  - Rating (20%)
  - Load availability (15%)
  - Experience (10%)
  - Speed (5%)
  - Top 5 candidates with reasons
  - "Assign Best Match" auto-assignment

- [x] **DELIVERABLE BUILDER** - Results delivery:
  - Link completed work units
  - Add resource links
  - Send to client for approval

### Backend Endpoints (NEW)
**Assignment Engine:**
- `GET /api/admin/assignment-engine/{work_unit_id}/candidates` - Get ranked candidates
- `POST /api/admin/assignment-engine/{work_unit_id}/assign` - Assign to specific dev
- `POST /api/admin/assignment-engine/{work_unit_id}/assign-best` - Auto-assign best

**Deliverables:**
- `POST /api/admin/deliverable` - Create deliverable (JSON body)

### Frontend Routes (NEW)
- `/admin/scope-builder/:requestId` - Scope Builder wizard
- `/admin/work-unit/:unitId` - Work Unit detail with Assignment Panel
- `/admin/deliverable/:projectId` - Deliverable creation

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Developer work log UI
- [ ] Developer submission flow
- [ ] Admin review flow with feedback
- [ ] Tester validation flow

### P1 - High Priority
- [ ] Email notifications
- [ ] Real-time updates (WebSocket)
- [ ] Client messaging/support system
- [ ] File attachments

### P2 - Medium Priority
- [ ] Time tracking reports
- [ ] Project analytics dashboard
- [ ] Developer performance metrics
- [ ] Invoice generation

### P3 - Future
- [ ] AI-powered scope estimation
- [ ] Mobile companion app
- [ ] Telegram Mini App integration

## Technical Notes
- Authentication: Email-based quick auth (session cookie)
- Session: httpOnly cookies, 7-day expiry
- Database: MongoDB with custom IDs
- Assignment scoring: Weighted formula for developer matching
- Auto-generation: Work units auto-suggested based on scope item type

## URLs
- Frontend: https://auth-platform-20.preview.emergentagent.com
- API: https://auth-platform-20.preview.emergentagent.com/api
