import { describe, expect, test } from 'bun:test'
import { render } from './utils.ts'

describe('base', () => {
  test('no imports', async () => {
    expect(await render('simple.md')).toMatchSnapshot()
  })

  test('single import', async () => {
    expect(await render('whole.md')).toMatchSnapshot()
  })

  test('multiple imports', async () => {
    expect(await render('multiple.md')).toMatchSnapshot()
  })

  test('fail on not found', async () => {
    expect(() => render('notFound.md')).toThrow(/cannot locate file.*nirvana\.md/)
  })

  test('custom lines', async () => {
    expect(await render('partial.md')).toMatchSnapshot()
  })
})
