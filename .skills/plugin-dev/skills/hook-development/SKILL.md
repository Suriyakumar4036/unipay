---
name: hook-development
description: Advanced hooks API and event-driven automation for Claude Code plugins.
---

# Hook Development

## Overview
This skill covers prompt-based hooks and command hooks for deterministic validation.

## Events
- PreToolUse
- PostToolUse
- Stop
- SessionStart
- etc.

## Best Practices
- Use LLM decision-making for prompt-based hooks.
- Use command hooks for security validation.
- Always use ${CLAUDE_PLUGIN_ROOT} for paths.
