import fs from 'node:fs/promises';
import path from 'node:path';
import { logger } from '../../shared';

export const generateIndexPage = async (
  template: string,
  destinationDir: string,
  placeholders: Record<string, string> = {},
): Promise<void> => {
  const destination = path.join(destinationDir, 'index.html');
  logger.debug('generating index page', {
    template,
    destination,
    placeholders,
  });

  const rawTemplate = await fs.readFile(template, 'utf-8');
  await fs.writeFile(
    destination,
    Object.entries(placeholders).reduce((prev, [key, value]) => {
      return prev.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }, rawTemplate),
    'utf-8',
  );
};
