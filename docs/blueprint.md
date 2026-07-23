# Professional Telegram Assistant — Bot specification

**Archetype:** custom

**Voice:** professional and formal — write every user-facing message, button label, error, and empty state in this voice.

A formal 1:1 Telegram chat assistant that maintains conversation history (up to 50 messages) and provides saved snippet management. Responds only to user-initiated messages with professional tone, supporting contextual replies, note-saving, and history controls.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- individual Telegram users

## Success criteria

- User receives contextual replies using last 50 messages
- Saved snippets persist and retrieve correctly
- History management commands function without data loss

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open welcome message and basic usage instructions
- **/clear_history** (command, actor: user, command: /clear_history) — Reset conversation history for current thread
- **/export_history** (command, actor: user, command: /export_history) — Receive full conversation history as formatted text
- **/save** (command, actor: user, command: /save) — Save a named text snippet (usage: /save <name> <text>)
- **/get** (command, actor: user, command: /get) — Retrieve a saved snippet by name (usage: /get <name>)
- **/list_saves** (command, actor: user, command: /list_saves) — List all saved snippet names

## Flows

### Conversation history management
_Trigger:_ /clear_history

1. Confirm history deletion
2. Reset history store

_Data touched:_ conversation_threads

### Snippet management
_Trigger:_ /save

1. Parse name and content
2. Store in user's snippet collection

_Data touched:_ saved_snippets

### Contextual reply
_Trigger:_ User message

1. Retrieve last 50 messages
2. Generate formal response using context

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **user_profile** _(retention: persistent)_ — Telegram user identifier and display name
  - fields: telegram_id, display_name
- **conversation_threads** _(retention: persistent)_ — Chronological message history per user
  - fields: timestamp, message_text, is_user
- **saved_snippets** _(retention: persistent)_ — User-created notes with name and content
  - fields: snippet_name, content, creation_time

## Integrations

- **Telegram** (required) — Bot API messaging
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- /clear_history
- /export_history
- /save
- /get
- /list_saves

## Notifications

- All responses appear in user's 1:1 chat

## Permissions & privacy

- Only user-initiated messages processed
- No third-party data sharing

## Edge cases

- History export when no messages exist
- Snippet name collisions
- Messages exceeding context window size

## Required tests

- Verify /clear_history resets context without affecting snippets
- Test snippet storage limits (100 items)
- Validate message history truncation to 50 items

## Assumptions

- History truncation to 50 most recent messages maintains context without performance issues
- 100-snippet limit meets personal use requirements
