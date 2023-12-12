/**
 * Flags for `BundleOptions`
 */
export enum OptionFlag {
  None = 0b00000000,
  PlatformAndroid = 0b00000001,
  PlatformIos = 0b00000010,
  PlatformWeb = 0b00000100,
  Dev = 0b00001000,
  Minify = 0b00010000,
}

export enum BuildMode {
  Bundle,
  Watch,
}
