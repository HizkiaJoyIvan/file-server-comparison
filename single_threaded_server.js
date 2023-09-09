const http = require('http');
const fs = require('fs');
const path = require('path');

const fileNames = ['index1.html', 'index2.html', 'index3.html']; // Add more as needed
let currentIndex = 0;

const server = http.createServer((req, res) => {
    const startTime = Date.now(); // Start measuring request handling speed

    const isCacheHit = Math.random() < 2/3;
    const selectedFileName = fileNames[currentIndex];
    const filePath = path.join(__dirname, selectedFileName);

    setTimeout(() => {
        if(isCacheHit){
            fs.readFile(filePath, (err, data) => {
                if(err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain'});
                    res.end('File not found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html'});
                    res.end(data);
                    const endTime = Date.now(); // End measuring request handling speed
                    console.log(`Request handled in ${endTime - startTime} milliseconds`);
                }
                currentIndex = (currentIndex + 1) % fileNames.length; // Move to the next file
            });
        } else {
            setTimeout(() => {
                fs.readFile(filePath, (err, data) => {
                    if(err) {
                        res.writeHead(404, { 'Content-Type': 'text/plain'});
                        res.end('File not found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html'});
                        res.end(data);
                        const endTime = Date.now(); // End measuring request handling speed
                        console.log(`Request handled in ${endTime - startTime} milliseconds`);
                    }
                    currentIndex = (currentIndex + 1) % fileNames.length; // Move to the next file
                });
            }, 75);
        }
    }, 15);
});

const port = 3000;
server.listen(port, () => {
    console.log(`Single-threaded server listening on port ${port}`);
});