const fs = require('node:fs');

const config = require("./config.js")                 // Config data here

const express = require("express") 
var app = express()                                   // Setup ExpressJS server

const PORT = process.env.PORT || process.env.port || config.port || 3000

try {
  if (!fs.existsSync("./database")) {
    fs.mkdirSync("./database");
  }
} catch (err) {
  console.error(err);
}

function generateURLName() {                        // Handles generated URLs.
  var i = 0
  while (i < 200) {
    var name = ""

    var j = 0
    while (j < config.minimumURLRandomNameSize) {
      name += config.allowedRandomCharacters[Math.floor(Math.random() * config.allowedRandomCharacters.length)]
      j++
    }

    return name
    i++
  }
}

app.use(express.static("./public"))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/config.json', function (req, res) {
  res.json({
    minimumURLNameSize: config.minimumURLNameSize,
    maximumURLNameSize: config.maximumURLNameSize,
    allowedRandomCharacters: config.allowedRandomCharacters,
    passwordProtected: !(!config.password),                   // In a weird way, this kinda converts
                                                      // the password into a boolean. It works.
    allowNamedURLs: config.allowNamedURLs,
  })
})


app.post('/create-url', function (req, res) {
  console.log("NEW REQUEST")

  var test = /^(?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)$/gm.exec(req.body.url)
  if (!test) {
    res.json({
      success: false,
      error: "url-invalid"
    })
    res.sendStatus(400)
    return;
  }

  console.log("TEST 1 PASS")

  var test = RegExp(config.URLNamePattern, "gm").exec(req.body.name)
  if (!test) {
    res.json({
      success: false,
      error: "url-invalid"
    })

    res.sendStatus(400)

    return
  }

  console.log("TEST 2 PASS")

  console.log(req.body)
  console.log(JSON.stringify(req.body))

  var name = req.body.name || generateURLName()

  fs.writeFile('./database/' + name, req.body.url, err => {
    if (err) {
      console.error(err)
      res.json({
        success: false,
        error: err
      })
    } else {
      res.json({
        success: true,
        name: name
      })
    }
  });

  
})

app.get('/*', (req, res) => {
  fs.readFile('./database' + req.path, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.send("404 Not Found")
      return
    }

    res.redirect(data)
  })
})

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("URLsocket listening on port", PORT);
});