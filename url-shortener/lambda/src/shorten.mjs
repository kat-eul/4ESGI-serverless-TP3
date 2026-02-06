function generateKey(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export const lambdaHandler = async (event) => {
  if (!event || !event.body) {
    return {
      statusCode: 400,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({error: 'Invalid JSON'}),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({error: 'Invalid JSON'}),
    };
  }

  const longUrl = body && body.url;
  if (!longUrl) {
    return {
      statusCode: 400,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({error: 'URL is required'}),
    };
  }

  /*
  * Avec l'utilisation de dynomoDB, on aurait tenté d'insérer une clef générée et une condition d'absence de cette clef.
  * */

  let shortKey = generateKey(6);
  if (!shortKey) {
    return {
      statusCode: 500,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({error: 'Failed to generate unique key'}),
    };
  }

  const now = Date.now();
  const item = {shortKey, longUrl, createdAt: now, clickCount: 0};

  const responseBody = {shortKey, shortUrl: `http://localhost:3000/${shortKey}`, longUrl, createdAt: now};
  return {
    statusCode: 201,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(responseBody)
  };
};
