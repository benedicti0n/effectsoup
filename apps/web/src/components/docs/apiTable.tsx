import type { JSX } from "react";
import { InlineCode } from "@/components/docs/code";

type Param = {
  name: string;
  type: string;
  description: string;
};

export function ApiSignature({
  signature,
  children
}: {
  signature: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="my-4 rounded-sm border border-hairline bg-soft-stone/30 p-4">
      <pre className="overflow-x-auto font-mono text-sm text-ink-primary">
        <code>{signature}</code>
      </pre>
      {children && <div className="mt-3 text-sm text-body-muted">{children}</div>}
    </div>
  );
}

export function ParamsTable({ params }: { params: Param[] }): JSX.Element {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-hairline">
            <th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted">Name</th>
            <th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted">Type</th>
            <th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={param.name} className="border-b border-hairline/50">
              <td className="px-4 py-2.5 font-mono text-sm text-ink-primary">{param.name}</td>
              <td className="px-4 py-2.5"><InlineCode>{param.type}</InlineCode></td>
              <td className="px-4 py-2.5 text-body-muted">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
