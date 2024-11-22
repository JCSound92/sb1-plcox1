import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ChatControl } from './components/ChatControl';
import { HomePage } from './pages/HomePage';
import { RecentRecipesPage } from './pages/RecentRecipesPage';
import { SavedRecipesPage } from './pages/SavedRecipesPage';
import { CurrentMeal } from './components/CurrentMeal';
import { CookingModePage } from './pages/CookingModePage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { Toast } from './components/Toast';
import { Onboarding } from './components/Onboarding';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-1 flex flex-col mt-16 mb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recent" element={<RecentRecipesPage />} />
            <Route path="/saved" element={<SavedRecipesPage />} />
            <Route path="/shopping-list" element={<ShoppingListPage />} />
            <Route path="/current-meal" element={<CurrentMeal />} />
            <Route path="/cooking" element={<CookingModePage />} />
          </Routes>
        </main>
        <ChatControl />
        <Toast />
        <Onboarding />
      </div>
    </BrowserRouter>
  );
}