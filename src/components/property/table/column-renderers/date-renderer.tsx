interface DateRendererProps {
  value: Date | undefined;
}

export const DateRenderer = ({ value }: DateRendererProps) => (
  <p>
    {value ? value.toLocaleDateString("en-IN", { dateStyle: "medium" }) : ""}
  </p>
);
