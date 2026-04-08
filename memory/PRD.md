# Development OS - Product Requirements Document

## Project Overview
**Name:** Development OS  
**Type:** SaaS Web Platform  
**Tech Stack:** React + FastAPI + MongoDB  
**Date Started:** April 8, 2026  
**Last Updated:** April 8, 2026

## Problem Statement
Development OS is an operating system for managed digital product development. It provides a unified managed layer between clients and production, where clients don't need to manage development themselves - the platform transforms their ideas into structured, controlled product delivery processes.

## Core Architecture

### Entry Flow (IMPLEMENTED)
Two paths from Entry Page:
1. **"I want to build a product"** → Client Auth → Client Dashboard
2. **"I want to work on projects"** → Builder Auth (skill selection) → Developer/Tester Dashboard

### User Roles
1. **Client** - Creates requests, views projects, approves deliverables
2. **Developer** - Receives assignments, logs work, submits results
3. **Tester** - Validates submissions, reports issues
4. **Admin** - Manages entire production pipeline

### Key Principle
**Client ↔ Platform ↔ Internal Team**
- Clients don't communicate directly with developers
- Role determined by actions, not explicit selection

## What's Been Implemented

### Phase 1 - Core Structure (April 8, 2026)
- [x] **Entry Page** - Two paths: build product / work on projects
- [x] **Quick Auth** - Email-based, no complex OAuth required
- [x] **Client Auth Flow** - Email → Onboarding (name, company) → Dashboard
- [x] **Builder Auth Flow** - Skill selection → Email → Onboarding → Dashboard
- [x] **Client Dashboard** - Projects, requests, new request button, stats
- [x] **Developer Dashboard** - Assignments, work units, performance metrics
- [x] **Tester Dashboard** - Validation tasks, pass/fail, issues, history
- [x] **Admin Dashboard** - Work board, requests, projects, review queue, users
- [x] **New Request Page** - Single textarea for idea, example ideas
- [x] **Project Details Page** - Progress, updates, deliverables, actions

### Backend Endpoints (IMPLEMENTED)
**Auth:**
- `POST /api/auth/quick` - Check/create user session
- `POST /api/auth/onboarding` - Complete user registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/role` - Admin: change user role

**Public:**
- `GET /api/` - API version
- `GET /api/stats` - Platform statistics
- `GET /api/portfolio/cases` - Portfolio cases
- `GET /api/portfolio/featured` - Featured cases

**Client:**
- `POST /api/requests` - Create request
- `GET /api/requests` - Get my requests
- `GET /api/projects/mine` - Get my projects
- `GET /api/projects/{id}` - Project details
- `GET /api/projects/{id}/deliverables` - Deliverables
- `POST /api/deliverables/{id}/approve` - Approve
- `POST /api/deliverables/{id}/reject` - Reject
- `POST /api/projects/{id}/support` - Create support ticket

**Developer:**
- `GET /api/developer/assignments` - My assignments
- `GET /api/developer/work-units` - My work units
- `POST /api/work-units/{id}/log` - Log hours
- `POST /api/work-units/{id}/submit` - Submit work

**Tester:**
- `GET /api/tester/validation-tasks` - My validations
- `POST /api/validation/{id}/pass` - Pass validation
- `POST /api/validation/{id}/fail` - Fail validation
- `POST /api/validation/{id}/issue` - Create issue

**Admin:**
- Full CRUD for users, requests, projects, scopes, work units, assignments, reviews, validations, deliverables

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

## Production Flow
```
Client Request 
  → Admin: Product Definition 
  → Admin: Scope + Items 
  → Admin: Project 
  → Admin: Work Units 
  → Admin: Assignment → Developer
  → Developer: Work Log + Submission
  → Admin: Review
  → Admin: Validation → Tester
  → Tester: Pass/Fail
  → Admin: Deliverable → Client
  → Client: Approve/Reject
```

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Scope Builder UI for Admin
- [ ] Work Unit assignment workflow UI
- [ ] Review and approval workflow UI
- [ ] Deliverable creation flow

### P1 - High Priority
- [ ] Email notifications
- [ ] Real-time updates with WebSocket
- [ ] Client messaging system
- [ ] File attachments

### P2 - Medium Priority
- [ ] Time tracking reports
- [ ] Project analytics dashboard
- [ ] Developer performance metrics
- [ ] Invoice generation

### P3 - Future
- [ ] Mobile companion app
- [ ] Telegram Mini App
- [ ] AI-powered scope estimation
- [ ] Automated testing integration

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
- Authentication: Email-based quick auth (session cookie)
- Session: httpOnly cookies, 7-day expiry
- Database: MongoDB with custom user_id
- Frontend: React with TailwindCSS
- Backend: FastAPI with Motor (async MongoDB)
- Design: Dark theme (#0A0A0A), sharp edges, no rounded corners
