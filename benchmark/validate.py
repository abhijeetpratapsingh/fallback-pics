#!/usr/bin/env python3
"""
Advanced Placeholder Service Validator
Tests image generation, formats, and advanced features
"""

import json
import time
import requests
import hashlib
import statistics
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse
import concurrent.futures
import sys
import os
from io import BytesIO

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("Warning: PIL not available. Image validation will be skipped.")
    print("Install with: pip install Pillow")

class PlaceholderServiceTester:
    def __init__(self, services_config: str, output_dir: str = "results"):
        self.services = self.load_config(services_config)
        self.output_dir = output_dir
        self.results = {}
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'PlaceholderServiceValidator/1.0'
        })
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
    def load_config(self, config_file: str) -> List[Dict]:
        """Load services configuration from JSON file"""
        with open(config_file, 'r') as f:
            data = json.load(f)
        return data['services']
    
    def test_endpoint(self, url: str, timeout: int = 10) -> Dict:
        """Test a single endpoint"""
        result = {
            'url': url,
            'success': False,
            'status_code': None,
            'response_time': None,
            'content_type': None,
            'content_length': None,
            'headers': {},
            'error': None,
            'image_info': None
        }
        
        try:
            start_time = time.time()
            response = self.session.get(url, timeout=timeout, stream=True)
            response_time = time.time() - start_time
            
            result['success'] = response.status_code == 200
            result['status_code'] = response.status_code
            result['response_time'] = round(response_time * 1000, 2)  # Convert to ms
            result['content_type'] = response.headers.get('Content-Type', '')
            result['content_length'] = int(response.headers.get('Content-Length', 0))
            
            # Store relevant headers
            relevant_headers = [
                'Cache-Control', 'CDN-Cache-Control', 'X-Cache', 
                'CF-Cache-Status', 'Server', 'X-Powered-By',
                'Access-Control-Allow-Origin', 'Vary'
            ]
            for header in relevant_headers:
                if header in response.headers:
                    result['headers'][header] = response.headers[header]
            
            # Validate image if successful and PIL is available
            if result['success'] and PIL_AVAILABLE:
                result['image_info'] = self.validate_image(response.content, result['content_type'])
                
        except requests.Timeout:
            result['error'] = 'Timeout'
        except requests.ConnectionError:
            result['error'] = 'Connection failed'
        except Exception as e:
            result['error'] = str(e)
            
        return result
    
    def validate_image(self, content: bytes, content_type: str) -> Optional[Dict]:
        """Validate image content and extract metadata"""
        if not content:
            return None
            
        try:
            # Skip SVG validation (text format)
            if 'svg' in content_type.lower():
                return {
                    'format': 'SVG',
                    'valid': True,
                    'size_bytes': len(content)
                }
            
            # Validate raster images
            img = Image.open(BytesIO(content))
            return {
                'format': img.format,
                'width': img.width,
                'height': img.height,
                'mode': img.mode,
                'valid': True,
                'size_bytes': len(content)
            }
        except Exception as e:
            return {
                'valid': False,
                'error': str(e),
                'size_bytes': len(content)
            }
    
    def test_service(self, service: Dict) -> Dict:
        """Test all endpoints for a service"""
        print(f"\n{'='*60}")
        print(f"Testing: {service['name']}")
        print(f"Base URL: {service['baseUrl']}")
        print(f"{'='*60}")
        
        service_results = {
            'name': service['name'],
            'base_url': service['baseUrl'],
            'tested_at': datetime.utcnow().isoformat() + 'Z',
            'endpoints': [],
            'summary': {}
        }
        
        # Test each endpoint
        for endpoint in service['endpoints']:
            url = service['baseUrl'] + endpoint
            print(f"  Testing {endpoint}...", end=' ')
            
            # Run multiple iterations for consistency
            iterations = 3
            results = []
            for _ in range(iterations):
                result = self.test_endpoint(url)
                results.append(result)
                time.sleep(0.1)  # Small delay between requests
            
            # Aggregate results
            successful_results = [r for r in results if r['success']]
            if successful_results:
                avg_response_time = statistics.mean([r['response_time'] for r in successful_results])
                endpoint_result = {
                    'endpoint': endpoint,
                    'url': url,
                    'success_rate': len(successful_results) / len(results) * 100,
                    'avg_response_time': round(avg_response_time, 2),
                    'content_type': successful_results[0]['content_type'],
                    'avg_size': statistics.mean([r['content_length'] for r in successful_results]),
                    'headers': successful_results[0]['headers'],
                    'image_valid': successful_results[0]['image_info']['valid'] if successful_results[0]['image_info'] else None
                }
                print(f"✓ ({avg_response_time:.0f}ms)")
            else:
                endpoint_result = {
                    'endpoint': endpoint,
                    'url': url,
                    'success_rate': 0,
                    'error': results[0]['error'] if results else 'Unknown error'
                }
                print(f"✗ ({results[0]['error'] if results else 'Failed'})")
            
            service_results['endpoints'].append(endpoint_result)
        
        # Calculate summary statistics
        successful_endpoints = [e for e in service_results['endpoints'] if e.get('success_rate', 0) > 0]
        
        service_results['summary'] = {
            'total_endpoints_tested': len(service_results['endpoints']),
            'successful_endpoints': len(successful_endpoints),
            'overall_success_rate': len(successful_endpoints) / len(service_results['endpoints']) * 100 if service_results['endpoints'] else 0,
            'avg_response_time': statistics.mean([e['avg_response_time'] for e in successful_endpoints]) if successful_endpoints else None,
            'features_detected': self.detect_features(service_results['endpoints'], service)
        }
        
        return service_results
    
    def detect_features(self, endpoints: List[Dict], service: Dict) -> Dict:
        """Detect which features are actually working"""
        features = service.get('features', {})
        detected = {}
        
        # Check format support
        formats_found = set()
        for endpoint in endpoints:
            if endpoint.get('success_rate', 0) > 0:
                content_type = endpoint.get('content_type', '').lower()
                if 'svg' in content_type:
                    formats_found.add('svg')
                elif 'png' in content_type:
                    formats_found.add('png')
                elif 'jpeg' in content_type or 'jpg' in content_type:
                    formats_found.add('jpg')
                elif 'webp' in content_type:
                    formats_found.add('webp')
                elif 'gif' in content_type:
                    formats_found.add('gif')
                elif 'avif' in content_type:
                    formats_found.add('avif')
        
        detected['formats_working'] = list(formats_found)
        detected['formats_claimed'] = features.get('formats', [])
        
        # Check if custom colors work
        color_endpoints = [e for e in endpoints if any(c in e['endpoint'] for c in ['3B82F6', '7C3AED', 'FFFFFF'])]
        detected['custom_colors_working'] = any(e.get('success_rate', 0) > 0 for e in color_endpoints)
        
        # Check if custom text works
        text_endpoints = [e for e in endpoints if 'text=' in e['endpoint'] or 'Test' in e['endpoint']]
        detected['custom_text_working'] = any(e.get('success_rate', 0) > 0 for e in text_endpoints)
        
        # Check special features
        detected['ai_endpoints_working'] = any('ai' in e['endpoint'] and e.get('success_rate', 0) > 0 for e in endpoints)
        detected['animation_endpoints_working'] = any('skeleton' in e['endpoint'] and e.get('success_rate', 0) > 0 for e in endpoints)
        detected['chart_endpoints_working'] = any('chart' in e['endpoint'] and e.get('success_rate', 0) > 0 for e in endpoints)
        
        return detected
    
    def run_benchmark(self):
        """Run complete benchmark for all services"""
        print(f"\n{'='*60}")
        print("PLACEHOLDER SERVICE BENCHMARK")
        print(f"Started at: {datetime.now()}")
        print(f"{'='*60}")
        
        all_results = {
            'metadata': {
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'pil_available': PIL_AVAILABLE,
                'services_tested': len(self.services)
            },
            'services': []
        }
        
        # Test each service
        for service in self.services:
            service_result = self.test_service(service)
            all_results['services'].append(service_result)
            
        # Generate rankings
        all_results['rankings'] = self.generate_rankings(all_results['services'])
        
        # Save results
        output_file = os.path.join(self.output_dir, f'validation_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')
        with open(output_file, 'w') as f:
            json.dump(all_results, f, indent=2)
        
        print(f"\n{'='*60}")
        print("BENCHMARK COMPLETE")
        print(f"Results saved to: {output_file}")
        print(f"{'='*60}")
        
        # Print summary
        self.print_summary(all_results)
        
        return all_results
    
    def generate_rankings(self, services: List[Dict]) -> Dict:
        """Generate performance and feature rankings"""
        rankings = {}
        
        # Performance ranking (by response time)
        perf_data = []
        for service in services:
            if service['summary']['avg_response_time']:
                perf_data.append({
                    'name': service['name'],
                    'avg_response_time': service['summary']['avg_response_time'],
                    'success_rate': service['summary']['overall_success_rate']
                })
        
        perf_data.sort(key=lambda x: x['avg_response_time'])
        rankings['performance'] = perf_data
        
        # Reliability ranking (by success rate)
        rel_data = sorted(perf_data, key=lambda x: x['success_rate'], reverse=True)
        rankings['reliability'] = rel_data
        
        # Feature completeness
        feature_data = []
        for service in services:
            features = service['summary']['features_detected']
            feature_score = 0
            
            # Count working features
            if features.get('custom_colors_working'):
                feature_score += 1
            if features.get('custom_text_working'):
                feature_score += 1
            if features.get('ai_endpoints_working'):
                feature_score += 3  # Higher weight for advanced features
            if features.get('animation_endpoints_working'):
                feature_score += 3
            if features.get('chart_endpoints_working'):
                feature_score += 3
            
            feature_score += len(features.get('formats_working', []))
            
            feature_data.append({
                'name': service['name'],
                'feature_score': feature_score,
                'formats': len(features.get('formats_working', [])),
                'advanced_features': sum([
                    features.get('ai_endpoints_working', False),
                    features.get('animation_endpoints_working', False),
                    features.get('chart_endpoints_working', False)
                ])
            })
        
        feature_data.sort(key=lambda x: x['feature_score'], reverse=True)
        rankings['features'] = feature_data
        
        return rankings
    
    def print_summary(self, results: Dict):
        """Print a formatted summary of results"""
        print("\n" + "="*60)
        print("PERFORMANCE RANKINGS")
        print("="*60)
        
        rankings = results['rankings']['performance']
        for i, service in enumerate(rankings[:5], 1):
            print(f"{i}. {service['name']}: {service['avg_response_time']:.0f}ms (Success: {service['success_rate']:.1f}%)")
        
        print("\n" + "="*60)
        print("RELIABILITY RANKINGS")
        print("="*60)
        
        rankings = results['rankings']['reliability']
        for i, service in enumerate(rankings[:5], 1):
            print(f"{i}. {service['name']}: {service['success_rate']:.1f}% success rate")
        
        print("\n" + "="*60)
        print("FEATURE RANKINGS")
        print("="*60)
        
        rankings = results['rankings']['features']
        for i, service in enumerate(rankings[:5], 1):
            print(f"{i}. {service['name']}: Score {service['feature_score']} ({service['formats']} formats, {service['advanced_features']} advanced)")
        
        print("\n" + "="*60)
        print("KEY FINDINGS")
        print("="*60)
        
        # Find services with unique features
        for service in results['services']:
            features = service['summary']['features_detected']
            unique_features = []
            
            if features.get('ai_endpoints_working'):
                unique_features.append("AI Generation")
            if features.get('animation_endpoints_working'):
                unique_features.append("Animations")
            if features.get('chart_endpoints_working'):
                unique_features.append("Charts")
                
            if unique_features:
                print(f"• {service['name']} has unique features: {', '.join(unique_features)}")

if __name__ == "__main__":
    # Check if services.json exists
    if not os.path.exists('services.json'):
        print("Error: services.json not found!")
        print("Please ensure services.json is in the current directory.")
        sys.exit(1)
    
    # Run the benchmark
    tester = PlaceholderServiceTester('services.json')
    results = tester.run_benchmark()