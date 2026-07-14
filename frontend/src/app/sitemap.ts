import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 🟢 Ajustado para bater exatamente com a URL cadastrada no seu Google Search Console
  const baseUrl = 'https://arkeucalipto.com.br'; 

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0, 
    },
    {
      url: `${baseUrl}/produtos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, 
    },
    {
      url: `${baseUrl}/diferenciais`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, 
    },
    {
      url: `${baseUrl}/rodovias`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, 
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7, 
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7, 
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5, 
    },
  ];
}