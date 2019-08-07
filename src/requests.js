var baseConvert = 36;

// Convert any GET request into the array of chunks
function get() {
    // Cut the "?" off the front of the GET request
    var request = window.location.search.slice(1).split(';');
    var chunks = stringToChunkIndexes(request[0]);
    var potential = [];
    if (request.length > 1)
        potential = stringToChunkIndexes(request[1]);

    // Add every unpacked chunk into the unlocked chunks list
    for (var i = 0; i < chunks.length; i++) {
        addChunkAsUnlocked(chunks[i]);
    }

    // add every potential chunk into the potential chunks list
    for (var i = 0; i < potential.length; i++) {
        addChunkAsPotential(potential[i]);
    }
}

// Encode the chunk array into a GET request to avoid 1024 char limit
function encodeGet() {
    var unlocked = chunkIndexesIntoString(unlockedChunks);
    var potential = chunkIndexesIntoString(potentialChunks);

    // Create, copy, and remove a text field
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    // insert base url of this website
    dummy.value = document.location.href.split('?')[0];
    // insert query for unlocked chunks
    dummy.value += '?' + unlocked + ';' + potential;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

// Take in the string from the URL and unpack the chunk indexes
function stringToChunkIndexes(request) {
    var gap = 4;
    var chunks = [];

    request = request.split(",");

    // Unpack every chunk index
    for (var i = 0; i < request.length; i++) {
        // Convert the indexes from base 62 to base 10
        request[i] = convert(request[i], BASE62, BASE10);

        // Use modulo using the gap to check for indexes less than 1000
        var mod = request[i].length % gap;
        if (mod != 0) {
            // Add 0s to the start of the string
            for (var j = 4; j > mod; j--) {
                request[i] = "0" + request[i];
            }
        }

        // Split the string into the chunk indexes
        for (var k = 0; k < request[i].length - 3; k += 4) {
            chunks.push(request[i].slice(k, k + 4));
        }
    }

    return chunks;
}

// Take the chunk indexes and compress them into a string
function chunkIndexesIntoString(chunks) {
    var combinedArray = [];
    var combinedIndexes = "";
    var counter = 0;

    for (var i = 0; i < chunks.length; i++) {
        counter++;
        // unify length of numbers
        combinedIndexes += chunks[i].toString().padStart(4, '0');

        // Combine 3 chunk indexes into base64
        if (counter >= 3 || i >= chunks.length - 1) {
            combinedArray.push(convert(combinedIndexes, BASE10, BASE62));
            combinedIndexes = "";
            counter = 0;
        }
    }

    var retval = "";
    if (combinedArray.length >= 1) {
        retval += combinedArray[0];
    }
    for (var i = 1; i < combinedArray.length; i++) {
        retval += "," + combinedArray[i];
    }

    return retval;
}

// Taken from https://rot47.net/base.html
var BASE10 = "0123456789";
var BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
// Convert between two different number bases
function convert(src, srctable, desttable) {
    var srclen = srctable.length;
    var destlen = desttable.length;
    var val = 0;
    var numlen = src.length;
    for(var i = 0; i < numlen; i++) {
        val = val * srclen + srctable.indexOf(src.charAt(i));
    }
    if (val < 0) {
        return 0;
    }
    var r = val % destlen;
    var res = desttable.charAt(r);
    var q = Math.floor(val / destlen);
    while(q) {
        r = q % destlen;
        q = Math.floor(q / destlen);
        res = desttable.charAt(r) + res;
    }
    return res;
}
