const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Server-sent events endpoint
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const refreshRate = 1000; // in milliseconds
    const id = Date.now();
    const data = `Hello World ${id}`;
    const message =
      `retry: ${refreshRate}\nid:${id}\ndata: ${data}\n\n`;
    res.end(message);
    return;
  }

  // Client side
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>SSE</title>
      </head>
      <body>
        <pre id="log"></pre>
      </body>
      <script>
        var eventSource = new EventSource('/events');
        eventSource.onmessage = function(event) {
          document.getElementById('log').innerHTML += event.data + '<br>';
        };
      </script>
    </html>
  `);
});

server.listen(port);

server.on('error', (err) => {
  console.log(err);
  process.exit(1);
});

server.on('listening', () => {
  console.log(`Listening on port ${port}`);
});
