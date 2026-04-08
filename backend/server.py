from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Development OS API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============ MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "client"  # client, developer, tester, admin
    skills: List[str] = []
    level: str = "junior"  # junior, middle, senior
    rating: float = 5.0
    completed_tasks: int = 0
    active_load: int = 0
    created_at: datetime

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime

# Request Models
class RequestCreate(BaseModel):
    title: str
    description: str
    business_idea: str
    target_audience: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None

class RequestModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    request_id: str
    user_id: str
    title: str
    description: str
    business_idea: str
    target_audience: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    status: str = "pending"  # pending, in_review, approved, rejected
    created_at: datetime

# Product Definition
class ProductDefinition(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: str
    request_id: str
    product_type: str  # web_app, mobile_app, telegram_app, dashboard, marketplace, etc.
    goal: str
    target_audience: str
    key_features: List[str]
    constraints: List[str]
    estimated_timeline: str
    status: str = "draft"
    created_at: datetime

# Scope
class ScopeItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    item_id: str
    scope_id: str
    title: str
    description: str
    item_type: str  # feature, integration, design, logic, qa
    priority: str = "core"  # core, optional, future
    estimated_hours: int
    status: str = "pending"

class Scope(BaseModel):
    model_config = ConfigDict(extra="ignore")
    scope_id: str
    product_id: str
    total_hours: int
    items: List[ScopeItem] = []
    status: str = "draft"
    created_at: datetime

# Project
class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    project_id: str
    scope_id: str
    client_id: str
    name: str
    current_stage: str = "discovery"  # discovery, scope, design, development, qa, delivery, support
    progress: int = 0
    status: str = "active"
    created_at: datetime

# Work Unit
class WorkUnit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    unit_id: str
    project_id: str
    scope_item_id: str
    title: str
    description: str
    unit_type: str  # task, bug, integration, design
    estimated_hours: int
    actual_hours: int = 0
    assigned_to: Optional[str] = None
    status: str = "pending"  # pending, assigned, in_progress, submitted, review, validation, completed
    created_at: datetime

# Assignment
class Assignment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    assignment_id: str
    unit_id: str
    developer_id: str
    assigned_by: str
    status: str = "active"
    created_at: datetime

# Work Log
class WorkLogCreate(BaseModel):
    hours: float
    description: str

class WorkLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    log_id: str
    unit_id: str
    developer_id: str
    hours: float
    description: str
    created_at: datetime

# Submission
class SubmissionCreate(BaseModel):
    summary: str
    links: List[str] = []
    attachments: List[str] = []

class Submission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    submission_id: str
    unit_id: str
    developer_id: str
    summary: str
    links: List[str] = []
    attachments: List[str] = []
    status: str = "pending"  # pending, approved, revision_needed
    created_at: datetime

# Review
class ReviewCreate(BaseModel):
    submission_id: str
    result: str  # approved, revision_needed
    feedback: str

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    review_id: str
    submission_id: str
    reviewer_id: str
    result: str
    feedback: str
    created_at: datetime

# Validation Task
class ValidationTask(BaseModel):
    model_config = ConfigDict(extra="ignore")
    validation_id: str
    unit_id: str
    tester_id: Optional[str] = None
    status: str = "pending"  # pending, in_progress, passed, failed
    issues: List[str] = []
    created_at: datetime

# Validation Issue
class ValidationIssue(BaseModel):
    model_config = ConfigDict(extra="ignore")
    issue_id: str
    validation_id: str
    title: str
    description: str
    severity: str  # low, medium, high, critical
    status: str = "open"
    created_at: datetime

# Deliverable
class Deliverable(BaseModel):
    model_config = ConfigDict(extra="ignore")
    deliverable_id: str
    project_id: str
    title: str
    description: str
    links: List[str] = []
    status: str = "pending"  # pending, approved, rejected
    client_feedback: Optional[str] = None
    created_at: datetime

# Support Ticket
class SupportTicketCreate(BaseModel):
    title: str
    description: str
    ticket_type: str  # bug, improvement, question

class SupportTicket(BaseModel):
    model_config = ConfigDict(extra="ignore")
    ticket_id: str
    project_id: str
    user_id: str
    title: str
    description: str
    ticket_type: str
    priority: str = "medium"
    status: str = "open"
    created_at: datetime

# Portfolio Case
class PortfolioCase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    case_id: str
    title: str
    description: str
    client_name: str
    industry: str
    product_type: str
    technologies: List[str]
    results: str
    testimonial: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = False
    created_at: datetime


# ============ AUTH HELPERS ============

async def get_current_user(request: Request) -> User:
    """Get current user from session token in cookie or Authorization header"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header[7:]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    if isinstance(user.get("created_at"), str):
        user["created_at"] = datetime.fromisoformat(user["created_at"])
    
    return User(**user)


def require_role(*roles):
    """Decorator to require specific roles"""
    async def role_checker(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail=f"Requires one of roles: {roles}")
        return user
    return role_checker


# ============ AUTH ENDPOINTS ============

@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange session_id for session_token"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth to get user data
    async with httpx.AsyncClient() as client_http:
        auth_response = await client_http.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session_id")
        
        auth_data = auth_response.json()
    
    email = auth_data["email"]
    name = auth_data.get("name", email.split("@")[0])
    picture = auth_data.get("picture")
    session_token = auth_data["session_token"]
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        # Update user info
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture}}
        )
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": "client",
            "skills": [],
            "level": "junior",
            "rating": 5.0,
            "completed_tasks": 0,
            "active_load": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_doc)
    
    # Create session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    session_doc = {
        "session_id": str(uuid.uuid4()),
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user


@api_router.get("/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    """Get current user info"""
    return user


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}


@api_router.put("/auth/role")
async def update_user_role(
    user_id: str,
    role: str,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Update user role"""
    if role not in ["client", "developer", "tester", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"role": role}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Role updated"}


# Quick Auth Models
class QuickAuthRequest(BaseModel):
    email: str
    role: str = "client"
    skill: Optional[str] = None

class OnboardingRequest(BaseModel):
    email: str
    name: str
    role: str = "client"
    company: Optional[str] = None
    skills: List[str] = []


@api_router.post("/auth/quick")
async def quick_auth(req: QuickAuthRequest, response: Response):
    """Quick auth - check if user exists or create pending user"""
    email = req.email.strip().lower()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        # User exists - create session and return
        user_id = existing_user["user_id"]
        session_token = f"sess_{uuid.uuid4().hex}"
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        session_doc = {
            "session_id": str(uuid.uuid4()),
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.user_sessions.insert_one(session_doc)
        
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=7 * 24 * 60 * 60
        )
        
        if isinstance(existing_user.get("created_at"), str):
            existing_user["created_at"] = datetime.fromisoformat(existing_user["created_at"])
        
        return {"isNew": False, "user": existing_user}
    
    # New user - store email temporarily, needs onboarding
    return {"isNew": True, "email": email}


@api_router.post("/auth/onboarding")
async def complete_onboarding(req: OnboardingRequest, response: Response):
    """Complete user onboarding"""
    email = req.email.strip().lower()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    user_doc = {
        "user_id": user_id,
        "email": email,
        "name": req.name.strip(),
        "picture": None,
        "role": req.role,
        "company": req.company,
        "skills": req.skills,
        "level": "junior",
        "rating": 5.0,
        "completed_tasks": 0,
        "active_load": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    # Create session
    session_token = f"sess_{uuid.uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    session_doc = {
        "session_id": str(uuid.uuid4()),
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user_doc.pop("_id", None)
    user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    return user_doc


# ============ PUBLIC ENDPOINTS ============

@api_router.get("/")
async def root():
    return {"message": "Development OS API", "version": "1.0.0"}


@api_router.get("/portfolio/cases", response_model=List[PortfolioCase])
async def get_portfolio_cases():
    """Public: Get all portfolio cases"""
    cases = await db.portfolio_cases.find({}, {"_id": 0}).to_list(100)
    for case in cases:
        if isinstance(case.get("created_at"), str):
            case["created_at"] = datetime.fromisoformat(case["created_at"])
    return cases


@api_router.get("/portfolio/featured", response_model=List[PortfolioCase])
async def get_featured_cases():
    """Public: Get featured portfolio cases"""
    cases = await db.portfolio_cases.find({"featured": True}, {"_id": 0}).to_list(10)
    for case in cases:
        if isinstance(case.get("created_at"), str):
            case["created_at"] = datetime.fromisoformat(case["created_at"])
    return cases


@api_router.get("/stats")
async def get_platform_stats():
    """Public: Get platform statistics"""
    projects_count = await db.projects.count_documents({})
    clients_count = await db.users.count_documents({"role": "client"})
    developers_count = await db.users.count_documents({"role": "developer"})
    completed_projects = await db.projects.count_documents({"status": "completed"})
    
    return {
        "total_projects": projects_count,
        "total_clients": clients_count,
        "total_developers": developers_count,
        "completed_projects": completed_projects,
        "satisfaction_rate": 98.5,
        "avg_delivery_time": "4 weeks"
    }


# ============ CLIENT ENDPOINTS ============

@api_router.post("/requests", response_model=RequestModel)
async def create_request(
    req: RequestCreate,
    user: User = Depends(get_current_user)
):
    """Client: Create a new project request"""
    request_doc = {
        "request_id": f"req_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        "title": req.title,
        "description": req.description,
        "business_idea": req.business_idea,
        "target_audience": req.target_audience,
        "budget_range": req.budget_range,
        "timeline": req.timeline,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.requests.insert_one(request_doc)
    request_doc.pop("_id", None)
    request_doc["created_at"] = datetime.fromisoformat(request_doc["created_at"])
    return RequestModel(**request_doc)


@api_router.get("/requests", response_model=List[RequestModel])
async def get_my_requests(user: User = Depends(get_current_user)):
    """Client: Get my requests"""
    query = {"user_id": user.user_id} if user.role == "client" else {}
    requests = await db.requests.find(query, {"_id": 0}).to_list(100)
    for req in requests:
        if isinstance(req.get("created_at"), str):
            req["created_at"] = datetime.fromisoformat(req["created_at"])
    return requests


@api_router.get("/projects/mine", response_model=List[Project])
async def get_my_projects(user: User = Depends(get_current_user)):
    """Client: Get my projects"""
    projects = await db.projects.find({"client_id": user.user_id}, {"_id": 0}).to_list(100)
    for proj in projects:
        if isinstance(proj.get("created_at"), str):
            proj["created_at"] = datetime.fromisoformat(proj["created_at"])
    return projects


@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, user: User = Depends(get_current_user)):
    """Get project details"""
    project = await db.projects.find_one({"project_id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if isinstance(project.get("created_at"), str):
        project["created_at"] = datetime.fromisoformat(project["created_at"])
    return Project(**project)


@api_router.get("/projects/{project_id}/deliverables", response_model=List[Deliverable])
async def get_project_deliverables(project_id: str, user: User = Depends(get_current_user)):
    """Client: Get project deliverables"""
    deliverables = await db.deliverables.find({"project_id": project_id}, {"_id": 0}).to_list(100)
    for d in deliverables:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return deliverables


@api_router.post("/deliverables/{deliverable_id}/approve")
async def approve_deliverable(
    deliverable_id: str,
    feedback: Optional[str] = None,
    user: User = Depends(get_current_user)
):
    """Client: Approve deliverable"""
    result = await db.deliverables.update_one(
        {"deliverable_id": deliverable_id},
        {"$set": {"status": "approved", "client_feedback": feedback}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Deliverable not found")
    return {"message": "Deliverable approved"}


@api_router.post("/deliverables/{deliverable_id}/reject")
async def reject_deliverable(
    deliverable_id: str,
    feedback: str,
    user: User = Depends(get_current_user)
):
    """Client: Reject deliverable"""
    result = await db.deliverables.update_one(
        {"deliverable_id": deliverable_id},
        {"$set": {"status": "rejected", "client_feedback": feedback}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Deliverable not found")
    return {"message": "Deliverable rejected"}


@api_router.post("/projects/{project_id}/support", response_model=SupportTicket)
async def create_support_ticket(
    project_id: str,
    ticket: SupportTicketCreate,
    user: User = Depends(get_current_user)
):
    """Client: Create support ticket"""
    ticket_doc = {
        "ticket_id": f"tkt_{uuid.uuid4().hex[:12]}",
        "project_id": project_id,
        "user_id": user.user_id,
        "title": ticket.title,
        "description": ticket.description,
        "ticket_type": ticket.ticket_type,
        "priority": "medium",
        "status": "open",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.support_tickets.insert_one(ticket_doc)
    ticket_doc.pop("_id", None)
    ticket_doc["created_at"] = datetime.fromisoformat(ticket_doc["created_at"])
    return SupportTicket(**ticket_doc)


# ============ DEVELOPER ENDPOINTS ============

@api_router.get("/developer/assignments", response_model=List[Assignment])
async def get_my_assignments(user: User = Depends(require_role("developer", "admin"))):
    """Developer: Get my assignments"""
    assignments = await db.assignments.find(
        {"developer_id": user.user_id, "status": "active"},
        {"_id": 0}
    ).to_list(100)
    for a in assignments:
        if isinstance(a.get("created_at"), str):
            a["created_at"] = datetime.fromisoformat(a["created_at"])
    return assignments


@api_router.get("/developer/work-units", response_model=List[WorkUnit])
async def get_my_work_units(user: User = Depends(require_role("developer", "admin"))):
    """Developer: Get my work units"""
    units = await db.work_units.find(
        {"assigned_to": user.user_id},
        {"_id": 0}
    ).to_list(100)
    for u in units:
        if isinstance(u.get("created_at"), str):
            u["created_at"] = datetime.fromisoformat(u["created_at"])
    return units


@api_router.post("/work-units/{unit_id}/log", response_model=WorkLog)
async def create_work_log(
    unit_id: str,
    log: WorkLogCreate,
    user: User = Depends(require_role("developer", "admin"))
):
    """Developer: Log work hours"""
    log_doc = {
        "log_id": f"log_{uuid.uuid4().hex[:12]}",
        "unit_id": unit_id,
        "developer_id": user.user_id,
        "hours": log.hours,
        "description": log.description,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.work_logs.insert_one(log_doc)
    
    # Update work unit hours
    await db.work_units.update_one(
        {"unit_id": unit_id},
        {"$inc": {"actual_hours": log.hours}}
    )
    
    log_doc.pop("_id", None)
    log_doc["created_at"] = datetime.fromisoformat(log_doc["created_at"])
    return WorkLog(**log_doc)


@api_router.post("/work-units/{unit_id}/submit", response_model=Submission)
async def submit_work(
    unit_id: str,
    submission: SubmissionCreate,
    user: User = Depends(require_role("developer", "admin"))
):
    """Developer: Submit work for review"""
    submission_doc = {
        "submission_id": f"sub_{uuid.uuid4().hex[:12]}",
        "unit_id": unit_id,
        "developer_id": user.user_id,
        "summary": submission.summary,
        "links": submission.links,
        "attachments": submission.attachments,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.submissions.insert_one(submission_doc)
    
    # Update work unit status
    await db.work_units.update_one(
        {"unit_id": unit_id},
        {"$set": {"status": "submitted"}}
    )
    
    submission_doc.pop("_id", None)
    submission_doc["created_at"] = datetime.fromisoformat(submission_doc["created_at"])
    return Submission(**submission_doc)


# ============ TESTER ENDPOINTS ============

@api_router.get("/tester/validation-tasks", response_model=List[ValidationTask])
async def get_my_validation_tasks(user: User = Depends(require_role("tester", "admin"))):
    """Tester: Get my validation tasks"""
    tasks = await db.validation_tasks.find(
        {"tester_id": user.user_id},
        {"_id": 0}
    ).to_list(100)
    for t in tasks:
        if isinstance(t.get("created_at"), str):
            t["created_at"] = datetime.fromisoformat(t["created_at"])
    return tasks


@api_router.post("/validation/{validation_id}/pass")
async def pass_validation(
    validation_id: str,
    user: User = Depends(require_role("tester", "admin"))
):
    """Tester: Pass validation"""
    result = await db.validation_tasks.update_one(
        {"validation_id": validation_id},
        {"$set": {"status": "passed"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Validation task not found")
    return {"message": "Validation passed"}


@api_router.post("/validation/{validation_id}/fail")
async def fail_validation(
    validation_id: str,
    issues: List[str],
    user: User = Depends(require_role("tester", "admin"))
):
    """Tester: Fail validation with issues"""
    result = await db.validation_tasks.update_one(
        {"validation_id": validation_id},
        {"$set": {"status": "failed", "issues": issues}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Validation task not found")
    return {"message": "Validation failed"}


@api_router.post("/validation/{validation_id}/issue", response_model=ValidationIssue)
async def create_validation_issue(
    validation_id: str,
    title: str,
    description: str,
    severity: str,
    user: User = Depends(require_role("tester", "admin"))
):
    """Tester: Create validation issue"""
    issue_doc = {
        "issue_id": f"iss_{uuid.uuid4().hex[:12]}",
        "validation_id": validation_id,
        "title": title,
        "description": description,
        "severity": severity,
        "status": "open",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.validation_issues.insert_one(issue_doc)
    issue_doc.pop("_id", None)
    issue_doc["created_at"] = datetime.fromisoformat(issue_doc["created_at"])
    return ValidationIssue(**issue_doc)


# ============ ADMIN ENDPOINTS ============

@api_router.get("/admin/users", response_model=List[User])
async def get_all_users(admin: User = Depends(require_role("admin"))):
    """Admin: Get all users"""
    users = await db.users.find({}, {"_id": 0}).to_list(1000)
    for u in users:
        if isinstance(u.get("created_at"), str):
            u["created_at"] = datetime.fromisoformat(u["created_at"])
    return users


@api_router.get("/admin/developers", response_model=List[User])
async def get_developers(admin: User = Depends(require_role("admin"))):
    """Admin: Get all developers"""
    developers = await db.users.find({"role": "developer"}, {"_id": 0}).to_list(100)
    for d in developers:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return developers


@api_router.get("/admin/testers", response_model=List[User])
async def get_testers(admin: User = Depends(require_role("admin"))):
    """Admin: Get all testers"""
    testers = await db.users.find({"role": "tester"}, {"_id": 0}).to_list(100)
    for t in testers:
        if isinstance(t.get("created_at"), str):
            t["created_at"] = datetime.fromisoformat(t["created_at"])
    return testers


@api_router.get("/admin/requests", response_model=List[RequestModel])
async def get_all_requests(admin: User = Depends(require_role("admin"))):
    """Admin: Get all requests"""
    requests = await db.requests.find({}, {"_id": 0}).to_list(1000)
    for req in requests:
        if isinstance(req.get("created_at"), str):
            req["created_at"] = datetime.fromisoformat(req["created_at"])
    return requests


@api_router.post("/admin/requests/{request_id}/approve")
async def approve_request(request_id: str, admin: User = Depends(require_role("admin"))):
    """Admin: Approve request"""
    result = await db.requests.update_one(
        {"request_id": request_id},
        {"$set": {"status": "approved"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"message": "Request approved"}


@api_router.post("/admin/product-definition", response_model=ProductDefinition)
async def create_product_definition(
    request_id: str,
    product_type: str,
    goal: str,
    target_audience: str,
    key_features: List[str],
    constraints: List[str],
    estimated_timeline: str,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Create product definition from request"""
    product_doc = {
        "product_id": f"prod_{uuid.uuid4().hex[:12]}",
        "request_id": request_id,
        "product_type": product_type,
        "goal": goal,
        "target_audience": target_audience,
        "key_features": key_features,
        "constraints": constraints,
        "estimated_timeline": estimated_timeline,
        "status": "draft",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.product_definitions.insert_one(product_doc)
    product_doc.pop("_id", None)
    product_doc["created_at"] = datetime.fromisoformat(product_doc["created_at"])
    return ProductDefinition(**product_doc)


@api_router.post("/admin/scope", response_model=Scope)
async def create_scope(
    product_id: str,
    total_hours: int,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Create scope for product"""
    scope_doc = {
        "scope_id": f"scope_{uuid.uuid4().hex[:12]}",
        "product_id": product_id,
        "total_hours": total_hours,
        "items": [],
        "status": "draft",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.scopes.insert_one(scope_doc)
    scope_doc.pop("_id", None)
    scope_doc["created_at"] = datetime.fromisoformat(scope_doc["created_at"])
    return Scope(**scope_doc)


@api_router.post("/admin/scope/{scope_id}/item", response_model=ScopeItem)
async def add_scope_item(
    scope_id: str,
    title: str,
    description: str,
    item_type: str,
    priority: str,
    estimated_hours: int,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Add scope item"""
    item = {
        "item_id": f"item_{uuid.uuid4().hex[:12]}",
        "scope_id": scope_id,
        "title": title,
        "description": description,
        "item_type": item_type,
        "priority": priority,
        "estimated_hours": estimated_hours,
        "status": "pending"
    }
    await db.scope_items.insert_one(item)
    item.pop("_id", None)
    return ScopeItem(**item)


@api_router.post("/admin/project", response_model=Project)
async def create_project(
    scope_id: str,
    client_id: str,
    name: str,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Create project from scope"""
    project_doc = {
        "project_id": f"proj_{uuid.uuid4().hex[:12]}",
        "scope_id": scope_id,
        "client_id": client_id,
        "name": name,
        "current_stage": "discovery",
        "progress": 0,
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.projects.insert_one(project_doc)
    project_doc.pop("_id", None)
    project_doc["created_at"] = datetime.fromisoformat(project_doc["created_at"])
    return Project(**project_doc)


@api_router.get("/admin/projects", response_model=List[Project])
async def get_all_projects(admin: User = Depends(require_role("admin"))):
    """Admin: Get all projects"""
    projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    for proj in projects:
        if isinstance(proj.get("created_at"), str):
            proj["created_at"] = datetime.fromisoformat(proj["created_at"])
    return projects


@api_router.post("/admin/work-unit", response_model=WorkUnit)
async def create_work_unit(
    project_id: str,
    scope_item_id: str,
    title: str,
    description: str,
    unit_type: str,
    estimated_hours: int,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Create work unit"""
    unit_doc = {
        "unit_id": f"unit_{uuid.uuid4().hex[:12]}",
        "project_id": project_id,
        "scope_item_id": scope_item_id,
        "title": title,
        "description": description,
        "unit_type": unit_type,
        "estimated_hours": estimated_hours,
        "actual_hours": 0,
        "assigned_to": None,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.work_units.insert_one(unit_doc)
    unit_doc.pop("_id", None)
    unit_doc["created_at"] = datetime.fromisoformat(unit_doc["created_at"])
    return WorkUnit(**unit_doc)


@api_router.get("/admin/work-units", response_model=List[WorkUnit])
async def get_all_work_units(admin: User = Depends(require_role("admin"))):
    """Admin: Get all work units"""
    units = await db.work_units.find({}, {"_id": 0}).to_list(1000)
    for u in units:
        if isinstance(u.get("created_at"), str):
            u["created_at"] = datetime.fromisoformat(u["created_at"])
    return units


@api_router.post("/admin/assign", response_model=Assignment)
async def assign_work_unit(
    unit_id: str,
    developer_id: str,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Assign work unit to developer"""
    assignment_doc = {
        "assignment_id": f"asgn_{uuid.uuid4().hex[:12]}",
        "unit_id": unit_id,
        "developer_id": developer_id,
        "assigned_by": admin.user_id,
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.assignments.insert_one(assignment_doc)
    
    # Update work unit
    await db.work_units.update_one(
        {"unit_id": unit_id},
        {"$set": {"assigned_to": developer_id, "status": "assigned"}}
    )
    
    # Update developer load
    await db.users.update_one(
        {"user_id": developer_id},
        {"$inc": {"active_load": 1}}
    )
    
    assignment_doc.pop("_id", None)
    assignment_doc["created_at"] = datetime.fromisoformat(assignment_doc["created_at"])
    return Assignment(**assignment_doc)


@api_router.get("/admin/submissions", response_model=List[Submission])
async def get_pending_submissions(admin: User = Depends(require_role("admin"))):
    """Admin: Get pending submissions for review"""
    submissions = await db.submissions.find({"status": "pending"}, {"_id": 0}).to_list(100)
    for s in submissions:
        if isinstance(s.get("created_at"), str):
            s["created_at"] = datetime.fromisoformat(s["created_at"])
    return submissions


@api_router.post("/admin/review", response_model=Review)
async def create_review(
    review: ReviewCreate,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Review submission"""
    review_doc = {
        "review_id": f"rev_{uuid.uuid4().hex[:12]}",
        "submission_id": review.submission_id,
        "reviewer_id": admin.user_id,
        "result": review.result,
        "feedback": review.feedback,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.reviews.insert_one(review_doc)
    
    # Update submission status
    await db.submissions.update_one(
        {"submission_id": review.submission_id},
        {"$set": {"status": review.result}}
    )
    
    # If approved, create validation task
    if review.result == "approved":
        submission = await db.submissions.find_one({"submission_id": review.submission_id}, {"_id": 0})
        if submission:
            validation_doc = {
                "validation_id": f"val_{uuid.uuid4().hex[:12]}",
                "unit_id": submission["unit_id"],
                "tester_id": None,
                "status": "pending",
                "issues": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.validation_tasks.insert_one(validation_doc)
            
            # Update work unit status
            await db.work_units.update_one(
                {"unit_id": submission["unit_id"]},
                {"$set": {"status": "validation"}}
            )
    
    review_doc.pop("_id", None)
    review_doc["created_at"] = datetime.fromisoformat(review_doc["created_at"])
    return Review(**review_doc)


@api_router.post("/admin/validation/{validation_id}/assign")
async def assign_validation(
    validation_id: str,
    tester_id: str,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Assign validation task to tester"""
    result = await db.validation_tasks.update_one(
        {"validation_id": validation_id},
        {"$set": {"tester_id": tester_id, "status": "in_progress"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Validation task not found")
    return {"message": "Validation assigned"}


class DeliverableCreate(BaseModel):
    project_id: str
    title: str
    description: str
    links: List[str] = []
    work_unit_ids: List[str] = []


@api_router.post("/admin/deliverable", response_model=Deliverable)
async def create_deliverable(
    data: DeliverableCreate,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Create deliverable for client"""
    deliverable_doc = {
        "deliverable_id": f"dlv_{uuid.uuid4().hex[:12]}",
        "project_id": data.project_id,
        "title": data.title,
        "description": data.description,
        "links": data.links,
        "work_unit_ids": data.work_unit_ids,
        "status": "pending",
        "client_feedback": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.deliverables.insert_one(deliverable_doc)
    deliverable_doc.pop("_id", None)
    deliverable_doc["created_at"] = datetime.fromisoformat(deliverable_doc["created_at"])
    return Deliverable(**deliverable_doc)


@api_router.get("/admin/support-tickets", response_model=List[SupportTicket])
async def get_all_support_tickets(admin: User = Depends(require_role("admin"))):
    """Admin: Get all support tickets"""
    tickets = await db.support_tickets.find({}, {"_id": 0}).to_list(1000)
    for t in tickets:
        if isinstance(t.get("created_at"), str):
            t["created_at"] = datetime.fromisoformat(t["created_at"])
    return tickets


@api_router.post("/admin/portfolio", response_model=PortfolioCase)
async def create_portfolio_case(
    title: str,
    description: str,
    client_name: str,
    industry: str,
    product_type: str,
    technologies: List[str],
    results: str,
    testimonial: Optional[str] = None,
    image_url: Optional[str] = None,
    featured: bool = False,
    admin: User = Depends(require_role("admin"))
):
    """Admin: Create portfolio case"""
    case_doc = {
        "case_id": f"case_{uuid.uuid4().hex[:12]}",
        "title": title,
        "description": description,
        "client_name": client_name,
        "industry": industry,
        "product_type": product_type,
        "technologies": technologies,
        "results": results,
        "testimonial": testimonial,
        "image_url": image_url,
        "featured": featured,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.portfolio_cases.insert_one(case_doc)
    case_doc.pop("_id", None)
    case_doc["created_at"] = datetime.fromisoformat(case_doc["created_at"])
    return PortfolioCase(**case_doc)


# ============ ASSIGNMENT ENGINE ============

def score_developer_for_work_unit(work_unit: dict, developer: dict) -> tuple:
    """Calculate assignment score for a developer"""
    reasons = []
    
    # Skill match (30%)
    required_skill = work_unit.get("unit_type", "task")
    dev_skills = developer.get("skills", [])
    skill_match = 1.0 if required_skill in [s.lower() for s in dev_skills] else 0.5
    if skill_match == 1.0:
        reasons.append(f"Strong {required_skill} match")
    
    # Level match (20%)
    level_scores = {"junior": 0.5, "middle": 0.75, "senior": 1.0, "lead": 1.0}
    level_score = level_scores.get(developer.get("level", "junior"), 0.5)
    if level_score >= 0.75:
        reasons.append(f"{developer.get('level', 'junior').capitalize()} level developer")
    
    # Rating (20%)
    rating = developer.get("rating", 5.0)
    rating_score = min(rating / 5.0, 1.0)
    if rating >= 4.5:
        reasons.append("High rating")
    
    # Load availability (15%)
    active_load = developer.get("active_load", 0)
    max_load = 40  # hours per week
    load_availability = max(0, 1 - (active_load / max_load))
    if load_availability > 0.7:
        reasons.append("Low current load")
    
    # Completed tasks (10%)
    completed = developer.get("completed_tasks", 0)
    experience_score = min(completed / 50, 1.0)
    if completed > 20:
        reasons.append(f"{completed} tasks completed")
    
    # Speed (5%)
    speed_score = 0.7  # Default
    
    # Calculate total score
    total_score = (
        skill_match * 0.30 +
        level_score * 0.20 +
        rating_score * 0.20 +
        load_availability * 0.15 +
        experience_score * 0.10 +
        speed_score * 0.05
    )
    
    return total_score, reasons


@api_router.get("/admin/assignment-engine/{work_unit_id}/candidates")
async def get_assignment_candidates(
    work_unit_id: str,
    admin: User = Depends(require_role("admin"))
):
    """Get recommended developers for a work unit"""
    # Get work unit
    work_unit = await db.work_units.find_one({"unit_id": work_unit_id}, {"_id": 0})
    if not work_unit:
        raise HTTPException(status_code=404, detail="Work unit not found")
    
    # Get available developers
    developers = await db.users.find(
        {"role": "developer"},
        {"_id": 0}
    ).to_list(100)
    
    # Score each developer
    candidates = []
    for dev in developers:
        score, reasons = score_developer_for_work_unit(work_unit, dev)
        if score > 0.4:  # Minimum threshold
            candidates.append({
                "developer": dev,
                "score": score,
                "reasons": reasons
            })
    
    # Sort by score descending
    candidates.sort(key=lambda x: x["score"], reverse=True)
    
    return candidates[:5]  # Top 5


@api_router.post("/admin/assignment-engine/{work_unit_id}/assign")
async def assign_work_unit(
    work_unit_id: str,
    developer_id: str,
    admin: User = Depends(require_role("admin"))
):
    """Assign a work unit to a specific developer"""
    # Verify work unit exists
    work_unit = await db.work_units.find_one({"unit_id": work_unit_id}, {"_id": 0})
    if not work_unit:
        raise HTTPException(status_code=404, detail="Work unit not found")
    
    # Verify developer exists
    developer = await db.users.find_one({"user_id": developer_id, "role": "developer"}, {"_id": 0})
    if not developer:
        raise HTTPException(status_code=404, detail="Developer not found")
    
    # Create assignment
    assignment_doc = {
        "assignment_id": f"asgn_{uuid.uuid4().hex[:12]}",
        "unit_id": work_unit_id,
        "developer_id": developer_id,
        "assigned_by": admin.user_id,
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.assignments.insert_one(assignment_doc)
    
    # Update work unit
    await db.work_units.update_one(
        {"unit_id": work_unit_id},
        {"$set": {"assigned_to": developer_id, "status": "assigned"}}
    )
    
    # Update developer load
    await db.users.update_one(
        {"user_id": developer_id},
        {"$inc": {"active_load": work_unit.get("estimated_hours", 0)}}
    )
    
    return {"message": "Assigned successfully", "assignment_id": assignment_doc["assignment_id"]}


@api_router.post("/admin/assignment-engine/{work_unit_id}/assign-best")
async def assign_best_match(
    work_unit_id: str,
    admin: User = Depends(require_role("admin"))
):
    """Assign work unit to the best matching developer"""
    # Get candidates
    work_unit = await db.work_units.find_one({"unit_id": work_unit_id}, {"_id": 0})
    if not work_unit:
        raise HTTPException(status_code=404, detail="Work unit not found")
    
    developers = await db.users.find({"role": "developer"}, {"_id": 0}).to_list(100)
    
    if not developers:
        raise HTTPException(status_code=400, detail="No developers available")
    
    # Find best match
    best_dev = None
    best_score = 0
    for dev in developers:
        score, _ = score_developer_for_work_unit(work_unit, dev)
        if score > best_score:
            best_score = score
            best_dev = dev
    
    if not best_dev:
        raise HTTPException(status_code=400, detail="No suitable developer found")
    
    # Create assignment
    assignment_doc = {
        "assignment_id": f"asgn_{uuid.uuid4().hex[:12]}",
        "unit_id": work_unit_id,
        "developer_id": best_dev["user_id"],
        "assigned_by": admin.user_id,
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.assignments.insert_one(assignment_doc)
    
    # Update work unit
    await db.work_units.update_one(
        {"unit_id": work_unit_id},
        {"$set": {"assigned_to": best_dev["user_id"], "status": "assigned"}}
    )
    
    # Update developer load
    await db.users.update_one(
        {"user_id": best_dev["user_id"]},
        {"$inc": {"active_load": work_unit.get("estimated_hours", 0)}}
    )
    
    return {
        "message": "Assigned to best match",
        "assignment_id": assignment_doc["assignment_id"],
        "developer_id": best_dev["user_id"],
        "score": best_score
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Seed initial data on startup"""
    # Seed portfolio cases if empty
    cases_count = await db.portfolio_cases.count_documents({})
    if cases_count == 0:
        mock_cases = [
            {
                "case_id": f"case_{uuid.uuid4().hex[:12]}",
                "title": "E-Commerce Marketplace Platform",
                "description": "Full-stack marketplace with real-time inventory, payment processing, and analytics dashboard",
                "client_name": "TechRetail Inc.",
                "industry": "E-Commerce",
                "product_type": "web_app",
                "technologies": ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
                "results": "300% increase in conversion rate, 50% reduction in cart abandonment",
                "testimonial": "Development OS transformed our digital presence. The platform exceeded expectations.",
                "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "case_id": f"case_{uuid.uuid4().hex[:12]}",
                "title": "Healthcare Management System",
                "description": "HIPAA-compliant patient management system with telemedicine integration",
                "client_name": "MedCare Solutions",
                "industry": "Healthcare",
                "product_type": "web_app",
                "technologies": ["Vue.js", "Python", "MongoDB", "WebRTC", "GCP"],
                "results": "40% improvement in patient scheduling efficiency, 99.9% uptime",
                "testimonial": "The team delivered a complex healthcare solution with impeccable security standards.",
                "image_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "case_id": f"case_{uuid.uuid4().hex[:12]}",
                "title": "Fintech Trading Dashboard",
                "description": "Real-time trading platform with advanced charting and portfolio analytics",
                "client_name": "Alpha Investments",
                "industry": "Finance",
                "product_type": "dashboard",
                "technologies": ["React", "Go", "TimescaleDB", "WebSocket", "Kubernetes"],
                "results": "Sub-100ms latency, handling 10K+ concurrent users",
                "testimonial": "Exceptional performance and reliability. Our traders love the interface.",
                "image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "case_id": f"case_{uuid.uuid4().hex[:12]}",
                "title": "AI-Powered Content Platform",
                "description": "Content management system with AI-driven recommendations and analytics",
                "client_name": "MediaFlow",
                "industry": "Media",
                "product_type": "web_app",
                "technologies": ["Next.js", "Python", "OpenAI", "Redis", "Vercel"],
                "results": "200% increase in user engagement, 45% longer session duration",
                "testimonial": "The AI integration has revolutionized how we deliver content to our audience.",
                "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "case_id": f"case_{uuid.uuid4().hex[:12]}",
                "title": "Logistics Tracking System",
                "description": "End-to-end supply chain visibility platform with IoT integration",
                "client_name": "GlobalShip",
                "industry": "Logistics",
                "product_type": "web_app",
                "technologies": ["React", "Node.js", "PostgreSQL", "IoT Hub", "Azure"],
                "results": "60% reduction in delivery delays, real-time tracking for 100K+ shipments",
                "testimonial": "Complete visibility across our supply chain. Game-changing platform.",
                "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.portfolio_cases.insert_many(mock_cases)
        logger.info("Seeded portfolio cases")
    
    # Create admin user if not exists
    admin_exists = await db.users.find_one({"email": "admin@devos.io"}, {"_id": 0})
    if not admin_exists:
        admin_doc = {
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "email": "admin@devos.io",
            "name": "Platform Admin",
            "picture": None,
            "role": "admin",
            "skills": ["management", "architecture", "review"],
            "level": "senior",
            "rating": 5.0,
            "completed_tasks": 0,
            "active_load": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_doc)
        logger.info("Created admin user")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
