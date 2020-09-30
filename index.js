
const express = require('express');
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')

const fs = require("fs");
const path = require("path")

const app = express();
const port = 8080;

// the bodyParser extracts the entire body of an incoming request and dumps it into req.body - which allows us to view with and interact with it.
app.use(bodyParser.urlencoded({ extended: false }));

// This is from express-fileupload - it handles the parsing of the files from the upload form - extracting them and making them available under req.files
app.use(fileUpload());




// this sets the upload directory - __dirname gives back the entire path of the directory currently being used, path.sep seperates the path based on / and // (not sure why this is important) and the last is the place which the uploaded files will be stored.
const directory = __dirname + path.sep + "uploads";


// the second is to serve up the uploaded folder, so it's accessible to the server upon request.
app.use(express.static('public'));
app.use(express.static('uploads'))
app.use(express.static('assets'))


// the cache which will contain teh files uploaded. This is a RAM storage section - only used to make things go faster and is technically not essential as it doesn't contain the long-term storage parts of this file.
let caches = {};

/*
1. When 'upload' is clicked, write the file name into the text, and select the file for the purposes of submitting.
2. When 'submit' is clicked, file is uploaded. 
2.1. Whilst file is being uploaded, a line is added to the 'uploaded' section that says uploading... please wait
2.2 After file has finished uploading, then the file's name and size appears in the 'uploaded' section, with a working button to download it
2.3 To make this button work, a counter has to be placed which keeps track of which file this is, stored in the javascript file. 

3. Downloading works by pressing the appropriate button, which downloads the appropriate file. 


*/




// writefile is the function which will write the file to the directory (it's here as a parameter called directory)
function writeFile(name, body) {
    return new Promise((resolve, reject) => {
        fs.writeFile(directory + path.sep + name, body, (err) => {
            if (err) {
                return reject(err);
            } else {
                resolve(name);
            }
        });
    }).then(readFile);
}


// this will take the file given previously (by the resolve(name)) and return the body of the file that was found. 
function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(directory + path.sep + file, (err, body) => {
            if (err) {
                return reject(err);
            } else {
                resolve(body);
            }
        });
    });
}



/*

Changes - call refreshFunction during teh POST request - so that the file size adn tyep etc. can be read and placed during that time.

The alternative is a function called fs.readDir, which should be looked up as well. However, this only reads the names of the files, and so it can't be fully relied upon. Maybe just institute it this way instead, as the other way seems like it takes more effort. 


Also, can use event.prevent default to stop the page from refreshing when POST request is processed - then can use a .then to process what should happen afterwards instead.

*/




// the GET request reads the uploaded file, and stores the data back into the cache 
app.get("/", (req, res) => {
    console.log("sending index page")
    res.sendFile(__dirname + "/public/index.html");
});




app.post("/upload", (req, res) => {
    // after the request path upload.single('upload'),
    console.log(req.files.upload);


    // req.files.upload is the request form from express-fileupload. It's requesting the files from the input form called 'upload'
    // instanceof gives out a boolean for whether the given file is the type of the given array. 
    // why the fuck does this need to be here? Why would req.files.upload be an array? It's clearly an object?
    if (req.files.upload instanceof Array) {
        for (var i = 0; i < req.files.upload.length; i++) {
            textModifier()
            console.log("test1")
            // setting file to the name of the uploaded file
            let file = req.files.upload[i].name;

            // setting 'data' to contain all teh data of teh uploaded file
            let data = req.files.upload[i].data;

            // Writing the object containing the uploaded file to the caches with the key being the name of the file
            caches[file] = writeFile(file, data);

            // afterwards, after this is set - send the message.
            caches[file]
                .then(() => {
                    res.redirect('back');
                    res.end()
                }
                )
                .catch((error) => {
                    console.log(error);
                    res.end(error);
                });
        }
    } else {
        console.log(req.files);
        console.log("test2")


        let file = req.files.fileU.name;
        let data = req.files.fileU.data;

        caches[file] = writeFile(file, data);

        caches[file]
            .then(() => {
                res.redirect('back');
                res.end()
            }
            )
            .catch((e) => res.status(500).send(e.message));
    }
});

// module.exports.postApp = postApp;



app.get("/uploaded/:name", (req, res) => {
     // if there is nothing in the path, this does nothing.


    // this function allocates the file from storage to the cache, if the file that is asked for is not in the cache.
    if (caches[req.params.name] == null) {
        console.log("reading from folder");
        caches[req.params.name] = readFile(req.params.name);
    }

    // this function finds the requested file in the cache by name, and sends it to be downloaded by the computer.    
    caches[req.params.name]
        .then((body) => {
            console.log(body);
            res.send(body);
        })
        .catch((e) => res.status(500).send(e.message));
});

app.listen(port, () => {
    console.log(`Application Listening to port: ${port}`);
});

//This application doesnt have buttons or anything to download the file. In order to download the file, you must emulate the route that has been set up.
// app.get('/files/:name' where the name is the file name that you've uploaded.




/*
1. When 'upload' is clicked, write the file name into the text, and select the file for the purposes of submitting.
2. When 'submit' is clicked, file is uploaded.
2.1. Whilst file is being uploaded, a line is added to the 'uploaded' section that says uploading... please wait
2.2 After file has finished uploading, then the file's name and size appears in the 'uploaded' section, with a working button to download it
2.3 To make this button work, a counter has to be placed which keeps track of which file this is, stored in the javascript file.

3. Downloading works by pressing the appropriate button, which downloads the appropriate file.


*/



app.get('/jsonString', function (req, res) {
    function dirNames() {
        fs.readdir('uploads', (err, files) => {
            if (err)
                return (err);
            else {
                res.send(files);
            }
        })
    };
    dirNames()
    // let testFunc = {...dirNames()};
    // console.log(testFunc)
    // console.log("ready")
    // const jsonString = JSON.stringify(testFunc);
})











/*

GET - send index.html, res.sendFile
POST - handle the data - set in an object, set in the folder - fs.write
Write to disk, rather than storing locally

Use a form, inbuilt form methods to recieve data


Get - app.get(/file/:name (this is the ))




Total steps:

1. Choose file from local computer to be uploaded
2. Upload file from local computer into target disk
3. Select file from target disk to be downloaded
4. Download file from target disk into local computer






hERE



Cache is in RAM,

i/o is in memory, from readFile, writeFile







*/





/*

Changes to be made:

1. Add the listing of files upon POST request.
2. Preventdefault on POST request to stop page from refreshing - add a 'upload complete' section and make sure it still works via .then functions.
3. Make the download function work properly, by wrapping the get request in a function which can be called from the frontend.
4. Spruce it up a little using the CSS, which should properly now that it's being served up as a static element.






*/











