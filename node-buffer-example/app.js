// app.js

const fs = require('fs').promises; // Use the promises API for fs

async function main() {
    try {
        // Step 1: Create a buffer from a string
        const stringData = 'Hello, Buffer!';
        const buffer = Buffer.from(stringData);
        console.log('Buffer:', buffer);

        // Step 2: Write binary data to a file
        const filePath = 'bufferData.bin';
        await fs.writeFile(filePath, buffer);
        console.log('Binary data written to file successfully.');

        // Step 3: Read binary data from the file
        const data = await fs.readFile(filePath);
        console.log('Binary data read from file:', data);

        // Step 4: Convert buffer back to string
        const decodedData = data.toString();
        console.log('Decoded data from buffer:', decodedData);

        // Additional Manipulation: Modify the buffer
        const modifiedBuffer = Buffer.concat([data, Buffer.from(' Goodbye!')]);
        await fs.writeFile(filePath, modifiedBuffer);
        console.log('Modified buffer written to file successfully.');

        // Read and display the modified buffer
        const newData = await fs.readFile(filePath);
        console.log('Modified data read from file:', newData.toString());
    } catch (err) {
        console.error('Error:', err);
    }
}

// Run the main function
main();
