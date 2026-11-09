# Tanjet Hawlader — Personal Portfolio

Responsive personal portfolio built with HTML, CSS and vanilla JavaScript.

## V8 mobile header correction
- Fixed the translucent mobile header that allowed scrolled page text to show through the navigation.
- Mobile header now uses a solid dark background in both normal and scrolled states.
- Added scroll offset for section anchors so headings do not land underneath the fixed header.
- Kept the V7 soft neon touch halo, responsive layout, portrait, navigation, theme toggle, CV and contact form.

## V7 touch interaction
- Electric Canvas, lightning trails, sparks and particle effects are removed.
- One soft lime/blue halo follows a finger during touch scrolling.
- A subtle circular pulse appears on touch; the halo fades after contact ends.
- Passive touch listeners and one requestAnimationFrame update preserve native scrolling.

## Update the existing GitHub repository
Extract this ZIP and upload all files directly to the repository root, replacing files with matching names. Include `profile-photo.webp`. Do not upload the ZIP itself. Commit to `main`; Vercel can redeploy automatically when its GitHub integration is connected.

## Contact form
The form opens the visitor's configured email application with a prepared message. It does not send or store messages on a server. Direct website submissions require a backend or form service.


## V9 lead-tracking chip overlap fix
- Kept the lead-tracking floating chip.
- Repositioned and resized the mobile art caption so it stays to the right of the chip.
- Slightly adjusted the chip's bottom offset.
- No copy, portrait, or other section design was removed or changed.

## V10 mobile Lead tracking clearance
- Reserved a separate bottom row for the Lead tracking badge, below the portrait card.
- Kept the portrait card near its previous vertical position by top-aligning it with a small top inset.
- The badge no longer covers the portrait, name, or GOOD WORK call-to-action.
- Kept the badge and caption side-by-side without overlap at narrow phone widths.
- Desktop layout and all existing content remain unchanged.
