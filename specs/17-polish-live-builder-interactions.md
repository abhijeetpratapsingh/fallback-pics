# Spec Kit Command Sequence: Polish Live Builder Interactions

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/017-polish-live-builder-interactions
GIT_BRANCH_NAME=017-polish-live-builder-interactions

Create a Spec Kit feature for polishing the fallback.pics live builder controls and interaction feedback.

Problem: The homepage live builder is useful and visually clear on desktop, but the controls are dense and text-heavy. Presets, copy actions, and generated URL feedback can feel more like a form than a polished developer tool.

User value: Developers should be able to adjust a placeholder, understand the selected preset, and copy the generated URL with immediate confidence.

Functional requirements:
- Preset controls should use clearer visual states and compact affordances, including icons where appropriate.
- Copy URL and code-copy actions must provide visible success feedback.
- Numeric and color inputs must remain readable and easy to use on desktop and mobile.
- Generated preview must remain prominent without crowding controls.
- Builder layout must not shift when values change.
- Interaction states must be keyboard-accessible.

Visual review evidence:
- Playwright viewport: 1440x1000 and 390x844 on `/`.
- Desktop builder is functional but dense.
- Mobile builder appears after the first fold and will need to remain usable after homepage layout refinements.

Out of scope:
- Changing image generation logic.
- Adding authentication or saved presets.
- Adding paid features.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if expected copy-feedback behavior, preset icon set, or mobile builder density is ambiguous.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan live builder UI polish for preset controls, copy feedback, input grouping, preview prominence, and accessible interaction states.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for builder usability, visual states, copy feedback, keyboard access, layout stability, and responsive behavior.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for control styling, feedback states, icon usage, layout stability checks, and Playwright interaction validation.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze builder artifacts for missing feedback states, inaccessible controls, visual density regressions, and incomplete interaction validation.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after expected interaction states and validation flows are explicit.
```

## Source Story

## Description

The live builder should feel like the core product surface. Improve controls, states, and feedback so users can confidently generate and copy fallback image URLs.

## User Story

As a developer testing fallback image options, I want the builder controls and copy feedback to be clear so that I can quickly create a URL and trust that it copied correctly.

## Acceptance Criteria

- Selected preset state is visually unmistakable.
- Copy actions show success feedback without layout shift.
- Inputs remain readable and touch-friendly on mobile.
- Preview image remains stable while values change.
- Keyboard users can tab through controls and activate copy actions.
- Playwright interaction test confirms changing a preset or value updates the generated URL/preview.

## Technical Details

- Likely file: `apps/web/src/components/EnterpriseLanding.tsx`.
- Use existing styling conventions and avoid unrelated component rewrites.
- If icons are available in the project, use them for presets/copy affordances; otherwise keep text labels but improve state styling.
- Avoid font-size scaling based on viewport width.
- Keep controls within stable dimensions to prevent layout shift.

## Validation

- Use Playwright to interact with preset buttons, width/height inputs, text input, and copy button.
- Capture screenshots at desktop and mobile.
- Confirm no console warnings/errors.
- Confirm no horizontal overflow.

## Out of Scope

- API logic changes.
- Persisted user presets.
- Analytics changes.
