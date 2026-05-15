---
name: learning-journal
description: Automatically documents student learning progress, code snippets, and architectural decisions into Obsidian-friendly markdown files.
---

# 📝 Learning Journal Skill

## Overview
This skill should be used to capture "What I Learned Today" (WILT) entries. It transforms technical sessions into professional documentation for a student's portfolio or study notes.

## Trigger Phrases
- "journal this session"
- "save to my learning log"
- "document what I learned"
- "create an obsidian note for this task"

## Workflow: /journal
When triggered, follow this process:
1. **Analyze**: Review the current session's key takeaways (concepts, challenges, solutions).
2. **Format**: Use the standard Obsidian template (YAML frontmatter + Markdown).
3. **Save**: Write the file to `d:\eeeee\journal\YYYY-MM-DD-task-name.md`.

## Metadata Schema
Entries MUST include:
- `date`: Current ISO date
- `tags`: #frontend #student #[topic]
- `concepts`: List of key technical terms learned
- `code_snippet`: The most important piece of code from the session

## Use when: 
- Finishing a project milestone.
- Solving a difficult CSS/JS bug.
- Learning a new tool (like PRPM or Pilot Shell).
