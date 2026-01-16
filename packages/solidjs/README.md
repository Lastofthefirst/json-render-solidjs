# @json-render/solidjs

**Predictable. Guardrailed. Fast.** SolidJS renderer for user-prompted dashboards, widgets, apps, and data visualizations.

## Features

- **Fine-grained Reactivity**: Leverages SolidJS signals for efficient updates
- **Visibility Filtering**: Components automatically show/hide based on visibility conditions
- **Action Handling**: Built-in action execution with confirmation dialogs
- **Validation**: Field validation with error display
- **Data Binding**: Reactive data binding between UI and data model
- **Streaming**: Progressive rendering from streamed UI trees

## Installation

```bash
pnpm add @json-render/solidjs @json-render/core solid-js
```

## Quick Start

### Basic Setup

```tsx
import { JSONUIProvider, Renderer, createUIStream } from '@json-render/solidjs';

// Define your component registry
const registry = {
  Card: (props) => (
    <div class="card">
      <h3>{props.element.props.title}</h3>
      {props.children}
    </div>
  ),
  Button: (props) => (
    <button onClick={() => props.onAction?.(props.element.props.action)}>
      {props.element.props.label}
    </button>
  ),
};

// Action handlers
const actionHandlers = {
  submit: async (params) => {
    await api.submit(params);
  },
  export: (params) => {
    download(params.format);
  },
};

function App() {
  const { tree, isStreaming, send, clear } = createUIStream({
    api: '/api/generate',
  });

  return (
    <JSONUIProvider
      registry={registry}
      initialData={{ user: { name: 'John' } }}
      authState={{ isSignedIn: true }}
      actionHandlers={actionHandlers}
    >
      <input
        placeholder="Describe the UI..."
        onKeyDown={(e) => e.key === 'Enter' && send(e.currentTarget.value)}
      />
      <Renderer tree={tree()} registry={registry} loading={isStreaming()} />
    </JSONUIProvider>
  );
}
```

### Using Contexts Directly

```tsx
import {
  DataProvider,
  VisibilityProvider,
  ActionProvider,
  ValidationProvider,
  useData,
  useIsVisible,
  useActions,
  useFieldValidation,
} from '@json-render/solidjs';

// Data context
function MyComponent() {
  const { data, get, set } = useData();
  const value = () => get('/user/name');

  return (
    <input
      value={value() ?? ''}
      onInput={(e) => set('/user/name', e.currentTarget.value)}
    />
  );
}

// Visibility context
function ConditionalComponent(props) {
  const isVisible = useIsVisible(() => props.visible);

  return (
    <Show when={isVisible()}>
      <div>Visible content</div>
    </Show>
  );
}

// Action context
function ActionButton(props) {
  const { execute } = useActions();

  return (
    <button onClick={() => execute(props.action)}>
      {props.action.name}
    </button>
  );
}

// Validation context
function ValidatedInput(props) {
  const { errors, validate, touch } = useFieldValidation(props.path, { checks: props.checks });
  const { get, set } = useData();

  return (
    <div>
      <input
        value={get(props.path) ?? ''}
        onInput={(e) => set(props.path, e.currentTarget.value)}
        onBlur={() => { touch(); validate(); }}
      />
      <For each={errors()}>
        {(err) => <span>{err}</span>}
      </For>
    </div>
  );
}
```

### Streaming UI

```tsx
import { createUIStream, Renderer } from '@json-render/solidjs';
import { Show } from 'solid-js';

function StreamingDemo() {
  const {
    tree,        // Accessor for current UI tree
    isStreaming, // Accessor for streaming state
    error,       // Accessor for error
    send,        // Send a prompt
    clear,       // Clear the tree
  } = createUIStream({
    api: '/api/generate',
    onComplete: (tree) => console.log('Done:', tree),
    onError: (err) => console.error('Error:', err),
  });

  return (
    <div>
      <button onClick={() => send('Create a dashboard')}>
        Generate
      </button>
      <Show when={isStreaming()}>
        <span>Generating...</span>
      </Show>
      <Show when={tree()}>
        <Renderer tree={tree()!} registry={registry} />
      </Show>
    </div>
  );
}
```

## API Reference

### Providers

- `JSONUIProvider` - Combined provider for all contexts
- `DataProvider` - Data model context
- `VisibilityProvider` - Visibility evaluation context
- `ActionProvider` - Action execution context
- `ValidationProvider` - Validation context

### Hooks

- `useData()` - Access data model
- `useDataValue(path)` - Get a single reactive value
- `useDataBinding(path)` - Two-way binding returning [getter, setter]
- `useIsVisible(condition)` - Check if condition is visible
- `useActions()` - Access action execution
- `useFieldValidation(path, config)` - Field-level validation

### Components

- `Renderer` - Render a UI tree

### Utilities

- `createUIStream(options)` - Create reactive stream for UI generation
- `flatToTree(elements)` - Convert flat list to tree

## Component Props

Components in your registry receive these props:

```typescript
interface BaseComponentProps {
  element: UIElement;           // The element definition
  children?: JSX.Element;       // Rendered children
  onAction?: (action: Action) => void;  // Action callback
  loading?: boolean;            // Streaming in progress
}
```

## Example Component

```tsx
import { useDataValue } from '@json-render/solidjs';

function MetricComponent(props) {
  const { label, valuePath, format } = props.element.props;
  const value = useDataValue(valuePath);

  const formatted = () => {
    const v = value();
    return format === 'currency'
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
      : String(v);
  };

  return (
    <div class="metric">
      <span class="label">{label}</span>
      <span class="value">{formatted()}</span>
    </div>
  );
}
```

## SolidJS-Specific Notes

### Signals and Accessors

In SolidJS, reactive values are accessed via function calls (accessors). When using hooks like `createUIStream`, the returned values are signals:

```tsx
const { tree, isStreaming } = createUIStream({ api: '/api/generate' });

// Access values by calling them
<Show when={tree()}>
  <Renderer tree={tree()!} registry={registry} loading={isStreaming()} />
</Show>
```

### Control Flow Components

Use SolidJS control flow components (`Show`, `For`, `Switch/Match`) instead of JavaScript conditionals in JSX:

```tsx
import { Show, For } from 'solid-js';

// Good
<Show when={isVisible()}>
  <Content />
</Show>

// Avoid
{isVisible() && <Content />}
```

### Event Handlers

Use `e.currentTarget` instead of `e.target` for typed access to the element:

```tsx
<input onInput={(e) => setValue(e.currentTarget.value)} />
```
