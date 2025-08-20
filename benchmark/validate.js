#!/usr/bin/env node

/**
 * Node.js Placeholder Service Validator
 * Tests services from a JavaScript/Node.js perspective
 */

const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

class ServiceValidator {
    constructor(configFile = 'services.json') {
        this.configFile = configFile;
        this.results = [];
        this.services = [];
    }

    async loadConfig() {
        try {
            const data = await fs.readFile(this.configFile, 'utf8');
            const config = JSON.parse(data);
            this.services = config.services;
            console.log(`${colors.green}✓${colors.reset} Loaded ${this.services.length} services from config`);
        } catch (error) {
            console.error(`${colors.red}✗${colors.reset} Failed to load config:`, error.message);
            process.exit(1);
        }
    }

    makeRequest(url) {
        return new Promise((resolve, reject) => {
            const startTime = performance.now();
            const parsedUrl = new URL(url);
            const protocol = parsedUrl.protocol === 'https:' ? https : http;

            const options = {
                hostname: parsedUrl.hostname,
                path: parsedUrl.pathname + parsedUrl.search,
                method: 'GET',
                headers: {
                    'User-Agent': 'NodeJS-PlaceholderValidator/1.0'
                },
                timeout: 10000
            };

            const req = protocol.request(options, (res) => {
                let data = Buffer.alloc(0);

                res.on('data', (chunk) => {
                    data = Buffer.concat([data, chunk]);
                });

                res.on('end', () => {
                    const endTime = performance.now();
                    resolve({
                        success: res.statusCode === 200,
                        statusCode: res.statusCode,
                        headers: res.headers,
                        contentType: res.headers['content-type'],
                        contentLength: data.length,
                        responseTime: endTime - startTime,
                        data: data
                    });
                });
            });

            req.on('error', (error) => {
                const endTime = performance.now();
                resolve({
                    success: false,
                    error: error.message,
                    responseTime: endTime - startTime
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    error: 'Request timeout',
                    responseTime: 10000
                });
            });

            req.end();
        });
    }

    async testEndpoint(baseUrl, endpoint, iterations = 3) {
        const url = baseUrl + endpoint;
        const results = [];

        for (let i = 0; i < iterations; i++) {
            const result = await this.makeRequest(url);
            results.push(result);
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Calculate statistics
        const successfulResults = results.filter(r => r.success);
        const avgResponseTime = successfulResults.length > 0
            ? successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length
            : null;

        return {
            endpoint,
            url,
            successRate: (successfulResults.length / results.length) * 100,
            avgResponseTime: avgResponseTime ? Math.round(avgResponseTime) : null,
            contentType: successfulResults[0]?.contentType || null,
            avgSize: successfulResults.length > 0
                ? Math.round(successfulResults.reduce((sum, r) => sum + r.contentLength, 0) / successfulResults.length)
                : null,
            results: results.map(r => ({
                success: r.success,
                statusCode: r.statusCode,
                responseTime: Math.round(r.responseTime),
                error: r.error
            }))
        };
    }

    async testService(service) {
        console.log(`\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`);
        console.log(`${colors.bright}Testing: ${service.name}${colors.reset}`);
        console.log(`Base URL: ${service.baseUrl}`);
        console.log(`${'='.repeat(60)}`);

        const serviceResult = {
            name: service.name,
            baseUrl: service.baseUrl,
            testedAt: new Date().toISOString(),
            endpoints: [],
            summary: {}
        };

        // Test each endpoint
        for (const endpoint of service.endpoints) {
            process.stdout.write(`  Testing ${endpoint}... `);
            const result = await this.testEndpoint(service.baseUrl, endpoint);
            serviceResult.endpoints.push(result);

            if (result.successRate > 0) {
                console.log(`${colors.green}✓${colors.reset} (${result.avgResponseTime}ms)`);
            } else {
                console.log(`${colors.red}✗${colors.reset} (failed)`);
            }
        }

        // Calculate summary
        const successfulEndpoints = serviceResult.endpoints.filter(e => e.successRate > 0);
        serviceResult.summary = {
            totalEndpoints: serviceResult.endpoints.length,
            successfulEndpoints: successfulEndpoints.length,
            overallSuccessRate: (successfulEndpoints.length / serviceResult.endpoints.length) * 100,
            avgResponseTime: successfulEndpoints.length > 0
                ? Math.round(successfulEndpoints.reduce((sum, e) => sum + e.avgResponseTime, 0) / successfulEndpoints.length)
                : null,
            featuresDetected: this.detectFeatures(serviceResult.endpoints, service)
        };

        return serviceResult;
    }

    detectFeatures(endpoints, service) {
        const features = {
            formats: new Set(),
            customColors: false,
            customText: false,
            ai: false,
            animations: false,
            charts: false
        };

        for (const endpoint of endpoints) {
            if (endpoint.successRate === 0) continue;

            // Detect formats
            const contentType = endpoint.contentType?.toLowerCase() || '';
            if (contentType.includes('svg')) features.formats.add('svg');
            if (contentType.includes('png')) features.formats.add('png');
            if (contentType.includes('jpeg') || contentType.includes('jpg')) features.formats.add('jpg');
            if (contentType.includes('webp')) features.formats.add('webp');
            if (contentType.includes('gif')) features.formats.add('gif');
            if (contentType.includes('avif')) features.formats.add('avif');

            // Detect features based on endpoint
            if (endpoint.endpoint.includes('3B82F6') || endpoint.endpoint.includes('7C3AED')) {
                features.customColors = true;
            }
            if (endpoint.endpoint.includes('text=') || endpoint.endpoint.includes('Test')) {
                features.customText = true;
            }
            if (endpoint.endpoint.includes('/ai/')) {
                features.ai = true;
            }
            if (endpoint.endpoint.includes('skeleton') || endpoint.endpoint.includes('pulse')) {
                features.animations = true;
            }
            if (endpoint.endpoint.includes('chart')) {
                features.charts = true;
            }
        }

        return {
            formatsWorking: Array.from(features.formats),
            customColorsWorking: features.customColors,
            customTextWorking: features.customText,
            aiWorking: features.ai,
            animationsWorking: features.animations,
            chartsWorking: features.charts
        };
    }

    async runValidation() {
        console.log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
        console.log(`${colors.bright}PLACEHOLDER SERVICE VALIDATION${colors.reset}`);
        console.log(`Started: ${new Date().toISOString()}`);
        console.log(`${'='.repeat(60)}`);

        await this.loadConfig();

        const allResults = {
            metadata: {
                timestamp: new Date().toISOString(),
                platform: process.platform,
                nodeVersion: process.version
            },
            services: []
        };

        // Test each service
        for (const service of this.services) {
            const result = await this.testService(service);
            allResults.services.push(result);
        }

        // Generate rankings
        allResults.rankings = this.generateRankings(allResults.services);

        // Save results
        const outputFile = `nodejs_results_${Date.now()}.json`;
        await fs.writeFile(outputFile, JSON.stringify(allResults, null, 2));

        console.log(`\n${colors.bright}${colors.green}${'='.repeat(60)}${colors.reset}`);
        console.log(`${colors.bright}VALIDATION COMPLETE${colors.reset}`);
        console.log(`Results saved to: ${colors.blue}${outputFile}${colors.reset}`);
        console.log(`${'='.repeat(60)}`);

        this.printSummary(allResults);

        return allResults;
    }

    generateRankings(services) {
        // Performance ranking
        const performance = services
            .filter(s => s.summary.avgResponseTime !== null)
            .map(s => ({
                name: s.name,
                avgResponseTime: s.summary.avgResponseTime,
                successRate: s.summary.overallSuccessRate
            }))
            .sort((a, b) => a.avgResponseTime - b.avgResponseTime);

        // Reliability ranking
        const reliability = [...performance].sort((a, b) => b.successRate - a.successRate);

        // Feature ranking
        const features = services.map(s => {
            const detected = s.summary.featuresDetected;
            let score = 0;
            
            score += detected.formatsWorking.length;
            score += detected.customColorsWorking ? 1 : 0;
            score += detected.customTextWorking ? 1 : 0;
            score += detected.aiWorking ? 3 : 0;
            score += detected.animationsWorking ? 3 : 0;
            score += detected.chartsWorking ? 3 : 0;

            return {
                name: s.name,
                featureScore: score,
                formats: detected.formatsWorking.length,
                advancedFeatures: [
                    detected.aiWorking,
                    detected.animationsWorking,
                    detected.chartsWorking
                ].filter(Boolean).length
            };
        }).sort((a, b) => b.featureScore - a.featureScore);

        return { performance, reliability, features };
    }

    printSummary(results) {
        console.log(`\n${colors.bright}${colors.yellow}PERFORMANCE RANKINGS:${colors.reset}`);
        results.rankings.performance.slice(0, 5).forEach((s, i) => {
            console.log(`  ${i + 1}. ${s.name}: ${s.avgResponseTime}ms (${s.successRate.toFixed(1)}% success)`);
        });

        console.log(`\n${colors.bright}${colors.yellow}RELIABILITY RANKINGS:${colors.reset}`);
        results.rankings.reliability.slice(0, 5).forEach((s, i) => {
            console.log(`  ${i + 1}. ${s.name}: ${s.successRate.toFixed(1)}% success rate`);
        });

        console.log(`\n${colors.bright}${colors.yellow}FEATURE RANKINGS:${colors.reset}`);
        results.rankings.features.slice(0, 5).forEach((s, i) => {
            console.log(`  ${i + 1}. ${s.name}: Score ${s.featureScore} (${s.formats} formats, ${s.advancedFeatures} advanced)`);
        });

        // Highlight unique features
        console.log(`\n${colors.bright}${colors.yellow}UNIQUE FEATURES DETECTED:${colors.reset}`);
        for (const service of results.services) {
            const features = service.summary.featuresDetected;
            const unique = [];
            
            if (features.aiWorking) unique.push('AI');
            if (features.animationsWorking) unique.push('Animations');
            if (features.chartsWorking) unique.push('Charts');
            
            if (unique.length > 0) {
                console.log(`  • ${service.name}: ${unique.join(', ')}`);
            }
        }
    }
}

// Main execution
async function main() {
    const validator = new ServiceValidator();
    
    try {
        await validator.runValidation();
        process.exit(0);
    } catch (error) {
        console.error(`${colors.red}Fatal error:${colors.reset}`, error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}