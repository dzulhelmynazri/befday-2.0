---
name: eve
description: "Framework guidance for building, running, and debugging durable AI agents and agent-powered applications with the Eve framework (vercel/eve)."
license: Apache-2.0
metadata:
  author: vercel
  version: "0.1.0"
---

# Eve Framework Guidance

Guidance for creating, editing, testing, and debugging durable backend AI agents using the **Eve** (`vercel/eve`) framework.

## When to Use

- Building or modifying AI agents using the Eve framework
- Configuring `agent/agent.ts`, `agent/instructions.md`, or agent directories
- Implementing tools in `agent/tools/` using TypeScript and Zod
- Setting up channels (HTTP, Slack, Discord) in `agent/channels/`
- Connecting external services or MCP servers in `agent/connections/`
- Defining scheduled tasks (`agent/schedules/`) or subagents (`agent/subagents/`)
- Debugging agent execution, sessions, sandboxes, or evals

---

## What is Eve?

Eve is an open-source, filesystem-first framework created by Vercel for building durable, production-grade AI agents. It treats an agent as a directory structure on disk:

- **Markdown** (`.md`) files define human-readable specifications, instructions, and prompt procedures.
- **TypeScript** (`.ts`) files define typed executable tools, configurations, channels, and runtime hooks.
- **Sessions & Sandboxes** provide durable, isolated execution environments with persistent state.

---

## Project Structure & Architecture

A standard Eve project adheres to this filesystem convention:

```text
my-agent/
├── package.json
├── tsconfig.json
└── agent/
    ├── agent.ts          # Agent runtime configuration (model, reasoning, compaction)
    ├── instructions.md   # Primary system prompt & permanent operational rules
    ├── tools/            # Executable tools exposed to the agent (filename = tool name)
    │   ├── search.ts
    │   └── fetch-data.ts
    ├── skills/           # Modular, on-demand procedures (SKILL.md files)
    ├── hooks/            # Lifecycle event listeners and stream subscribers
    ├── channels/         # Ingress & delivery channels (Slack, Discord, webhooks)
    ├── connections/      # External integrations (MCP servers, OpenAPI, DBs)
    ├── sandbox/          # Custom sandbox configurations & execution container settings
    ├── workspace/        # Seed files mounted into the session sandbox
    ├── subagents/        # Specialized delegate agents
    └── schedules/        # Scheduled cron jobs and recurring tasks
```

---

## Core Components

### 1. Agent Configuration (`agent/agent.ts`)

Defines runtime options like model provider, reasoning effort, and compaction strategies:

```typescript
import { defineAgent } from 'eve';

export default defineAgent({
  name: 'my-agent',
  model: 'openai/gpt-4o',
  reasoning: 'medium', // 'low' | 'medium' | 'high'
  compaction: {
    maxTokens: 32000,
  },
});
```

### 2. Instructions (`agent/instructions.md`)

The primary instruction document that serves as the agent's core identity, goals, and behavioral constraints:

```markdown
# Agent Instructions

You are an automated research assistant responsible for collecting, summarizing, and reporting domain insights.

## Operating Rules
1. Always verify external links before including them in summaries.
2. Use the provided tools rather than fabricating data.
3. Keep responses structured and concise.
```

### 3. Tools (`agent/tools/<tool-name>.ts`)

Every TypeScript file in `agent/tools/` defines a single tool. The file basename matches the tool name. Use Zod schemas to validate input arguments:

```typescript
import { defineTool } from 'eve/tools';
import { z } from 'zod';

export default defineTool({
  description: 'Search documentation and external resources by query string',
  inputSchema: z.object({
    query: z.string().describe('The search query keyword or sentence'),
    limit: z.number().int().positive().optional().default(5),
  }),
  async execute({ query, limit }) {
    // Implement tool business logic
    return {
      query,
      results: [],
    };
  },
});
```

### 4. Channels (`agent/channels/<channel-name>.ts`)

Channels handle message transport to and from users:

```typescript
import { defineChannel } from 'eve/channels';

export default defineChannel({
  transport: 'http',
  async onMessage(message, { session }) {
    const response = await session.send(message);
    return response;
  },
});
```

### 5. Connections (`agent/connections/<service>.ts`)

Configure external protocols such as Model Context Protocol (MCP) servers:

```typescript
import { defineConnection } from 'eve/connections';

export default defineConnection({
  type: 'mcp',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-postgres', process.env.DATABASE_URL!],
});
```

### 6. Schedules (`agent/schedules/<schedule-name>.ts`)

Define scheduled tasks that trigger agent workflows autonomously:

```typescript
import { defineSchedule } from 'eve/schedules';

export default defineSchedule({
  cron: '0 9 * * 1-5', // Every weekday at 9:00 AM
  prompt: 'Generate daily report and notify the team channel',
});
```

---

## Local Development & CLI Commands

```bash
# Initialize a new agent project
npx eve@latest init <project-name>

# Start local dev server & interactive chat harness
npx eve dev

# Run evaluations / test suites
npx eve eval

# Deploy agent to production (Vercel)
npx eve deploy
```

---

## Best Practices

1. **Keep Tools Focused:** Each tool should have one single responsibility, explicit Zod validation, and descriptive parameter docs.
2. **Handle Errors Gracefully:** In tool execution, return informative error payloads instead of unhandled promise rejections so the model can recover.
3. **Persist State Safely:** Store session state in the sandbox or durable persistence layer rather than relying on ephemeral memory.
4. **Local Documentation Source of Truth:** Refer to `node_modules/eve/docs/` whenever you need internal API details or framework reference docs.

