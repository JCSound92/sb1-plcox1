import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import { useStore } from '../store';
import { Timer as TimerComponent } from '../components/Timer';
import toast from 'react-hot-toast';

export function CookingModePage() {
  const navigate = useNavigate();
  const { currentMeal, startTimer } = useStore();
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showTimerInput, setShowTimerInput] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState('5');

  // Redirect if no recipes in current meal
  if (currentMeal.recipes.length === 0) {
    navigate('/current-meal');
    return null;
  }

  const currentRecipe = currentMeal.recipes[currentRecipeIndex];
  const currentStep = currentRecipe?.steps[currentStepIndex];
  const totalSteps = currentMeal.recipes.reduce(
    (total, recipe) => total + recipe.steps.length,
    0
  );

  const currentStepNumber = currentMeal.recipes
    .slice(0, currentRecipeIndex)
    .reduce((total, recipe) => total + recipe.steps.length, 0) + currentStepIndex + 1;

  const nextStep = () => {
    if (!currentRecipe) return;

    if (currentStepIndex < currentRecipe.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (currentRecipeIndex < currentMeal.recipes.length - 1) {
      setCurrentRecipeIndex(currentRecipeIndex + 1);
      setCurrentStepIndex(0);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else if (currentRecipeIndex > 0) {
      setCurrentRecipeIndex(currentRecipeIndex - 1);
      setCurrentStepIndex(
        currentMeal.recipes[currentRecipeIndex - 1].steps.length - 1
      );
    }
  };

  const handleTimerClick = () => {
    setShowTimerInput(!showTimerInput);
  };

  const handleTimerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(timerMinutes, 10);
    if (minutes > 0 && minutes <= 180) { // Max 3 hours
      startTimer(minutes);
      setShowTimerInput(false);
      toast.success(`${minutes} minute timer started`);
    } else {
      toast.error('Please enter a valid time between 1 and 180 minutes');
    }
  };

  if (!currentRecipe || !currentStep) return null;

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/current-meal')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Cooking Tonight's Meal</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        <div className="card space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#FF6B6B]">
              {currentRecipe.title}
            </h2>
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStepNumber} of {totalSteps}
              </span>
            </div>
          </div>

          <p className="text-2xl text-gray-800 leading-relaxed py-6">
            {currentStep}
          </p>

          <div className="flex justify-between pt-4">
            <button
              onClick={previousStep}
              disabled={currentRecipeIndex === 0 && currentStepIndex === 0}
              className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <ChevronLeft /> Previous
            </button>
            <div className="relative">
              <button
                onClick={handleTimerClick}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Timer className="w-5 h-5" />
                Set Timer
              </button>
              {showTimerInput && (
                <form
                  onSubmit={handleTimerSubmit}
                  className="absolute bottom-full mb-2 bg-white rounded-xl shadow-lg p-4 animate-fade-in"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(e.target.value)}
                      className="w-20 px-3 py-2 border rounded-lg"
                      min="1"
                      max="180"
                    />
                    <span className="text-sm text-gray-600">minutes</span>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF5252]"
                    >
                      Start
                    </button>
                  </div>
                </form>
              )}
            </div>
            <button
              onClick={nextStep}
              disabled={
                currentRecipeIndex === currentMeal.recipes.length - 1 &&
                currentStepIndex === currentRecipe.steps.length - 1
              }
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              Next <ChevronRight />
            </button>
          </div>
        </div>
      </div>
      <TimerComponent />
    </div>
  );
}