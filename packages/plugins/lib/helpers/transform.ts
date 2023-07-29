export const isFlow = (source: string, path: string): boolean => {
  return (
    path.endsWith('.js') &&
    ['@flow', '@noflow'].some((flowSyntaxToken) =>
      source.includes(flowSyntaxToken),
    )
  );
};
