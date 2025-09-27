# 🔥 CRITICAL BACKEND ENDPOINTS - TODO

## 🚨 **IMMEDIATE FIXES REQUIRED (System Breaking Without These)**

### **1. Register Vote Routes (CRITICAL - 1 Line Fix)**
**File:** `backend/app/routes/__init__.py`
**Issue:** Vote routes exist but aren't registered - voting completely broken

```python
# ADD THESE LINES:
from .vote_routes import vote_bp

# IN register_routes function:
app.register_blueprint(vote_bp, url_prefix='/vote')
```

**Current Status:** ❌ Vote endpoint exists but is inaccessible
**Impact:** Users cannot vote at all

---

### **2. User Role Endpoint (CRITICAL - Frontend Dependency)**
**File:** `backend/app/routes/auth_routes.py`
**Frontend Requirement:** `userService.ts` expects `http://localhost:5000/auth/role/<reg_no>`

```python
# ADD THIS ENDPOINT:
@auth_bp.route("/role/<reg_no>", methods=["GET"])
def get_user_role_endpoint(reg_no):
    from ..models.user_model import get_user_role
    role = get_user_role(reg_no)
    return jsonify({"role": role or "user"})
```

**Current Status:** ❌ Frontend service fails, returns default 'user' role
**Impact:** Role-based features completely broken

---

### **3. Candidate Management System (CRITICAL - Core Voting)**
**File:** `backend/app/routes/candidate_routes.py` (NEW FILE NEEDED)

```python
from flask import Blueprint, jsonify, request
from ..models.candidate_model import (
    get_candidates_by_election, 
    create_candidate, 
    get_candidate_by_id,
    delete_candidate
)

candidate_bp = Blueprint("candidate", __name__)

@candidate_bp.route("/election/<int:election_id>", methods=["GET"])
def get_candidates_by_election_handler(election_id):
    """Get all candidates for a specific election"""
    candidates = get_candidates_by_election(election_id)
    return jsonify(candidates), 200

@candidate_bp.route("/create", methods=["POST"])
def create_candidate_handler():
    """Create a new candidate for an election"""
    data = request.get_json()
    election_id = data.get("election_id")
    reg_no = data.get("reg_no")
    manifesto = data.get("manifesto", "")
    
    if not all([election_id, reg_no]):
        return jsonify({"error": "Missing required fields"}), 400
    
    success = create_candidate(election_id, reg_no, manifesto)
    if success:
        return jsonify({"message": "Candidate created successfully"}), 201
    return jsonify({"error": "Failed to create candidate"}), 400

@candidate_bp.route("/<int:candidate_id>", methods=["GET"])
def get_candidate_handler(candidate_id):
    """Get single candidate details"""
    candidate = get_candidate_by_id(candidate_id)
    if candidate:
        return jsonify(candidate), 200
    return jsonify({"error": "Candidate not found"}), 404

@candidate_bp.route("/<int:candidate_id>", methods=["DELETE"])
def delete_candidate_handler(candidate_id):
    """Delete a candidate"""
    success = delete_candidate(candidate_id)
    if success:
        return jsonify({"message": "Candidate deleted successfully"}), 200
    return jsonify({"error": "Failed to delete candidate"}), 400
```

**Then register in:** `backend/app/routes/__init__.py`
```python
from .candidate_routes import candidate_bp
app.register_blueprint(candidate_bp, url_prefix='/candidate')
```

**Current Status:** ❌ Elections show "0 candidates", voting UI completely empty
**Impact:** Entire voting system non-functional

---

### **4. Vote Status Checking (CRITICAL - System Integrity)**
**File:** `backend/app/routes/vote_routes.py`

```python
# ADD THIS ENDPOINT:
@vote_bp.route("/check/<reg_no>/<int:election_id>", methods=["GET"])
def check_vote_status(reg_no, election_id):
    """Check if user has already voted in an election"""
    has_voted = check_already_voted(reg_no, election_id)
    return jsonify({"has_voted": has_voted}), 200

@vote_bp.route("/user/<reg_no>/elections", methods=["GET"])
def get_user_voted_elections(reg_no):
    """Get all elections user has voted in"""
    # TODO: Implement get_user_votes function in vote_model.py
    return jsonify({"elections": []}), 200
```

**Current Status:** ❌ No way to check vote status, double voting possible
**Impact:** System integrity compromised

---

### **5. Enhanced Election Data (CRITICAL - Data Integration)**
**File:** `backend/app/services/election_service.py`

```python
# MODIFY fetch_all_elections function:
def fetch_all_elections():
    from ..models.candidate_model import get_candidates_by_election
    elections = get_all_elections()
    
    # Add candidates to each election
    for election in elections:
        election['candidates'] = get_candidates_by_election(election['election_id'])
    
    return elections

# ALSO MODIFY other election fetch functions:
def get_single_election(election_id):
    from ..models.candidate_model import get_candidates_by_election
    election = get_election_by_id(election_id)
    if not election:
        return {"error": "Election not found"}, 404
    
    # Add candidates to election
    election['candidates'] = get_candidates_by_election(election_id)
    return election
```

**Current Status:** ❌ Frontend expects candidates array, always receives empty
**Impact:** Voting UI shows no candidates to vote for

---

## 🔴 **HIGH PRIORITY ENDPOINTS (Core Features Missing)**

### **6. User Profile Management**
**File:** `backend/app/routes/user_routes.py`

```python
# ADD THESE ENDPOINTS:
@user_bp.route("/<reg_no>/profile", methods=["GET"])
def get_user_profile(reg_no):
    """Get user profile details"""
    from ..models.user_model import get_user_by_reg_no
    user = get_user_by_reg_no(reg_no)
    if user:
        profile = {
            "reg_no": user[0],
            "name": user[2],
            "created_at": user[3] if len(user) > 3 else None
        }
        return jsonify(profile), 200
    return jsonify({"error": "User not found"}), 404

@user_bp.route("/<reg_no>/role", methods=["GET"])
def get_user_site_role(reg_no):
    """Get user's site-wide role (admin/student)"""
    from ..models.user_model import get_user_role
    role = get_user_role(reg_no)
    return jsonify({"role": role or "student"}), 200
```

---

### **7. Enhanced Member Management**
**File:** `backend/app/routes/club_routes.py`

```python
# ADD THESE ENDPOINTS:
@club_bp.route("/<int:club_id>/members/pending", methods=["GET"])
def get_pending_members(club_id):
    """Get pending membership requests"""
    # TODO: Modify get_members_by_status function in member_model.py
    return jsonify([]), 200

@club_bp.route("/member/<reg_no>/role/<int:club_id>", methods=["GET"])
def get_member_role_in_club(reg_no, club_id):
    """Get member's role in specific club"""
    from ..models.member_model import get_member_role
    role = get_member_role(reg_no, club_id)
    return jsonify({"role": role}), 200
```

---

## 🟡 **MEDIUM PRIORITY (Enhanced Functionality)**

### **8. Voting Analytics**
```python
# NEW FILE: backend/app/routes/analytics_routes.py
@analytics_bp.route("/election/<int:election_id>/stats", methods=["GET"])
def get_election_stats(election_id):
    """Get voting statistics for an election"""
    # TODO: Implement analytics functions
    return jsonify({"total_votes": 0, "turnout_percentage": 0}), 200
```

### **9. Notification System**
```python
# NEW FILE: backend/app/routes/notification_routes.py
@notification_bp.route("/user/<reg_no>", methods=["GET"])
def get_user_notifications(reg_no):
    """Get user notifications"""
    # TODO: Create notification model and service
    return jsonify([]), 200
```

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **✅ Day 1 (System Critical):**
- [ ] Register vote routes in `routes/__init__.py`
- [ ] Add user role endpoint in `auth_routes.py`
- [ ] Create `candidate_routes.py` with all CRUD operations
- [ ] Register candidate routes in `routes/__init__.py`

### **✅ Day 2 (Core Functionality):**
- [ ] Add vote checking endpoints in `vote_routes.py`
- [ ] Modify election service to include candidates
- [ ] Test voting end-to-end functionality

### **✅ Week 1 (Enhanced Features):**
- [ ] Add user profile endpoints
- [ ] Enhanced member management
- [ ] Voting analytics basic implementation

---

## 🔧 **CURRENT SYSTEM STATUS**

### **❌ BROKEN:**
- Voting system (no candidates displayed)
- Role-based features (endpoint missing)
- Vote recording (routes not registered)
- Double vote prevention (no checking)

### **✅ WORKING:**
- User authentication
- Club management
- Basic election CRUD
- Member management (partial)

### **📊 COMPLETION ESTIMATE:**
- **Critical fixes:** 4-6 hours
- **High priority:** 1-2 days  
- **Medium priority:** 1 week

---

## 🚨 **DEPENDENCIES & ORDER**

1. **Vote routes registration** (prerequisite for all voting)
2. **Candidate routes** (prerequisite for election functionality)  
3. **Election service modification** (requires candidate routes)
4. **User role endpoint** (independent, high priority)
5. **Vote checking** (requires vote routes working)

**⚠️ WARNING:** Without items 1-3, the voting system is completely non-functional.

---

## 📝 **TESTING CHECKLIST AFTER IMPLEMENTATION**

- [ ] Can create candidates for elections
- [ ] Elections display candidates correctly
- [ ] Users can vote successfully
- [ ] Double voting is prevented
- [ ] Role-based UI features work
- [ ] Vote counting is accurate
- [ ] All existing functionality still works

---

*Last Updated: September 27, 2025*
*Priority: CRITICAL - System currently non-functional*