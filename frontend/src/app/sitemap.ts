import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.arkeucalipto.com.br'; // 🟢 Padronizado com o 'www' que o Google está lendo no Search Console

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
      url: `${baseUrl}/diferenciais`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, // Tecnologia da madeira tratada
    },
    {
      url: `${baseUrl}/rodovias`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, // Atendimento viário e construtoras B2B
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
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5, // 🟢 ADICIONADO: Nova rota mapeada para zerar o erro Soft 404
    },
  ];
}