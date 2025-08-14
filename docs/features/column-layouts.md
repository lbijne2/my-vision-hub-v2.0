# Column Layouts

The markdown renderer now supports multi-column layouts for creating more visually appealing and organized content.

## Syntax

### Two-Column Layout

Use the `:::columns-2` syntax to create a two-column layout:

```markdown
:::columns-2
**Left Column Content**
This is the left column with some content. You can put any markdown content here including:
- Lists
- **Bold text**
- *Italic text*
- [Links](https://github.com)

---

**Right Column Content**
This is the right column with different content. Columns are great for:
- Comparing information
- Side-by-side layouts
- Organizing content
- Creating visual balance
:::
```

### Three-Column Layout

Use the `:::columns-3` syntax to create a three-column layout:

```markdown
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
```

### Four-Column Layout

Use the `:::columns-4` syntax to create a four-column layout:

```markdown
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
```

### Five-Column Layout

Use the `:::columns-5` syntax to create a five-column layout:

```markdown
:::columns-5
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

---

**Column 5**
Fifth column content.
:::
```

## Manual Column Markers (For Notion Exports)

Since Notion's markdown export doesn't preserve column layout information, you can use HTML comment markers to manually specify columns. These work perfectly with Notion exports.

### Two-Column Layout with HTML Comments

```markdown
<!-- 2-columns -->
**Left Column Content**
This is the left column with some content.

<!-- column-break -->

**Right Column Content**
This is the right column with different content.
<!-- /2-columns -->
```

### Three-Column Layout with HTML Comments

```markdown
<!-- 3-columns -->
**Column 1**
First column content.

<!-- column-break -->

**Column 2**
Second column content.

<!-- column-break -->

**Column 3**
Third column content.
<!-- /3-columns -->
```

### Four-Column Layout with HTML Comments

```markdown
<!-- 4-columns -->
**Column 1**
First column content.

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
```

### Five-Column Layout with HTML Comments

```markdown
<!-- 5-columns -->
**Column 1**
First column content.

<!-- column-break -->

**Column 2**
Second column content.

<!-- column-break -->

**Column 3**
Third column content.

<!-- column-break -->

**Column 4**
Fourth column content.

<!-- column-break -->

**Column 5**
Fifth column content.
<!-- /5-columns -->
```

### Alternative Format

```markdown
<!-- columns:2 -->
**Left Column**
Content for the left column.

<!-- break -->

**Right Column**
Content for the right column.
<!-- /columns -->
```

### Important: Proper Spacing

The column markers automatically add proper spacing around your content to ensure markdown formatting works correctly. This means:

- **Bold text** like `**this**` will render properly
- **Images** like `![alt](url)` will display correctly
- **Lists** and other markdown elements will work as expected
- **No extra spacing needed** - the markers handle it automatically

### Example with Images

```markdown
<!-- 2-columns -->
![Left Image](https://example.com/image1.jpg)
*Caption for left image*

<!-- column-break -->

![Right Image](https://example.com/image2.jpg)
*Caption for right image*
<!-- /2-columns -->
```

## Features

- **Responsive Design**: Columns automatically stack on mobile devices and display side-by-side on larger screens
- **Equal Height**: All columns maintain equal height for visual consistency
- **Markdown Support**: Each column supports full markdown syntax including:
  - Headers
  - Lists
  - Links
  - Images
  - Code blocks
  - Tables
  - And more
- **Flexible Content**: You can put any type of content in each column
- **Automatic Spacing**: Proper spacing and margins are automatically applied
- **Notion Compatible**: Manual markers work perfectly with Notion exports

## Use Cases

Column layouts are perfect for:
- **Comparing Information**: Side-by-side feature comparisons
- **Organizing Content**: Grouping related information
- **Creating Balance**: Visual balance in documentation
- **Responsive Design**: Mobile-first layouts that adapt to screen size
- **Content Organization**: Structuring complex information
- **Notion Integration**: Creating columns in content that will be exported to markdown

## How to Use with Notion

1. **Create your content** in Notion as usual
2. **Add column markers** using HTML comments where you want columns
3. **Export to markdown** - the markers will be preserved
4. **Render in your app** - the columns will be automatically detected and rendered

### Example Workflow

1. In Notion, add this to your content:
   ```markdown
   <!-- 2-columns -->
   **Left side content**
   Your content here
   
   <!-- column-break -->
   
   **Right side content**
   More content here
   <!-- /2-columns -->
   ```

2. Export to markdown from Notion
3. The markers will be preserved and your app will render them as columns

## Technical Details

- Uses CSS Grid for layout
- **Responsive breakpoints:**
  - **2 columns**: `md:` (768px+) for side-by-side display
  - **3 columns**: `md:` (768px+) for 2 columns, `lg:` (1024px+) for 3 columns
  - **4 columns**: `md:` (768px+) for 2 columns, `lg:` (1024px+) for 3 columns, `xl:` (1280px+) for 4 columns
  - **5 columns**: `md:` (768px+) for 2 columns, `lg:` (1024px+) for 3 columns, `xl:` (1280px+) for 4 columns, `2xl:` (1536px+) for 5 columns
- Automatic gap spacing between columns
- Mobile-first approach with progressive enhancement
- HTML comment markers are preserved during markdown export
