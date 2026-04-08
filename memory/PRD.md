# Development OS - Product Requirements Document

## Project Overview
**Name:** Development OS  
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
1. **Public Layer (Market)** - Landing page, portfolio, case studies
2. **Client Layer** - Requests, projects, deliverables, approvals, support
3. **Production Layer** - Scope items, work units, assignments, work logs, submissions
4. **Quality Layer** - Reviews, validation tasks, issues
5. **Control Layer** - Admin dashboard, work board, review queue

## What's Been Implemented

### Deployed (April 8, 2026)
- [x] Landing Page with Hero, About, Process, Pricing, FAQ sections
- [x] Google OAuth authentication (Emergent-managed)
- [x] Client/Developer/Tester/Admin Dashboards
- [x] Full backend API with CRUD operations
- [x] Portfolio cases with seeded data
- [x] Request submission system
- [x] Project management system

### Backend Endpoints
- Auth: `/api/auth/session`, `/api/auth/me`, `/api/auth/logout`, `/api/auth/role`
- Public: `/api/`, `/api/stats`, `/api/portfolio/cases`, `/api/portfolio/featured`
- Client: `/api/requests`, `/api/projects/mine`, `/api/projects/{id}`, deliverables, support
- Developer: `/api/developer/assignments`, `/api/developer/work-units`, work logs, submissions
- Tester: `/api/tester/validation-tasks`, validation pass/fail
- Admin: Full user, project, request, scope, work unit management

## Prioritized Backlog

### P0 - Critical
- [ ] Full authorization flow testing with real Google account
- [ ] Demo mode with test data

### P1 - High Priority
- [ ] Scope Builder UI for Admin
- [ ] Email notifications
- [ ] Real-time updates with WebSocket

### P2 - Medium Priority
- [ ] File attachments
- [ ] Time tracking reports
- [ ] Project analytics dashboard

## User Personas

### Maria - Startup Founder (Client)
- Needs to build MVP quickly
- Wants transparent process

### Alex - Full-Stack Developer
- Wants clear task specifications
- Appreciates fair workload distribution

### Sam - QA Tester
- Focused on user experience
- Values clear pass/fail criteria

### Jordan - Platform Admin
- Manages entire operation
- Makes resource allocation decisions

## Technical Notes
- Authentication: Emergent-managed Google OAuth
- Session management: httpOnly cookies with 7-day expiry
- Database: MongoDB with custom user_id
- Frontend URL: https://auth-platform-20.preview.emergentagent.com
