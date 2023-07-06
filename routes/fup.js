const config = require('../config');
const express = require('express');
const router = express.Router();
const mv = require('mv');
const fs = require('fs');
const path = require('path');
const http = require('http');
const multer = require('multer');
const Jimp = require('jimp');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.tmp_upload)
    }, filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload_avator = multer({
    storage: storage, limits: {fileSize: 1000000 * 2} // Limit to 2 MB
})
const upload_claims = multer({
    storage: storage, limits: {fileSize: 1000000 * 4} // Limit to 4 MB
})

router.get('/claim-img-view', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body, req.file);
    } else {
        console.log(req.session.user);
    }

    let id = req.query.id;
    let fn = req.query.fn;
    let destinationPath = config.claim_images + id;
    let readFile = destinationPath + '/' + fn;
    console.log('read file : ' + readFile);

    responseFile = (fileName, response) => {
        if (fs.existsSync(readFile)) {
            let f = fs.readFileSync(readFile);
            res.contentType(path.basename(readFile));
            res.send(f);
        } else {
            //response.writeHead(400, {"Content-Type": "text/plain"});
            //response.end("ERROR File does not exist");
        }
    }
    responseFile();
});

router.get('/inv-view', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body, req.file);
    } else {
        console.log(req.session.user);
    }

    let id = req.query.id;
    let destinationPath = config.inv_images;
    let readFile = destinationPath + id + '.pdf';
    console.log('read file : ' + readFile);

    function get_invPDF() {
        return new Promise((resolve) => {
            setTimeout(() => {
                let file = fs.createWriteStream(readFile);
                http.get(config.pdf_url + "Type=Invoice&RefNo=" + id, response => {
                    let stream = response.pipe(file);
                    stream.on("finish", function () {
                        resolve();
                        console.log("done");
                    });
                });
            }, 10); //1/10 sec
        });
    }

    await get_invPDF();
    if (fs.existsSync(readFile)) {
        let f = fs.readFileSync(readFile);
        // res.contentType("application/pdf");
        res.contentType(path.basename(readFile));
        res.send(f);
    } else {
        res.contentType("text/plain");
        res.send("File does not exist")
    }
});

router.get('/receipt-view', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body, req.file);
    } else {
        console.log(req.session.user);
    }

    let id = req.query.id;
    let destinationPath = config.inv_images;
    let readFile = destinationPath + id + '.pdf';
    console.log('read file : ' + readFile);

    function get_invPDF() {
        return new Promise((resolve) => {
            setTimeout(() => {
                let file = fs.createWriteStream(readFile);
                http.get(config.pdf_url + "Type=Receipt&RefNo=" + id, response => {
                    let stream = response.pipe(file);
                    stream.on("finish", function () {
                        resolve();
                        console.log("done");
                    });
                });
            }, 10); //1/10 sec
        });
    }

    await get_invPDF();
    if (fs.existsSync(readFile)) {
        let f = fs.readFileSync(readFile);
        // res.contentType("application/pdf");
        res.contentType(path.basename(readFile));
        res.send(f);
    } else {
        res.contentType("text/plain");
        res.send("File does not exist")
    }
});

router.get('/studentcard-view', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body, req.file);
    } else {
        console.log(req.session.user);
    }

    let id = req.query.id;
    let destinationPath = config.pdfs;
    let readFile = destinationPath + id + '.pdf';
    console.log('read file : ' + readFile);

    function get_invPDF() {
        return new Promise((resolve) => {
            setTimeout(() => {
                let file = fs.createWriteStream(readFile);
                http.get(config.pdf_url + "Type=StudentCard&RefNo=" + id, response => {
                    let stream = response.pipe(file);
                    stream.on("finish", function () {
                        resolve();
                        console.log("done");
                    });
                });
            }, 10); //1/10 sec
        });
    }

    await get_invPDF();
    if (fs.existsSync(readFile)) {
        let f = fs.readFileSync(readFile);
        // res.contentType("application/pdf");
        res.contentType(path.basename(readFile));
        res.send(f);
    } else {
        res.contentType("text/plain");
        res.send("File does not exist")
    }
});

router.post('/photo-pf', upload_avator.single('uploaded_file'), async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body, req.file);
    } else {
        console.log(req.session.user);
    }
    let return_MSG = '';
    let currentPath = '';
    let currentPath2 = '';
    let destinationPath = '';
    if (req.file) {
        if (req.file !== undefined) {
            currentPath = req.file.path;
            currentPath2 = req.file.path + ".jpg";
            destinationPath = config.avator_images + req.session.usercode + ".jpg";

            if (req.file.mimetype === 'image/png') {
                // png file, require to do conversion.
                console.log('convert image');

                function convertFile() {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            Jimp.read(currentPath, (error, Image) => {
                                if (!error) {
                                    Image.write(currentPath2);
                                    resolve();
                                } else {
                                    console.log(error);
                                }
                            });
                        }, 10); //1/10 sec
                    })
                }

                await convertFile();
                currentPath = currentPath2;

            }

            function moveFile() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        mv(currentPath, destinationPath, (error) => {
                            if (!error) {
                                return_MSG = 'Successful';
                                console.log("Successfully moved the file!");
                                resolve();
                            } else {
                                return_MSG = 'Error';
                                console.log(error);
                            }
                        });
                    }, 10); //1/10 sec
                })
            }

            await moveFile();
        }
    }


    // update session photo in case using default
    req.session.photo = req.session.user;
    console.log('-- Return Message --');
    console.log(return_MSG);
    res.send(return_MSG);
});

router.post('/claim-img-up', upload_claims.single('uploaded_file'), async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body, req.file);
    } else {
        console.log(req.session.user);
    }
    let return_MSG = '';
    let destinationPath = config.claim_images + req.body.id;
    if (req.file) {
        if (req.file !== undefined) {
            let currentPath = req.file.path;

            //console.log(destinationPath);
            //console.log(req.file.originalname);

            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath);
            }

            function moveFile() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        mv(currentPath, destinationPath + '/' + req.file.originalname, (error) => {
                            if (!error) {
                                return_MSG = 'Successful-' + req.file.originalname;
                                console.log("Successfully moved the file!");
                                resolve();
                            } else {
                                return_MSG = 'Error';
                                console.log(error);
                            }
                        });
                    }, 10); //1/10 sec
                })
            }

            await moveFile();
        }
    }
    // update session photo in case using default
    console.log(return_MSG);
    res.send(return_MSG);
});

router.post('/claim-img', upload_claims.single('uploaded_file'), async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body, req.file);
    } else {
        console.log(req.session.user);
    }
    let return_MSG = '';
    let destinationPath = config.claim_images + req.body.id;

    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath);
    }

    if (req.body.action === "removeF") {
        let deleteFile = destinationPath + '/' + req.body.fn;

        function removeFile() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    fs.unlink(deleteFile, (error) => {
                        if (!error) {
                            return_MSG = 'Deleted';
                            console.log(return_MSG);
                            resolve();
                        } else {
                            console.log(error);
                        }
                    })
                }, 10); //1/10 sec
            });
        }

        await removeFile();
    }
    if (req.body.action === "listF") {
        function listFile() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    fs.readdir(destinationPath, (error, files) => {
                        if (!error) {
                            return_MSG = files;
                            console.log(return_MSG);
                            resolve();
                        } else {
                            console.log(return_MSG);
                        }
                    })
                }, 10); //1/10 sec
            });
        }

        if (req.body.id) {
            await listFile();
        }
    }
    res.send(return_MSG);
});

module.exports = router;
