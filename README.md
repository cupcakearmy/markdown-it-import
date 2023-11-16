# Markdown import plugin

This is a `markdown-it` plugin to include/import any raw files from your filesystem.

## Features

- No dependencies
- Recursive import
- Import whatever file
- Customizable RegEx
- Tested

## Installation

```bash
npm install @nicco.io/markdown-it-import
```

## Usage

Include a whole file

```md
@import(somefile.md)
```

Import specific lines

```md
@import(snippet.ts)[5-10]
```

### Example

```md
<!-- main.md -->

# Title

@import(chapter.md)

<!-- This should be tripple ` -->

`ts
@import(sum.ts)
`
```

```md
## Chapter

I will be included
```

```ts
// sum.ts
export function sum(a: number, b: number): number {
  return a + b
}
```

```ts
import MarkdownIt from 'markdown-it'
import fs from 'node:fs/promises'
import { Options, importPlugin } from '@nicco.io/markdown-it-import'

const input = await fs.readFile('./main.md', 'utf-8')
const html = MarkdownIt().use(importPlugin).render(input)
```

## Similar works

There are two very similar plugins, which this one is def. inspired by, however while the one can only import `.md` files, the other cannot select single lines.

- https://github.com/camelaissani/markdown-it-include
- https://github.com/h-hg/markdown-it-import
