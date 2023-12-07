import React from 'react'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import Image from 'next/image'

const config: DocsThemeConfig = {
  logo: (
    <>
      <Image 
        src="/logo.svg"
        width={30}
        height={30}
        style={{ marginRight: 8 }}
        alt="logo"
      />
      <span>React Native Esbuild</span>
    </>
  ),
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  project: {
    link: 'https://github.com/leegeunhyeok/react-native-esbuild',
  },
  docsRepositoryBase: 'https://github.com/leegeunhyeok/react-native-esbuild',
  footer: {
    text: 'React Native Esbuild',
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter()
    const { frontMatter } = useConfig()
    const url =
      'https://react-native-esbuild.vercel.app' +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`)
 
    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:image" content="/social-card.png" />
        <meta property="og:title" content={frontMatter.title || 'React Native Esbuild'} />
        <meta
          property="og:description"
          content={frontMatter.description || 'Document'}
        />
      </>
    )
  }
}

export default config
