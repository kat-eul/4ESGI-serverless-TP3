const urls = {
    'abc123': { longUrl: 'https://www.example.com', clickCount: 0 },
    'def456': { longUrl: 'https://www.google.com', clickCount: 0 },
}



export const lambdaHandler = async (event) => {
  try {
    const shortKey = event && event.pathParameters && event.pathParameters.shortKey;
    if (!shortKey) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'shortKey is required' }),
      };
    }

    let longUrl;
    try {
      const item = urls[shortKey];
      const getResult = { Item: item ? { ...item } : undefined };
      if (!getResult.Item) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Short URL not found' }),
        };
      }
      longUrl = getResult.Item.longUrl;
    } catch (err) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Internal server error', details: String(err) }),
      };
    }

    return {
      statusCode: 302,
      headers: {
        Location: longUrl,
        'Cache-Control': 'no-cache',
      },
      body: '',
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server misconfiguration', details: String(err.message || err) }),
    };
  }
};
