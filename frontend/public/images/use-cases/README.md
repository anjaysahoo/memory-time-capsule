# Use Case Images - Manual Download Required

## Status: Images Not Yet Downloaded

The image sources have been identified via Pexels MCP and documented in `IMAGE_SOURCES.md`.

**Action Required**: Download and optimize the 4 images using the instructions in `IMAGE_SOURCES.md`.

## Expected Files

Once downloaded and optimized, this directory should contain:

```
use-cases/
  ├── birthday.webp     (~60KB)
  ├── birthday.jpg      (~90KB)
  ├── professional.webp (~60KB)
  ├── professional.jpg  (~90KB)
  ├── connection.webp   (~60KB)
  ├── connection.jpg    (~90KB)
  ├── family.webp       (~60KB)
  ├── family.jpg        (~90KB)
  ├── IMAGE_SOURCES.md  (source documentation)
  └── README.md         (this file)
```

## Download Instructions Summary

1. Open `IMAGE_SOURCES.md` for image URLs
2. Download each image from the landscape URL
3. Use Squoosh (https://squoosh.app/) to:
   - Resize to 800x533px
   - Generate WebP version (<60KB target)
   - Generate JPG version (<90KB target)
4. Save with the specified filenames
5. Verify all 8 files are present (4 images × 2 formats)

## Verification

After downloading, verify with:
```bash
ls -lh *.webp *.jpg
# Should show 8 files, all under 100KB
```

