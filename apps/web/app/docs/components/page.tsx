import Link from "next/link";
import { Code } from "@/components/code";

export const metadata = {
  title: "Components | json-render",
};

export default function ComponentsPage() {
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">Components</h1>
      <p className="text-muted-foreground mb-8">
        Register SolidJS components to render your catalog types.
      </p>

      <h2 className="text-xl font-semibold mt-12 mb-4">Component Registry</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Create a registry that maps catalog component types to SolidJS
        components:
      </p>
      <Code lang="tsx">{`import { Show } from 'solid-js';

const registry = {
  Card: (props) => (
    <div class="card">
      <h2>{props.element.props.title}</h2>
      <Show when={props.element.props.description}>
        <p>{props.element.props.description}</p>
      </Show>
      {props.children}
    </div>
  ),

  Button: (props) => (
    <button onClick={() => props.onAction?.(props.element.props.action)}>
      {props.element.props.label}
    </button>
  ),
};`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">Component Props</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Each component receives these props:
      </p>
      <Code lang="typescript">{`interface BaseComponentProps {
  element: {
    key: string;
    type: string;
    props: Record<string, unknown>;
    children?: string[];
    visible?: VisibilityCondition;
  };
  children?: JSX.Element;      // Rendered children
  onAction?: (action: Action) => void;
  loading?: boolean;
}`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">Using Data Binding</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Use hooks to read and write data. Remember that SolidJS hooks return
        signal accessors:
      </p>
      <Code lang="tsx">{`import { useDataValue, useDataBinding } from '@json-render/solidjs';

const Metric = (props) => {
  // Read-only value - call value() to access
  const value = useDataValue(props.element.props.valuePath);

  return (
    <div class="metric">
      <span class="label">{props.element.props.label}</span>
      <span class="value">{formatValue(value())}</span>
    </div>
  );
};

const TextField = (props) => {
  // Two-way binding
  const [value, setValue] = useDataBinding(props.element.props.valuePath);

  return (
    <input
      value={value() ?? ''}
      onInput={(e) => setValue(e.currentTarget.value)}
      placeholder={props.element.props.placeholder}
    />
  );
};`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">Using the Renderer</h2>
      <Code lang="tsx">{`import { Show } from 'solid-js';
import { Renderer } from '@json-render/solidjs';

function App() {
  return (
    <Show when={uiTree()}>
      <Renderer tree={uiTree()!} registry={registry} />
    </Show>
  );
}`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">Next</h2>
      <p className="text-sm text-muted-foreground">
        Learn about{" "}
        <Link
          href="/docs/data-binding"
          className="text-foreground hover:underline"
        >
          data binding
        </Link>{" "}
        for dynamic values.
      </p>
    </article>
  );
}
