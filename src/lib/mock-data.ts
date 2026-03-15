export const MOCK_FOOD_DATA = [
  { id: "1", title: "Vegetable Biryani", type: "Cooked", servings: 50, timeLeft: "2h", distance: 1.2, providerName: "The Grand Plaza", status: "available", pickupTime: "2:00 PM", quantity: "5 kg", ngo: null },
  { id: "2", title: "Fresh Bread Rolls", type: "Bakery", servings: 100, timeLeft: "4h", distance: 0.8, providerName: "Baker's Delight", status: "claimed", pickupTime: "4:00 PM", quantity: "10 kg", ngo: "FoodForAll" },
  { id: "3", title: "Mixed Fruit Salad", type: "Fresh", servings: 30, timeLeft: "1h", distance: 2.5, providerName: "Green Kitchen", status: "available", pickupTime: "1:00 PM", quantity: "3 kg", ngo: null },
  { id: "4", title: "Dal Makhani", type: "Cooked", servings: 80, timeLeft: "3h", distance: 3.1, providerName: "Spice Garden", status: "completed", pickupTime: "12:00 PM", quantity: "8 kg", ngo: "HelpingHands" },
  { id: "5", title: "Paneer Tikka", type: "Cooked", servings: 40, timeLeft: "2h", distance: 1.8, providerName: "Tandoor House", status: "available", pickupTime: "3:00 PM", quantity: "4 kg", ngo: null },
  { id: "6", title: "Rice & Curry Combo", type: "Cooked", servings: 120, timeLeft: "1h", distance: 0.5, providerName: "Campus Mess", status: "available", pickupTime: "1:30 PM", quantity: "12 kg", ngo: null },
  { id: "7", title: "Sandwiches Platter", type: "Packaged", servings: 60, timeLeft: "5h", distance: 4.2, providerName: "Event Caterers", status: "claimed", pickupTime: "5:00 PM", quantity: "6 kg", ngo: "MealShare" },
  { id: "8", title: "Pasta Alfredo", type: "Cooked", servings: 35, timeLeft: "2h", distance: 1.5, providerName: "Italian Corner", status: "available", pickupTime: "2:30 PM", quantity: "3.5 kg", ngo: null },
  { id: "9", title: "Fresh Juice Bottles", type: "Beverage", servings: 45, timeLeft: "3h", distance: 2.0, providerName: "Juice Bar Plus", status: "available", pickupTime: "3:30 PM", quantity: "15 L", ngo: null },
];

export const MOCK_STATS = {
  foodSaved: 12480,
  mealsServed: 45230,
  activeNGOs: 156,
  providersRegistered: 892,
};

export const MOCK_PROVIDER_STATS = {
  totalDonations: 48,
  mealsServed: 1284,
  activeRequests: 3,
  impactScore: 98,
};

export const MOCK_NGO_STATS = {
  availableNearby: 12,
  foodClaimed: 86,
  mealsDistributed: 3420,
  rating: 4.8,
};

export const MOCK_CHART_DATA = [
  { month: "Jan", foodSaved: 400, mealsServed: 1200 },
  { month: "Feb", foodSaved: 600, mealsServed: 1800 },
  { month: "Mar", foodSaved: 550, mealsServed: 1650 },
  { month: "Apr", foodSaved: 780, mealsServed: 2340 },
  { month: "May", foodSaved: 920, mealsServed: 2760 },
  { month: "Jun", foodSaved: 1100, mealsServed: 3300 },
  { month: "Jul", foodSaved: 1350, mealsServed: 4050 },
  { month: "Aug", foodSaved: 1200, mealsServed: 3600 },
  { month: "Sep", foodSaved: 1450, mealsServed: 4350 },
  { month: "Oct", foodSaved: 1600, mealsServed: 4800 },
  { month: "Nov", foodSaved: 1380, mealsServed: 4140 },
  { month: "Dec", foodSaved: 1700, mealsServed: 5100 },
];

export const MOCK_PROVIDER_GROWTH = [
  { month: "Jan", providers: 120 },
  { month: "Feb", providers: 180 },
  { month: "Mar", providers: 250 },
  { month: "Apr", providers: 340 },
  { month: "May", providers: 460 },
  { month: "Jun", providers: 580 },
  { month: "Jul", providers: 650 },
  { month: "Aug", providers: 720 },
  { month: "Sep", providers: 780 },
  { month: "Oct", providers: 830 },
  { month: "Nov", providers: 860 },
  { month: "Dec", providers: 892 },
];
