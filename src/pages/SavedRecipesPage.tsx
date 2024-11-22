import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Heart, ChevronLeft } from 'lucide-react';
import { useStore } from '../store';
import { RecipeModal } from '../components/RecipeModal';
import toast from 'react-hot-toast';
import type { Recipe } from '../types';

export function SavedRecipesPage() {
  const navigate = useNavigate();
  const { 
    recipes, 
    filteredRecipes,
    setCurrentRecipe,
    currentRecipe,
    toggleFavorite
  } = useStore();
  
  const savedRecipes = (filteredRecipes.length ? filteredRecipes : recipes).filter(recipe => recipe.favorite);

  const handleToggleFavorite = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
    toast.success('Recipe removed from favorites');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 border-b border-gray-100 bg-white px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Saved Recipes</h1>
        </div>
      </div>

      <div className="content-container">
        <div className="max-w-3xl mx-auto py-6">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No saved recipes yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Save recipes you love to find them easily later
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedRecipes.map((recipe: Recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => setCurrentRecipe(recipe)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#333333] mb-2 group-hover:text-[#FF6B6B] transition-colors">
                          {recipe.title}
                        </h3>
                        {recipe.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {recipe.description}
                          </p>
                        )}
                        <div className="flex items-center gap-8 text-sm text-[#666666]">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{recipe.time} mins</span>
                          </div>
                          {recipe.cuisine && (
                            <span className="text-[#FF6B6B]">{recipe.cuisine}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleToggleFavorite(recipe, e)}
                        className="p-2 text-[#FF6B6B] hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Heart className="w-5 h-5 fill-[#FF6B6B]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {currentRecipe && <RecipeModal onClose={() => setCurrentRecipe(null)} />}
    </div>
  );
}