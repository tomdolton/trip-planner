interface PhaseHeaderProps {
  title: string;
  description?: string;
}

export function PhaseHeader({ title, description }: PhaseHeaderProps) {
  return (
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
