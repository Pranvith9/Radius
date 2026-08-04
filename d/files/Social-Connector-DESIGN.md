---
version: "alpha"
name: "Nearby | Social Connector Design System"
description: "Design system for a location-aware social connector app. Built for warmth and trust — soft rounded surfaces, calm neutral base, a single confident accent for actions like Connect, Accept, and Call. Suitable for onboarding, discovery feed, profile, chat, and call screens."
colors:
  primary: "#FB923C"
  secondary: "#FDE68A"
  tertiary: "#BAE6FD"
  neutral: "#FFFFFF"
  background: "#FAFAF9"
  surface: "#FFFFFF"
  text-primary: "#1C1917"
  text-secondary: "#78716C"
  border: "#E7E5E4"
  accent: "#FB923C"
  success: "#22C55E"
  danger: "#EF4444"
  online: "#22C55E"
typography:
  display-lg:
    fontFamily: "Geist"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: "52px"
    letterSpacing: "-0.02em"
  heading-md:
    fontFamily: "Geist"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
  body-md:
    fontFamily: "Geist"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-sm:
    fontFamily: "Geist"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label-md:
    fontFamily: "Geist"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: "20px"
rounded:
  sm: "10px"
  md: "16px"
  lg: "24px"
  full: "9999px"
spacing:
  base: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  gap: "12px"
  card-padding: "16px"
  section-padding: "32px"
components:
  button-primary:
    backgroundColor: "#FB923C"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.text-primary}"
    border: "1px solid {colors.border}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  fab-call:
    backgroundColor: "{colors.success}"
    rounded: "{rounded.full}"
    size: "56px"
---

## Overview

- **Product feel:** Warm, human, trustworthy — this is a social app built around real people meeting nearby, so the visual language avoids anything cold, clinical, or "dating-app-neon." Rounded, soft, approachable.
- **Composition cues:**
  - Layout: Card-based stack (feed of nearby people, chat bubbles, profile cards)
  - Content Width: Contained, mobile-first (max 480px reference frame)
  - Framing: Soft, rounded, generous whitespace
  - Grid: Loose — single column on mobile, 2-column card grid on tablet/desktop discovery view

## Colors

Light mode, warm-neutral base with a single confident coral/orange accent (#FB923C) used consistently for the primary action across the whole app (Connect, Accept, Send).

- **Primary (#FB923C):** Connect requests, primary CTAs, active states, selected filters.
- **Secondary (#FDE68A):** Soft highlight for badges (e.g. "New", "Active now" backdrop).
- **Tertiary (#BAE6FD):** Supporting accent for informational chips (e.g. shared-interest tags).
- **Success (#22C55E):** Online indicator, accepted requests, active call button.
- **Danger (#EF4444):** Decline, block, report, end call.
- **Neutral (#FFFFFF) / Background (#FAFAF9):** Base app canvas — background is a hair warmer than pure white to feel less clinical.
- **Text Primary (#1C1917) / Text Secondary (#78716C):** Warm near-black and warm gray, never pure black/gray, to stay on-tone with the warm neutral palette.

- **Usage:** Background: #FAFAF9; Surface (cards): #FFFFFF; Text Primary: #1C1917; Text Secondary: #78716C; Border: #E7E5E4; Accent: #FB923C

- **Gradients:** bg-gradient-to-b from-orange-50 to-white (onboarding/hero), bg-gradient-to-br from-orange-400 to-amber-300 (profile verified badge / avatar ring for "active now")

## Typography

Geist across the app; weight does most of the hierarchy work rather than large size jumps, keeping the interface calm.

- **Display (`display-lg`):** Geist, 48px, weight 500, line-height 52px — onboarding headlines only.
- **Heading (`heading-md`):** Geist, 24px, weight 600, line-height 32px — screen titles ("Nearby", "Requests", "Chats").
- **Body (`body-md`):** Geist, 16px, weight 400, line-height 24px — profile bios, chat messages.
- **Body Small (`body-sm`):** Geist, 14px, weight 400, line-height 20px — timestamps, distance labels, metadata.
- **Labels (`label-md`):** Geist, 15px, weight 500, line-height 20px — button text, tab labels, chip text.

## Layout

Card-based, mobile-first, single primary column. Base rhythm is 4px, stepping up through 8/12/16/24 for real breathing room — this app needs more air than a dense dashboard since it's built around people, photos, and trust.

- **Layout type:** Card stack / feed
- **Content width:** Contained, 480px reference frame (mobile-first), 2-column card grid ≥768px
- **Base unit:** 4px
- **Scale:** 4px, 8px, 12px, 16px, 24px, 32px
- **Section padding:** 32px
- **Card padding:** 16px
- **Gaps:** 12px between cards, 8px within card internals

## Elevation & Depth

Depth stays soft and low-contrast — cards lift gently off the warm background rather than using hard shadows or heavy borders, reinforcing the "safe, calm" tone.

- **Surface style:** Softly elevated
- **Borders:** 1px #E7E5E4 on cards and inputs; 2px accent-colored ring on "active now" avatars
- **Shadows:** rgba(28, 25, 23, 0.04) 0px 1px 2px, rgba(28, 25, 23, 0.06) 0px 4px 12px -2px (card resting state); rgba(28, 25, 23, 0.10) 0px 8px 24px -4px (modal / call-incoming overlay)

### Techniques
- **Avatar presence ring:** Online/active-now users get a 2px solid success-green ring around their avatar with 2px offset from the photo. Verified users get a small badge (checkmark, 16px) anchored bottom-right of the avatar, on a white 2px border so it sits cleanly on any photo.
- **Distance pill:** Nearby-list cards show distance as a rounded pill (e.g. "0.8 km") using the tertiary color at 20% opacity as background, text-secondary as text — keeps it informational, not loud.
- **Interest chips:** Shared interests shown as small rounded chips (max 3 visible + "+N more") using the secondary color at low opacity — purely informational, never used as a filter gate.
- **Request card border-left accent:** Incoming connection requests get a 3px primary-colored left border on the card to draw the eye without needing a filled background.

## Shapes

Rounded, friendly geometry throughout — no sharp corners anywhere in the UI, reinforcing warmth and approachability.

- **Corner radii:** 10px (inputs, chips), 16px (cards), 24px (sheets/modals), 9999px (buttons, avatars, pills)
- **Icon treatment:** Linear, medium stroke weight
- **Icon sets:** Solar (or Lucide as fallback) — consistent stroke weight across nav, chat, and call icons

## Components

### Buttons
- **Primary (Connect / Accept / Send):** background #FB923C, text #FFFFFF, radius 9999px, padding 14px 24px, no border.
- **Secondary (Decline / Cancel):** background #FFFFFF, text #1C1917, radius 9999px, padding 14px 24px, border 1px #E7E5E4.
- **Destructive (Block / Report / End Call):** background #FEF2F2, text #EF4444, radius 9999px, padding 14px 24px.
- **Call FAB:** circular, 56px, background #22C55E (voice/video icon centered, white), used on accepted-chat screens.

### Cards
- **Nearby person card:** photo (top, 4:5 ratio, rounded 16px top corners), name + distance pill, shared-interest chips (max 3), Connect button bottom-right.
- **Request card:** avatar (left, 48px circular), name + intro message (body-sm), Accept (primary) / Decline (secondary) buttons stacked or inline right.
- **Chat bubble:** sender bubble background #FB923C at 100% with white text (own messages), receiver bubble background #FFFFFF with border (their messages), radius 16px with a 4px "tail" corner toward the sender side.

### Iconography
- **Treatment:** Linear, 1.5px stroke.
- **Sets:** Solar.

## Do's and Don'ts

### Do
- Do use the coral/orange accent as the single primary action color — one accent, used consistently, builds trust.
- Do keep every corner rounded; no sharp edges anywhere, including modals and sheets.
- Do use the success-green ring/badge system consistently for "active now" and "verified" — these are trust signals and must stay visually distinct from each other (ring = online, badge = verified).
- Do keep card shadows soft and low-opacity; this app should never feel "flashy."

### Don't
- Don't introduce a second bright accent color competing with the primary orange — secondary/tertiary colors are for quiet informational chips only, never for CTAs.
- Don't use hard drop shadows or sharp corner radii — breaks the warm, safe tone the whole system is built around.
- Don't show exact location, coordinates, or a non-fuzzed map pin anywhere in the UI, per product requirements — only distance pills and coarse/offset map markers.
- Don't exceed the detected minimal-to-moderate motion intensity (see Motion) with anything jarring — incoming call is the one moment allowed a stronger pulse animation.

## Motion

Motion is calm and interface-led for most of the app, with one deliberate exception: incoming call gets a stronger, attention-appropriate pulse since it's a real-time, time-sensitive moment.

**Motion Level:** minimal-to-moderate (moderate only for incoming-call state)

**Durations:** 200ms (standard UI transitions), 800ms pulse loop (incoming call ring animation)

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1)

**Hover Patterns:** color, subtle scale (1.02) on card hover (desktop/tablet only)

**Scroll Patterns:** standard momentum scroll for nearby feed; card-entry fade-up (200ms, staggered 40ms) as new nearby cards load in
