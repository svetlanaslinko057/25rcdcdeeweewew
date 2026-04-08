# Development OS - Product Requirements Document

## Project Overview
**Name:** Development OS / FOMO Dev OS  
**Type:** SaaS Web Platform  
**Tech Stack:** React + FastAPI + MongoDB  
**Date Started:** April 8, 2026

## Problem Statement
Development OS is an operating system for managed digital product development. It provides a unified managed layer between clients and production, where clients don't need to manage development themselves - the platform transforms their ideas into structured, controlled product delivery processes.

## Core Architecture

### User Roles
1. **Guest/Public User** - Views market, portfolio, cases, can start project
2. **Client** - Creates requests, views projects, approves deliverables, opens support
3. **Developer** - Receives assignments, logs work, submits results
4. **Tester** - Validates submissions, reports issues
5. **Admin** - Manages entire production pipeline

### Key Layers
1. **Public Layer (Market)** - Landing page, portfolio, case studies, testimonials
2. **Client Layer** - Requests, projects, deliverables, approvals, support
3. **Production Layer** - Scope items, work units, assignments, work logs, submissions
4. **Quality Layer** - Reviews, validation tasks, issues
5. **Control Layer** - Admin dashboard, work board, review queue

### Production Flow
```
Request → Product Definition → Scope → Scope Items → Project → Stages → 
Work Units → Assignment → Work Log → Submission → Admin Review → 
Tester Validation → Deliverable → Client Approval → Release → Support → Version
```

## What's Been Implemented

### Phase 1 - MVP (April 8, 2026)
- [x] **Landing Page** - artone.studio style, clean minimal design
- [x] **All content in ENGLISH** 
- [x] Hero: "From idea to product. No chaos."
- [x] About: "Between a client's idea and a finished product lies chaos"
- [x] Statement: "Not a studio. Not a marketplace. An operating system."
- [x] Process: 6 steps (Request → Product Definition → Scope → Production → Review & Validation → Deliverable)
- [x] Key Principle: Client ↔ Platform ↔ Internal Team
- [x] Roles: Client, Developer, Tester, Admin
- [x] Production Engine: Product Core, Production Core, Lifecycle Core
- [x] Pricing: Monthly Retainer ($4,000+) and Custom Project
- [x] FAQ: 5 questions about the platform
- [x] Images from Unsplash, professional photography
- [x] Google OAuth authentication (Emergent-managed)
- [x] Client/Developer/Tester/Admin Dashboards
- [x] Full backend API with all CRUD operations

### Backend Endpoints Implemented
- Auth: `/api/auth/session`, `/api/auth/me`, `/api/auth/logout`, `/api/auth/role`
- Public: `/api/`, `/api/stats`, `/api/portfolio/cases`, `/api/portfolio/featured`
- Client: `/api/requests`, `/api/projects/mine`, `/api/projects/{id}`, `/api/projects/{id}/deliverables`, `/api/deliverables/{id}/approve`, `/api/deliverables/{id}/reject`, `/api/projects/{id}/support`
- Developer: `/api/developer/assignments`, `/api/developer/work-units`, `/api/work-units/{id}/log`, `/api/work-units/{id}/submit`
- Tester: `/api/tester/validation-tasks`, `/api/validation/{id}/pass`, `/api/validation/{id}/fail`, `/api/validation/{id}/issue`
- Admin: Full user, project, request, scope, work unit, assignment, review, validation, deliverable management

### Database Collections
- users, user_sessions
- requests, product_definitions
- scopes, scope_items
- projects, work_units
- assignments, work_logs
- submissions, reviews
- validation_tasks, validation_issues
- deliverables, support_tickets
- portfolio_cases

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Scope Builder UI for Admin
- [ ] Work Unit assignment workflow
- [ ] Review and approval workflow
- [ ] Email notifications for status changes

### P1 - High Priority
- [ ] Real-time updates with WebSocket
- [ ] File attachments for submissions
- [ ] Client messaging system
- [ ] Developer performance metrics
- [ ] Tester accuracy tracking

### P2 - Medium Priority
- [ ] Invoice generation
- [ ] Time tracking reports
- [ ] Project analytics dashboard
- [ ] Custom project templates
- [ ] API documentation

### P3 - Future
- [ ] Mobile companion app
- [ ] Telegram Mini App integration
- [ ] AI-powered scope estimation
- [ ] Automated testing integration
- [ ] Client portal customization

## User Personas

### Maria - Startup Founder (Client)
- Needs to build MVP quickly
- Doesn't know technical details
- Wants transparent process

### Alex - Full-Stack Developer
- Wants clear task specifications
- Prefers minimal client interaction
- Appreciates fair workload distribution

### Sam - QA Tester
- Focused on user experience
- Systematic approach to testing
- Values clear pass/fail criteria

### Jordan - Platform Admin
- Manages entire operation
- Needs overview of all activities
- Makes resource allocation decisions

## Technical Notes
- Authentication: Emergent-managed Google OAuth
- Session management: httpOnly cookies with 7-day expiry
- Database: MongoDB with custom user_id (not _id)
- CORS: Configured for production URL
- Hot reload enabled for development
