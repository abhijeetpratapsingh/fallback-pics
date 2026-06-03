# Tasks: Publish llms.txt

**Input**: Design documents from `/specs/004-publish-llms-txt/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/http-validation.md, quickstart.md

**Tests**: Include scriptable checks for public behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

- [X] T001 Read source story `specs/04-publish-llms-txt.md` and convert it into Spec Kit artifacts in `specs/004-publish-llms-txt/`
- [X] T002 Record clarify defaults in `specs/004-publish-llms-txt/spec.md` and `specs/004-publish-llms-txt/research.md`

## Phase 2: Foundational

- [X] T003 Define affected public URLs and expected behavior in `specs/004-publish-llms-txt/contracts/http-validation.md`
- [X] T004 Define validation commands in `specs/004-publish-llms-txt/quickstart.md`

## Phase 3: User Story 1 - Publish llms.txt (Priority: P1)

**Goal**: As an AI search or assistant crawler, I want a concise llms.txt file so that I can understand fallback.pics, its API, docs, and key guides without parsing unrelated homepage HTML.

**Independent Test**: Fetch `/llms.txt`; verify text/plain static content includes product summary, primary links, target topics, and API route strategy.

### Implementation for User Story 1

- [X] T010 [US1] Create apps/web/public/llms.txt
- [X] T011 [US1] Use canonical final URLs in llms.txt
- [X] T012 [US1] Check robots policy compatibility
- [X] T013 [US1] Validate built output is plain text, not HTML

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T099 Run relevant web build, Worker typecheck, Worker tests, or source checks for this story scope
- [X] T100 Review generated artifacts to ensure no scheduling projections are included

## Dependencies & Execution Order

- Setup precedes foundational validation.
- Foundational public URL contract precedes implementation.
- User Story 1 is independently testable after the listed implementation tasks.

## Parallel Opportunities

- Source content updates and validation-contract drafting can run in parallel when they touch different files.
- Final source checks can run after all implementation tasks are complete.

## Implementation Strategy

Deliver the P1 story completely, validate the changed public behavior, and keep changes scoped to the story's affected files.
