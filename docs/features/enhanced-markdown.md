# Enhanced Markdown Components

The MarkdownRenderer component has been enhanced with support for advanced markdown features including toggle lists, callouts, block equations, and enhanced tables.

## Overview

The enhanced markdown renderer now supports:

1. **Toggle Lists** - Collapsible content sections from Notion
2. **Callouts** - Special notice boxes (info, warning, error, success)
3. **Block Equations** - Mathematical formulas using KaTeX
4. **Enhanced Tables** - GitHub Flavored Markdown tables with better styling
5. **Syntax Highlighting** - Code blocks with language-specific highlighting

## Toggle Lists (Notion Integration)

Toggle lists from Notion are automatically converted to HTML `<details>` and `<summary>` elements by the `notion-to-md` library. The enhanced MarkdownRenderer properly handles these elements with custom styling:

### Example from Notion:
```html
<details>
<summary>Official Models</summary>
Content inside the toggle list...
</details>
```

### Features:
- **Collapsible Content**: Click to expand/collapse
- **Custom Styling**: Vision Hub design system colors
- **Nested Support**: Toggle lists can contain other toggle lists
- **Interactive Icons**: Chevron arrow that rotates on toggle
- **Hover Effects**: Visual feedback on interaction

## Callouts

Create special notice boxes using triple colons:

```markdown
:::info Optional Title
Your content here
:::

:::warning Be Careful
This is a warning message
:::

:::error Critical
This is an error message
:::

:::success Great!
This is a success message
:::
```

**Supported Types:**
- `info` - Blue informational callout
- `warning` - Amber warning callout  
- `error` - Red error/danger callout
- `success` - Green success callout

## Math Equations

Mathematical equations using KaTeX syntax:

**Inline math:** `$E = mc^2$`

**Block math:**
```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## Enhanced Tables

GitHub Flavored Markdown tables with enhanced styling:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

## Code Blocks

Syntax highlighting for code blocks:

```markdown
\`\`\`typescript
interface User {
  id: string;
  name: string;
}
\`\`\`
```

## Technical Implementation

### Dependencies

The enhanced renderer uses the following packages:

- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support
- `remark-math` - Math syntax parsing
- `rehype-katex` - KaTeX math rendering
- `rehype-highlight` - Syntax highlighting for code blocks
- `katex` - Mathematical notation rendering
- `highlight.js` - Code syntax highlighting

### Custom Components

The renderer includes custom React components:

- `details` - Handles collapsible content from Notion
- `summary` - Toggle headers with custom styling
- Enhanced table components with Vision Hub styling

### CSS Imports

Required CSS files are imported in `globals.css`:

```css
/* KaTeX for math equation rendering */
@import 'katex/dist/katex.min.css';

/* Highlight.js for syntax highlighting */
@import 'highlight.js/styles/github.css';
```

## Usage in Components

```tsx
import { MarkdownRenderer } from "@/components/MarkdownRenderer"

export function MyComponent() {
  const content = `
# My Document

<details>
<summary>Toggle Example</summary>
This content can be collapsed
</details>

:::info
This is an informational callout
:::

$$E = mc^2$$
`

  return <MarkdownRenderer content={content} />
}
```

## Styling

All components use the Vision Hub design system colors and styling:

- `vision-charcoal` - Primary text color
- `vision-ochre` - Accent color for links and highlights
- `vision-beige` - Background color for tables and highlights
- `vision-border` - Border color for tables and components

## Testing

Visit `/test-markdown` to see all features in action with comprehensive examples.

## Browser Support

- Modern browsers with ES6+ support
- KaTeX works in all major browsers
- Highlight.js provides syntax highlighting across browsers
- Toggle functionality requires JavaScript enabled

## Performance Notes

- KaTeX equations are rendered on the client side
- Large tables may benefit from virtualization for very large datasets
- Toggle states are managed in React state (not persisted across page loads)

## Notion Integration

When using Notion integration, toggle lists are automatically converted to the proper HTML format:

1. **Notion Toggle Block** → `notion-to-md` → HTML `<details><summary>`
2. **MarkdownRenderer** → Custom styled components
3. **Result** → Beautiful, interactive toggle lists

This ensures seamless integration between Notion's toggle functionality and the enhanced markdown renderer.
