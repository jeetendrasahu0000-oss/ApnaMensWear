const categoryCards = [
  {
    value: "jacket",
    name: "Jackets",
    image: "https://i.pinimg.com/1200x/00/cc/6f/00cc6ff38505b285768a9186e1535c71.jpg",
  },
  {
    value: "hoddie",
    name: "Hoodies",
    image: "https://i.pinimg.com/736x/78/20/b5/7820b5a56263da0b711ddff972bd4533.jpg",
  },
  {
    value: "jens",
    name: "Jeans",
    image: "https://i.pinimg.com/736x/32/c5/cc/32c5ccc87b7f640ae12d5a40005c5557.jpg",
  },
  {
    value: "Shirt",
    name: "Shirts",
    image: "https://i.pinimg.com/736x/44/e6/7b/44e67b93fe192737d556aa8192c9139d.jpg",
  },
  {
    value: "T-shirts",
    name: "T-Shirts",
    image: "https://i.pinimg.com/736x/88/4b/3a/884b3ad72513070241246775b3d5e1d3.jpg",
  },
  {
    value: "Men",
    name: "Men",
    image: "https://i.pinimg.com/736x/e0/7b/b9/e07bb9963ff5b7191c438117d411f284.jpg",
  },
];

const categories = categoryCards.map(({ value }) => value);

function GetCategories() {
  return categories;
}

function GetCategoryCards() {
  return categoryCards;
}

export { GetCategories, GetCategoryCards };
