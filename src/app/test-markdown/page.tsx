import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestMarkdownPage() {
  const testContent = `
# Enhanced Markdown Test Page

This page demonstrates the enhanced markdown features including toggle lists, callouts, math equations, and enhanced tables.

## Toggle Lists (from Notion)

<details>
<summary>Official Models</summary>

This is the content inside the toggle list. It should be collapsible and expandable.

### Subsection inside toggle

- Point 1
- Point 2
- Point 3

**Bold text** and *italic text* work inside toggles too.

</details>

<details>
<summary>Another Toggle Example</summary>

This is another toggle with different content.

\`\`\`javascript
// Code blocks work inside toggles
function hello() {
  console.log("Hello from toggle!");
}
\`\`\`

</details>

## Callouts

:::info Information Callout
This is an informational callout with important information.
:::

:::warning Warning Callout
This is a warning callout to alert users about something important.
:::

:::error Error Callout
This is an error callout for critical issues.
:::

:::success Success Callout
This is a success callout for positive feedback.
:::

## Math Equations

### Inline Math
The famous equation $E = mc^2$ was discovered by Einstein.

### Block Math
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Enhanced Tables

| Feature | Status | Description |
|---------|--------|-------------|
| Toggle Lists | ✅ | Collapsible content sections |
| Callouts | ✅ | Special notice boxes |
| Math Equations | ✅ | KaTeX rendering |
| Enhanced Tables | ✅ | Better styling |
| Syntax Highlighting | ✅ | Code block highlighting |

## Code Blocks

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

## Regular Content

This is regular paragraph content with **bold text** and *italic text*.

### Lists

- Unordered list item 1
- Unordered list item 2
  - Nested item
  - Another nested item
- Unordered list item 3

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

### Links

[Visit GitHub](https://github.com) for more information.

### Blockquotes

> This is a blockquote with enhanced styling.
> It should have a nice border and background.

## Nested Toggle Lists

<details>
<summary>Parent Toggle</summary>

This is the parent toggle content.

<details>
<summary>Child Toggle</summary>

This is a nested toggle inside the parent toggle.

- Nested list item
- Another nested item

</details>

More parent content after the nested toggle.

</details>
`

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-vision-charcoal">
            Enhanced Markdown Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer content={testContent} />
        </CardContent>
      </Card>
    </div>
  )
}

