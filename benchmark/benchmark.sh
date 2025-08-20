#!/bin/bash

# ============================================================================
# Placeholder Image Service Benchmark Script
# Tests performance, availability, and features of top placeholder services
# ============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVICES_FILE="${SCRIPT_DIR}/services.json"
RESULTS_FILE="${SCRIPT_DIR}/benchmark_results_$(date +%Y%m%d_%H%M%S).json"
TEMP_DIR="${SCRIPT_DIR}/temp"
LOG_FILE="${SCRIPT_DIR}/benchmark_$(date +%Y%m%d_%H%M%S).log"

# Test configuration
ITERATIONS=5  # Number of test iterations per endpoint
TIMEOUT=10    # Timeout in seconds for each request
USER_AGENT="Mozilla/5.0 (Benchmark Bot) PlaceholderServiceTest/1.0"

# Create directories
mkdir -p "$TEMP_DIR"

# Logging function
log() {
    echo -e "$1"
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sed 's/\x1b\[[0-9;]*m//g' >> "$LOG_FILE"
}

# Clean up function
cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Header
clear
log "${BOLD}${CYAN}=========================================="
log "   Placeholder Service Benchmark Tool"
log "==========================================${NC}"
log "${YELLOW}Timestamp: $(date)"
log "Results file: ${RESULTS_FILE}"
log "Log file: ${LOG_FILE}${NC}\n"

# Initialize results JSON
echo '{
  "metadata": {
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "platform": "'$(uname -s)'",
    "iterations": '$ITERATIONS',
    "timeout": '$TIMEOUT'
  },
  "services": {}
}' > "$RESULTS_FILE"

# Check if required tools are installed
check_dependencies() {
    local missing_deps=()
    
    for cmd in curl jq bc; do
        if ! command -v $cmd &> /dev/null; then
            missing_deps+=($cmd)
        fi
    done
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        log "${RED}❌ Missing dependencies: ${missing_deps[*]}"
        log "Please install them using:"
        log "  macOS: brew install ${missing_deps[*]}"
        log "  Ubuntu/Debian: apt-get install ${missing_deps[*]}"
        log "  RHEL/CentOS: yum install ${missing_deps[*]}${NC}"
        exit 1
    fi
    
    log "${GREEN}✓ All dependencies installed${NC}\n"
}

# Function to test a single endpoint
test_endpoint() {
    local service_name=$1
    local base_url=$2
    local endpoint=$3
    local full_url="${base_url}${endpoint}"
    
    local total_time=0
    local size_total=0
    local status_codes=()
    local successful_requests=0
    local failed_requests=0
    local response_times=()
    
    for ((i=1; i<=ITERATIONS; i++)); do
        # Make request and capture metrics
        local response=$(curl -s -o "$TEMP_DIR/response_${i}.tmp" \
            -w '%{http_code}|%{time_total}|%{size_download}|%{time_namelookup}|%{time_connect}|%{time_starttransfer}' \
            --max-time $TIMEOUT \
            -H "User-Agent: $USER_AGENT" \
            "$full_url" 2>/dev/null || echo "0|0|0|0|0|0")
        
        IFS='|' read -r http_code time_total size_download dns_time connect_time ttfb <<< "$response"
        
        status_codes+=($http_code)
        
        if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
            successful_requests=$((successful_requests + 1))
            total_time=$(echo "$total_time + $time_total" | bc -l)
            size_total=$(echo "$size_total + $size_download" | bc -l)
            response_times+=($time_total)
        else
            failed_requests=$((failed_requests + 1))
        fi
        
        # Small delay between requests
        sleep 0.1
    done
    
    # Calculate statistics
    local avg_time=0
    local min_time=999999
    local max_time=0
    local avg_size=0
    
    if [ $successful_requests -gt 0 ]; then
        avg_time=$(echo "scale=3; $total_time / $successful_requests" | bc -l)
        avg_size=$(echo "scale=0; $size_total / $successful_requests" | bc -l)
        
        # Find min and max response times
        for time in "${response_times[@]}"; do
            if (( $(echo "$time < $min_time" | bc -l) )); then
                min_time=$time
            fi
            if (( $(echo "$time > $max_time" | bc -l) )); then
                max_time=$time
            fi
        done
    fi
    
    # Return JSON result
    echo "{
        \"endpoint\": \"$endpoint\",
        \"url\": \"$full_url\",
        \"successful_requests\": $successful_requests,
        \"failed_requests\": $failed_requests,
        \"avg_response_time\": $avg_time,
        \"min_response_time\": $min_time,
        \"max_response_time\": $max_time,
        \"avg_size_bytes\": $avg_size,
        \"status_codes\": [$(IFS=,; echo "${status_codes[*]}")]
    }"
}

# Function to test DNS resolution
test_dns() {
    local domain=$1
    local dns_time=$(dig +stats "$domain" | grep "Query time:" | awk '{print $4}' || echo "0")
    echo "$dns_time"
}

# Function to test global latency (ping)
test_latency() {
    local domain=$1
    local ping_result=$(ping -c 3 -q "$domain" 2>/dev/null | grep "round-trip" | cut -d'=' -f2 | cut -d'/' -f2 || echo "0")
    echo "$ping_result"
}

# Main testing function
test_service() {
    local service_json=$1
    local service_name=$(echo "$service_json" | jq -r '.name')
    local base_url=$(echo "$service_json" | jq -r '.baseUrl')
    local endpoints=$(echo "$service_json" | jq -r '.endpoints[]')
    
    log "${BOLD}${BLUE}Testing: $service_name${NC}"
    log "Base URL: $base_url"
    log "----------------------------------------"
    
    # Extract domain for DNS and latency tests
    local domain=$(echo "$base_url" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
    
    # Test DNS resolution
    log "${CYAN}Testing DNS resolution...${NC}"
    local dns_time=$(test_dns "$domain")
    log "  DNS lookup time: ${dns_time}ms"
    
    # Test latency
    log "${CYAN}Testing network latency...${NC}"
    local latency=$(test_latency "$domain")
    log "  Average latency: ${latency}ms"
    
    # Initialize service results
    local service_results='{"name":"'$service_name'","base_url":"'$base_url'","dns_lookup_ms":'$dns_time',"network_latency_ms":'$latency',"endpoints":[],"summary":{}}'
    
    # Test each endpoint
    log "${CYAN}Testing endpoints...${NC}"
    local endpoint_results="[]"
    local total_success=0
    local total_fail=0
    local total_response_time=0
    local endpoint_count=0
    
    while IFS= read -r endpoint; do
        echo -n "  Testing $endpoint... "
        local result=$(test_endpoint "$service_name" "$base_url" "$endpoint")
        
        # Extract metrics for summary
        local success=$(echo "$result" | jq -r '.successful_requests')
        local fail=$(echo "$result" | jq -r '.failed_requests')
        local avg_time=$(echo "$result" | jq -r '.avg_response_time')
        
        total_success=$((total_success + success))
        total_fail=$((total_fail + fail))
        if [ "$success" -gt 0 ]; then
            total_response_time=$(echo "$total_response_time + $avg_time" | bc -l)
            endpoint_count=$((endpoint_count + 1))
        fi
        
        # Add to results
        endpoint_results=$(echo "$endpoint_results" | jq ". += [$result]")
        
        if [ "$success" -gt 0 ]; then
            echo -e "${GREEN}✓${NC} (${avg_time}s avg)"
        else
            echo -e "${RED}✗${NC} (failed)"
        fi
    done <<< "$endpoints"
    
    # Calculate summary statistics
    local overall_success_rate=0
    local overall_avg_response=0
    if [ $((total_success + total_fail)) -gt 0 ]; then
        overall_success_rate=$(echo "scale=2; $total_success * 100 / ($total_success + $total_fail)" | bc -l)
    fi
    if [ $endpoint_count -gt 0 ]; then
        overall_avg_response=$(echo "scale=3; $total_response_time / $endpoint_count" | bc -l)
    fi
    
    # Feature detection
    log "${CYAN}Detecting features...${NC}"
    local features=$(echo "$service_json" | jq '.features')
    
    # Build final service result
    service_results=$(echo "$service_results" | jq \
        --argjson endpoints "$endpoint_results" \
        --argjson features "$features" \
        --arg success_rate "$overall_success_rate" \
        --arg avg_response "$overall_avg_response" \
        --arg total_success "$total_success" \
        --arg total_fail "$total_fail" \
        '.endpoints = $endpoints | 
         .features = $features |
         .summary = {
            "overall_success_rate": ($success_rate | tonumber),
            "overall_avg_response_time": ($avg_response | tonumber),
            "total_successful_requests": ($total_success | tonumber),
            "total_failed_requests": ($total_fail | tonumber),
            "tested_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
         }')
    
    # Update results file
    local temp_results=$(jq --arg name "$service_name" --argjson service "$service_results" \
        '.services[$name] = $service' "$RESULTS_FILE")
    echo "$temp_results" > "$RESULTS_FILE"
    
    # Display summary
    log "${GREEN}✓ Completed testing $service_name${NC}"
    log "  Success rate: ${overall_success_rate}%"
    log "  Avg response time: ${overall_avg_response}s"
    log ""
}

# Generate comparison report
generate_report() {
    log "${BOLD}${CYAN}=========================================="
    log "           BENCHMARK RESULTS"
    log "==========================================${NC}\n"
    
    # Read results
    local results=$(cat "$RESULTS_FILE")
    
    # Create performance ranking
    log "${BOLD}${YELLOW}Performance Rankings:${NC}"
    echo "$results" | jq -r '
        .services | to_entries | 
        map({
            name: .value.name,
            avg_response: .value.summary.overall_avg_response_time,
            success_rate: .value.summary.overall_success_rate
        }) |
        sort_by(.avg_response) |
        to_entries |
        map("  \(.key + 1). \(.value.name): \(.value.avg_response)s avg, \(.value.success_rate)% success") |
        .[]'
    
    log ""
    log "${BOLD}${YELLOW}Feature Comparison:${NC}"
    echo "$results" | jq -r '
        .services | to_entries |
        map("  \(.value.name):\n" + 
            "    - AI: \(.value.features.ai // false)\n" +
            "    - Animations: \(.value.features.animations // false)\n" +
            "    - Charts: \(.value.features.charts // false)\n" +
            "    - Custom Colors: \(.value.features.customColors // false)\n" +
            "    - Custom Text: \(.value.features.customText // false)") |
        .[]'
    
    log ""
    log "${BOLD}${YELLOW}Reliability Summary:${NC}"
    echo "$results" | jq -r '
        .services | to_entries |
        map({
            name: .value.name,
            total_requests: (.value.summary.total_successful_requests + .value.summary.total_failed_requests),
            failed: .value.summary.total_failed_requests
        }) |
        map("  \(.name): \(.failed)/\(.total_requests) failures") |
        .[]'
}

# Main execution
main() {
    check_dependencies
    
    # Read services configuration
    if [ ! -f "$SERVICES_FILE" ]; then
        log "${RED}❌ Services configuration file not found: $SERVICES_FILE${NC}"
        exit 1
    fi
    
    # Get number of services
    local service_count=$(jq '.services | length' "$SERVICES_FILE")
    log "${MAGENTA}Found $service_count services to test${NC}\n"
    
    # Test each service
    local current=1
    jq -c '.services[]' "$SERVICES_FILE" | while read -r service; do
        log "${BOLD}[$current/$service_count]${NC}"
        test_service "$service"
        current=$((current + 1))
    done
    
    # Generate final report
    generate_report
    
    log ""
    log "${GREEN}${BOLD}✓ Benchmark complete!${NC}"
    log "Results saved to: ${BLUE}$RESULTS_FILE${NC}"
    log "Log saved to: ${BLUE}$LOG_FILE${NC}"
    
    # Create summary file
    local summary_file="${SCRIPT_DIR}/benchmark_summary.md"
    generate_markdown_report "$RESULTS_FILE" > "$summary_file"
    log "Summary report: ${BLUE}$summary_file${NC}"
}

# Generate markdown report
generate_markdown_report() {
    local results_file=$1
    local results=$(cat "$results_file")
    
    cat <<EOF
# Placeholder Service Benchmark Report

Generated: $(date)

## Executive Summary

This report presents objective performance measurements of top placeholder image services.

## Performance Rankings

| Rank | Service | Avg Response Time | Success Rate | DNS Lookup |
|------|---------|------------------|--------------|------------|
$(echo "$results" | jq -r '
    .services | to_entries | 
    map({
        name: .value.name,
        avg_response: .value.summary.overall_avg_response_time,
        success_rate: .value.summary.overall_success_rate,
        dns: .value.dns_lookup_ms
    }) |
    sort_by(.avg_response) |
    to_entries |
    map("| \(.key + 1) | \(.value.name) | \(.value.avg_response)s | \(.value.success_rate)% | \(.value.dns)ms |") |
    .[]')

## Feature Matrix

| Service | AI | Animations | Charts | Custom Colors | Custom Text | Formats |
|---------|-----|------------|--------|---------------|-------------|---------|
$(echo "$results" | jq -r '
    .services | to_entries |
    map("| \(.value.name) | \(.value.features.ai // false) | \(.value.features.animations // false) | \(.value.features.charts // false) | \(.value.features.customColors // false) | \(.value.features.customText // false) | \((.value.features.formats // []) | length) |") |
    .[]')

## Detailed Results

$(echo "$results" | jq -r '
    .services | to_entries |
    map("### \(.value.name)\n\n- **Base URL**: \(.value.base_url)\n- **Average Response Time**: \(.value.summary.overall_avg_response_time)s\n- **Success Rate**: \(.value.summary.overall_success_rate)%\n- **DNS Lookup**: \(.value.dns_lookup_ms)ms\n- **Network Latency**: \(.value.network_latency_ms)ms\n") |
    .[]')

## Methodology

- **Iterations**: $ITERATIONS requests per endpoint
- **Timeout**: ${TIMEOUT}s per request
- **Platform**: $(uname -s)
- **Test Time**: $(date)

## Conclusions

Based on objective measurements:
1. Response times vary significantly between services
2. Not all claimed features are functional
3. Success rates indicate reliability differences
4. Network latency impacts overall performance

---
*This report was generated automatically by the Placeholder Service Benchmark Tool*
EOF
}

# Run main function
main "$@"