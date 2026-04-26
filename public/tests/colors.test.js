/**
 * Frontend Unit Tests – Colors Project (LAMP)
 * File: public/tests/colors.test.js
 * Framework: Jest (Node.js only – not part of the PHP/LAMP app)
 *
 * Tests cover logic extracted from public/js/code.js:
 *  - Cookie parsing  (readCookie logic)
 *  - Cookie building (saveCookie logic)
 *  - Search response parsing (searchColor response handler)
 *  - Add color response parsing (addColor response handler)
 */

// ─── Logic extracted from code.js ────────────────────────────────────────────
// These mirror the inline logic in code.js so Jest can run without a browser.
// Keep in sync if code.js changes.

/**
 * Parses a cookie string in the exact format saveCookie() writes:
 *   "firstName=X,lastName=Y,userId=Z"
 */
function parseCookieString (cookieStr) {
  let firstName = ''
  let lastName = ''
  let userId = -1

  const splits = cookieStr.split(',')
  for (let i = 0; i < splits.length; i++) {
    const thisOne = splits[i].trim()
    const tokens = thisOne.split('=')
    if (tokens[0] === 'firstName') {
      firstName = tokens[1]
    } else if (tokens[0] === 'lastName') {
      lastName = tokens[1]
    } else if (tokens[0] === 'userId') {
      userId = parseInt(tokens[1].trim())
    }
  }

  return { firstName, lastName, userId }
}

/**
 * Builds the cookie value string the way saveCookie() does.
 */
function buildCookieValue (firstName, lastName, userId) {
  return `firstName=${firstName},lastName=${lastName},userId=${userId}`
}

/**
 * Parses the JSON response from SearchColors.php and returns
 * an array of color strings — mirrors the searchColor() handler.
 */
function parseSearchResponse (responseText) {
  const jsonObject = JSON.parse(responseText)
  if (!jsonObject.results || jsonObject.results.length === 0) {
    return []
  }
  return jsonObject.results
}

/**
 * Parses the JSON response from AddColor.php.
 * Returns true on success (error === ''), false otherwise.
 */
function parseAddColorResponse (responseText) {
  const jsonObject = JSON.parse(responseText)
  return jsonObject.error === ''
}

// ─── Cookie Tests ─────────────────────────────────────────────────────────────

describe('parseCookieString() – mirrors readCookie() logic', () => {
  test('correctly parses a well-formed cookie string', () => {
    const result = parseCookieString('firstName=John,lastName=Doe,userId=5')
    expect(result.firstName).toBe('John')
    expect(result.lastName).toBe('Doe')
    expect(result.userId).toBe(5)
  })

  test('userId is parsed as a number, not a string', () => {
    const result = parseCookieString('firstName=Jane,lastName=Smith,userId=42')
    expect(typeof result.userId).toBe('number')
    expect(result.userId).toBe(42)
  })

  test('returns userId of -1 when userId token is missing', () => {
    const result = parseCookieString('firstName=John,lastName=Doe')
    expect(result.userId).toBe(-1)
  })

  test('handles extra whitespace around tokens', () => {
    const result = parseCookieString(' firstName=Alice , lastName=Brown , userId=3 ')
    expect(result.firstName).toBe('Alice')
    expect(result.userId).toBe(3)
  })
})

describe('buildCookieValue() – mirrors saveCookie() format', () => {
  test('produces the expected cookie string format', () => {
    const result = buildCookieValue('John', 'Doe', 7)
    expect(result).toBe('firstName=John,lastName=Doe,userId=7')
  })

  test('round-trips correctly through parseCookieString', () => {
    const cookie = buildCookieValue('Alice', 'Smith', 12)
    const parsed = parseCookieString(cookie)
    expect(parsed.firstName).toBe('Alice')
    expect(parsed.lastName).toBe('Smith')
    expect(parsed.userId).toBe(12)
  })
})

// ─── SearchColors Response Tests ──────────────────────────────────────────────

describe('parseSearchResponse() – mirrors searchColor() response handler', () => {
  test('returns array of color names on a successful search', () => {
    // SearchColors.php success: {"results":["red","red-orange"],"error":""}
    const response = JSON.stringify({ results: ['red', 'red-orange'], error: '' })
    expect(parseSearchResponse(response)).toEqual(['red', 'red-orange'])
  })

  test('returns empty array when results is empty', () => {
    const response = JSON.stringify({ results: [], error: 'No Records Found' })
    expect(parseSearchResponse(response)).toHaveLength(0)
  })

  test('returns empty array on SearchColors.php error shape (no results key)', () => {
    // SearchColors.php error: {"id":0,"firstName":"","lastName":"","error":"No Records Found"}
    const response = JSON.stringify({ id: 0, firstName: '', lastName: '', error: 'No Records Found' })
    expect(parseSearchResponse(response)).toHaveLength(0)
  })

  test('returns all matched colors when multiple results exist', () => {
    const response = JSON.stringify({ results: ['blue', 'light blue', 'dark blue'], error: '' })
    const result = parseSearchResponse(response)
    expect(result).toHaveLength(3)
    expect(result).toContain('light blue')
  })

  test('result is always an array', () => {
    const response = JSON.stringify({ results: ['green'], error: '' })
    expect(Array.isArray(parseSearchResponse(response))).toBe(true)
  })
})

// ─── AddColor Response Tests ──────────────────────────────────────────────────

describe('parseAddColorResponse() – mirrors addColor() response handler', () => {
  test('returns true when error is empty string (AddColor.php success shape)', () => {
    // AddColor.php success: {"error":""}
    expect(parseAddColorResponse(JSON.stringify({ error: '' }))).toBe(true)
  })

  test('returns false when error contains a message', () => {
    expect(parseAddColorResponse(JSON.stringify({ error: 'Duplicate entry' }))).toBe(false)
  })

  test('returns false on DB connection error', () => {
    expect(parseAddColorResponse(JSON.stringify({ error: 'Connection refused' }))).toBe(false)
  })
})
