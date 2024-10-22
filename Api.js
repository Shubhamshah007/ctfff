const express = require("express");
const path = require("path");
const bodyP = require("body-parser");
const compiler = require("compilex");

const app = express();
const options = { stats: true };
compiler.init(options);

// Middleware to parse JSON requests
app.use(bodyP.json());

// Serve static files for CodeMirror
app.use("/codemirror-5.65.18", express.static(path.join("C:\\compiler\\CodeEditor")));

// Route for testing server
app.get("/test", function (req, res) {
    res.send("Server is working!");
});

// Route for the root URL
app.get("/", function (req, res) {
    compiler.flush(function () {
        console.log("deleted");
    });
    res.sendFile(path.join("C:/compiler/CodeEditor", 'index.html'));
});

// Route for compiling code
app.post("/compile", function (req, res) {
    var code = req.body.code;
    var input = req.body.input;
    var lang = req.body.lang;

    try {
        var envData = { OS: "windows" }; // General environment data

        // Function to clean the output
        const cleanOutput = (output) => output.replace(/\r\n/g, '\n').trim();

        if (lang === "Python") {
            if (!input) {
                compiler.compilePython(envData, code, function (data) {
                    if (data.output) {
                        res.send({ output: cleanOutput(data.output) });
                    } else {
                        console.error("Python compilation error: ", data.error);
                        res.send({ output: "error", error: data.error });
                    }
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send({ output: cleanOutput(data.output) });
                    } else {
                        console.error("Python compilation error: ", data.error);
                        res.send({ output: "error", error: data.error });
                    }
                });
            }
        } else if (lang === "Cpp") {
            envData.cmd = "g++"; // C++ specific command
            if (!input) {
                compiler.compileCPP(envData, code, function (data) {
                    if (data.output) {
                        res.send({ output: cleanOutput(data.output) });
                    } else {
                        console.error("C++ compilation error: ", data.error);
                        res.send({ output: "error", error: data.error });
                    }
                });
            } else {
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send({ output: cleanOutput(data.output) });
                    } else {
                        console.error("C++ compilation error: ", data.error);
                        res.send({ output: "error", error: data.error });
                    }
                });
            }
        } else if (lang === "Java") {
            if (!input) {
                compiler.compileJava(envData, code, function (data) {
                    if (data.output) {
                        res.send({ output: cleanOutput(data.output) });
                    } else {
                        console.error("Java compilation error: ", data.error);
                        res.send({ output: "error", error: data.error });
                    }
                });
            } else {
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send({ output: cleanOutput(data.output) });
                    } else {
                        console.error("Java compilation error: ", data.error);
                        res.send({ output: "error", error: data.error });
                    }
                });
            }
        }
    } catch (e) {
        console.error("Error occurred: ", e);
        res.send({ output: "error" });
    }
});

// Start the server
app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});
