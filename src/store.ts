import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe, ShoppingListItem } from './types';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  steps: {
    search: boolean;
    addToMeal: boolean;
    adjustServings: boolean;
    shoppingList: boolean;
    cookingMode: boolean;
  };
}

export const useStore = create(
  persist(
    (set, get) => ({
      recipes: [],
      filteredRecipes: [],
      suggestions: [],
      currentRecipe: null,
      currentStep: 0,
      isTimerActive: false,
      timerSeconds: 0,
      isCooking: false,
      showMenu: false,
      showRecipePanel: false,
      shoppingList: [],
      isLoading: false,
      currentMeal: {
        recipes: [],
        status: 'building',
        servings: 4,
        originalRecipes: []
      },
      onboarding: {
        hasCompletedOnboarding: false,
        steps: {
          search: false,
          addToMeal: false,
          adjustServings: false,
          shoppingList: false,
          cookingMode: false,
        },
      },

      // ... rest of your actions ...

      markOnboardingComplete: () =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            hasCompletedOnboarding: true,
          },
        })),

      completeOnboardingStep: (step: keyof OnboardingState['steps']) =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            steps: {
              ...state.onboarding.steps,
              [step]: true,
            },
          },
        })),
    }),
    {
      name: 'oh-sure-chef-storage',
      partialize: (state) => ({
        recipes: state.recipes,
        shoppingList: state.shoppingList,
        currentMeal: state.currentMeal,
        onboarding: {
          hasCompletedOnboarding: state.onboarding.hasCompletedOnboarding,
          steps: state.onboarding.steps,
        },
      }),
    }
  )
);