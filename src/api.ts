import { Recipe } from './types';

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
if (!API_KEY) {
  console.error('Missing Perplexity API key');
}

const BASE_URL = 'https://api.perplexity.ai';

const RECIPE_SEARCH_PROMPT = `You are a friendly Midwest cooking assistant who helps users find recipes. 
When suggesting multiple recipes, respond with a JSON array of recipes in this format:
[{
  "title": "Recipe Name",
  "description": "Brief description",
  "ingredients": ["ingredient1", "ingredient2"],
  "steps": ["step1", "step2"],
  "time": estimatedMinutes,
  "difficulty": "easy|medium|hard",
  "cuisine": "cuisine type"
}]
Keep steps clear and concise. Include exact measurements in ingredients.`;

const COOKING_COACH_PROMPT = (recipe: Recipe) => `You are a friendly Midwest cooking coach helping someone make ${recipe.title}. 

You have access to these recipe details:
- Ingredients: ${recipe.ingredients.join(', ')}
- Steps: ${recipe.steps.join(' ')}

Style guidelines:
- Use occasional, natural Midwest expressions like "ope", "oh sure", "you betcha"
- Keep responses warm and encouraging, but not overly enthusiastic
- Use at most one Midwest phrase per response
- Focus on being helpful and practical first
- Limit responses to 2-3 sentences when possible

Focus on:
- Clear, practical cooking advice
- Common substitutions
- Timing and temperature guidance
- Technique explanations
- Troubleshooting help

Example response style:
"You'll want that pan nice and hot before adding the onions. Oh sure, medium-high heat should do it."
"Ope! You can substitute buttermilk with regular milk and a splash of lemon juice."`;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 1000
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', error);
      throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
    }
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    if (retries === 0) throw error;
    await delay(backoff);
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}

export async function suggestRecipes(
  prompt: string,
  model = 'llama-3.1-70b-instruct'
): Promise<Recipe[]> {
  if (!API_KEY) {
    throw new Error('Perplexity API key is not configured');
  }

  try {
    const response = await fetchWithRetry(
      `${BASE_URL}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: RECIPE_SEARCH_PROMPT },
            { role: 'user', content: `Suggest 3 recipes for: ${prompt}` },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const recipesData = JSON.parse(jsonMatch[0]);
    
    return recipesData.map((recipe: any) => ({
      ...recipe,
      id: `${Date.now()}-${Math.random()}`,
      favorite: false,
    }));
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to get recipes: ${error.message}`
        : 'Failed to get recipes'
    );
  }
}

export async function getCookingAdvice(
  question: string,
  recipe: Recipe,
  model = 'llama-3.1-70b-instruct'
): Promise<string> {
  if (!API_KEY) {
    throw new Error('Perplexity API key is not configured');
  }

  try {
    const response = await fetchWithRetry(
      `${BASE_URL}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: COOKING_COACH_PROMPT(recipe) },
            { role: 'user', content: question },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to get cooking advice: ${error.message}`
        : 'Failed to get cooking advice'
    );
  }
}