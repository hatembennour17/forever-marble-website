# Forever Marble & Granite website

A statically exported Next.js replacement for forevermarble.com. It preserves the existing brand assets and visual character while improving page speed, content hierarchy, mobile usability and local SEO.

## Run locally

```powershell
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Production build

```powershell
pnpm build
```

The deployable static site is generated in `out/`. Before launch, connect the estimate form to the preferred CRM/form service if browser-email submission is not desired, preserve all legacy WordPress URLs with redirects, and verify the business hours/service-area details.
# forever-marble-website


# Client photo management

Sign in at `/admin/` with an existing administrator or staff account and choose **Photos**.

- **Gallery photos:** choose a JPG, PNG or WebP, add a photo description, review the preview and select **Publish photo**. Use **Move up / Move down** to arrange photos and **Hide from gallery / Show in gallery** to remove or restore them without permanently deleting them.
- **Website images:** search by page or image name, select a replacement, review it and publish. A shared image changes in all locations listed on its card. **Restore original** returns a replaced slot to its bundled image.
- Photo changes become visible after refreshing the public website; no code deployment is required. Uploads are resized to a maximum of 2400 pixels and stored in the site-wide `forever-marble-photos` Netlify Blobs store, so they survive deployments. The original files and prior upload objects are retained.
- Inputs up to 15 MB are prepared in the browser; server uploads are capped at 3 MB and decoded/re-encoded as JPEG or PNG (preserving transparency). SVG/animated uploads are not supported. Concurrent edits are rejected rather than silently overwriting another editor's changes.
- Photo writes require an active staff/admin account, a valid session and a same-origin request. The public photo manifest and image files are read-only.

Validation: `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm build`. For an isolated browser preview, run `pnpm build` then `pnpm preview:photos` and open `http://127.0.0.1:3210/admin/`. The preview uses in-memory sample authentication and image storage only, binds to localhost, and never changes production data. It is not a Netlify function.


## Specials management

Sign in at `/admin/` and choose the separate **Specials** tab. Search for an offer, replace its image, edit its name, original price, sale price per square foot and minimum square footage, then click **Publish changes**. The image and prices are saved together. Leave original price blank to omit the crossed-out price; a zero minimum hides the minimum line. Use **Add a new special**, **Move up / Move down** and **Hide special / Show special** to manage the offer list. Both staff and administrators can manage specials.

The existing eleven offers are the initial defaults. Offer settings are stored separately from photo settings in `specials.json`; uploaded images use the existing authenticated photo storage and validation. Existing image overrides are respected until an offer receives its own replacement. Offer images are managed in Specials rather than duplicated in the Photos editor. Reload the public `/specials/` page after publishing. The public page requests current prices and shows a contact message if they cannot be loaded, rather than displaying stale fallback prices.

Each Specials image replacement now keeps up to 10 previous images and descriptions. Use **Restore previous image**, or choose an earlier image from the history selector. Restoring an image does not change prices, minimums, names or visibility. The replaced image remains in history so the restore can be undone. For replacements made before history was introduced, the original offer image is available when known; intermediate earlier uploads cannot be reconstructed automatically.

The **Specials page headline** form at the top of Admin > Specials edits the large financing label above the offers. Review the preview and click **Publish headline**. A blank headline hides the label. Headline updates keep offer prices, photos and image history intact.
