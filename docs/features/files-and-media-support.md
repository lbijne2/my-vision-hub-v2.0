# Files and Media Support

## Overview

Blog posts now support rich file and media attachments, allowing you to enhance your content with downloadable files, images, videos, and other media types.

## Features

### 1. Cover Images
- **Hero Images**: Display a prominent cover image at the top of your blog post
- **Responsive Design**: Automatically adjusts to different screen sizes
- **Loading Optimization**: Uses lazy loading for better performance

### 2. File Attachments
- **Multiple File Types**: Support for documents, spreadsheets, presentations, PDFs, archives
- **Rich Metadata**: File names, types, sizes, and creation dates
- **Download Actions**: Direct download links for all attachments
- **Visual Indicators**: Color-coded badges and appropriate icons for each file type

### 3. Media Files
- **Image Support**: Photos, infographics, diagrams with captions and alt text
- **Video Support**: MP4, WebM, and other video formats with duration display
- **Audio Support**: MP3, WAV, and other audio files
- **GIF Support**: Animated GIFs and other animated formats
- **Inline Previews**: Media files can be previewed directly in the post
- **Interactive Controls**: Video and audio players with standard controls

### 4. Preview Functionality
- **Image Previews**: Thumbnails displayed inline with the post content
- **Video Players**: Embedded video players with standard controls (play, pause, volume)
- **Audio Players**: Audio controls for podcast episodes and sound files
- **GIF Display**: Animated GIFs shown directly in the content
- **No External Navigation**: Users can preview content without leaving the page

## Usage

### In Notion Database

To add files and media to your blog posts:

1. **Cover Image**: Use the `CoverImage` property (Files & Media type)
2. **Attachments**: Use the `attachments` property (Files & Media type)
3. **Media Files**: Use the `mediaFiles` property (Files & Media type)

### In Markdown Content

You can reference files and media directly in your markdown content:

#### File References
```markdown
[file:document.pdf](file:document.pdf) - Download the research paper
[file:presentation.pptx](file:presentation.pptx) - View the slides
```

#### Media References
```markdown
[media:video.mp4](media:video.mp4) - Watch the demo
[media:image.png](media:image.png) - View the infographic
```

### File Type Detection

The system automatically detects file types based on:
- **File extensions** (e.g., .pdf, .docx, .mp4)
- **MIME types** from the database
- **Manual type specification** in Notion

## Supported File Types

### Documents
- **PDF**: Research papers, reports, manuals
- **Word**: .docx, .doc files
- **Spreadsheets**: .xlsx, .csv files
- **Presentations**: .pptx, .key files
- **Text**: .txt, .md files

### Media
- **Images**: .jpg, .png, .gif, .webp
- **Videos**: .mp4, .webm, .mov
- **Audio**: .mp3, .wav, .ogg

### Archives
- **Compressed**: .zip, .rar, .7z
- **Packages**: .tar.gz, .tar.bz2

## Technical Implementation

### Database Schema

The blog posts table now includes:
```sql
cover_image_url TEXT,
attachments JSONB,
media_files JSONB
```

### Notion Integration

Files and media are fetched from Notion's Files & Media properties:
- `coverImage`: Single file for the post cover
- `attachments`: Array of downloadable files
- `mediaFiles`: Array of media content

### Frontend Components

- **MediaRenderer**: Displays attachments and media files
- **Enhanced MarkdownRenderer**: Handles file/media references in content
- **Responsive Design**: Works on all device sizes

## Best Practices

### File Organization
1. **Use Descriptive Names**: Clear, meaningful file names
2. **Group Related Files**: Organize by topic or section
3. **Limit File Sizes**: Keep files under 50MB for optimal performance

### Media Optimization
1. **Image Compression**: Use appropriate image formats and sizes
2. **Video Quality**: Balance quality with file size
3. **Accessibility**: Include alt text and captions

### Content Integration
1. **Contextual References**: Link files to relevant content sections
2. **Clear Descriptions**: Explain what each file contains
3. **Logical Flow**: Arrange files in a logical order

## Examples

### Sample Blog Post Structure
```markdown
# Research Findings

Our latest research on AI ethics has yielded interesting results.

## Download Resources
[file:research-paper.pdf](file:research-paper.pdf) - Full research paper
[file:data-analysis.xlsx](file:data-analysis.xlsx) - Raw data and analysis

## Visual Content
[media:infographic.png](media:infographic.png) - Key findings summary
[media:presentation-video.mp4](media:presentation-video.mp4) - Conference presentation
```

### Preview Examples

#### Image Preview
- **Thumbnail Display**: Images are shown as 128px height thumbnails
- **Responsive Layout**: Automatically adjusts to container width
- **Alt Text Support**: Accessibility-friendly with descriptive text
- **Caption Display**: Optional captions below the image

#### Video Preview
- **Embedded Player**: HTML5 video player with standard controls
- **Metadata Display**: Shows duration, dimensions, and file information
- **Responsive Design**: Scales appropriately on all devices
- **Fallback Support**: Graceful degradation for unsupported formats

#### Audio Preview
- **Audio Controls**: Standard HTML5 audio player
- **Duration Display**: Shows total length in minutes:seconds format
- **File Information**: Displays file type, size, and creation date
- **Caption Support**: Optional descriptions for audio content

#### File Attachments
- **Type Indicators**: Color-coded badges for different file types
- **Size Information**: Human-readable file sizes (KB, MB, GB)
- **Action Buttons**: View and download options for each file
- **Icon Display**: Appropriate icons for each file category

### Notion Database Properties
```
Title: Research Findings
CoverImage: [hero-image.jpg]
attachments: [research-paper.pdf, data-analysis.xlsx]
mediaFiles: [infographic.png, presentation-video.mp4]
```

## Future Enhancements

### Planned Features
- **File Versioning**: Track file updates and changes
- **Access Control**: Role-based file permissions
- **Analytics**: Download and view statistics
- **Search**: Full-text search within file contents
- **Preview**: In-browser file previews

### Integration Opportunities
- **Cloud Storage**: Direct integration with Google Drive, Dropbox
- **Video Hosting**: YouTube, Vimeo integration
- **Document Sharing**: Real-time collaboration features
- **Mobile Apps**: Native mobile file handling

## Troubleshooting

### Common Issues

1. **Files Not Displaying**
   - Check file permissions in Notion
   - Verify file URLs are accessible
   - Ensure proper property mapping

2. **Media Not Loading**
   - Check file format compatibility
   - Verify file size limits
   - Test file URLs directly

3. **Performance Issues**
   - Optimize image and video files
   - Use appropriate file formats
   - Consider CDN for large files

### Support

For technical support or feature requests:
- Check the [GitHub repository](../../../README.md)
- Review [API documentation](../technical/api-reference.md)
- Contact the development team

---

**Last Updated**: January 2025  
**Feature Version**: v1.0  
**Next Update**: v1.1 - Enhanced File Management
