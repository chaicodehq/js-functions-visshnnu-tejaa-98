/**
 * 🍱 Mumbai Tiffin Service - Plan Builder
 *
 * Mumbai ki famous tiffin delivery service hai. Customer ka plan banana hai
 * using destructuring parameters aur rest/spread operators.
 *
 * Functions:
 *
 *   1. createTiffinPlan({ name, mealType = "veg", days = 30 })
 *      - Destructured parameter with defaults!
 *      - Meal prices per day: veg=80, nonveg=120, jain=90
 *      - Agar mealType unknown hai, return null
 *      - Agar name missing/empty, return null
 *      - Return: { name, mealType, days, dailyRate, totalCost }
 *
 *   2. combinePlans(...plans)
 *      - Rest parameter! Takes any number of plan objects
 *      - Each plan: { name, mealType, days, dailyRate, totalCost }
 *      - Return: { totalCustomers, totalRevenue, mealBreakdown }
 *      - mealBreakdown: { veg: count, nonveg: count, ... }
 *      - Agar koi plans nahi diye, return null
 *
 *   3. applyAddons(plan, ...addons)
 *      - plan: { name, mealType, days, dailyRate, totalCost }
 *      - Each addon: { name: "raita", price: 15 }
 *      - Add each addon price to dailyRate
 *      - Recalculate totalCost = new dailyRate * days
 *      - Return NEW plan object (don't modify original)
 *      - addonNames: array of addon names added
 *      - Agar plan null hai, return null
 *
 * Hint: Use { destructuring } in params, ...rest for variable args,
 *   spread operator for creating new objects
 *
 * @example
 *   createTiffinPlan({ name: "Rahul" })
 *   // => { name: "Rahul", mealType: "veg", days: 30, dailyRate: 80, totalCost: 2400 }
 *
 *   combinePlans(plan1, plan2, plan3)
 *   // => { totalCustomers: 3, totalRevenue: 7200, mealBreakdown: { veg: 2, nonveg: 1 } }
 */
export function createTiffinPlan({ name, mealType = "veg", days = 30 } = {}) {
  // Your code here
  let mealTypes = {
    veg: 80,
    nonveg: 120,
    jain: 90,
  };

  if (!Object.keys(mealTypes).includes(mealType)) return null;
  if (!name) return null;
  return {
    name,
    mealType,
    days,
    dailyRate: mealTypes[mealType],
    totalCost: mealTypes[mealType] * days,
  };
}

export function combinePlans(...plans) {
  // Your code here
  const res = {
    totalCustomers: 0,
    totalRevenue: 0,
  };

  let totalPlans = [...plans];

  if (totalPlans.length === 0) return null;

  let veg = 0;
  let nonveg = 0;
  let jain = 0;

  for (let i = 0; i < totalPlans.length; i++) {
    let plan = totalPlans[i];
    res.totalCustomers++;
    res.totalRevenue += plan.totalCost;
    if (plan.mealType === "veg") veg++;
    if (plan.mealType === "nonveg") nonveg++;
    if (plan.mealType === "jain") jain++;
  }
  return {
    totalCustomers: res.totalCustomers,
    totalRevenue: res.totalRevenue,
    mealBreakdown: {
      veg,
      nonveg,
      jain,
    },
  };
}

export function applyAddons(plan, ...addons) {
  if (!plan || typeof plan !== "object") return null;

  const { name, mealType, days, dailyRate, totalCost } = plan;

  let extraCostPerDay = 0;
  let addonNames = [];

  for (let i = 0; i < addons.length; i++) {
    const addon = addons[i];

    if (!addon || typeof addon.price !== "number") continue;

    extraCostPerDay += addon.price;
    addonNames.push(addon.name);
  }

  const newDailyRate = dailyRate + extraCostPerDay;

  return {
    name,
    mealType,
    days,
    dailyRate: newDailyRate,
    totalCost: newDailyRate * days,
    addonNames,
  };
}
