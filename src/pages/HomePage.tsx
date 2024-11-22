import React from 'react';
import { Welcome } from '../components/Welcome';
import { RecipeView } from '../components/RecipeView';
import { RecipeSuggestions } from '../components/RecipeSuggestions';
import { useStore } from '../store';
import { Loader2 } from 'lucide-react';

export function HomePage() {
  const { suggestions, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FF6B6B] mx-auto mb-4" />
          <p className="text-gray-600">Finding the perfect recipes...</p>
        </div>
      </div>
    );
  }

  if (suggestions.length > 0) {
    return <RecipeSuggestions />;
  }

  return <Welcome />;
}