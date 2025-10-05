import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { mockEducationalContent } from '@/data/mockData';
import { EducationalContent } from '@/types';

export function useEducationalContent() {
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase first
      const { data, error: supabaseError } = await supabase
        .from('educational_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.warn('Supabase error, falling back to mock data:', supabaseError);
        setUsingMockData(true);
        setContent(mockEducationalContent);
      } else if (data && data.length > 0) {
        // Transform Supabase data to match our interface
        const transformedData: EducationalContent[] = data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          category: item.category,
          ageRange: item.age_range,
          tags: item.tags || [],
          readTime: item.read_time || 5,
          status: item.status || 'published',
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at)
        }));
        setContent(transformedData);
        setUsingMockData(false);
      } else {
        // No data in Supabase, use mock data
        setUsingMockData(true);
        setContent(mockEducationalContent);
      }
    } catch (err) {
      console.error('Error fetching educational content:', err);
      setError('Failed to load content');
      setUsingMockData(true);
      setContent(mockEducationalContent);
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (newContent: Omit<EducationalContent, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (usingMockData) {
      // For mock data, just add to local state
      const newItem: EducationalContent = {
        ...newContent,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setContent(prev => [newItem, ...prev]);
      return newItem;
    }

    try {
      const { data, error } = await supabase
        .from('educational_content')
        .insert({
          title: newContent.title,
          content: newContent.content,
          category: newContent.category,
          age_range: newContent.ageRange,
          tags: newContent.tags,
          read_time: newContent.readTime,
          status: newContent.status
        })
        .select()
        .single();

      if (error) throw error;

      const newItem: EducationalContent = {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        ageRange: data.age_range,
        tags: data.tags || [],
        readTime: data.read_time || 5,
        status: data.status || 'published',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setContent(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      console.error('Error adding content:', err);
      throw err;
    }
  };

  const updateContent = async (id: string, updates: Partial<EducationalContent>) => {
    if (usingMockData) {
      setContent(prev => prev.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('educational_content')
        .update({
          title: updates.title,
          content: updates.content,
          category: updates.category,
          age_range: updates.ageRange,
          tags: updates.tags,
          read_time: updates.readTime,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setContent(prev => prev.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
      ));
    } catch (err) {
      console.error('Error updating content:', err);
      throw err;
    }
  };

  const deleteContent = async (id: string) => {
    if (usingMockData) {
      setContent(prev => prev.filter(item => item.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('educational_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContent(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting content:', err);
      throw err;
    }
  };

  return {
    content,
    loading,
    error,
    usingMockData,
    addContent,
    updateContent,
    deleteContent,
    refetch: fetchContent
  };
}
