export default function handler(request, response) {
  // Allow requests from any machine on the internet
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests from browsers
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Get the data sent by the Python app
  const { num1, num2, operation } = request.body || request.query;

  // Convert inputs to numbers
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  // Check if inputs are valid numbers
  if (isNaN(n1) || isNaN(n2)) {
    return response.status(400).json({ error: "Please provide two valid numbers." });
  }

  let result = 0;

  // Perform the math based on what the client asked for
  switch (operation) {
    case 'add': result = n1 + n2; break;
    case 'subtract': result = n1 - n2; break;
    case 'multiply': result = n1 * n2; break;
    case 'divide': 
      if (n2 === 0) return response.status(400).json({ error: "Cannot divide by zero!" });
      result = n1 / n2; 
      break;
    default:
      return response.status(400).json({ error: "Invalid operation. Use add, subtract, multiply, or divide." });
  }

  // Send the answer back to the Python app
  return response.status(200).json({ result: result });
}
