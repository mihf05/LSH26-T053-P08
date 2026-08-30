# Landing page assets

The images and vectors for the landing page are exported from the Figma design
(file `QMI63rM4YzUCDpN91OtS6Z`, node `1:265` — "Desktop"). They are not checked
into the repository.

To populate this folder:

```bash
npm run assets:landing
```

That reads the manifest in `lib/landing-assets.ts` and downloads each asset.
The Figma asset URLs expire roughly a week after they are issued; if a download
fails, open the design, select the layer named in the manifest, and export it
here using the file name and size listed there.

Until the assets are present the page lays out correctly but the image boxes
render empty — every one has explicit dimensions, so nothing shifts.
