#!/usr/bin/env python3
"""
Enhanced test script to verify the complete authentication flow
including the new /me endpoint for session management.
"""

import requests
import json
import sys

BASE_URL = "http://127.0.0.1:5000"

def test_complete_auth_flow():
    """Test the complete authentication flow including session management"""
    print("\n🧪 Testing Complete Authentication Flow")
    print("=" * 60)
    
    # Test data
    test_user = {
        "reg_no": "MDL99TE002",
        "password": "testpass123",
        "name": "Test User Two"
    }
    
    session = requests.Session()
    
    try:
        # Step 1: Register user
        print("Step 1: Testing user registration...")
        register_response = session.post(
            f"{BASE_URL}/register",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        print(f"Register Status: {register_response.status_code}")
        print(f"Register Response: {register_response.json()}")
        
        if register_response.status_code not in [200, 409]:  # 409 = user exists
            print("❌ Registration failed")
            return False
        
        # Step 2: Login
        print("\nStep 2: Testing user login...")
        login_response = session.post(
            f"{BASE_URL}/login",
            json={
                "reg_no": test_user["reg_no"],
                "password": test_user["password"]
            },
            headers={"Content-Type": "application/json"}
        )
        print(f"Login Status: {login_response.status_code}")
        print(f"Login Response: {login_response.json()}")
        
        if login_response.status_code != 200:
            print("❌ Login failed")
            return False
        
        # Step 3: Check session with /me endpoint
        print("\nStep 3: Testing session check (/me endpoint)...")
        me_response = session.get(
            f"{BASE_URL}/me",
            headers={"Content-Type": "application/json"}
        )
        print(f"Me Status: {me_response.status_code}")
        print(f"Me Response: {me_response.json()}")
        
        if me_response.status_code != 200:
            print("❌ Session check failed")
            return False
        
        me_data = me_response.json()
        if not me_data.get("user"):
            print("❌ No user data in session")
            return False
        
        user_data = me_data["user"]
        if user_data["reg_no"] != test_user["reg_no"]:
            print("❌ Session user data mismatch")
            return False
        
        print(f"✅ Session contains correct user: {user_data['name']} ({user_data['reg_no']})")
        
        # Step 4: Test logout
        print("\nStep 4: Testing logout...")
        logout_response = session.post(
            f"{BASE_URL}/logout",
            headers={"Content-Type": "application/json"}
        )
        print(f"Logout Status: {logout_response.status_code}")
        print(f"Logout Response: {logout_response.json()}")
        
        if logout_response.status_code != 200:
            print("❌ Logout failed")
            return False
        
        # Step 5: Verify session is cleared
        print("\nStep 5: Verifying session is cleared...")
        me_after_logout = session.get(
            f"{BASE_URL}/me",
            headers={"Content-Type": "application/json"}
        )
        print(f"Me After Logout Status: {me_after_logout.status_code}")
        print(f"Me After Logout Response: {me_after_logout.json()}")
        
        me_logout_data = me_after_logout.json()
        if me_logout_data.get("user") is not None:
            print("❌ Session not properly cleared after logout")
            return False
        
        print("✅ Session properly cleared after logout")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server. Is it running?")
        return False
    except Exception as e:
        print(f"❌ Error during auth flow test: {e}")
        return False

def test_clubs_endpoint():
    """Test the clubs endpoint that frontend uses"""
    print("\n🧪 Testing Clubs Endpoint")
    print("=" * 40)
    
    try:
        response = requests.get(
            f"{BASE_URL}/club/all",
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Clubs Status: {response.status_code}")
        if response.status_code == 200:
            clubs_data = response.json()
            print(f"Number of clubs: {len(clubs_data)}")
            if clubs_data:
                print(f"Sample club: {clubs_data[0]}")
            print("✅ Clubs endpoint working")
            return True
        else:
            print(f"❌ Clubs endpoint failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing clubs endpoint: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Enhanced Authentication & API Tests")
    print("=" * 70)
    
    tests = [
        ("Complete Auth Flow", test_complete_auth_flow),
        ("Clubs Endpoint", test_clubs_endpoint)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n▶️  Running: {test_name}")
        if test_func():
            passed += 1
        print("-" * 50)
    
    print("\n" + "=" * 70)
    print(f"📊 Final Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All authentication and API endpoints working correctly!")
        print("✅ Frontend can safely use the backend services!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the backend configuration.")
        print("🔧 Make sure the backend server is running on port 5000")
        return 1

if __name__ == "__main__":
    sys.exit(main())