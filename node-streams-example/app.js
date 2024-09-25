// app.js

const fs = require('fs');
const { Transform, Duplex } = require('stream');

// Step 1: Readable Stream
function readFromFile() {
    const readableStream = fs.createReadStream('input.txt', { encoding: 'utf8' });

    readableStream.on('data', (chunk) => {
        console.log('Read chunk:', chunk);
    });

    readableStream.on('end', () => {
        console.log('Finished reading from file.');
    });

    readableStream.on('error', (err) => {
        console.error('Error reading file:', err);
    });
}

// Step 2: Writable Stream
function writeToFile() {
    const writableStream = fs.createWriteStream('output.txt', { encoding: 'utf8' });
    
    writableStream.write('Hello, this is a writable stream!\n');
    writableStream.write('We are writing data to output.txt.\n');
    writableStream.end();
    
    writableStream.on('finish', () => {
        console.log('Data written to output.txt successfully.');
    });

    writableStream.on('error', (err) => {
        console.error('Error writing to file:', err);
    });
}

// Step 3: Duplex Stream
function duplexStreamExample() {
    const duplexStream = new Duplex({
        read(size) {
            this.push('Duplex stream data\n');
            this.push(null); // Signal end of stream
        },
        write(chunk, encoding, callback) {
            console.log('Duplex stream received:', chunk.toString());
            callback();
        }
    });

    duplexStream.on('data', (data) => {
        console.log('Data from duplex stream:', data.toString());
    });

    duplexStream.pipe(fs.createWriteStream('duplexOutput.txt'));
}

// Step 4: Transform Stream
function transformStreamExample() {
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            const modifiedChunk = chunk.toString().toUpperCase();
            callback(null, modifiedChunk);
        }
    });

    const readableStream = fs.createReadStream('input.txt', { encoding: 'utf8' });
    const writableStream = fs.createWriteStream('transformOutput.txt', { encoding: 'utf8' });

    readableStream.pipe(transformStream).pipe(writableStream);

    writableStream.on('finish', () => {
        console.log('Data transformed and written to transformOutput.txt successfully.');
    });

    writableStream.on('error', (err) => {
        console.error('Error writing transformed data:', err);
    });
}

// Create a sample input file and execute all functions
fs.writeFile('input.txt', 'This is a test file.\nIt contains multiple lines.\n', 'utf8', (err) => {
    if (err) {
        return console.error('Error creating input file:', err);
    }
    console.log('Input file created.');

    writeToFile();
    readFromFile();
    duplexStreamExample();
    transformStreamExample();
});
