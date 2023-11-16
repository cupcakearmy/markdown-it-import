import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const defaultOptions = {
  matcher: /@import\((?<file>.+)\)(\s*?\[(?<range>\d+-\d+)\])?/g,
  root: process.cwd(),
}

export type Options = Partial<typeof defaultOptions>

export function importPlugin(md: any, options: Options = {}) {
  // Options
  const o = Object.assign(defaultOptions, options)

  // Parser
  function parse(code: string, alreadyVisited: string[] = []) {
    if (!o.matcher.global) throw new Error('RegExp must be global')
    o.matcher.lastIndex = 0 // Reset Regexp
    const newFiles = []

    while (true) {
      const match = o.matcher.exec(code)
      if (!match) break

      // Get groups
      const file = match.groups?.['file']?.trim()
      if (!file) throw new Error('Regexp must expose a named group "file"')
      const range = match.groups?.['range']
        ?.trim()
        .split('-')
        .map((n) => parseInt(n))

      // Load content
      const filename = path.resolve(o.root, file)
      if (alreadyVisited.includes(filename)) throw new Error(`cycles are not allowed, already parsed "${filename}"`)
      newFiles.push(filename)
      const exists = fs.existsSync(filename)
      if (!exists) throw new Error(`cannot locate file "${filename}"`)
      let contents = fs.readFileSync(filename, 'utf-8')

      // Apply line range
      if (range) {
        const lines = contents.split('\n')
        const maxLines = lines.length
        const start = range[0]
        const end = range[1]
        if (start === undefined || end === undefined) throw new Error(`invalid range "${match.groups?.['range']}"`)
        if (end < start) throw new Error(`end position "${end}" cannot be smaller than start "${start}"`)
        if (start < 1) throw new Error(`start position "${start}" needs to be at least 1`)
        if (end > maxLines) throw new Error(`end position "${end}" is higher than the file contents "${maxLines}"`)
        contents = lines.slice(start - 1, end).join('\n')
      }

      // Recursion
      contents = parse(contents, [...alreadyVisited, ...newFiles])

      // Replace
      code = code.slice(0, match.index) + contents + code.slice(match.index + match[0].length, code.length)
    }

    return code
  }

  // Mount hook
  md.core.ruler.before('normalize', 'include', (state: any) => {
    state.src = parse(state.src)
  })
}
