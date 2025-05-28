export interface Cocktail {
    name: string;
    country: string;
    ingredients: string[];
    instructions: string;
}

export const cocktails: Cocktail[] = [
    {
        name: "Mojito",
        country: "Cuba",
        ingredients: [
            "60ml de rhum blanc",
            "30ml de jus de citron vert",
            "2 cuillères à café de sucre",
            "6-8 feuilles de menthe",
            "Eau gazeuse",
            "Glaçons"
        ],
        instructions: "Écraser la menthe avec le sucre et le jus de citron. Ajouter le rhum et les glaçons. Compléter avec l'eau gazeuse. Mélanger délicatement."
    },
    {
        name: "Margarita",
        country: "Mexico",
        ingredients: [
            "50ml de tequila",
            "25ml de triple sec",
            "25ml de jus de citron vert",
            "Sel",
            "Glaçons"
        ],
        instructions: "Frotter le bord du verre avec du citron et du sel. Mélanger tous les ingrédients avec des glaçons. Filtrer dans un verre à margarita."
    },
    {
        name: "Martini",
        country: "United Kingdom",
        ingredients: [
            "60ml de gin",
            "10ml de vermouth sec",
            "Zeste de citron ou olive"
        ],
        instructions: "Mélanger le gin et le vermouth avec de la glace. Filtrer dans un verre à martini. Garnir d'un zeste de citron ou d'une olive."
    },
    {
        name: "Saké Martini",
        country: "Japan",
        ingredients: [
            "45ml de saké",
            "15ml de gin",
            "Quelques gouttes de yuzu"
        ],
        instructions: "Mélanger le saké et le gin avec de la glace. Filtrer dans un verre à martini. Ajouter quelques gouttes de yuzu."
    }
]; 