# Spec Kit Setup

This repository is initialized with GitHub Spec Kit.

## Installed Version

- `specify-cli`: 0.9.2
- Integration: Codex CLI
- Script type: Bash
- Branch numbering: sequential

## Generated Locations

- `.specify/` contains Spec Kit templates, workflows, scripts, extensions, and project memory.
- `.agents/skills/` contains Codex skills for Spec Kit commands.
- `.specify/memory/constitution.md` is the project constitution template and should be completed before new feature specs are generated.
- `specs/` is the default feature spec directory.

## Codex Skill Commands

Use these skill names in Codex:

- `$speckit-constitution`
- `$speckit-specify`
- `$speckit-plan`
- `$speckit-tasks`
- `$speckit-implement`
- `$speckit-clarify`
- `$speckit-analyze`
- `$speckit-checklist`

Git extension skills are also installed:

- `$speckit-git-feature`
- `$speckit-git-validate`
- `$speckit-git-commit`
- `$speckit-git-remote`

## Notes For This Repo

- Existing markdown files under `specs/` are implementation story specs created before Spec Kit was installed.
- New Spec Kit features should be created as numbered directories under `specs/`, for example `specs/001-fix-soft-404/spec.md`.
- Do not manually edit generated templates unless the change is intended to affect future Spec Kit output.

## Useful Checks

```bash
specify version
specify integration list
specify check
```

