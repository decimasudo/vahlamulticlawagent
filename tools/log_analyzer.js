const fs = require('fs');
const readline = require('readline');
const path = require('path');

/**
 * VAHLA LOG ANALYTICS TOOL
 * Parses server logs to generate statistical reports.
 */

const CONFIG = {
    logDir: './logs',
    outputReport: './reports/daily_summary.json',
    errorThreshold: 50
};

class Analyzer {
    constructor() {
        this.stats = {
            totalLines: 0,
            errorCount: 0,
            warningCount: 0,
            ipAddresses: new Set(),
            endpoints: {},
            hourlyDistribution: new Array(24).fill(0)
        };
    }

    async processFile(filePath) {
        console.log(`Analyzing: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            console.error("File not found, skipping.");
            return;
        }

        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            this.parseLine(line);
        }
    }

    parseLine(line) {
        this.stats.totalLines++;
        
        // Regex for standard NGINX/Apache log format
        // IP - - [Date] "METHOD URL" Status Size
        const regex = /^(\S+) - - \[(.*?)\] "(.*?)" (\d+) (\d+)/;
        const match = line.match(regex);

        if (match) {
            const ip = match[1];
            const timestamp = match[2];
            const request = match[3];
            const status = parseInt(match[4]);

            this.stats.ipAddresses.add(ip);
            
            // Track Status Codes
            if (status >= 400 && status < 500) this.stats.warningCount++;
            if (status >= 500) this.stats.errorCount++;

            // Track Endpoint Popularity
            const url = request.split(' ')[1] || 'unknown';
            this.stats.endpoints[url] = (this.stats.endpoints[url] || 0) + 1;

            // Track Hourly Distribution
            // Example date: 10/Oct/2023:13:55:36
            const hour = timestamp.split(':')[1];
            if (hour) {
                const hourInt = parseInt(hour, 10);
                if (!isNaN(hourInt) && hourInt >= 0 && hourInt < 24) {
                    this.stats.hourlyDistribution[hourInt]++;
                }
            }
        }
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: {
                total_requests: this.stats.totalLines,
                unique_visitors: this.stats.ipAddresses.size,
                server_errors: this.stats.errorCount,
                client_errors: this.stats.warningCount,
            },
            top_endpoints: Object.entries(this.stats.endpoints)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5),
            peak_traffic_hour: this.stats.hourlyDistribution.indexOf(
                Math.max(...this.stats.hourlyDistribution)
            )
        };

        return JSON.stringify(report, null, 2);
    }
}

// Mock Log Generator for Testing
function createMockLog() {
    if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
    const content = [];
    const methods = ['GET', 'POST', 'PUT'];
    const paths = ['/api/v1/auth', '/dashboard', '/assets/main.css', '/api/v1/agent'];
    
    for (let i = 0; i < 5000; i++) {
        const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;
        const date = `10/Oct/2023:${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:00:00`;
        const method = methods[Math.floor(Math.random() * methods.length)];
        const path = paths[Math.floor(Math.random() * paths.length)];
        const status = Math.random() > 0.9 ? 500 : 200;
        
        content.push(`${ip} - - [${date}] "${method} ${path} HTTP/1.1" ${status} 1024`);
    }
    
    fs.writeFileSync('./logs/access.log', content.join('\n'));
}

async function main() {
    createMockLog();
    
    const analyzer = new Analyzer();
    await analyzer.processFile('./logs/access.log');
    
    const report = analyzer.generateReport();
    console.log("Analysis Complete. Summary:");
    console.log(report);
    
    if (!fs.existsSync('./reports')) fs.mkdirSync('./reports');
    fs.writeFileSync(CONFIG.outputReport, report);
}

main().catch(console.error);
