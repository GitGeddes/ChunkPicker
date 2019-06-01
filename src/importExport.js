// Combine the two arrays of chunk IDs into one text file
function chunksToJSON() {
    // Combine the arrays as strings to keep them separate
    var packedString = JSON.stringify(JSON.stringify(unlockedChunks) + JSON.stringify(potentialChunks));
    var packedURI = 'data:text/json;charset=utf-8,' + encodeURIComponent(packedString);

    var downloadAnchor = document.createElement("a"); // Create a temporary element
    downloadAnchor.setAttribute("href", packedURI); // Set the link as a download
    downloadAnchor.setAttribute("download", "Chunk-Picker-Save.txt"); // Set the filename
    document.body.appendChild(downloadAnchor); // Firefox
    downloadAnchor.click(); // "Click" the link to download the file
    downloadAnchor.remove();
}

// Allow user to upload a JSON file to the website to be parsed
function JSONToChunks() {
    var jsonFile = document.getElementById("select").files;
    if (jsonFile.length <= 0) {
        return false;
    }

    var reader = new FileReader();
    reader.readAsText(jsonFile.item(0));

    reader.onload = function(e) {
        var result = JSON.parse(e.target.result);
        var split = result.slice(1, -1).split("][");

        // Reset all tiles to "locked"
        var chunks = document.getElementById("btnDiv").children;
        for (var i = 0; i < chunks.length; i++) {
            addChunkAsLocked(i);
        }

        // Add parsed unlocked chunks
        var unlocked = split[0].split(",");
        for (var i = 0; i < unlocked.length; i++) {
            // Check if the array is empty from the JSON parsing
            if (unlocked[i] != "") {
                addChunkAsUnlocked(unlocked[i]);
            }
        }

        var potential = split[1].split(",");
        for (var i = 0; i < potential.length; i++) {
            // Check if the array is empty from the JSON parsing
            if (potential[i] != "") {
                addChunkAsPotential(potential[i]);
            }
        }
    }

    // Reset the value of the input form in case the user wants to upload the same file
    document.getElementById("select").value = "";
}