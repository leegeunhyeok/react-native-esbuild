import { isTTY, colors } from '@react-native-esbuild/utils';

const summaryTemplateForTTY = `
╭───────────╯
├─ @warnings warnings
├─ @errors errors
╰─ @duration
`.trim();

const summaryTemplateForNonTTY = `
> @warnings warnings
> @errors errors
> @durations
`.trim();

export const getSummaryTemplate = (): string => {
  return colors.gray(
    isTTY() ? summaryTemplateForTTY : summaryTemplateForNonTTY,
  );
};

export const fromTemplate = (
  template: string,
  placeholders: Record<string, string>,
): string => {
  const templateText = Object.entries(placeholders).reduce(
    (template, [key, value]) => template.replace(`@${key}`, value),
    template,
  );

  return `${templateText}\n`;
};
