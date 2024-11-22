import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft } from 'lucide-react';
import { useStore } from '../store';
import { SwipeableCard } from '../components/SwipeableCard';
import { RecipeModal } from '../components/RecipeModal';
import toast from 'react-hot-toast';
import type { Recipe } from '../types';

export function RecentRecipesPage() {
  const navigate = useNavigate();
  const { 
    addToCurrentMeal, 
    filteredRecipes, 
    recipes,
    setCurrentRecipe,
    currentRecipe
  } = useStore();
  
  const displayedRecipes = filteredRecipes.length ? filteredRecipes : recipes;

  const handleAddToMeal = (recipe: Recipe) => {
    addToCurrentMeal(recipe);
    toast(
      <div className="flex flex-col">
        <span>Added to tonight's meal</span>
        <button 
          onClick={() => navigate('/current-meal')}
          className="text-sm text-[#FF6B6B] mt-1 underline text-left"
        >
          View Meal
        </button>
      </div>
    );
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
          <h1 className="text-2xl font-bold">Recent Recipes</h1>
        </div>
      </div>

      <div className="content-container">
        <div className="max-w-3xl mx-auto py-6">
          <div className="grid gap-4">
            {displayedRecipes.map((recipe: Recipe) => (
              <SwipeableCard
                key={recipe.id}
                onAddToPlan={() => handleAddToMeal(recipe)}
                title={recipe.title}
              >
                <div
                  className="p-6 cursor-pointer group/card"
                  onClick={() => setCurrentRecipe(recipe)}
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
      </div>

      {currentRecipe && <RecipeModal onClose={() => setCurrentRecipe(null)} />}
    </div>
  );
}