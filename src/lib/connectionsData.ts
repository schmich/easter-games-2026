export interface ConnectionsGroup {
  category: string;
  words: string[];
  difficulty: 0 | 1 | 2 | 3;
}

export interface ConnectionsPuzzle {
  groups: [ConnectionsGroup, ConnectionsGroup, ConnectionsGroup, ConnectionsGroup];
}

export const PUZZLE: ConnectionsPuzzle = {
  groups: [
    {
      category: "Egg ____",
      words: ["NOG", "SHELL", "HEAD", "PLANT"],
      difficulty: 0,
    },
    {
      category: "Easter Symbols",
      words: ["BUNNY", "LAMB", "LILY", "CROSS"],
      difficulty: 1,
    },
    {
      category: "Animals That Hatch from Eggs",
      words: ["CHICK", "TURTLE", "ROBIN", "CRICKET"],
      difficulty: 2,
    },
    {
      category: "____ Basket",
      words: ["BREAD", "LAUNDRY", "WASTE", "PICNIC"],
      difficulty: 3,
    },
  ],
};
