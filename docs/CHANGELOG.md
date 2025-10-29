# Changelog

## Unreleased (phase-5)

- Implement camera left-drag to rotate player facing and right-drag skycam.
- Allow starting solo practice games (client and server changes).
- Gate client debug logs to dev-only mode.
- Extract GameManager scoring constants and improve scoring calculation.
- Make server profanity list configurable with `CHAT_PROFANITY` env var.
- Optimize chat buffer to avoid repeated array slicing.
- Add unit tests for profanity filter and GameManager scoring.
- Fix various markdownlint and test setup issues.
