import Link from "next/link";
import { Code } from "@/components/code";

export const metadata = {
  title: "Quick Start | json-render",
};

export default function QuickStartPage() {
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">Quick Start</h1>
      <p className="text-muted-foreground mb-8">
        Get up and running with json-render in 5 minutes.
      </p>

      <h2 className="text-xl font-semibold mt-12 mb-4">
        1. Define your catalog
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Create a catalog that defines what components AI can use:
      </p>
      <Code lang="typescript">{`// lib/catalog.ts
import { createCatalog } from '@json-render/core';
import { z } from 'zod';

export const catalog = createCatalog({
  components: {
    Card: {
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
      }),
      hasChildren: true,
    },
    Button: {
      props: z.object({
        label: z.string(),
        action: z.string(),
      }),
    },
    Text: {
      props: z.object({
        content: z.string(),
      }),
    },
  },
  actions: {
    submit: {
      params: z.object({ formId: z.string() }),
    },
    navigate: {
      params: z.object({ url: z.string() }),
    },
  },
});`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">
        2. Create your components
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Register SolidJS components that render each catalog type:
      </p>
      <Code lang="tsx">{`// components/registry.tsx
import { Show } from 'solid-js';

export const registry = {
  Card: (props) => (
    <div class="p-4 border rounded-lg">
      <h2 class="font-bold">{props.element.props.title}</h2>
      <Show when={props.element.props.description}>
        <p class="text-gray-600">{props.element.props.description}</p>
      </Show>
      {props.children}
    </div>
  ),
  Button: (props) => (
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded"
      onClick={() => props.onAction?.(props.element.props.action)}
    >
      {props.element.props.label}
    </button>
  ),
  Text: (props) => (
    <p>{props.element.props.content}</p>
  ),
};`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">
        3. Create an API route
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Set up a streaming API route for AI generation:
      </p>
      <Code lang="typescript">{`// api/generate.ts
import { streamText } from 'ai';
import { generateCatalogPrompt } from '@json-render/core';
import { catalog } from '../lib/catalog';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const systemPrompt = generateCatalogPrompt(catalog);

  const result = streamText({
    model: 'anthropic/claude-opus-4.5',
    system: systemPrompt,
    prompt,
  });

  return new Response(result.textStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">4. Render the UI</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Use the providers and renderer to display AI-generated UI:
      </p>
      <Code lang="tsx">{`// App.tsx
import { Show } from 'solid-js';
import { DataProvider, ActionProvider, VisibilityProvider, Renderer, createUIStream } from '@json-render/solidjs';
import { registry } from './components/registry';

export default function App() {
  const { tree, isStreaming, send } = createUIStream({
    api: '/api/generate',
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    send(formData.get('prompt') as string);
  };

  return (
    <DataProvider initialData={{}}>
      <VisibilityProvider>
        <ActionProvider handlers={{
          submit: (params) => console.log('Submit:', params),
          navigate: (params) => console.log('Navigate:', params),
        }}>
          <form onSubmit={handleSubmit}>
            <input
              name="prompt"
              placeholder="Describe what you want..."
              class="border p-2 rounded"
            />
            <button type="submit" disabled={isStreaming()}>
              Generate
            </button>
          </form>

          <div class="mt-8">
            <Show when={tree()}>
              <Renderer tree={tree()!} registry={registry} />
            </Show>
          </div>
        </ActionProvider>
      </VisibilityProvider>
    </DataProvider>
  );
}`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">Next steps</h2>
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
        <li>
          Learn about{" "}
          <Link
            href="/docs/catalog"
            className="text-foreground hover:underline"
          >
            catalogs
          </Link>{" "}
          in depth
        </li>
        <li>
          Explore{" "}
          <Link
            href="/docs/data-binding"
            className="text-foreground hover:underline"
          >
            data binding
          </Link>{" "}
          for dynamic values
        </li>
        <li>
          Add{" "}
          <Link
            href="/docs/actions"
            className="text-foreground hover:underline"
          >
            actions
          </Link>{" "}
          for interactivity
        </li>
        <li>
          Implement{" "}
          <Link
            href="/docs/visibility"
            className="text-foreground hover:underline"
          >
            conditional visibility
          </Link>
        </li>
      </ul>
    </article>
  );
}
