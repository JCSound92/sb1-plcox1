import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Loader2, ChefHat } from 'lucide-react';
import { useStore } from '../store';
import { suggestRecipes, getCookingAdvice } from '../api';
import toast from 'react-hot-toast';
import { CookingCoachResponse } from './CookingCoachResponse';

export function ChatControl() {
  const [input, setInput] = useState('');
  const [cookingResponse, setCookingResponse] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  
  const { 
    setIsLoading, 
    setSuggestions,
    currentRecipe,
    currentMeal,
    isCooking,
    setCurrentRecipe,
    addToShoppingList,
    adjustPortions,
    adjustMealPortions,
    isLoading,
    recipes,
    filterRecipes
  } = useStore();

  const isSearchView = location.pathname === '/recent' || location.pathname === '/saved';
  const isCookingView = location.pathname === '/cooking';
  const isMealPlanView = location.pathname === '/current-meal';

  const getPlaceholder = () => {
    if (isLoading) {
      if (isCookingView) {
        return "Asking the Oh Sure Chef...";
      }
      return "Finding recipes...";
    }

    if (isCookingView) {
      return "Ask about timing, temperatures, or techniques...";
    }

    if (isSearchView) {
      return "Search your recipes...";
    }

    if (isMealPlanView) {
      return "How many are you cooking for?";
    }

    return "What do you want to cook tonight?";
  };

  useEffect(() => {
    if (isSearchView) {
      filterRecipes(input);
    }
  }, [input, isSearchView, filterRecipes]);

  const handleCookingQuestion = async (query: string) => {
    if (!currentMeal.recipes[0]) return;
    
    try {
      setIsLoading(true);
      const response = await getCookingAdvice(query, currentMeal.recipes[0]);
      setCookingResponse(response);
    } catch (error) {
      toast.error('Failed to get cooking advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const query = input.trim().toLowerCase();
    setInput('');

    // If in cooking view, handle as cooking question
    if (isCookingView) {
      await handleCookingQuestion(query);
      return;
    }

    // If in search view, just filter
    if (isSearchView) {
      return;
    }

    // Handle serving adjustment for meal plan
    if (isMealPlanView) {
      if (handleServingAdjustment(query)) {
        return;
      }
    }

    // Only perform recipe search if not in special views
    if (!isSearchView && !isCookingView && !isMealPlanView) {
      await handleRecipeSearch(query);
    }
  };

  const handleServingAdjustment = (command: string) => {
    const servingMatch = command.match(/(?:adjust|make|scale).*?(\d+)\s*(?:people|servings)/i);
    if (servingMatch) {
      const newServings = parseInt(servingMatch[1], 10);
      if (newServings > 0 && newServings <= 100) {
        if (currentMeal.recipes.length > 0) {
          adjustMealPortions(newServings);
          toast.success(`Adjusted meal for ${newServings} people`);
          return true;
        } else if (currentRecipe) {
          adjustPortions(newServings);
          toast.success(`Adjusted recipe for ${newServings} people`);
          return true;
        }
      } else {
        toast.error('Please enter a serving size between 1 and 100');
        return true;
      }
    }
    return false;
  };

  const handleRecipeSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const recipes = await suggestRecipes(query);
      setSuggestions(recipes);
      setCurrentRecipe(null);
      toast.success('Found some recipes for you!');
    } catch (error) {
      toast.error('Failed to find recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isCookingView && cookingResponse && (
        <CookingCoachResponse response={cookingResponse} />
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
          <div className="relative flex items-center gap-3">
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-[#FF6B6B] animate-spin" />
            ) : isCookingView ? (
              <ChefHat className="w-6 h-6 text-[#FF6B6B]" />
            ) : (
              <Search className="w-6 h-6 text-[#FF6B6B]" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getPlaceholder()}
              className="flex-1 pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
            />
          </div>
        </form>
      </div>
    </>
  );
}