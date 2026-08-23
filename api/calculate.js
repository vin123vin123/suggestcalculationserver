const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // 1. Allow connections from a Python app on any machine
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle browser preflight checks
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  // 2. Parse the URL to read incoming numbers
  const parsedUrl = url.parse(req.url, true);
  
  // Route math requests hitting /api/calculate
  if (parsedUrl.pathname === '/api/calculate') {
    const { num1, num2, operation } = parsedUrl.query;

    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    // Validate inputs
    if (isNaN(n1) || isNaN(n2)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: "Provide valid num1 and num2 parameters." }));
    }

    let result = 0;

    // 3. Process the math operations
    switch (operation) {
      case 'add': result = n1 + n2; break;
      case 'subtract': result = n1 - n2; break;
      case 'multiply': result = n1 * n2; break;
      case 'divide': 
        if (n2 === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Cannot divide by zero." }));
        }
        result = n1 / n2; 
        break;
      default:
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Invalid operation. Use add, subtract, multiply, or divide." }));
    }

    // Send the correct math answer back
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ result: result }));
  }

  // 4. Clean Landing Page (Prevents 404 when visiting the main link)
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <div style="font-family:sans-serif; text-align:center; padding-top:100px;">
      <h1>🚀 Calculator Server is Live on Render!</h1>
      <p>Send math requests to <code>/api/calculate</code></p>
    </div>
  `);
});

// 5. Dynamic Port Assignment for Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
