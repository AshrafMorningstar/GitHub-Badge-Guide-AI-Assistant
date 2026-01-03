/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'earnable' | 'highlight' | 'retired';
  tiers?: string[];
  rarity?: 'Common' | 'Rare' | 'Legendary';
}

export enum AiMode {
  FAST_CHAT = 'FAST_CHAT',
  THINKING_CHAT = 'THINKING_CHAT',
  SEARCH_GROUNDING = 'SEARCH_GROUNDING',
  IMAGE_GEN = 'IMAGE_GEN',
  IMAGE_EDIT = 'IMAGE_EDIT',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  images?: string[];
  isLoading?: boolean;
  groundingUrls?: Array<{title: string; uri: string}>;
}

export interface ImageSize {
  label: string;
  value: '1K' | '2K' | '4K';
}