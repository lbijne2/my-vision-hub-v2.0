import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestColumnsPage() {
  const testContent = `
# Column Layout Test

This is a test of the new column layout functionality.

## Two-Column Test

:::columns-2
**Left Column**
This is the left column content. It should display on the left side on larger screens and stack on mobile.

- List item 1
- List item 2
- List item 3

---

**Right Column**
This is the right column content. It should display on the right side on larger screens and stack below the left column on mobile.

**Bold text** and *italic text* work in columns too.
:::

## Three-Column Test

:::columns-3
**Column 1**
First column with some sample content.

---

**Column 2**
Second column with different content.

---

**Column 3**
Third column demonstrating the three-column layout.
:::

## Four-Column Test

:::columns-4
**Column 1**
First column content.

---

**Column 2**
Second column content.

---

**Column 3**
Third column content.

---

**Column 4**
Fourth column content.
:::

## Five-Column Test

:::columns-5
**Col 1**
First column with some content to test the layout.

---

**Col 2**
Second column with different content to verify spacing.

---

**Col 3**
Third column to ensure proper grid distribution.

---

**Col 4**
Fourth column to test the responsive behavior.

---

**Col 5**
Fifth column that should display on the same row on large screens.
:::

## Manual Column Markers (For Notion)

### Two-Column Layout with HTML Comments

<!-- 2-columns -->
**Left Column Content**
This is the left column with some content. You can put any markdown content here including:
- Lists
- **Bold text**
- *Italic text*
- [Links](https://github.com)

The columns will automatically stack on mobile devices and display side-by-side on larger screens.

<!-- column-break -->

**Right Column Content**
This is the right column with different content. Columns are great for:
- Comparing information
- Side-by-side layouts
- Organizing content
- Creating visual balance

Both columns maintain equal height and responsive behavior.
<!-- /2-columns -->

### Alternative Format

<!-- columns:2 -->
**Technical Details**
- Uses CSS Grid for layout
- Responsive breakpoints
- Automatic spacing
- Equal height columns

<!-- break -->

**Benefits**
- Better content organization
- Improved readability
- Mobile-first design
- Flexible layouts
<!-- /columns -->

### Column with Images

<!-- 2-columns -->
![Left Image](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop)
*Caption for left image*

<!-- column-break -->

![Right Image](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop)
*Caption for right image*
<!-- /2-columns -->

### Four-Column Layout with HTML Comments

<!-- 4-columns -->
**Column 1**
First column with some content.

<!-- column-break -->

**Column 2**
Second column content.

<!-- column-break -->

**Column 3**
Third column content.

<!-- column-break -->

**Column 4**
Fourth column content.
<!-- /4-columns -->

### Five-Column Layout with HTML Comments

<!-- 5-columns -->
**Col 1**
First column content.

<!-- column-break -->

**Col 2**
Second column content.

<!-- column-break -->

**Col 3**
Third column content.

<!-- column-break -->

**Col 4**
Fourth column content.

<!-- column-break -->

**Col 5**
Fifth column content.
<!-- /5-columns -->

## Regular Content

This is regular content that should display normally below the columns.

## Another Two-Column Example

:::columns-2
**Technical Details**
- Uses CSS Grid for layout
- Responsive breakpoints
- Automatic spacing
- Equal height columns

---

**Benefits**
- Better content organization
- Improved readability
- Mobile-first design
- Flexible layouts
:::
`

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-vision-charcoal">
            Column Layout Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer content={testContent} />
        </CardContent>
      </Card>
    </div>
  )
}
