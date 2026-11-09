# Tanjet Hawlader — Personal Portfolio

Responsive personal portfolio built with HTML, CSS and vanilla JavaScript.

## Update the existing GitHub repository
Extract this ZIP and upload all files directly to the repository root, replacing files with matching names. Include `profile-photo.webp`. Do not upload the ZIP itself. Commit to `main`; Vercel can redeploy automatically when its GitHub integration is connected.

## V6 interaction update
- Removed the electric Canvas, touch spark trail and touch glow completely.
- Removed scroll-linked portrait movement and repeated scroll timers.
- Removed JavaScript-generated click ripple elements.
- Replaced them with opacity-only section reveals, a thin top progress line, and simple CSS tap/active feedback.
- Disabled continuous portrait floating and header backdrop blur on mobile to reduce rendering work.
- Kept the responsive layout, portrait, navigation, theme toggle, CV and contact form.

## Contact form
The form opens the visitor's configured email application with a prepared message. It does not send or store messages on a server. Direct website submissions require a backend or form service.
