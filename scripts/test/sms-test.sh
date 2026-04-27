#!/bin/bash

##############################################################################
#
# SMS Integration Test Suite - e-Vaccin
# 
# Usage: ./sms-test.sh [--provider=mock|twilio] [--quiet]
# 
# This script performs automated testing of the SMS notification system
# including sending notifications, checking status, and verifying responses.
#
##############################################################################

set -o pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="http://localhost:8080"
SMS_PROVIDER="mock"
QUIET=false
TEST_RESULTS=()
PASSED=0
FAILED=0

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --provider=*)
            SMS_PROVIDER="${1#*=}"
            shift
            ;;
        --quiet)
            QUIET=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

###############################################################################
# Helper Functions
###############################################################################

log_info() {
    if [ "$QUIET" = false ]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    fi
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED++))
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED++))
}

log_warning() {
    if [ "$QUIET" = false ]; then
        echo -e "${YELLOW}[WARN]${NC} $1"
    fi
}

# Check if API is running
check_api_health() {
    log_info "Checking API health..."
    response=$(curl -s -w "\n%{http_code}" -X GET "$API_BASE_URL/api/notifications/stats" 2>/dev/null)
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" -eq 200 ]; then
        log_success "API is running and responding (HTTP $http_code)"
        return 0
    else
        log_error "API returned HTTP $http_code. Is backend running on port 8080?"
        return 1
    fi
}

# Parse JSON response and extract field
extract_json_field() {
    local json="$1"
    local field="$2"
    echo "$json" | grep -o "\"$field\"[^,]*" | head -1 | cut -d':' -f2 | xargs
}

# Make API call with logging
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    log_info "Testing: $description"
    log_info "  Method: $method $endpoint"
    
    if [ -n "$data" ]; then
        log_info "  Data: $data"
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "X-User-Id: 1" \
            -d "$data" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "X-User-Id: 1" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        log_success "Response HTTP $http_code"
        if [ "$QUIET" = false ]; then
            echo "  Response: $body" | head -c 200
            echo "..."
        fi
        echo "$body"
    else
        log_error "Response HTTP $http_code"
        if [ "$QUIET" = false ]; then
            echo "  Response: $body"
        fi
        echo ""
    fi
}

###############################################################################
# Test Suite
###############################################################################

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     SMS Integration Test Suite - e-Vaccin                     ║${NC}"
echo -e "${BLUE}║     Provider: $SMS_PROVIDER                                              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 1: API Health
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST GROUP 1: API Health & Configuration${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
if ! check_api_health; then
    echo "Cannot proceed without API. Exiting."
    exit 1
fi
echo ""

# Test 2: Get Initial Statistics
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST GROUP 2: Statistics & Monitoring${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

api_call "GET" "/api/notifications/stats" "" "Get initial statistics"
echo ""

# Test 3: Send Custom SMS
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST GROUP 3: Custom SMS Sending${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

response=$(api_call "POST" "/api/notifications/send-sms" \
    '{
        "patientId": 1,
        "phoneNumber": "+221761234567",
        "recipientName": "Test User",
        "message": "Test SMS - Bienvenue sur e-Vaccin",
        "templateType": "CUSTOM"
    }' \
    "Send custom SMS")
echo ""

# Extract notification ID from response (if available)
NOTIFICATION_ID=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

# Test 4: Vaccination Templates
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST GROUP 4: Vaccination Templates${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

api_call "POST" "/api/notifications/vaccination-confirmation" \
    '{
        "patientId": 123,
        "patientName": "Moussa Konaté",
        "guardianPhone": "+221761234567",
        "guardianName": "Fatou Diallo",
        "vaccineName": "BCG"
    }' \
    "Send vaccination confirmation"
echo ""

api_call "POST" "/api/notifications/alert" \
    '{
        "patientId": 456,
        "patientName": "Awa Seck",
        "guardianPhone": "+221765432109",
        "guardianName": "Aminata Ndiaye",
        "reason": "Outbreak detected - polio vaccination urgently needed"
    }' \
    "Send urgent vaccination alert"
echo ""

APPOINTMENT_TIME=$(date -u -d "+25 hours" +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -u -v+25H +%Y-%m-%dT%H:%M:%S)
api_call "POST" "/api/notifications/vaccination-reminder" \
    '{
        "patientId": 789,
        "patientName": "Demba Ba",
        "guardianPhone": "+221769876543",
        "guardianName": "Khadija Ba",
        "vaccineName": "Polio 1",
        "appointmentTime": "'$APPOINTMENT_TIME'",
        "appointmentLocation": "Clinique Dia Dakar"
    }' \
    "Schedule vaccination reminder"
echo ""

# Test 5: Retrieve Notifications
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST GROUP 5: Retrieve Notifications${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

api_call "GET" "/api/notifications/patient/1" "" "Get notifications for patient 1"
echo ""

api_call "GET" "/api/notifications/patient/123" "" "Get notifications for patient 123"
echo ""

if [ -n "$NOTIFICATION_ID" ]; then
    api_call "GET" "/api/notifications/$NOTIFICATION_ID" "" "Get specific notification #$NOTIFICATION_ID"
    echo ""
fi

# Test 6: Final Statistics
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST GROUP 6: Final Verification${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

api_call "GET" "/api/notifications/stats" "" "Get final statistics"
echo ""

# Test 7: Performance Test (Optional)
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST GROUP 7: Performance Check (Non-blocking)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

log_info "Sending 5 SMS rapidly to verify async processing..."
start_time=$(date +%s%N)

for i in {1..5}; do
    curl -s -X POST "$API_BASE_URL/api/notifications/send-sms" \
        -H "Content-Type: application/json" \
        -H "X-User-Id: 1" \
        -d '{
            "patientId": '$(($i + 1000))',
            "phoneNumber": "+221761234567",
            "recipientName": "Guardian '$i'",
            "message": "Batch test SMS #'$i'",
            "templateType": "CUSTOM"
        }' > /dev/null 2>&1 &
done
wait

end_time=$(date +%s%N)
elapsed=$((($end_time - $start_time) / 1000000)) # Convert to milliseconds

if [ $elapsed -lt 2000 ]; then
    log_success "5 SMS sent in ${elapsed}ms (async processing confirmed)"
else
    log_warning "5 SMS took ${elapsed}ms (may indicate blocking behavior)"
fi
echo ""

###############################################################################
# Summary
###############################################################################

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                        TEST SUMMARY                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! SMS integration is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Check the output above for details.${NC}"
    exit 1
fi
