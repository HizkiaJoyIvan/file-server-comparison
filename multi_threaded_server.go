package main

import (
	"fmt"
	"net/http"
	"sync"
)

var fileNames = []string{"index1.html", "index2.html", "index3.html"} // Add more as needed
var currentIndex = 0
var mu sync.Mutex

func handler(w http.ResponseWriter, r *http.Request) {
	startTime := 0
	filePath := ""

	mu.Lock()
	currentIndex = (currentIndex + 1) % len(fileNames)
	selectedFileName := fileNames[currentIndex]
	filePath = selectedFileName
	mu.Unlock()

	isCacheHit := true // Assuming data is always in cache for simplicity

	if !isCacheHit {
		// Simulate disk operation
		startTime = 75
	}

	// Simulate processing time
	startTime += 15

	// Simulate reading file
	fmt.Printf("Request handled in %d milliseconds\n", startTime)
	http.ServeFile(w, r, filePath)
}

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":3001", nil)
}
