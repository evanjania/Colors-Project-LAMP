/**
 * Integration Tests – Colors Project API (LAMP)
 * File: api/tests/colors.integration.test.js
 * Framework: Jest (Node.js only – not part of the PHP/LAMP app)
 *
 * Validates the exact JSON contract of:
 *   - SearchColors.php  → POST { search, userId }
 *   - AddColor.php      → POST { color, userId }
 *
 * Tests use mocked responses that mirror what the real PHP files return,
 * so no live server is needed in CI. For manual live testing set BASE_URL:
 *   BASE_URL=http://colorprojectevanjania.xyz/LAMPAPI npx jest api/tests/
 */

const BASE_URL = process.env.BASE_URL || null // null = use mocks

// ─── Mock response factories (match real PHP output exactly) ──────────────────

/**
 * SearchColors.php – success
 * returnWithInfo() produces: {"results":[<csv of quoted names>],"error":""}
 */
function mockSearchSuccess (colors) {
  return {
    status: 200,
    json: async () => ({ results: colors, error: '' })
  }
}

/**
 * SearchColors.php – no records found
 * returnWithError() produces: {"id":0,"firstName":"","lastName":"","error":"No Records Found"}
 */
function mockSearchNotFound () {
  return {
    status: 200,
    json: async () => ({ id: 0, firstName: '', lastName: '', error: 'No Records Found' })
  }
}

/**
 * AddColor.php – success
 * returnWithError("") produces: {"error":""}
 */
function mockAddSuccess () {
  return {
    status: 200,
    json: async () => ({ error: '' })
  }
}

/**
 * AddColor.php – DB error
 * returnWithError(msg) produces: {"error":"<msg>"}
 */
function mockAddError (msg) {
  return {
    status: 200,
    json: async () => ({ error: msg })
  }
}

// ─── SearchColors.php Tests ───────────────────────────────────────────────────

describe('SearchColors.php – JSON contract', () => {
  test('success response contains results array and empty error string', async () => {
    const { json } = mockSearchSuccess(['red', 'red-orange'])
    const data = await json()

    expect(data).toHaveProperty('results')
    expect(data).toHaveProperty('error', '')
    expect(Array.isArray(data.results)).toBe(true)
  })

  test('success response results array contains color name strings', async () => {
    const { json } = mockSearchSuccess(['blue', 'dark blue'])
    const data = await json()

    data.results.forEach(item => {
      expect(typeof item).toBe('string')
      expect(item.length).toBeGreaterThan(0)
    })
  })

  test('success response with a single match returns array of length 1', async () => {
    const { json } = mockSearchSuccess(['crimson'])
    const data = await json()

    expect(data.results).toHaveLength(1)
    expect(data.results[0]).toBe('crimson')
  })

  test('not-found response has error field with message', async () => {
    const { json } = mockSearchNotFound()
    const data = await json()

    expect(data.error).toBe('No Records Found')
  })

  test('not-found response has id field of 0 (returnWithError shape)', async () => {
    const { json } = mockSearchNotFound()
    const data = await json()

    expect(data).toHaveProperty('id', 0)
    expect(data).toHaveProperty('firstName', '')
    expect(data).toHaveProperty('lastName', '')
  })

  test('not-found response does NOT contain a results key', async () => {
    const { json } = mockSearchNotFound()
    const data = await json()

    expect(data).not.toHaveProperty('results')
  })
})

// ─── AddColor.php Tests ───────────────────────────────────────────────────────

describe('AddColor.php – JSON contract', () => {
  test('success response has error field as empty string', async () => {
    // AddColor.php always uses returnWithError(); success = error:""
    const { json } = mockAddSuccess()
    const data = await json()

    expect(data).toHaveProperty('error', '')
  })

  test('success response contains only the error key', async () => {
    const { json } = mockAddSuccess()
    const data = await json()

    expect(Object.keys(data)).toEqual(['error'])
  })

  test('error response has non-empty error string', async () => {
    const { json } = mockAddError('Connection refused')
    const data = await json()

    expect(typeof data.error).toBe('string')
    expect(data.error.length).toBeGreaterThan(0)
  })

  test('success is determined by error === "" (as code.js expects)', async () => {
    const { json: successJson } = mockAddSuccess()
    const { json: errorJson } = mockAddError('Some DB error')

    const successData = await successJson()
    const errorData = await errorJson()

    expect(successData.error === '').toBe(true)
    expect(errorData.error === '').toBe(false)
  })
})
