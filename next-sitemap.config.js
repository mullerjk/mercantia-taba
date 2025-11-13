/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mercantia.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/auth/*', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/admin/']
      }
    ]
  },
  transform: async (config, path) => {
    // Personalizar prioridade e frequência baseada no tipo de página
    const defaultTransform = {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }

    // Páginas dinâmicas têm prioridade menor
    if (path.includes('/product/') || path.includes('/organization/') || path.includes('/person/')) {
      return {
        ...defaultTransform,
        priority: 0.6,
        changefreq: 'weekly'
      }
    }

    // Página inicial tem prioridade máxima
    if (path === '/') {
      return {
        ...defaultTransform,
        priority: 1.0,
        changefreq: 'daily'
      }
    }

    return defaultTransform
  }
}
