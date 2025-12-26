const express = require('express');
const morgan = require('morgan');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Log buffer
const logs = [];
const MAX_LOGS = 50;

// Override console.log to capture logs
const originalLog = console.log;
console.log = (...args) => {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
    if (logs.length > MAX_LOGS) logs.shift();
    originalLog.apply(console, args);
};

// Custom stream for morgan to capture HTTP logs
const logStream = {
    write: (message) => {
        logs.push(`[${new Date().toLocaleTimeString()}] HTTP: ${message.trim()}`);
        if (logs.length > MAX_LOGS) logs.shift();
        originalLog(message.trim());
    }
};

app.use(morgan('combined', { stream: logStream }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint with system metrics
app.get('/health', (req, res) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = (usedMem / totalMem) * 100;

    // Basic CPU load average (1 minute)
    const cpuLoad = os.loadavg()[0];

    const cpus = os.cpus();
    const cpuCount = cpus.length;

    res.status(200).json({
        status: 'OK',
        uptime: process.uptime(),
        system: {
            memory: {
                total: totalMem,
                free: freeMem,
                used: usedMem,
                percent: memUsage.toFixed(1)
            },
            cpu: {
                load: cpuLoad,
                count: cpuCount
            },
            platform: `${os.type()} ${os.release()}`
        },
        logs: logs.slice().reverse() // Newest first
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`- Operating System: ${os.type()} ${os.release()}`);
    console.log(`- CPU Cores: ${os.cpus().length}`);
    console.log(`- Total Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
});
