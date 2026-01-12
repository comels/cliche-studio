export default function sitemap() {
  const baseUrl = 'https://www.cliche-studio.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}

