// Dynamic blocks this app renders. The dashboard's editable fields come from here,
// registered with `npm run register-blocks` (never from the app: it needs the write key).
//
// The server archives every workspace block that is NOT in the list it receives,
// so registration must always send this whole list, never a subset.

type FieldType = 'text' | 'image' | 'url' | 'color' | 'number' | 'collection';

export interface BlockField {
  tag: string;
  type: FieldType;
  label: string;
  required?: boolean;
  allowedBlockKeys?: string[];
  maxItems?: number;
}

export interface BlockDefinition {
  key: string;
  name: string;
  screen: string;
  fields: BlockField[];
}

const text = (tag: string, label: string, required?: boolean): BlockField => ({ tag, type: 'text', label, required });
const image = (tag: string, label: string): BlockField => ({ tag, type: 'image', label });
const list = (label: string, itemKey: string): BlockField => ({
  tag: 'items', type: 'collection', label, allowedBlockKeys: [itemKey], maxItems: 20,
});

// Cards that the list blocks hold. Each list item is one instance of these.
export const ITEM_BLOCK_DEFINITIONS: BlockDefinition[] = [
  { key: 'story_item', name: 'Story Item', screen: 'shared', fields: [
    text('title', 'Label'),
    image('image', 'Image'),
    text('icon', 'Emoji Icon'),
    { tag: 'url', type: 'url', label: 'Link' },
  ]},
  { key: 'card_item', name: 'Card Item', screen: 'shared', fields: [
    text('title', 'Title'),
    text('subtitle', 'Subtitle'),
    image('image', 'Image'),
    text('icon', 'Emoji Icon'),
    { tag: 'url', type: 'url', label: 'Link' },
  ]},
];

export const APP_BLOCK_DEFINITIONS: BlockDefinition[] = [
  // Home
  { key: 'home_stories', name: 'Home Stories', screen: 'home', fields: [list('Stories', 'story_item')] },
  { key: 'home_hero', name: 'Home Hero Banner', screen: 'home', fields: [
    text('title', 'Title', true),
    text('subtitle', 'Subtitle'),
    image('image', 'Background Image'),
    text('cta_label', 'Button Text'),
    { tag: 'cta_url', type: 'url', label: 'Button URL' },
  ]},
  { key: 'home_inline_1', name: 'Home Inline 1', screen: 'home', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'), text('icon', 'Icon'),
  ]},
  { key: 'home_inline_2', name: 'Home Inline 2', screen: 'home', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'), text('icon', 'Icon'),
  ]},
  { key: 'home_promo', name: 'Home Promo Strip', screen: 'home', fields: [
    text('title', 'Title', true), text('subtitle', 'Subtitle'), text('icon', 'Emoji Icon'),
    { tag: 'backgroundColor', type: 'color', label: 'Background Color' },
  ]},
  { key: 'home_countdown', name: 'Home Countdown', screen: 'home', fields: [
    text('title', 'Title'),
    { tag: 'hours', type: 'number', label: 'Hours' },
    { tag: 'minutes', type: 'number', label: 'Minutes' },
    { tag: 'seconds', type: 'number', label: 'Seconds' },
  ]},
  { key: 'home_featured', name: 'Home Featured', screen: 'home', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'), image('image', 'Image'),
  ]},
  { key: 'home_services_promo', name: 'Home Services Promo', screen: 'home', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},
  { key: 'home_carousel', name: 'Home Carousel', screen: 'home', fields: [list('Carousel Items', 'card_item')] },
  { key: 'home_fullwidth', name: 'Home Fullwidth Banner', screen: 'home', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'), image('image', 'Image'), text('badge', 'Badge'),
  ]},
  { key: 'home_bottom', name: 'Home Bottom', screen: 'home', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},

  // Wallet
  { key: 'wallet_promo', name: 'Wallet Promo', screen: 'wallet', fields: [
    text('title', 'Title', true), text('subtitle', 'Subtitle'), text('cta_label', 'Button Text'),
  ]},
  { key: 'wallet_upgrade', name: 'Wallet Upgrade Banner', screen: 'wallet', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'), text('badge', 'Badge Text'),
  ]},
  { key: 'wallet_card_offers', name: 'Wallet Card Offers', screen: 'wallet', fields: [list('Offers', 'card_item')] },
  { key: 'wallet_insights', name: 'Wallet Insights', screen: 'wallet', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},
  { key: 'wallet_rewards', name: 'Wallet Rewards', screen: 'wallet', fields: [
    text('title', 'Title'), text('value', 'Points Value'), text('icon', 'Icon'),
  ]},
  { key: 'wallet_cashback', name: 'Wallet Cashback', screen: 'wallet', fields: [
    text('title', 'Title'), text('value', 'Value'),
  ]},
  { key: 'wallet_goals', name: 'Wallet Goals', screen: 'wallet', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},
  { key: 'wallet_bottom', name: 'Wallet Bottom', screen: 'wallet', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},

  // Travel
  { key: 'travel_flash', name: 'Travel Flash Deal', screen: 'travel', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'), text('badge', 'Badge'),
  ]},
  { key: 'travel_hero', name: 'Travel Hero', screen: 'travel', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'), image('image', 'Image'),
  ]},
  { key: 'travel_spotlight', name: 'Travel Spotlight', screen: 'travel', fields: [
    text('title', 'Title'), text('description', 'Description'), image('image', 'Image'), text('badge', 'Badge'),
  ]},
  { key: 'travel_promo', name: 'Travel Promo', screen: 'travel', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},
  { key: 'travel_lastminute', name: 'Travel Last Minute', screen: 'travel', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},
  { key: 'travel_hotels', name: 'Travel Hotels', screen: 'travel', fields: [list('Hotels', 'card_item')] },
  { key: 'travel_miles', name: 'Travel Miles', screen: 'travel', fields: [
    text('title', 'Title'), text('value', 'Miles Value'),
  ]},
  { key: 'travel_bottom', name: 'Travel Bottom', screen: 'travel', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},

  // Food
  { key: 'food_flash', name: 'Food Flash Deal', screen: 'food', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},
  { key: 'food_hero', name: 'Food Hero', screen: 'food', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},
  { key: 'food_promo', name: 'Food Promo', screen: 'food', fields: [
    text('title', 'Title'), text('subtitle', 'Promo Code'), text('icon', 'Icon'),
  ]},
  { key: 'food_recommended', name: 'Food Recommended', screen: 'food', fields: [list('Restaurants', 'card_item')] },
  { key: 'food_cuisines', name: 'Food Cuisines', screen: 'food', fields: [list('Cuisines', 'card_item')] },
  { key: 'food_cuisine_grid', name: 'Food Cuisine Grid', screen: 'food', fields: [list('Grid Items', 'card_item')] },
  { key: 'food_rewards', name: 'Food Rewards', screen: 'food', fields: [
    text('title', 'Title'), text('value', 'Value'),
  ]},
  { key: 'food_bottom', name: 'Food Bottom', screen: 'food', fields: [
    text('title', 'Title'), text('subtitle', 'Subtitle'),
  ]},
];

// How CFSlot draws each block. Chosen in code, not in the dashboard: a block's fields
// are only useful in the layout built for them (e.g. only 'hero' shows image + subtitle).
export type BlockLayout =
  | 'hero' | 'banner' | 'card' | 'promo' | 'inline' | 'reward'
  | 'carousel' | 'story' | 'grid' | 'countdown' | 'fullwidth' | 'spotlight';

export const BLOCK_LAYOUTS: Record<string, BlockLayout> = {
  home_stories: 'story',
  home_hero: 'hero',
  home_inline_1: 'inline',
  home_inline_2: 'inline',
  home_promo: 'promo',
  home_countdown: 'countdown',
  home_featured: 'card',
  home_services_promo: 'promo',
  home_carousel: 'carousel',
  home_fullwidth: 'fullwidth',
  home_bottom: 'promo',

  wallet_promo: 'promo',
  wallet_upgrade: 'banner',
  wallet_card_offers: 'carousel',
  wallet_insights: 'card',
  wallet_rewards: 'reward',
  wallet_cashback: 'reward',
  wallet_goals: 'card',
  wallet_bottom: 'promo',

  travel_flash: 'banner',
  travel_hero: 'hero',
  travel_spotlight: 'spotlight',
  travel_promo: 'promo',
  travel_lastminute: 'promo',
  travel_hotels: 'carousel',
  travel_miles: 'reward',
  travel_bottom: 'promo',

  food_flash: 'banner',
  food_hero: 'hero',
  food_promo: 'promo',
  food_recommended: 'carousel',
  food_cuisines: 'carousel',
  food_cuisine_grid: 'grid',
  food_rewards: 'reward',
  food_bottom: 'promo',
};

// Payload for POST /cards/sync. Tags stay plain ("title"); the server needs an `id` per field.
// Screen blocks get one draft instance to edit; item blocks are created from inside their list.
export function buildBlockManifest() {
  const entry = (def: BlockDefinition, seedInstance: boolean) => ({
    key: def.key,
    name: def.name,
    screen: def.screen,
    fields: def.fields.map(f => ({ ...f, id: f.tag })),
    seedInstance,
  });
  return [
    ...ITEM_BLOCK_DEFINITIONS.map(def => entry(def, false)),
    ...APP_BLOCK_DEFINITIONS.map(def => entry(def, true)),
  ];
}
