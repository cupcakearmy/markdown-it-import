import { describe, expect, test } from 'bun:test'
import { render } from './utils.ts'

describe('options', () => {
  test('empty options', async () => {
    expect(await render('simple.md', {})).toMatchSnapshot()
  })

  test('set root directory', async () => {
    expect(await render('relative.md', { root: 'tests/fixtures' }))
  })

  describe('matcher', () => {
    test('custom matcher', async () => {
      const matcher = /foo '(?<file>.+)'/g
      expect(await render('matcher-a.md', { matcher })).toMatchSnapshot()
    })
    test('custom matcher', async () => {
      const matcher = /\$(?<file>.+)\$/g
      expect(await render('matcher-b.md', { matcher })).toMatchSnapshot()
    })

    test('fail for non global regexp', async () => {
      const matcher = /foo '(?<file>.+)'/
      expect(() => render('matcher-a.md', { matcher })).toThrow('RegExp must be global')
    })

    test('fail for missing "file" group', async () => {
      const matcher = /foo '(.+)'/g
      expect(() => render('matcher-a.md', { matcher })).toThrow('Regexp must expose a named group "file"')
    })
  })
})
