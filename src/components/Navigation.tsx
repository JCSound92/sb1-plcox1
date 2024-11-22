import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, History, ChefHat, ShoppingCart, Utensils, Search } from 'lucide-react';
import { useStore } from '../store';

export function Navigation() {
  const navigate = useNavigate();
  const { 
    setShowMenu, 
    shoppingList, 
    currentMeal, 
    setCurrentRecipe, 
    suggestions,
    setSuggestions
  } = useStore();
  
  const pendingItems = shoppingList.filter(item => !item.completed).length;

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentRecipe(null);
    
    // If we have suggestions, go back to them
    if (suggestions.length > 0) {
      navigate('/');
    } else {
      // Otherwise clear suggestions and show welcome screen
      setSuggestions([]);
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-sm z-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ChefHat className="w-6 h-6 text-[#FF6B6B]" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSearchClick}
              className="p-2 hover:bg-gray-100 rounded-lg relative group"
              title={suggestions.length > 0 ? "Back to search results" : "Search recipes"}
            >
              <Search className="w-6 h-6 text-[#333333]" />
              {suggestions.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {suggestions.length}
                </span>
              )}
            </button>
            <Link
              to="/current-meal"
              className="p-2 hover:bg-gray-100 rounded-lg relative"
              title="Tonight's Meal"
            >
              <Utensils className="w-6 h-6 text-[#333333]" />
              {currentMeal.recipes.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {currentMeal.recipes.length}
                </span>
              )}
            </Link>
            <Link
              to="/recent"
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Recent Recipes"
            >
              <History className="w-6 h-6 text-[#333333]" />
            </Link>
            <Link
              to="/saved"
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Saved Recipes"
            >
              <Heart className="w-6 h-6 text-[#333333]" />
            </Link>
            <Link
              to="/shopping-list"
              className="p-2 hover:bg-gray-100 rounded-lg relative"
              title="Shopping List"
            >
              <ShoppingCart className="w-6 h-6 text-[#333333]" />
              {pendingItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}