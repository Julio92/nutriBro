import type { Recipe, RecipeInput } from "./types";

export interface DefaultRecipeTemplate extends RecipeInput {
  key: string;
}

export interface DefaultRecipeLibraryEntry {
  key: string;
  recipe: Recipe;
}

export const DEFAULT_RECIPE_LIBRARY_VERSION = 1;

function recipeInstructions(...steps: string[]) {
  return steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
}

/**
 * Biblioteca inicial transcrita del plan semanal proporcionado por la persona
 * usuaria. Los alimentos servidos sin elaboración se mantienen fuera de esta
 * biblioteca para que cada receta tenga ingredientes e instrucciones útiles.
 */
export const DEFAULT_RECIPE_TEMPLATES: ReadonlyArray<DefaultRecipeTemplate> = [
  {
    key: "tostada-integral-con-tomate",
    name: "Tostada integral con tomate",
    description: "Tostada de pan integral de barra con tomate crudo.",
    instructions: recipeInstructions(
      "Tuesta el pan integral.",
      "Sirve el tomate crudo en rodajas sobre la tostada.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Pan integral de trigo", quantity: "70 g" },
      { name: "Tomate crudo", quantity: "55 g (3 rodajas)" },
    ],
    tags: [],
  },
  {
    key: "arroz-con-verduras",
    name: "Arroz con verduras",
    description: "Arroz blanco con alcachofa, judía verde y verduras salteadas.",
    instructions: recipeInstructions(
      "Limpia las alcachofas, retirando los troncos, las hojas duras y las puntas. Córtalas en cuartos y cuécelas en agua hirviendo. Resérvalas.",
      "Calienta el aceite en una cazuela y añade la cebolla pelada y muy picada, la zanahoria y las judías cortadas en trozos pequeños. Rehoga sin dejar de mover.",
      "Añade el tomate rallado y sofríe hasta que reduzca el agua que desprende.",
      "Incorpora el arroz y rehoga removiendo.",
      "Añade agua hirviendo y el azafrán. Cuece a fuego vivo 5 minutos y a fuego medio 15 minutos más.",
      "A media cocción, añade por encima las alcachofas cocidas y el pimiento rojo cortado en tiras.",
      "Deja reposar unos minutos antes de servir.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Arroz blanco crudo", quantity: "40 g (2 cucharadas soperas)" },
      { name: "Aceite de oliva", quantity: "5 g (1 cucharada de postre)" },
      { name: "Alcachofa / alcaucil", quantity: "50 g" },
      { name: "Cebolla o cebolleta", quantity: "30 g (1 trozo pequeño)" },
      { name: "Judía verde", quantity: "25 g" },
      { name: "Pimiento rojo", quantity: "20 g (2 rodajas)" },
      { name: "Tomate crudo", quantity: "30 g (2 rodajas)" },
      { name: "Zanahoria", quantity: "20 g (5 rodajas)" },
      { name: "Azafrán", quantity: "Cantidad no indicada" },
    ],
    tags: [],
  },
  {
    key: "pollo-al-curry-con-zanahorias",
    name: "Pollo al curry con zanahorias",
    description: "Pollo salteado con curry, jengibre y zanahoria en dados.",
    instructions: recipeInstructions(
      "Trocea el pollo en porciones no muy gruesas. Pela y corta la zanahoria en dados pequeños.",
      "Calienta una sartén amplia con el aceite, añade la zanahoria y rehoga unos minutos. Cuando empiece a estar tierna, añade el pollo y mézclalo hasta que tome color.",
      "Espolvorea el curry y el jengibre. Cocina a fuego suave, removiendo de vez en cuando, hasta que el pollo esté hecho.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Pollo, pechuga o solomillo", quantity: "200 g" },
      { name: "Curry", quantity: "2 g" },
      { name: "Jengibre", quantity: "2 g (al gusto)" },
      { name: "Zanahoria", quantity: "100 g (1 unidad grande)" },
      { name: "Aceite de oliva", quantity: "8 g (1 cucharada de postre)" },
    ],
    tags: [],
  },
  {
    key: "ensalada-de-maiz-guisantes-y-zanahoria",
    name: "Ensalada de maíz, guisantes y zanahoria",
    description: "Ensalada fría de zanahoria rallada, maíz y guisantes.",
    instructions: recipeInstructions(
      "Pela y ralla la zanahoria.",
      "Mezcla en un bol la zanahoria con el maíz y los guisantes escurridos.",
      "Sazona y aliña con el aceite de oliva.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Maíz dulce enlatado", quantity: "70 g (1/2 lata pequeña)" },
      { name: "Guisante fresco", quantity: "75 g (5 vainas)" },
      { name: "Zanahoria", quantity: "120 g" },
      { name: "Aceite de oliva", quantity: "10 g (1 cucharada sopera)" },
    ],
    tags: [],
  },
  {
    key: "pasta-de-lentejas-con-mozzarella",
    name: "Pasta de lentejas con mozzarella a las finas hierbas",
    description: "Pasta de lentejas salteada con hierbas, ajo y mozzarella fresca.",
    instructions: recipeInstructions(
      "Cuece la pasta en abundante agua con sal durante 12 minutos. Escúrrela y resérvala.",
      "Saltea el ajo laminado en una sartén con el aceite. Cuando empiece a dorarse, agrega las hierbas picadas y enseguida la pasta. Mezcla bien.",
      "Incorpora la mozzarella fresca troceada y remueve hasta que se funda.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Pasta de lentejas", quantity: "60 g" },
      { name: "Ajo", quantity: "5 g (1 diente)" },
      { name: "Perejil", quantity: "5 g (al gusto)" },
      { name: "Orégano", quantity: "5 g (al gusto)" },
      { name: "Albahaca", quantity: "5 g (al gusto)" },
      { name: "Aceite de oliva", quantity: "8 g (1 cucharada de postre)" },
      { name: "Mozzarella fresca light", quantity: "60 g (1/2 bola)" },
    ],
    tags: [],
  },
  {
    key: "chips-de-patata-al-horno",
    name: "Chips de patata al horno",
    description: "Rodajas finas de patata horneadas con aceite y pimienta.",
    instructions: recipeInstructions(
      "Pela la patata y córtala en rodajas muy finas con ayuda de una mandolina.",
      "Coloca las rodajas extendidas en una sola capa sobre una bandeja de horno. Adereza con pimienta y aceite de oliva.",
      "Hornea durante 15 minutos a 180 °C, hasta que estén doradas y crujientes.",
      "Añade especias o hierbas aromáticas al gusto si lo deseas.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Patata", quantity: "100 g (1 unidad pequeña)" },
      { name: "Aceite de oliva", quantity: "5 g (1 cucharada de postre)" },
      { name: "Pimienta negra", quantity: "1 g (al gusto)" },
    ],
    tags: [],
  },
  {
    key: "salmon-al-horno-con-tomillo-y-cherry",
    name: "Salmón al horno con tomillo y tomates cherry",
    description: "Lomo de salmón marinado con limón y tomillo, acompañado de tomates cherry.",
    instructions: recipeInstructions(
      "Prepara una marinada mezclando el zumo de limón con tomillo seco.",
      "Riega con la marinada el lomo de salmón limpio de espinas y déjalo reposar durante 40 minutos.",
      "Coloca el salmón en una bandeja de horno con los tomates cherry enteros. Añade la marinada y el aceite de oliva. Hornea a 180 °C durante 20 minutos.",
      "Sirve con los tomates cherry asados y espolvorea perejil picado.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Aceite de oliva", quantity: "5 g (1 cucharada de postre)" },
      { name: "Perejil", quantity: "3 g (al gusto)" },
      { name: "Tomate cherry", quantity: "50 g (5-6 unidades)" },
      { name: "Limón", quantity: "30 g (2 rodajas)" },
      { name: "Salmón", quantity: "120 g" },
      { name: "Tomillo", quantity: "2 g (al gusto)" },
    ],
    tags: [],
  },
  {
    key: "quinoa-con-setas",
    name: "Quinoa con setas",
    description: "Quinoa cocida con setas laminadas salteadas.",
    instructions: recipeInstructions(
      "Coloca la quinoa en un colador y lávala bajo agua fría durante medio minuto. Cuécela 15 minutos con el doble de agua que de quinoa y deja reposar.",
      "Saltea las setas laminadas en una sartén con el aceite hasta que se doren. Agrega la quinoa cocida y mezcla bien.",
      "Usa especias o hierbas aromáticas al gusto si lo deseas.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Quinoa", quantity: "40 g (1/2 vaso de 100 ml)" },
      { name: "Champiñón o seta", quantity: "50 g" },
      { name: "Aceite de oliva", quantity: "5 g (1 cucharada de postre)" },
    ],
    tags: [],
  },
  {
    key: "salteado-de-pavo-con-verduras-al-limon",
    name: "Salteado de pavo con verduras al limón",
    description: "Pavo marinado en limón, soja y miel con verduras salteadas.",
    instructions: recipeInstructions(
      "Mezcla el zumo de limón, la salsa de soja y la miel. Trocea la pechuga de pavo en tiras, mézclala con la marinada y déjala en la nevera al menos media hora.",
      "Corta el calabacín y el pimiento en tiras y la cebolla en juliana.",
      "Saca el pavo de la marinada y saltéalo en una sartén engrasada a fuego vivo hasta que esté dorado. Añade la cebolla, después el pimiento y continúa salteando.",
      "Agrega por último el calabacín y rehoga hasta obtener la textura deseada en las verduras.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Pavo, pechuga fresca", quantity: "150 g (1 filete mediano)" },
      { name: "Calabacín", quantity: "100 g (1 unidad pequeña)" },
      { name: "Cebolla blanca", quantity: "70 g (1 unidad pequeña)" },
      { name: "Pimiento rojo", quantity: "100 g (1/2 unidad mediana)" },
      { name: "Aceite de oliva", quantity: "10 g (1 cucharada sopera)" },
      { name: "Salsa de soja", quantity: "10 g" },
      { name: "Miel", quantity: "25 g (1 cucharada sopera)" },
      { name: "Zumo de limón", quantity: "100 g (1 vaso pequeño)" },
    ],
    tags: [],
  },
  {
    key: "tortilla-francesa-con-pavo",
    name: "Tortilla francesa con pavo",
    description: "Tortilla de huevo y claras pasteurizadas con pavo.",
    instructions: recipeInstructions(
      "Utiliza una cazuela de barro pequeña, de unos 20 cm de diámetro.",
      "Añade el huevo, las claras y el pavo cortado en trozos pequeños.",
      "Cuaja la mezcla en el microondas durante 3-4 minutos aproximadamente.",
      "Como alternativa, vierte la mezcla en una sartén caliente y cocina la tortilla hasta que cuaje.",
      "Las claras pasteurizadas pueden comprarse en envases de 300 ml, equivalentes a unas 10 claras.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Clara de huevo pasteurizada", quantity: "140 g (4 unidades)" },
      { name: "Pechuga de pavo (fiambre)", quantity: "125 g" },
      { name: "Huevo de gallina", quantity: "60 g (1 unidad talla M)" },
      { name: "Aceite de oliva", quantity: "8 g (1 cucharada de postre)" },
    ],
    tags: [],
  },
  {
    key: "ensalada-de-lentejas-mixta-con-maiz",
    name: "Ensalada de lentejas mixta con maíz",
    description: "Ensalada fría de lentejas cocidas, hortalizas y maíz.",
    instructions: recipeInstructions(
      "Escurre las lentejas en un colador, pásalas por agua fría y déjalas escurrir en una fuente.",
      "Lava y trocea la lechuga, el tomate y la cebolla. Ralla la zanahoria.",
      "Incorpora las hortalizas y el maíz escurrido a las lentejas.",
      "Aliña con el aceite de oliva en crudo, mezcla y sirve.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Aceite de oliva", quantity: "8 g (1 cucharada de postre)" },
      { name: "Cebolla o cebolleta", quantity: "30 g (1 trozo pequeño)" },
      { name: "Lechuga", quantity: "30 g (2 hojas grandes)" },
      { name: "Tomate crudo", quantity: "75 g (4 rodajas)" },
      { name: "Zanahoria", quantity: "40 g (1 unidad pequeña)" },
      { name: "Maíz dulce enlatado", quantity: "30 g (3 cucharadas soperas)" },
      { name: "Lentejas cocidas", quantity: "120 g" },
    ],
    tags: [],
  },
  {
    key: "lomo-adobado-con-champinones",
    name: "Lomo adobado a la plancha con champiñones",
    description: "Lomo adobado a la plancha con champiñones salteados.",
    instructions: recipeInstructions(
      "Asa los filetes de lomo adobado en una plancha caliente.",
      "Saltea con el aceite los champiñones cortados en cuartos.",
      "Sirve el lomo con los champiñones.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Aceite de oliva", quantity: "10 g (1 cucharada sopera)" },
      { name: "Champiñón o seta", quantity: "175 g (7 unidades medianas)" },
      { name: "Lomo adobado", quantity: "240 g (5 filetes)" },
    ],
    tags: [],
  },
  {
    key: "merluza-al-horno-con-espinacas",
    name: "Merluza al horno con espinacas",
    description: "Lomos de merluza horneados con espinacas y salsa de leche evaporada.",
    instructions: recipeInstructions(
      "Pocha en una cazuela apta para horno la cebolla picada fina junto con las espinacas.",
      "Cuando la cebolla empiece a dorarse, añade la leche evaporada y cocina 5 minutos hasta obtener una salsa.",
      "Agrega los lomos de merluza limpios de espinas y aliña con el aceite de oliva.",
      "Introduce la cazuela en el horno precalentado a 180 °C y asa durante 30 minutos.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Espinaca", quantity: "100 g (1 plato pequeño)" },
      { name: "Cebolla o cebolleta", quantity: "50 g (1/3 de cebolleta)" },
      { name: "Merluza", quantity: "150 g" },
      { name: "Aceite de oliva", quantity: "5 g (1 cucharada de postre)" },
      { name: "Leche evaporada", quantity: "75 g" },
    ],
    tags: [],
  },
  {
    key: "pasta-integral-de-espelta-con-tomate-y-albahaca",
    name: "Pasta integral de espelta con tomate y albahaca",
    description: "Pasta de espelta con salsa triturada de tomate, albahaca y ajo.",
    instructions: recipeInstructions(
      "Cuece la pasta integral de espelta en abundante agua hirviendo durante 10 minutos. Escúrrela y resérvala.",
      "Lava y seca la albahaca y pela el ajo. Tritura la albahaca, el ajo picado, el tomate troceado y la pimienta, incorporando poco a poco el aceite.",
      "Mezcla la pasta con la salsa y sirve.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Aceite de oliva", quantity: "10 g (1 cucharada sopera)" },
      { name: "Ajo", quantity: "5 g (1 diente)" },
      { name: "Pimienta negra", quantity: "2 g (al gusto)" },
      { name: "Tomate crudo", quantity: "150 g (1 tomate pequeño tipo raff)" },
      { name: "Albahaca", quantity: "5 g (al gusto)" },
      { name: "Pasta integral de espelta", quantity: "80 g (2 vasos pequeños de 100 ml)" },
    ],
    tags: [],
  },
  {
    key: "bocadillo-de-hummus-y-rucula",
    name: "Bocadillo de hummus y rúcula",
    description: "Bocadillo sencillo de pan, hummus y rúcula fresca.",
    instructions: recipeInstructions(
      "Unta el hummus en el pan.",
      "Coloca la rúcula encima y sirve.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Pan blanco", quantity: "40 g (1/5 de barra de 250 g)" },
      { name: "Hummus", quantity: "15 g (1 cucharada sopera)" },
      { name: "Rúcula", quantity: "10 g" },
    ],
    tags: [],
  },
  {
    key: "chips-de-boniato-al-horno",
    name: "Chips de boniato al horno",
    description: "Rodajas finas de boniato horneadas con aceite y pimienta.",
    instructions: recipeInstructions(
      "Lava el boniato, córtalo en rodajas muy finas y ponlo a remojo durante 10 minutos.",
      "Precalienta el horno a 220 °C.",
      "Engrasa una bandeja de horno y extiende las rodajas de boniato escurridas y secadas.",
      "Sazona con pimienta y hornea 10 minutos. Da la vuelta a las rodajas y hornea 10 minutos más, hasta que queden doradas y crujientes.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Boniato, camote o batata", quantity: "100 g (1 unidad pequeña)" },
      { name: "Aceite de oliva", quantity: "3 g (1 cucharada de café)" },
      { name: "Pimienta negra", quantity: "1 g (al gusto)" },
    ],
    tags: [],
  },
  {
    key: "pechuga-de-pavo-con-esparragos",
    name: "Pechuga de pavo a la plancha con espárragos verdes",
    description: "Pechuga de pavo a la plancha acompañada de espárragos verdes.",
    instructions: recipeInstructions(
      "Asa la pechuga de pavo a la plancha.",
      "Lava los espárragos, retira la parte leñosa y ásalos con el aceite de oliva.",
      "Sirve el pavo con los espárragos.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Aceite de oliva", quantity: "10 g (1 cucharada sopera)" },
      { name: "Espárrago", quantity: "150 g (10 espárragos)" },
      { name: "Pavo, pechuga fresca", quantity: "275 g" },
    ],
    tags: [],
  },
  {
    key: "pizza-fit-de-atun-cebolla-y-pimiento",
    name: "Pizza fit de atún, cebolla y pimiento",
    description: "Pizza rápida sobre fajita integral con atún, verduras y mozzarella.",
    instructions: recipeInstructions(
      "Utiliza la fajita integral como base de la pizza.",
      "Extiende el tomate triturado y añade la mozzarella, la cebolla en aros, el pimiento en tiras y el atún escurrido y desmenuzado.",
      "Hornea a 180 °C durante 10 minutos.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Fajita integral", quantity: "40 g (1 unidad)" },
      { name: "Tomate triturado natural", quantity: "75 g" },
      { name: "Queso mozzarella para gratinar", quantity: "45 g (1/4 de paquete de 200 g)" },
      { name: "Atún enlatado en agua", quantity: "75 g" },
      { name: "Cebolla o cebolleta", quantity: "30 g (1 trozo pequeño)" },
      { name: "Pimiento rojo", quantity: "50 g" },
    ],
    tags: [],
  },
  {
    key: "ensalada-de-tomate-con-ajo",
    name: "Ensalada de tomate con ajo",
    description: "Ensalada de tomate crudo aliñado con ajo y aceite de oliva.",
    instructions: recipeInstructions(
      "Lava y corta el tomate en trozos gruesos.",
      "Pica el ajo muy fino.",
      "Sirve el tomate, reparte el ajo por encima y aliña con el aceite de oliva.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Tomate crudo", quantity: "90 g (1 tomate pequeño tipo pera)" },
      { name: "Ajo", quantity: "5 g (1 diente)" },
      { name: "Aceite de oliva", quantity: "5 g (1 cucharada de postre)" },
    ],
    tags: [],
  },
  {
    key: "paella-valenciana",
    name: "Paella valenciana",
    description: "Arroz con pollo, conejo, judía verde y alcachofa.",
    instructions: recipeInstructions(
      "Pon el aceite en la paella y sofríe el pollo y el conejo troceados.",
      "Añade las judías verdes y la alcachofa troceadas y rehoga.",
      "Incorpora el tomate triturado, el ajo picado y el pimentón. Sofríe mezclando bien.",
      "Añade el arroz, mézclalo con el sofrito y cúbrelo con el doble de agua que de arroz.",
      "Cuando empiece a hervir, añade el azafrán.",
      "Cuece durante 20 minutos, apaga el fuego y deja reposar 5 minutos más.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Arroz blanco crudo", quantity: "70 g (1 vaso pequeño de 100 ml)" },
      { name: "Aceite de oliva", quantity: "8 g (1 cucharada de postre)" },
      { name: "Alcachofa / alcaucil", quantity: "65 g" },
      { name: "Ajo", quantity: "5 g (1 diente)" },
      { name: "Judía verde", quantity: "45 g (3 vainas)" },
      { name: "Tomate triturado natural", quantity: "45 g" },
      { name: "Conejo", quantity: "75 g" },
      { name: "Pollo, muslo o contramuslo", quantity: "100 g" },
      { name: "Pimentón", quantity: "2 g (al gusto)" },
      { name: "Azafrán", quantity: "Cantidad no indicada" },
    ],
    tags: [],
  },
  {
    key: "hamburguesa-de-pollo-con-lechuga-y-tomate",
    name: "Hamburguesa de pollo con lechuga y tomate",
    description: "Hamburguesa de pollo a la plancha con guarnición de lechuga y tomate.",
    instructions: recipeInstructions(
      "Asa la hamburguesa de pollo a la plancha.",
      "Lava y trocea la lechuga y el tomate. Aliña con el aceite de oliva.",
      "Sirve la hamburguesa con las hortalizas como guarnición.",
    ),
    imageUrl: "",
    ingredients: [
      { name: "Aceite de oliva", quantity: "5 g (1 cucharada de postre)" },
      { name: "Lechuga", quantity: "30 g (2 hojas grandes)" },
      { name: "Hamburguesa de pollo", quantity: "130 g (1 unidad)" },
      { name: "Tomate crudo", quantity: "45 g (3 rodajas)" },
    ],
    tags: [],
  },
];

/** Crea copias con identificadores y propiedad independientes para una cuenta. */
export function createDefaultRecipeLibrary(
  ownerId: string,
  now: Date,
  createId: () => string,
): DefaultRecipeLibraryEntry[] {
  const timestamp = now.toISOString();

  return DEFAULT_RECIPE_TEMPLATES.map((template) => ({
    key: template.key,
    recipe: {
      id: createId(),
      ownerId,
      name: template.name,
      description: template.description,
      instructions: template.instructions,
      imageUrl: null,
      ingredients: template.ingredients.map((ingredient) => ({
        id: createId(),
        name: ingredient.name,
        quantity: ingredient.quantity,
      })),
      tags: [...(template.tags ?? [])],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  }));
}
