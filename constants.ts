import { Badge } from './types';

export const BADGES: Badge[] = [
  // Earnable
  {
    id: 'starstruck',
    name: 'Starstruck',
    icon: '⭐',
    description: 'Created a repository that receives stars.',
    category: 'earnable',
    tiers: ['Base (16)', 'Bronze (128)', 'Silver (512)', 'Gold (4096)'],
    rarity: 'Common'
  },
  {
    id: 'quickdraw',
    name: 'Quickdraw',
    icon: '⚡',
    description: 'Closed an issue or PR within 5 minutes of opening.',
    category: 'earnable',
    tiers: ['One-time'],
    rarity: 'Rare'
  },
  {
    id: 'pair-extraordinaire',
    name: 'Pair Extraordinaire',
    icon: '👯',
    description: 'Co-authored commits in a pull request.',
    category: 'earnable',
    tiers: ['Base (10)', 'Bronze (24)', 'Silver (48)', 'Gold (128)'],
    rarity: 'Common'
  },
  {
    id: 'pull-shark',
    name: 'Pull Shark',
    icon: '🦈',
    description: 'Opened pull requests that have been merged.',
    category: 'earnable',
    tiers: ['Base (2)', 'Bronze (16)', 'Silver (128)', 'Gold (1024)'],
    rarity: 'Common'
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy Brain',
    icon: '🧠',
    description: 'Accepted answer on a Discussion.',
    category: 'earnable',
    tiers: ['Base (2)', 'Bronze (8)', 'Silver (16)', 'Gold (32)'],
    rarity: 'Rare'
  },
  {
    id: 'yolo',
    name: 'YOLO',
    icon: '🚀',
    description: 'Merged a PR without code review.',
    category: 'earnable',
    tiers: ['One-time'],
    rarity: 'Common'
  },
  {
    id: 'public-sponsor',
    name: 'Public Sponsor',
    icon: '💖',
    description: 'Sponsoring an open source contributor.',
    category: 'earnable',
    rarity: 'Common'
  },
  
  // Highlights
  {
    id: 'pro',
    name: 'GitHub Pro',
    icon: '🏆',
    description: 'Member of GitHub Pro.',
    category: 'highlight'
  },
  {
    id: 'dev-program',
    name: 'Developer Program Member',
    icon: '🛠️',
    description: 'Member of the GitHub Developer Program.',
    category: 'highlight'
  },
  {
    id: 'security-hunter',
    name: 'Security Bug Bounty Hunter',
    icon: '🐛',
    description: 'Participated in GitHub Security Bug Bounty.',
    category: 'highlight'
  },

  // Retired
  {
    id: 'arctic-vault',
    name: 'Arctic Code Vault Contributor',
    icon: '❄️',
    description: 'Code included in the 2020 Arctic Code Vault snapshot.',
    category: 'retired'
  },
  {
    id: 'mars-2020',
    name: 'Mars 2020 Helicopter Contributor',
    icon: '🚁',
    description: 'Contributed to repositories used in the Mars 2020 mission.',
    category: 'retired'
  }
];

export const MODELS = {
  FAST: 'gemini-2.5-flash-lite-latest',
  THINKING: 'gemini-3-pro-preview',
  SEARCH: 'gemini-2.5-flash',
  IMAGE_GEN: 'gemini-3-pro-image-preview',
  IMAGE_EDIT: 'gemini-2.5-flash-image'
};