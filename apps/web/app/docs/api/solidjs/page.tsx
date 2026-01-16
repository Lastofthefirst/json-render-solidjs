import { Code } from "@/components/code";

export const metadata = {
  title: "@json-render/solidjs API | json-render",
};

export default function SolidjsApiPage() {
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">@json-render/solidjs</h1>
      <p className="text-muted-foreground mb-8">
        SolidJS components, providers, and reactive primitives.
      </p>

      <h2 className="text-xl font-semibold mt-12 mb-4">Providers</h2>

      <h3 className="text-lg font-semibold mt-8 mb-4">DataProvider</h3>
      <Code lang="tsx">{`<DataProvider initialData={object}>
  {props.children}
</DataProvider>`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">ActionProvider</h3>
      <Code lang="tsx">{`<ActionProvider handlers={Record<string, ActionHandler>}>
  {props.children}
</ActionProvider>

type ActionHandler = (params: Record<string, unknown>) => void | Promise<void>;`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">VisibilityProvider</h3>
      <Code lang="tsx">{`<VisibilityProvider auth={AuthState}>
  {props.children}
</VisibilityProvider>

interface AuthState {
  isSignedIn: boolean;
  roles?: string[];
}`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">ValidationProvider</h3>
      <Code lang="tsx">{`<ValidationProvider functions={Record<string, ValidatorFn>}>
  {props.children}
</ValidationProvider>

type ValidatorFn = (value: unknown, args?: object) => boolean | Promise<boolean>;`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">Components</h2>

      <h3 className="text-lg font-semibold mt-8 mb-4">Renderer</h3>
      <Code lang="tsx">{`<Renderer
  tree={UITree}
  registry={ComponentRegistry}
  loading={boolean}
/>

type ComponentRegistry = Record<string, Component<ComponentProps>>;

interface ComponentProps {
  element: UIElement;
  children?: JSX.Element;
  onAction: (name: string, params: object) => void;
  loading?: boolean;
}`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">Reactive Primitives</h2>
      <p className="text-sm text-muted-foreground mb-4">
        All hooks return SolidJS signals. Access values by calling them as
        functions.
      </p>

      <h3 className="text-lg font-semibold mt-8 mb-4">createUIStream</h3>
      <Code lang="typescript">{`const {
  tree,        // Accessor<UITree | null> - call tree() to get value
  isStreaming, // Accessor<boolean> - call isStreaming() to check
  error,       // Accessor<Error | null>
  send,        // (prompt: string) => void
  abort,       // () => void
} = createUIStream({
  api: string,
});

// Usage with SolidJS Show:
<Show when={tree()}>
  <Renderer tree={tree()!} registry={registry} loading={isStreaming()} />
</Show>`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">useData</h3>
      <Code lang="typescript">{`const {
  data,      // Accessor<Record<string, unknown>> - call data() to access
  setData,   // (data: object) => void
  getValue,  // (path: string) => unknown
  setValue,  // (path: string, value: unknown) => void
} = useData();`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">useDataValue</h3>
      <Code lang="typescript">{`const value = useDataValue(path: string);
// Returns Accessor<unknown> - call value() to get current value`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">useDataBinding</h3>
      <Code lang="typescript">{`const [value, setValue] = useDataBinding(path: string);
// value is Accessor<unknown> - call value() to read
// setValue updates both local and data store`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">useActions</h3>
      <Code lang="typescript">{`const { execute } = useActions();
// execute(actionName: string, params: object)`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">useAction</h3>
      <Code lang="typescript">{`const submitForm = useAction('submit_form');
// submitForm(params: object)`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">useIsVisible</h3>
      <Code lang="typescript">{`const isVisible = useIsVisible(() => condition);
// Returns Accessor<boolean> - call isVisible() to check
// Pass condition as accessor for reactivity`}</Code>

      <h3 className="text-lg font-semibold mt-8 mb-4">useFieldValidation</h3>
      <Code lang="typescript">{`const {
  errors,    // Accessor<string[]> - call errors() to get array
  validate,  // () => Promise<boolean>
  touch,     // () => void - mark field as touched
  isValid,   // Accessor<boolean>
} = useFieldValidation(path: string, { checks: ValidationCheck[] });`}</Code>

      <h2 className="text-xl font-semibold mt-12 mb-4">SolidJS Patterns</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Key differences from React:
      </p>
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
        <li>
          Use <code className="text-foreground">class</code> instead of{" "}
          <code className="text-foreground">className</code> in JSX
        </li>
        <li>
          Use <code className="text-foreground">onInput</code> for text inputs
          instead of <code className="text-foreground">onChange</code>
        </li>
        <li>
          Use <code className="text-foreground">e.currentTarget</code> instead
          of <code className="text-foreground">e.target</code>
        </li>
        <li>
          Use <code className="text-foreground">Show</code> and{" "}
          <code className="text-foreground">For</code> components for control
          flow
        </li>
        <li>
          Signal values are accessed by calling them:{" "}
          <code className="text-foreground">value()</code>
        </li>
      </ul>
    </article>
  );
}
