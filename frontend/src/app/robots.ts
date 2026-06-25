import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/'], // Bloqueia o painel administrativo das buscas públicas
      },
    ],
    sitemap: 'https://arkeucalipto.com.br/sitemap.xml',
  };
}