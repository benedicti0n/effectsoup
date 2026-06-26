import type { JSX, ReactNode } from "react";

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  highlighted,
  button
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  button: ReactNode;
}): JSX.Element {
  return (
    <div
      className={`flex flex-col rounded-sm border p-6 md:p-8 ${
        highlighted
          ? "border-ink-primary bg-ink-primary text-on-primary"
          : "border-card-border bg-canvas text-ink"
      }`}
    >
      <div className="mb-6">
        <h2 className="mb-2 font-display text-xl font-medium">{title}</h2>
        <div className="mb-3 flex items-baseline gap-1">
          <span className="font-display text-4xl font-medium">{price}</span>
          <span className={highlighted ? "text-on-dark/60" : "text-muted"}>{period}</span>
        </div>
        <p className={highlighted ? "text-on-dark/80" : "text-body-muted"}>{description}</p>
      </div>

      <ul className="mb-8 flex-1 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className={highlighted ? "text-on-dark/60" : "text-muted"}>+</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {button}
    </div>
  );
}
