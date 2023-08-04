declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const src: React.FC<import('react-native-svg').SvgProps>;
  // eslint-disable-next-line import/no-default-export
  export default src;
}
