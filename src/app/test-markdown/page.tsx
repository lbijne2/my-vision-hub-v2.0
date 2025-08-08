import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const testMarkdown = `# Enhanced Markdown Components Test

This page demonstrates all the new markdown components that have been added.

## Standard Markdown Features

### Regular Tables (GitHub Flavored Markdown)

| Feature | Status | Priority |
|---------|--------|----------|
| Toggle Lists | ✅ Complete | High |
| Toggle Headings | ✅ Complete | High |
| Callouts | ✅ Complete | Medium |
| Block Equations | ✅ Complete | Low |
| Database Tables | ✅ Complete | Medium |

### Block Equations

Here's an inline equation: $E = mc^2$

Here's a block equation:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

Another complex equation:

$$
f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n
$$

### Code Blocks with Syntax Highlighting

\`\`\`javascript
function enhancedMarkdown() {
  const features = [
    'toggle-lists',
    'toggle-headings', 
    'callouts',
    'block-equations',
    'database-tables'
  ];
  
  return features.map(feature => ({
    name: feature,
    status: 'implemented'
  }));
}
\`\`\`

\`\`\`python
def calculate_factorial(n):
    """Calculate factorial using recursion."""
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

print(calculate_factorial(5))  # Output: 120
\`\`\`

## Custom Components

### Toggle Lists

{{Basic Toggle|This is a simple toggle that can be expanded and collapsed. Perfect for FAQs, detailed explanations, or any content you want to keep collapsible.}}

{{Advanced Features|Here you can put more complex content including **bold text**, *italic text*, and even lists:

- Feature 1
- Feature 2  
- Feature 3

And code: \`const example = "test"\`}}

### Toggle Headings

### {{Collapsible Section}}

This creates a toggleable heading that users can expand or collapse.

## {{Important Information}}

This is a second-level heading that can be toggled.

### Callouts

:::info Important Information
This is an informational callout. Use it to highlight important details or provide additional context.
:::

:::warning Be Careful
This is a warning callout. Use it to alert users about potential issues or important considerations.
:::

:::error Critical Alert
This is an error callout. Use it to highlight critical issues, errors, or problems that need immediate attention.
:::

:::success Great Job
This is a success callout. Use it to confirm successful actions or highlight positive outcomes.
:::

:::info Advanced Callout Example
You can include **formatting**, \`code\`, and even lists in callouts:

1. First item
2. Second item
3. Third item

This makes callouts very versatile for documentation.
:::

### Database Tables

|||Name,Role,Department,Start Date|||
John Doe,Software Engineer,Engineering,2023-01-15
Jane Smith,Product Manager,Product,2022-11-30
Bob Johnson,Designer,Design,2023-03-10
Alice Brown,Data Scientist,Engineering,2022-09-20
|||

|||Project,Status,Priority,Due Date|||
My Vision Hub,Active,High,2024-12-31
AI Integration,Planning,Medium,2024-06-30
Mobile App,Backlog,Low,2025-03-15
API Redesign,In Progress,High,2024-04-15
|||

### Enhanced Blockquotes

> This is an enhanced blockquote with better styling and visual hierarchy. It includes better spacing, background colors, and visual indicators.

> **Pro Tip:** You can combine blockquotes with other formatting like **bold text** and *italic text* for more expressive content.

## Testing All Features Together

Here's a complex example combining multiple features:

:::info Project Overview
This project includes several major components:

{{Core Features|The main features include:
- Enhanced markdown rendering
- Toggle components for better UX
- Mathematical equation support
- Improved table styling}}

{{Technical Implementation|Built using:
- React and TypeScript
- react-markdown with plugins
- Custom component renderers
- Tailwind CSS for styling}}
:::

|||Component,Implementation Status,Notes|||
Toggle Lists,Complete,Custom syntax with regex parsing
Toggle Headings,Complete,Integrated with existing heading renderer
Callouts,Complete,Four types: info warning error success
Block Equations,Complete,Using KaTeX for math rendering
Database Tables,Complete,Custom table component with styling
Enhanced Tables,Complete,GitHub Flavored Markdown support
|||

### Mathematical Formulas

The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

Euler's identity in block form:
$$e^{i\\pi} + 1 = 0$$

Matrix notation:
$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}$$

## Conclusion

All enhanced markdown components are now working! The system supports:

1. ✅ Toggle Lists with custom \`{{}}\` syntax
2. ✅ Toggle Headings with heading + \`{{}}\` syntax  
3. ✅ Enhanced Quotes with better styling
4. ✅ Callouts with \`:::\` syntax (info, warning, error, success)
5. ✅ Block Equations with KaTeX rendering
6. ✅ Database Tables with custom \`|||\` syntax
7. ✅ Enhanced Tables with GitHub Flavored Markdown

The markdown renderer is now much more powerful and suitable for complex documentation and content creation.
`

export default function TestMarkdownPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Enhanced Markdown Components Test
          </h1>
          <p className="text-xl text-vision-charcoal/70">
            Testing all the new markdown components and features
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Markdown Renderer Test</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer content={testMarkdown} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
