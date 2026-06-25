import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://arkeucalipto.com.br';

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0, // Página principal tem peso máximo
    },
    {
      url: `${baseUrl}/produtos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // Vitrine de produtos/madeiras tem alta relevância
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7, // Institucional (Quem Somos)
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7, // Página de orçamento / contato
    },
  ];
}