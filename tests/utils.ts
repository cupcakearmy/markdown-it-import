import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import MarkdownIt from 'markdown-it'
import { Options, importPlugin } from '../src/index.ts'

export async function render(path: string, options: Options | undefined = undefined): Promise<string> {
  const filename = join('./tests/fixtures', path)
  const input = await readFile(filename, 'utf-8')
  const output = MarkdownIt().use(importPlugin, options).render(input)
  return output
}
