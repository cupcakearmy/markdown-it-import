import { describe, expect, test } from 'bun:test'
import { render } from './utils.ts'

describe('base', () => {
  test('should not be able to import itself', async () => {
    expect(() => render('self-reference.md')).toThrow(/cycles are not allowed, already parsed.*self-reference\.md/)
  })

  test('should not be able to import cycles', async () => {
    expect(() => render('cycle-a.md')).toThrow(/cycles are not allowed, already parsed.*cycle-b\.md/)
    expect(() => render('cycle-b.md')).toThrow(/cycles are not allowed, already parsed.*cycle-a\.md/)
  })

  test('import different files', async () => {
    expect(await render('rec-a.md')).toMatchSnapshot()
  })
})
