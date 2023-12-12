import type { Config } from '@svgr/core';

export const SVG_COMPONENT_NAME = 'SvgLogo';

export const defaultTemplate: Config['template'] = (variables, { tpl }) => {
  return tpl`${variables.imports};

${variables.interfaces};

const ${SVG_COMPONENT_NAME} = (${variables.props}) => (
  ${variables.jsx}
);

export default ${SVG_COMPONENT_NAME};`;
};
