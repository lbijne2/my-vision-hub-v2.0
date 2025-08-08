# Enhanced Markdown Components

The MarkdownRenderer component has been enhanced with support for advanced markdown features including toggle lists, toggle headings, callouts, block equations, databases, and enhanced tables.

## Overview

The enhanced markdown renderer now supports:

1. **Toggle Lists** - Collapsible content sections
2. **Toggle Headings** - Collapsible heading sections  
3. **Enhanced Quotes** - Better styled blockquotes
4. **Callouts** - Special notice boxes (info, warning, error, success)
5. **Block Equations** - Mathematical formulas using KaTeX
6. **Database Tables** - Custom styled tables with special syntax
7. **Enhanced Tables** - GitHub Flavored Markdown tables with better styling

## Syntax Guide

### Toggle Lists

Create collapsible content sections using double curly braces:

```markdown
{{Title|Content goes here}}
```

**Example:**
```markdown
{{FAQ: How does this work?|This is a detailed explanation that can be collapsed or expanded by the user.}}
```

### Toggle Headings

Create collapsible heading sections by adding double curly braces to any heading:

```markdown
### {{Collapsible Section}}
Content under this heading will be collapsible.

## {{Another Toggle Section}}
This creates a larger collapsible section.
```

### Enhanced Quotes

Regular blockquote syntax with enhanced styling:

```markdown
> This is a blockquote with enhanced visual styling
> including better spacing and background colors.
```

### Callouts

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

### Block Equations

Mathematical equations using KaTeX syntax:

**Inline math:** `$E = mc^2$`

**Block math:**
```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Database Tables

Custom table syntax for enhanced styling:

```markdown
|||Header1,Header2,Header3|||
Row1Col1,Row1Col2,Row1Col3
Row2Col1,Row2Col2,Row2Col3
|||
```

**Example:**
```markdown
|||Name,Role,Department|||
John Doe,Engineer,Development
Jane Smith,Manager,Product
|||
```

### Enhanced Tables

Regular GitHub Flavored Markdown tables with enhanced styling:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

## Technical Implementation

### Dependencies

The enhanced renderer uses the following additional packages:

- `remark-gfm` - GitHub Flavored Markdown support
- `remark-math` - Math syntax parsing
- `rehype-katex` - KaTeX math rendering
- `rehype-highlight` - Syntax highlighting for code blocks
- `katex` - Mathematical notation rendering
- `highlight.js` - Code syntax highlighting

### Custom Components

The renderer includes custom React components:

- `Toggle` - Handles collapsible content
- `Callout` - Renders styled notice boxes
- `Database` - Custom table component with enhanced styling

### Preprocessing

Content is preprocessed to convert custom syntax into HTML data attributes that are then handled by custom component renderers.

## Usage in Components

```tsx
import { MarkdownRenderer } from "@/components/MarkdownRenderer"

export function MyComponent() {
  const content = `
# My Document

{{Toggle Example|This content can be collapsed}}

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
