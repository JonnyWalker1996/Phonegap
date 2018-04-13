var app = {
    embeddedIndex:1,
    embeddedName:"embedded",
    fileNameToCheck:"",
    // Application Constructor
    initialize: function() {
        console.log("loading embedded1.html as soon as document is ready");
        $(document).ready(function() {
            console.log("this.embeddedName=" + this.embeddedName + ", this.embeddedIndex=" + this.embeddedIndex);
            var fileName = this.embeddedName + this.embeddedIndex + ".html";
            console.log("fileName=" + fileName);
            $("#content").load(fileName);
        });
        console.log("binding events");
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        console.log("adding deviceready event listener");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log("device is now ready.");
        console.log("binding previousPage event to previousButton");
        document.getElementById("previousButton").addEventListener("onclick", this.previousPage, false);
        console.log("binding nextPage event to nextButton");
        $("#nextButton").on('click', this.nextPage);
    },
    previousPage: function() {
        console.log("previousPage entered");
        if (fileExists(this.embeddedName + (this.embeddedIndex - 1) + ".html")) {
            this.embeddedIndex--;
            $("#content").load(this.embeddedName + this.embeddedIndex + ".html");
        } else {
            alert("First page reached!");
        }
    },

    nextPage: function() {
        console.log("nextPage entered");
        if (this.fileExists(this.embeddedName + (this.embeddedIndex + 1) + ".html")) {
            this.embeddedIndex++;
            $("#content").load(this.embeddedName + this.embeddedIndex + ".html");
        } else {
            alert("Last page reached!");
        }
    },

    fileExists: function(fileName) {
        console.log("setting fileNameToCheck to " + fileName);
        this.fileNameToCheck = fileName;
        window.storageInfo.requestQuota(PERSISTENT, 1024*1024, 
            function(grantedBytes) {
                window.requestFileSystem(window.PERSISTENT, grantedBytes, this.gotFS, this.fail);
            }, 
            this.fail
        );
        
        console.log("requesting file system");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.gotFS, this.fail);
        console.log("is this printed?");
    },

    gotFS: function(fileSystem) {
        console.log("getting file");
        fileSystem.root.getFile(this.fileNameToCheck, null, this.gotFileEntry, this.fail);
    },

    gotFileEntry: function(fileEntry) {
        console.log("got file");
        fileEntry.file(this.gotFile, this.fail);
    },

    gotFile: function(file){
        console.log("reading data url");
        readDataUrl(file);
    },

    readDataUrl: function(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("Read as data URL");
            if (evt.target.result == null) {
                return false;
            } else {
                console.log(evt.target.result);
                return true;
            }
        };
        reader.readAsDataURL(file);
    },

    fail: function(evt) {
        console.log(evt.target.error.code);
        return false;
    }
};