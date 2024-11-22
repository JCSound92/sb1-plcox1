import React from 'react';
import { Clock, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { SwipeableCard } from './SwipeableCard';
import { RecipeModal } from './RecipeModal';
import toast from 'react-hot-toast';
import type { Recipe } from '../types';

export function RecipeSuggestions() {
  const navigate = useNavigate();
  const { 
    suggestions, 
    setCurrentRecipe,
    addToCurrentMeal,
    currentRecipe
  } = useStore();

  if (!suggestions.length) return null;

  const handleAddToMeal = (recipe: Recipe) => {
    addToCurrentMeal(recipe);
    toast.success(
      <div className="flex flex-col">
        <span>Added to tonight's meal</span>
        <button 
          className="text-sm text-[#FF6B6B] mt-1 underline"
          onClick={() => navigate('/current-meal')}
        >
          View Meal
        </button>
      </div>,
      { duration: 4000 }
    );
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        <div className="grid gap-4">
          {suggestions.map((recipe: Recipe) => (
            <SwipeableCard
              key={recipe.id}
              onAddToPlan={() => handleAddToMeal(recipe)}
              title={recipe.title}
            >
              <div
                className="p-6 cursor-pointer group/card"
                onClick={() => handleRecipeClick(recipe)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#333333] mb-2 group-hover/card:text-[#FF6B6B] transition-colors">
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
                      {recipe.difficulty && (
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4" />
                          <span className="capitalize">{recipe.difficulty}</span>
                        </div>
                      )}
                      {recipe.cuisine && (
                        <span className="text-[#FF6B6B]">{recipe.cuisine}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwipeableCard>
          ))}
        </div>
      </div>

      {currentRecipe && <RecipeModal onClose={() => setCurrentRecipe(null)} />}
    </div>
  );
}