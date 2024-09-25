const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// Constants
const PORT = 3007;
const DIRECTORY = path.join(__dirname, 'files');
const FILE_NAME = 'example.txt';

// Ensure the directory exists
if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

// Event emitter for file operations
class FileEventEmitter extends EventEmitter {}
const eventEmitter = new FileEventEmitter();

// Event listener for file creation
eventEmitter.on('fileCreated', (fileName) => {
    console.log(`File: ${fileName} created`);
});

// Create an HTTP server
const httpServer = http.createServer((req, res) => {
    const url = req.url;

    switch (url) {
        case '/create':
            handleFileCreation(res);
            break;

        case '/read':
            handleFileReading(res);
            break;

        case '/update':
            handleFileUpdating(res);
            break;

        case '/delete':
            handleFileDeletion(res);
            break;

        case '/list':
            handleFileListing(res);
            break;

        default:
            res.writeHead(400);
            res.end('Invalid operation');
    }
});

// Handlers for file operations
const handleFileCreation = (res) => {
    const filePath = path.join(DIRECTORY, FILE_NAME);
    fs.writeFile(filePath, 'Hello World!', (error) => {
        if (error) {
            res.writeHead(500);
            return res.end('File not created');
        }
        eventEmitter.emit('fileCreated', FILE_NAME);
        res.writeHead(201);
        res.end('File successfully created');
    });
};

const handleFileReading = (res) => {
    const filePath = path.join(DIRECTORY, FILE_NAME);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end('File not found');
        }
        res.writeHead(200);
        res.end(`File content: ${data}`);
    });
};

const handleFileUpdating = (res) => {
    const filePath = path.join(DIRECTORY, FILE_NAME);
    fs.appendFile(filePath, ' How are we doing!', (error) => {
        if (error) {
            res.writeHead(500);
            return res.end('Error while updating');
        }
        res.writeHead(200);
        res.end('File successfully updated');
    });
};

const handleFileDeletion = (res) => {
    const filePath = path.join(DIRECTORY, FILE_NAME);
    fs.unlink(filePath, (error) => {
        if (error) {
            res.writeHead(500);
            return res.end('File not deleted');
        }
        res.writeHead(200);
        res.end('File successfully deleted');
    });
};

const handleFileListing = (res) => {
    fs.readdir(DIRECTORY, (err, files) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error reading directory');
        }
        res.writeHead(200);
        res.end(`Files: ${files.join(', ')}`);
    });
};

// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
