import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { MediaRenderer } from "@/components/MediaRenderer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestMarkdownPage() {
  const testContent = `
# Enhanced Markdown Test Page

This page demonstrates the enhanced markdown features including toggle lists, callouts, math equations, enhanced tables, and **column layouts**.

## File and Media References Test

This section tests the new file and media reference functionality:

### File References
- [file:research-paper.pdf](file:research-paper.pdf) - A research paper on AI ethics
- [file:presentation.pptx](file:presentation.pptx) - Slides from our recent conference
- [file:data-analysis.xlsx](file:data-analysis.xlsx) - Spreadsheet with our findings

### Media References
- [media:demo-video.mp4](media:demo-video.mp4) - A demonstration video
- [media:infographic.png](media:infographic.png) - An infographic explaining the concepts  
- [media:podcast-episode.mp3](media:podcast-episode.mp3) - Audio discussion on the topic

*Note: Captions are configured in the media data and appear below the media in italic.*

### Alternative Link Formats
- [research-paper.pdf](file:research-paper.pdf) - A research paper on AI ethics
- [presentation.pptx](file:presentation.pptx) - Slides from our recent conference
- [data-analysis.xlsx](file:data-analysis.xlsx) - Spreadsheet with our findings

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

## Column Layouts

### Two-Column Layout

:::columns-2
**Left Column Content**
This is the left column with some content. You can put any markdown content here including:
- Lists
- **Bold text**
- *Italic text*
- [Links](https://github.com)

The columns will automatically stack on mobile devices and display side-by-side on larger screens.

---

**Right Column Content**
This is the right column with different content. Columns are great for:
- Comparing information
- Side-by-side layouts
- Organizing content
- Creating visual balance

Both columns maintain equal height and responsive behavior.
:::

### Three-Column Layout

:::columns-3
**Column 1**
First column content with some sample text and formatting.

---

**Column 2**
Second column with different content and styling examples.

---

**Column 3**
Third column demonstrating the three-column layout capability.
:::

## Enhanced Tables

| Feature | Status | Description |
|---------|--------|-------------|
| Toggle Lists | ✅ | Collapsible content sections |
| Callouts | ✅ | Special notice boxes |
| Math Equations | ✅ | KaTeX rendering |
| Enhanced Tables | ✅ | Better styling |
| Column Layouts | ✅ | 2 and 3 column support |
| Syntax Highlighting | ✅ | Code block highlighting |
| File References | ✅ | Inline file previews |
| Media References | ✅ | Inline media previews |

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

  // Sample data for testing file and media references
  const testAttachments = [
    {
      id: "1",
      name: "research-paper.pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      type: "pdf" as const,
      size: 1024000,
      mime_type: "application/pdf",
      created_at: "2024-01-25T10:00:00Z"
    },
    {
      id: "2",
      name: "presentation.pptx",
      url: "https://file-examples.com/storage/fe52cb0c4862dcb4a23434e/2017/10/file-sample_150kB.pptx",
      type: "presentation" as const,
      size: 153600,
      mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      created_at: "2024-01-25T10:00:00Z"
    },
    {
      id: "3",
      name: "data-analysis.xlsx",
      url: "https://file-examples.com/storage/fe52cb0c4862dcb4a23434e/2017/10/file-sample_100kB.xlsx",
      type: "spreadsheet" as const,
      size: 102400,
      mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      created_at: "2024-01-25T10:00:00Z"
    }
  ]

  const testMediaFiles = [
    {
      id: "1",
      name: "demo-video.mp4",
      url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      type: "video" as const,
      caption: "A demonstration of the new features",
      alt_text: "Demo video showing file and media support",
      width: 1280,
      height: 720,
      duration: 120,
      mime_type: "video/mp4",
      created_at: "2024-01-25T10:00:00Z"
    },
    {
      id: "2",
      name: "infographic.png",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      type: "image" as const,
      caption: "Key findings summary visualization",
      alt_text: "Infographic showing research findings",
      width: 400,
      height: 300,
      mime_type: "image/png",
      created_at: "2024-01-25T10:00:00Z"
    },
    {
      id: "3",
      name: "podcast-episode.mp3",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      type: "audio" as const,
      caption: "Audio discussion on the topic",
      alt_text: "Podcast episode about file and media support",
      duration: 1800,
      mime_type: "audio/wav",
      created_at: "2024-01-25T10:00:00Z"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-vision-charcoal">
            Enhanced Markdown Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer 
            content={testContent} 
            attachments={testAttachments}
            mediaFiles={testMediaFiles}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-vision-charcoal">
            Media Renderer Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MediaRenderer 
            attachments={testAttachments}
            mediaFiles={testMediaFiles}
          />
        </CardContent>
      </Card>
    </div>
  )
}

