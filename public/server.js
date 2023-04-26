const http = require("http");
const url = require("url");
const shortUrls = {};

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (pathname === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(`
      <html>
        <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="https://cdn.glitch.global/a8ceb785-838a-49e6-bc77-4eadb6b7ea42/icon.png?v=1682510899456"><title>UrlSocket</title>
    <link rel="stylesheet" href="https://imgsocket.glitch.me/style.css">
    <style>input[type=text] {display: block; border: 2px solid white; background: none; color: white;} input[type=Submit] {display: block; border: 2px solid blue; background: none; color: blue; cursor: pointer; height: 30px; width: 120px;}</style>
         <body>
         <center>
         <br>
          <h1>UrlSocket by Redstone Network</h1>
          <p>An open source url shortener thats free and always will be.</p>
          <form method="GET" action="/shortUrls">
            <label for="url">URL:</label>
            <input type="text" id="url" name="url"><br>
            <label for="shortcode">Tag:</label>
            <input type="text" id="shortcode" name="shortcode"><br>
            <input type="submit" value="Shorten My Url">
          </form>
          </center>
        </body>
      </html>
    `);
    res.end();
  } else if (pathname === "/shortUrls") {
    const { url, shortcode } = query;
    if (!url || !shortcode) {
      const responseHtml = `
  <html>
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="https://cdn.glitch.global/a8ceb785-838a-49e6-bc77-4eadb6b7ea42/icon.png?v=1682510899456"><title>UrlSocket</title>
    <link rel="stylesheet" href="https://imgsocket.glitch.me/style.css">
    <style>input[type=text] {display: block; border: 2px solid white; background: none; color: white;} button {display: block; border: 2px solid blue; background: none; color: blue; cursor: pointer; height: 30px; width: 120px;}</style>
        
    <body>
    <center>
    <br>
      <h1>Error</h1>
      <p>Please fill in all of the areas.</p>
      <button onclick="window.location.href = 'https://urlsocket.glitch.me/'">Go Home</button>
      </center>
      </body>
  </html>
`;

    res.statusCode = 400;
    res.setHeader("Content-Type", "text/html");
    res.end(responseHtml);
      return;
    }
    if (shortcode in shortUrls) {
      const responseHtml = `
  <html>
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="https://cdn.glitch.global/a8ceb785-838a-49e6-bc77-4eadb6b7ea42/icon.png?v=1682510899456"><title>UrlSocket</title>
    <link rel="stylesheet" href="https://imgsocket.glitch.me/style.css">
    <style>input[type=text] {display: block; border: 2px solid white; background: none; color: white;} button {display: block; border: 2px solid blue; background: none; color: blue; cursor: pointer; height: 30px; width: 120px;}</style>
    <body>
<center>
    <br>
      <h1>Error</h1>
      <p>This url already exists.</p>
      <button onclick="window.location.href = 'https://urlsocket.glitch.me/'">Go Home</button>
      </center>
      </body>
  </html>
`;

    res.statusCode = 409;
    res.setHeader("Content-Type", "text/html");
    res.end(responseHtml);
      return;
    }
    shortUrls[shortcode] = url;
    const responseHtml = `
  <html>
    <head>
      <title>URL Shortener</title>
    </head>
    <body>
      <h1>URL Shortener</h1>
      <p>Your short URL has been created:</p>
      <a href="https://${req.headers.host}/${shortcode}">https://${req.headers.host}/${shortcode}</a>
    </body>
  </html>
`;

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(responseHtml);
  } else {
    const shortcode = pathname.slice(1);
    const url = shortUrls[shortcode];
    if (!url) {
      res.statusCode = 404;
      res.end("Shortcode not found");
      return;
    }
    res.statusCode = 301;
    res.setHeader("Location", url);
    res.end();
  }
});

const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
