import "dotenv/config";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { pathToFileURL } from "node:url";

const connectionString = process.env.POOLING_DATABASE_URL;
const seedPassword = "password";

if (!connectionString) {
  throw new Error("POOLING_DATABASE_URL is missing from your environment.");
}

const sql = postgres(connectionString, { max: 1 });

const seedUsers = [
  {
    username: "chef_alice",
    firstName: "Alice",
    lastName: "Baker",
    email: "alice@dishbox.com",
    recipes: [
      {
        title: "Classic Tomato Basil Pasta",
        description:
          "A simple Italian pasta with sweet tomatoes, garlic, and fresh basil.",
        portions: 4,
        ingredients: [
          "400g spaghetti",
          "500g cherry tomatoes",
          "3 cloves garlic",
          "1 bunch fresh basil",
          "3 tbsp olive oil",
        ],
        instructions: [
          "Boil the spaghetti in salted water until al dente.",
          "Sauté minced garlic and halved tomatoes in olive oil until soft.",
          "Toss the pasta with the tomatoes and a splash of pasta water.",
          "Finish with torn basil, salt, and pepper.",
        ],
        tags: ["vegetarian", "easy"],
      },
      {
        title: "Creamy Garlic Butter Salmon",
        description:
          "Pan-seared salmon served with a creamy garlic and spinach sauce.",
        portions: 2,
        ingredients: [
          "2 salmon fillets",
          "3 tbsp butter",
          "4 cloves garlic",
          "120ml cream",
          "2 handfuls spinach",
        ],
        instructions: [
          "Season and sear the salmon until golden and just cooked through.",
          "Melt the butter and gently cook the minced garlic.",
          "Stir in the cream and spinach and simmer until the spinach wilts.",
          "Return the salmon to the pan and spoon the sauce over it.",
        ],
        tags: ["fish"],
      },
      {
        title: "Chickpea Coconut Curry",
        description:
          "A warmly spiced chickpea curry simmered in coconut milk and tomatoes.",
        portions: 4,
        ingredients: [
          "2 cans chickpeas",
          "1 can coconut milk",
          "2 tbsp curry powder",
          "1 can diced tomatoes",
          "100g spinach",
        ],
        instructions: [
          "Sauté diced onion until soft, then add the curry powder.",
          "Stir in chickpeas, tomatoes, and coconut milk.",
          "Simmer gently for 20 minutes.",
          "Fold in the spinach and serve once wilted.",
        ],
        tags: ["vegan", "dairy-free", "easy"],
      },
      {
        title: "Avocado Toast with Poached Egg",
        description:
          "Toasted sourdough topped with lemony avocado and a soft poached egg.",
        portions: 2,
        ingredients: [
          "2 slices sourdough bread",
          "1 ripe avocado",
          "2 eggs",
          "1 tsp lemon juice",
          "A pinch of chilli flakes",
        ],
        instructions: [
          "Toast the sourdough until crisp.",
          "Mash avocado with lemon juice, salt, and pepper.",
          "Poach the eggs in gently simmering water.",
          "Spread avocado on toast and top with an egg and chilli flakes.",
        ],
        tags: ["vegetarian", "breakfast", "quick"],
      },
      {
        title: "Vegan Lentil Soup",
        description:
          "A hearty lentil soup with carrots, celery, cumin, and vegetable broth.",
        portions: 6,
        ingredients: [
          "200g brown lentils",
          "2 carrots",
          "2 celery stalks",
          "1 onion",
          "1 litre vegetable broth",
          "1 tsp cumin",
        ],
        instructions: [
          "Dice the vegetables and sauté them in olive oil until softened.",
          "Add lentils, cumin, and vegetable broth.",
          "Bring to a boil, then simmer for about 30 minutes.",
          "Season to taste and serve warm.",
        ],
        tags: ["vegan", "dairy-free", "gluten-free"],
      },
      {
        title: "Mushroom Risotto",
        description:
          "Creamy arborio rice with browned mushrooms, white wine, and parmesan.",
        portions: 4,
        ingredients: [
          "300g arborio rice",
          "300g mixed mushrooms",
          "1 litre vegetable broth",
          "100ml white wine",
          "50g parmesan",
        ],
        instructions: [
          "Brown the sliced mushrooms in olive oil, then set them aside.",
          "Toast the rice, add the wine, and stir until absorbed.",
          "Add warm broth a ladle at a time, stirring until the rice is creamy.",
          "Fold in the mushrooms and parmesan before serving.",
        ],
        tags: ["vegetarian"],
      },
      {
        title: "Tofu Veggie Stir-Fry",
        description:
          "Crispy tofu and colourful vegetables tossed in a ginger soy sauce.",
        portions: 3,
        ingredients: [
          "400g firm tofu",
          "1 head broccoli",
          "1 red bell pepper",
          "3 tbsp soy sauce",
          "1 tbsp sesame oil",
          "1 tsp grated ginger",
        ],
        instructions: [
          "Press and cube the tofu, then pan-fry until crisp.",
          "Stir-fry the broccoli and sliced pepper until tender-crisp.",
          "Add ginger, soy sauce, and sesame oil.",
          "Return the tofu to the pan and toss to coat.",
        ],
        tags: ["vegan", "dairy-free", "quick"],
      },
      {
        title: "Greek Lemon Roasted Potatoes",
        description:
          "Golden potato wedges roasted with lemon, garlic, and oregano.",
        portions: 4,
        ingredients: [
          "1kg potatoes",
          "80ml lemon juice",
          "80ml olive oil",
          "4 cloves garlic",
          "1 tbsp dried oregano",
        ],
        instructions: [
          "Cut the potatoes into wedges and place them in a baking dish.",
          "Whisk lemon juice, olive oil, crushed garlic, oregano, and salt.",
          "Pour the dressing over the potatoes and toss well.",
          "Roast at 200°C for 45 minutes until golden and tender.",
        ],
        tags: ["vegan", "gluten-free", "dairy-free"],
      },
      {
        title: "Caprese Salad Skewers",
        description:
          "Fresh mozzarella, cherry tomatoes, and basil finished with balsamic.",
        portions: 6,
        ingredients: [
          "20 cherry tomatoes",
          "20 mini mozzarella balls",
          "20 fresh basil leaves",
          "2 tbsp balsamic glaze",
        ],
        instructions: [
          "Thread a tomato, basil leaf, and mozzarella ball onto each skewer.",
          "Arrange the skewers on a serving plate.",
          "Drizzle with balsamic glaze just before serving.",
        ],
        tags: ["vegetarian", "quick"],
      },
      {
        title: "Overnight Chia Seed Pudding",
        description:
          "A make-ahead chia pudding with almond milk, maple syrup, and berries.",
        portions: 2,
        ingredients: [
          "80g chia seeds",
          "480ml almond milk",
          "2 tbsp maple syrup",
          "100g fresh berries",
        ],
        instructions: [
          "Whisk chia seeds, almond milk, and maple syrup together.",
          "Cover and refrigerate for at least 6 hours.",
          "Stir well and divide between bowls.",
          "Top with fresh berries.",
        ],
        tags: ["vegan", "dairy-free", "breakfast"],
      },
    ],
  },
  {
    username: "chef_bob",
    firstName: "Bob",
    lastName: "Cook",
    email: "bob@dishbox.com",
    recipes: [
      {
        title: "Classic Beef Tacos",
        description:
          "Seasoned beef tacos with crisp lettuce, cheddar, and salsa.",
        portions: 4,
        ingredients: [
          "500g ground beef",
          "8 taco shells",
          "1 tbsp taco seasoning",
          "100g shredded lettuce",
          "100g cheddar",
          "Salsa to serve",
        ],
        instructions: [
          "Brown the beef in a skillet and drain any excess fat.",
          "Add taco seasoning and a splash of water, then simmer.",
          "Warm the taco shells according to the package.",
          "Fill with beef, lettuce, cheddar, and salsa.",
        ],
        tags: ["meat", "easy"],
      },
      {
        title: "Grilled Chicken Caesar Salad",
        description:
          "Grilled chicken over crisp romaine with parmesan and Caesar dressing.",
        portions: 2,
        ingredients: [
          "2 chicken breasts",
          "1 head romaine lettuce",
          "50g parmesan",
          "100g croutons",
          "4 tbsp Caesar dressing",
        ],
        instructions: [
          "Season and grill the chicken until fully cooked, then slice.",
          "Chop the romaine and place it in a large bowl.",
          "Toss the lettuce with dressing, parmesan, and croutons.",
          "Top with sliced chicken and serve.",
        ],
        tags: ["meat", "easy"],
      },
      {
        title: "Honey Garlic Glazed Pork Chops",
        description:
          "Tender pork chops finished with a sweet honey, soy, and garlic glaze.",
        portions: 2,
        ingredients: [
          "2 pork chops",
          "2 tbsp honey",
          "2 tbsp soy sauce",
          "3 cloves garlic",
          "1 tbsp butter",
        ],
        instructions: [
          "Season the pork chops and sear until browned on both sides.",
          "Mix honey, soy sauce, and minced garlic.",
          "Add butter and the glaze to the pan.",
          "Simmer, turning the chops, until cooked through and glazed.",
        ],
        tags: ["meat", "quick"],
      },
      {
        title: "Crispy Baked Sweet Potato Fries",
        description:
          "Oven-baked sweet potato fries with paprika and a crisp coating.",
        portions: 3,
        ingredients: [
          "2 large sweet potatoes",
          "1 tbsp cornstarch",
          "2 tbsp olive oil",
          "1 tsp paprika",
          "Salt to taste",
        ],
        instructions: [
          "Cut the sweet potatoes into evenly sized fries.",
          "Toss with cornstarch, olive oil, paprika, and salt.",
          "Spread in a single layer on a lined baking tray.",
          "Bake at 220°C for 25 to 30 minutes, turning halfway.",
        ],
        tags: ["vegan", "gluten-free", "dairy-free"],
      },
      {
        title: "Shrimp Scampi Pasta",
        description:
          "Juicy shrimp and linguine in a lemon, garlic, and white wine sauce.",
        portions: 2,
        ingredients: [
          "300g shrimp",
          "250g linguine",
          "100ml white wine",
          "2 tbsp lemon juice",
          "2 tbsp chopped parsley",
          "2 tbsp butter",
        ],
        instructions: [
          "Boil the linguine in salted water until al dente.",
          "Sauté garlic and shrimp in butter until the shrimp turn pink.",
          "Add white wine and lemon juice and simmer briefly.",
          "Toss with the drained linguine and parsley.",
        ],
        tags: ["fish", "quick"],
      },
      {
        title: "Spicy Peanut Noodles",
        description:
          "Quick noodles tossed in a creamy peanut, soy, and chilli sauce.",
        portions: 2,
        ingredients: [
          "200g noodles",
          "3 tbsp peanut butter",
          "2 tbsp soy sauce",
          "1 tbsp chilli oil",
          "1 cucumber",
        ],
        instructions: [
          "Cook the noodles according to the package and drain.",
          "Whisk peanut butter, soy sauce, chilli oil, and warm water.",
          "Toss the noodles with the sauce.",
          "Top with sliced cucumber and serve.",
        ],
        tags: ["vegan", "quick"],
      },
      {
        title: "Classic Beef Chili",
        description:
          "A slow-simmered beef chilli with kidney beans and warming spices.",
        portions: 6,
        ingredients: [
          "700g ground beef",
          "2 cans kidney beans",
          "1 can crushed tomatoes",
          "2 tbsp chilli powder",
          "1 onion",
        ],
        instructions: [
          "Brown the beef with the diced onion in a large pot.",
          "Stir in crushed tomatoes, drained kidney beans, and chilli powder.",
          "Bring to a simmer and cook gently for 45 minutes.",
          "Season to taste and serve hot.",
        ],
        tags: ["meat", "gluten-free"],
      },
      {
        title: "BBQ Pulled Chicken Sandwiches",
        description:
          "Tender shredded chicken with tangy barbecue sauce and crunchy slaw.",
        portions: 4,
        ingredients: [
          "500g chicken breasts",
          "240ml BBQ sauce",
          "4 burger buns",
          "150g coleslaw",
        ],
        instructions: [
          "Poach the chicken until fully cooked, then shred it with two forks.",
          "Warm the shredded chicken with BBQ sauce in a pan.",
          "Toast the buns lightly.",
          "Fill each bun with chicken and coleslaw.",
        ],
        tags: ["meat", "bbq"],
      },
      {
        title: "Roasted Cauliflower Steaks",
        description:
          "Thick cauliflower slices roasted with garlic, turmeric, and olive oil.",
        portions: 2,
        ingredients: [
          "1 large cauliflower",
          "3 tbsp olive oil",
          "1 tsp garlic powder",
          "1/2 tsp turmeric",
          "Salt and pepper",
        ],
        instructions: [
          "Cut the cauliflower into thick steaks.",
          "Brush both sides with olive oil and season with garlic, turmeric, salt, and pepper.",
          "Roast at 200°C for 30 minutes, turning halfway.",
          "Serve once the edges are caramelized and the centre is tender.",
        ],
        tags: ["vegan", "dairy-free", "gluten-free"],
      },
      {
        title: "French Onion Soup",
        description:
          "Slow-caramelized onions in a rich broth with toasted cheesy bread.",
        portions: 4,
        ingredients: [
          "4 yellow onions",
          "1 litre vegetable broth",
          "150g gruyere cheese",
          "4 slices baguette",
          "2 tbsp butter",
        ],
        instructions: [
          "Slice the onions and cook slowly in butter until deeply golden.",
          "Add the broth and simmer for 20 minutes.",
          "Ladle into oven-safe bowls and top with toasted baguette and gruyere.",
          "Broil until the cheese is melted and bubbling.",
        ],
        tags: ["vegetarian"],
      },
    ],
  },
];

const seedStockItems = [
  { name: "Rice", metric: "g", quantity: 1000 },
  { name: "Pasta", metric: "g", quantity: 500 },
  { name: "Flour", metric: "g", quantity: 1000 },
  { name: "Sugar", metric: "g", quantity: 500 },
  { name: "Olive oil", metric: "ml", quantity: 500 },
  { name: "Salt", metric: "g", quantity: 250 },
  { name: "Black pepper", metric: "g", quantity: 100 },
  { name: "Canned tomatoes", metric: "can", quantity: 4 },
  { name: "Chickpeas", metric: "can", quantity: 3 },
  { name: "Coconut milk", metric: "can", quantity: 2 },
  { name: "Lentils", metric: "g", quantity: 750 },
  { name: "Vegetable broth", metric: "ml", quantity: 1000 },
  { name: "Garlic", metric: "piece", quantity: 2 },
  { name: "Onion", metric: "piece", quantity: 5 },
  { name: "Eggs", metric: "piece", quantity: 12 },
  { name: "Milk", metric: "ml", quantity: 1000 },
  { name: "Butter", metric: "g", quantity: 250 },
  { name: "Parmesan", metric: "g", quantity: 150 },
  { name: "Spinach", metric: "g", quantity: 300 },
  { name: "Potatoes", metric: "g", quantity: 1500 },
];

const availableImages = [
  "images1.jpg",
  "images2.jpg",
  "images3.webp",
  "images4.jpg",
  "images5.jpg",
];

if (
  seedUsers.length !== 2 ||
  seedUsers.some((user) => user.recipes.length !== 10) ||
  seedStockItems.length !== 20
) {
  throw new Error(
    "Database initialization requires two users with 10 recipes each and 20 stock items.",
  );
}

async function dbInitialize() {
  const seedTags = [
    ...new Set(
      seedUsers.flatMap((user) =>
        user.recipes.flatMap((recipe) => recipe.tags),
      ),
    ),
  ];

  await sql.begin(async (tx) => {
    const existingTags = await tx`
      SELECT value FROM dishBox.tags WHERE value = ANY(${seedTags}::text[])
    `;
    const existingTagValues = new Set(existingTags.map((tag) => tag.value));
    const missingTags = seedTags.filter((tag) => !existingTagValues.has(tag));

    if (missingTags.length > 0) {
      throw new Error(
        `Required recipe tags are missing: ${missingTags.join(", ")}`,
      );
    }

    const initializedUsers = [];
    let imageIndex = 0;

    for (const user of seedUsers) {
      const passwordHash = await bcrypt.hash(seedPassword, 12);
      const [createdUser] = await tx`
        INSERT INTO public."user" (user_name, first_name, last_name, email, password)
        VALUES (
          ${user.username},
          ${user.firstName},
          ${user.lastName},
          ${user.email},
          ${passwordHash}
        )
        ON CONFLICT (email) DO UPDATE SET
          user_name = EXCLUDED.user_name,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          password = EXCLUDED.password
        RETURNING id
      `;
      if (!createdUser) {
        throw new Error(`Failed to initialize sample user ${user.username}.`);
      }
      initializedUsers.push(createdUser);

      for (const recipe of user.recipes) {
        const [existingRecipe] = await tx`
          SELECT id FROM dishBox.recipes
          WHERE user_id = ${createdUser.id} AND title = ${recipe.title}
          LIMIT 1
        `;

        const [savedRecipe] = existingRecipe
          ? await tx`
              UPDATE dishBox.recipes SET
                description = ${recipe.description},
                portions = ${recipe.portions},
                ingredients = ${tx.json(recipe.ingredients)},
                instructions = ${tx.json(recipe.instructions)},
                public = true
              WHERE id = ${existingRecipe.id}
              RETURNING id
            `
          : await tx`
              INSERT INTO dishBox.recipes (
                title, description, portions, ingredients, instructions, user_id, public
              )
              VALUES (
                ${recipe.title},
                ${recipe.description},
                ${recipe.portions},
                ${tx.json(recipe.ingredients)},
                ${tx.json(recipe.instructions)},
                ${createdUser.id},
                true
              )
              RETURNING id
            `;
        if (!savedRecipe) {
          throw new Error(`Failed to initialize recipe "${recipe.title}".`);
        }

        await tx`DELETE FROM dishBox.recipe_tags WHERE recipe_id = ${savedRecipe.id}`;
        const insertedTags = await tx`
          INSERT INTO dishBox.recipe_tags (recipe_id, tag_id)
          SELECT ${savedRecipe.id}, id
          FROM dishBox.tags
          WHERE value = ANY(${recipe.tags}::text[])
          RETURNING tag_id
        `;

        if (insertedTags.length !== recipe.tags.length) {
          throw new Error(
            `Failed to assign all tags to recipe "${recipe.title}".`,
          );
        }

        const imageName = availableImages[imageIndex % availableImages.length];
        const imageUrl = `/myRecipes/images/public/${imageName}`;
        imageIndex += 1;

        await tx`DELETE FROM dishBox.recipe_images WHERE recipe_id = ${savedRecipe.id}`;
        await tx`
          INSERT INTO dishBox.recipe_images (recipe_id, image_url, img_storage_type)
          VALUES (${savedRecipe.id}, ${imageUrl}, 'local')
        `;
      }
    }

    const stockItemIds = [];
    const stockItemOwnerId = initializedUsers[0].id;
    for (const item of seedStockItems) {
      const [existingItem] = await tx`
        SELECT id
        FROM stockbox.stock_items
        WHERE user_id = ${stockItemOwnerId}
          AND name = ${item.name}
          AND public = true
        LIMIT 1
      `;

      const [savedItem] = existingItem
        ? await tx`
            UPDATE stockbox.stock_items
            SET metric = ${item.metric}, public = true
            WHERE id = ${existingItem.id}
            RETURNING id
          `
        : await tx`
            INSERT INTO stockbox.stock_items (user_id, name, metric, public)
            VALUES (${stockItemOwnerId}, ${item.name}, ${item.metric}, true)
            RETURNING id
          `;

      if (!savedItem) {
        throw new Error(`Failed to initialize stock item "${item.name}".`);
      }
      stockItemIds.push(savedItem.id);
    }

    for (const [userIndex, user] of initializedUsers.entries()) {
      const firstItemIndex = userIndex * 10;
      for (
        let index = firstItemIndex;
        index < firstItemIndex + 10;
        index += 1
      ) {
        const item = seedStockItems[index];
        const stockItemId = stockItemIds[index];
        const [existingBatch] = await tx`
          SELECT id
          FROM stockbox.stock_batches
          WHERE user_id = ${user.id}
            AND stock_item_id = ${stockItemId}
          LIMIT 1
        `;

        const [savedBatch] = existingBatch
          ? await tx`
              UPDATE stockbox.stock_batches
              SET quantity = ${item.quantity},
                  expire_date = NOW() + INTERVAL '90 days'
              WHERE id = ${existingBatch.id}
              RETURNING id
            `
          : await tx`
              INSERT INTO stockbox.stock_batches (
                user_id, stock_item_id, quantity, expire_date
              )
              VALUES (
                ${user.id},
                ${stockItemId},
                ${item.quantity},
                NOW() + INTERVAL '90 days'
              )
              RETURNING id
            `;

        if (!savedBatch) {
          throw new Error(
            `Failed to initialize stock batch for user ${user.id}.`,
          );
        }
      }
    }
  });

  for (const user of seedUsers) {
    console.log(
      `Initialized ${user.recipes.length} recipes for ${user.username}.`,
    );
  }
  console.log(
    `Initialized ${seedStockItems.length} public stock items and 10 batches per user.`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    await dbInitialize();
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

export { dbInitialize };
