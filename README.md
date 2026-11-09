# Tanjet Hawlader — Personal Portfolio

Responsive personal portfolio built with HTML, CSS and vanilla JavaScript.

## V7 touch interaction update
- Electric Canvas, lightning trails, sparks and particle effects are removed.
- Added one soft lime/blue halo that follows a finger during touch scrolling.
- A subtle circular pulse appears on touch; the halo fades after contact ends.
- The touch follower uses passive touch listeners and one requestAnimationFrame update at a time.
- No touchmove preventDefault, canvas rendering, particle arrays or repeated scroll timers.
- The mobile portrait does not move with scroll; native scrolling remains in control.
- Section reveals, the thin top progress line, responsive layout, portrait, navigation, theme toggle, CV and contact form are retained.

## Update the existing GitHub repository
Extract this ZIP and upload all files directly to the repository root, replacing files with matching names. Include `profile-photo.webp`. Do not upload the ZIP itself. Commit to `main`; Vercel can redeploy automatically when its GitHub integration is connected.

## Contact form
The form opens the visitor's configured email application with a prepared message. It does not send or store messages on a server. Direct website submissions require a backend or form service.
