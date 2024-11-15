const fs = require('node:fs');

var config = {}

try {
  require("./config.js")                                          // Check if config file exists
} catch(e) {                                                      // If it doesn't, make one!
  var defaultConfigValue = fs.readFileSync('./config.default.js') // Yes, there's better ways,
  fs.writeFileSync("./config.js", defaultConfigValue)             // but I don't care!
}

config = require("./config.js")

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

async function generateURLName() {                        // Handles generated URL names.
  var i = 0
  var size = config.minimumURLRandomNameSize
  while (i < 200) {
    var name = ""

    var j = 0
    while (j < size) {
      name += config.allowedRandomCharacters[Math.floor(Math.random() * config.allowedRandomCharacters.length)]
      j++
    }

    if ((i % 20) == 19) {
      size += 1
    }

    if (!fs.existsSync("./database/" + name)) { 
      return name 
    }
    i++
  }
}

app.use(express.static("./public"))                     // push static site assets

app.use(express.json());                              // make JSON request bodies work
app.use(express.urlencoded());                      // removed this earlier, woops! :/

app.set('trust proxy', true)                            // allows ip access through proxies

app.get('/config.json', function (req, res) {
  res.json({
    minimumURLNameSize: config.minimumURLNameSize,
    maximumURLNameSize: config.maximumURLNameSize,
    allowedRandomCharacters: config.allowedRandomCharacters,
    passwordProtected: !(!config.password),           // In a weird way, this kinda converts
                                                      // the password into a boolean. It works for now :P
    allowNamedURLs: config.allowNamedURLs,
  })
})


app.post('/create-url', async function (req, res) {
  console.log("NEW REQUEST", req.body.url)

  // validation #1: check if url is valid

  var test = /^(?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)$/gm.exec(req.body.url)
  if (!test) {
    res.status(400).json({
      success: false,
      error: "url-invalid"
    })
    
    return;
  }

  console.log("pass")

  // validation #2: if name exists, check if name is valid

  var test = RegExp(config.URLNamePattern, "gm").exec(req.body.name)
  if (!test) {
    res.status(500).json({
      success: false,
      error: "url-invalid"
    })

    return
  }

  console.log("pass")

  // validation 3: if a password exists, check if it is correct

  if (config?.password && (req.body.password != config.password)) {
    res.status(401).json({
      success: false,
      error: "password-incorrect"
    })

    return
  }

  console.log("pass")

  var name = req.body.name || await generateURLName()

  fs.writeFile('./database/' + name + ".json", JSON.stringify({
    value: req.body.url,
    ip: config.logUserData ? req.ip : "logging disabled",
    userAgent: config.logUserData ? req.headers["user-agent"] : "logging disabled",
    key: "THIS IS NOT A VALID KEY!!!!!"                         // This is currently unused but it will be eventually
  }), err => {
    if (err) {
      console.error(err)
      res.status(500).json({
        success: false,
        error: err
      })
    } else {
      res.json({
        success: true,
        name: name
      })
      console.log("Created new short URL with name "+name+", linking to "+req.body.url+"")
    }
  });

  
})

app.get('/*', (req, res) => {
  fs.readFile('./database' + req.path + ".json", 'utf8', (err, data) => {
    if (err) {
      console.error(err);

      res.status(404).send("404 Not Found")
      
      return
    }
    try {
      var parsed = JSON.parse(data)
      res.redirect(parsed.value)
    } catch(e) {
      console.error(err)

      res.status(500).send("500 Internal Server Error")
    }

    
  })
})

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("URLsocket listening on port", PORT);
});