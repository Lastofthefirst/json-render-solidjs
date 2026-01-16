# json-render

**Predictable. Guardrailed. Fast.**

Let end users generate dashboards, widgets, apps, and data visualizations from prompts — safely constrained to components you define.

```bash
pnpm add @json-render/core @json-render/solidjs
```

## Why json-render?

When users prompt for UI, you need guarantees. json-render gives AI a **constrained vocabulary** so output is always predictable:

- **Guardrailed** — AI can only use components in your catalog
- **Predictable** — JSON output matches your schema, every time
- **Fast** — Stream and render progressively as the model responds

## Quick Start

### 1. Define Your Catalog (what AI can use)

```typescript
import { createCatalog } from '@json-render/core';
import { z } from 'zod';

const catalog = createCatalog({
  components: {
    Card: {
      props: z.object({ title: z.string() }),
      hasChildren: true,
    },
    Metric: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),      // Binds to your data
        format: z.enum(['currency', 'percent', 'number']),
      }),
    },
    Button: {
      props: z.object({
        label: z.string(),
        action: ActionSchema,        // AI declares intent, you handle it
      }),
    },
  },
  actions: {
    export_report: { description: 'Export dashboard to PDF' },
    refresh_data: { description: 'Refresh all metrics' },
  },
});
```

### 2. Register Your Components (how they render)

```tsx
import { useDataValue } from '@json-render/solidjs';

const registry = {
  Card: (props) => (
    <div class="card">
      <h3>{props.element.props.title}</h3>
      {props.children}
    </div>
  ),
  Metric: (props) => {
    const value = useDataValue(props.element.props.valuePath);
    return <div class="metric">{format(value())}</div>;
  },
  Button: (props) => (
    <button onClick={() => props.onAction(props.element.props.action)}>
      {props.element.props.label}
    </button>
  ),
};
```

### 3. Let AI Generate

```tsx
import { DataProvider, ActionProvider, Renderer, createUIStream } from '@json-render/solidjs';

function Dashboard() {
  const { tree, send } = createUIStream({ api: '/api/generate' });

  return (
    <DataProvider initialData={{ revenue: 125000, growth: 0.15 }}>
      <ActionProvider handlers={{
        export_report: () => downloadPDF(),
        refresh_data: () => refetch(),
      }}>
        <input
          placeholder="Create a revenue dashboard..."
          onKeyDown={(e) => e.key === 'Enter' && send(e.currentTarget.value)}
        />
        <Renderer tree={tree()} registry={registry} />
      </ActionProvider>
    </DataProvider>
  );
}
```

**That's it.** AI generates JSON, you render it safely.

---

## Features

### Conditional Visibility

Show/hide components based on data, auth, or complex logic:

```json
{
  "type": "Alert",
  "props": { "message": "Error occurred" },
  "visible": {
    "and": [
      { "path": "/form/hasError" },
      { "not": { "path": "/form/errorDismissed" } }
    ]
  }
}
```

```json
{
  "type": "AdminPanel",
  "visible": { "auth": "signedIn" }
}
```

### Rich Actions

Actions with confirmation dialogs and callbacks:

```json
{
  "type": "Button",
  "props": {
    "label": "Refund Payment",
    "action": {
      "name": "refund",
      "params": {
        "paymentId": { "path": "/selected/id" },
        "amount": { "path": "/refund/amount" }
      },
      "confirm": {
        "title": "Confirm Refund",
        "message": "Refund ${/refund/amount} to customer?",
        "variant": "danger"
      },
      "onSuccess": { "set": { "/ui/success": true } },
      "onError": { "set": { "/ui/error": "$error.message" } }
    }
  }
}
```

### Built-in Validation

```json
{
  "type": "TextField",
  "props": {
    "label": "Email",
    "valuePath": "/form/email",
    "checks": [
      { "fn": "required", "message": "Email is required" },
      { "fn": "email", "message": "Invalid email" }
    ],
    "validateOn": "blur"
  }
}
```

---

## Packages

| Package | Description |
|---------|-------------|
| `@json-render/core` | Types, schemas, visibility, actions, validation |
| `@json-render/solidjs` | SolidJS renderer, providers, hooks |

## Try It In This Repo

```bash
# Clone and install
git clone https://github.com/vercel-labs/json-render
cd json-render
pnpm install

# Run development servers
pnpm dev
```

- http://localhost:3000 — Docs & Playground
- http://localhost:3001 — Example Dashboard

### Run Tests

```bash
pnpm test
```

### Type Check

```bash
pnpm check-types
```

### Build All Packages

```bash
pnpm build
```

## Project Structure

```
json-render/
├── packages/
│   ├── core/        → @json-render/core
│   └── solidjs/     → @json-render/solidjs
├── apps/
│   └── web/         → Docs & Playground site
└── examples/
    └── dashboard/   → Example dashboard app
```

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ User Prompt │────▶│  AI + Catalog│────▶│  JSON Tree  │
│ "dashboard" │     │ (guardrailed)│     │(predictable)│
└─────────────┘     └──────────────┘     └─────────────┘
                                               │
                    ┌──────────────┐            │
                    │ Your SolidJS │◀───────────┘
                    │  Components  │ (streamed)
                    └──────────────┘
```

1. **Define the guardrails** — what components, actions, and data bindings AI can use
2. **Users prompt** — end users describe what they want in natural language
3. **AI generates JSON** — output is always predictable, constrained to your catalog
4. **Render fast** — stream and render progressively as the model responds

## License

Apache-2.0
