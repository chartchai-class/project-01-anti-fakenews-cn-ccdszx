import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getPaginationNews, getNewsDetail } from '@/services/NewsService';
import type { News } from '@/types';
import { mockNews } from '@/services/mockData';

// Check if mock data is used
const USE_MOCK_DATA = import.meta.env.DEV && !import.meta.env.VITE_BACKEND_URL;

export const useNewsStore = defineStore('news', () => {
  const news = ref<News | null>(null);
  const newsList = ref<News[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const setNews = (data: News | null) => {
    news.value = data;
  };

  const fetchNews = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      if (USE_MOCK_DATA) {
        // Use mock data directly
        const newsItem = mockNews.find(n => n.id === id);
        news.value = newsItem || null;
        return newsItem;
      } else {
        const response = await getNewsDetail(id);
        news.value = response.data;
        return response.data;
      }
    } catch (err) {
      error.value = 'Failed to fetch news';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchNewsList = async (params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getPaginationNews(params);
      newsList.value = response.data.items || [];
      return response.data;
    } catch (err) {
      error.value = 'Failed to fetch news list';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    news,
    newsList,
    loading,
    error,
    setNews,
    fetchNews,
    fetchNewsList,
  };
});
