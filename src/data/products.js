// Catalogo de capsulas de cafe de Origen.
// Cada "producto" representa una caja de 10 capsulas compatibles con maquinas tipo Nespresso.

export const products = [
  {
    id: 1,
    name: "Ristretto Forte",
    price: 5990,
    description:
      "Caja de 10 capsulas. Tueste oscuro y alta intensidad. Cuerpo robusto con notas de cacao amargo y madera. Pensado para amantes del espresso fuerte y corto.",
    category: "Intenso",
    image:
      "https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=800&q=80",
    stock: 50,
  },
  {
    id: 2,
    name: "Espresso Italiano",
    price: 5490,
    description:
      "Caja de 10 capsulas. Mezcla clasica italiana con notas de cacao y frutos secos. Crema densa y dorada. Ideal para el espresso de todos los dias.",
    category: "Intenso",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    stock: 60,
  },
  {
    id: 3,
    name: "Colombia Supremo",
    price: 7990,
    description:
      "Caja de 10 capsulas. Cafe de origen unico de Colombia, cultivado en altura. Cuerpo balanceado, acidez media y notas frutales de panela y caramelo.",
    category: "Intenso",
    image:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
    stock: 35,
  },
  {
    id: 4,
    name: "Brasil Santos Reserva",
    price: 9990,
    description:
      "Caja de 10 capsulas. Origen Brasil, cuerpo cremoso con notas de chocolate con leche, nuez y un final dulce. Excelente con leche.",
    category: "Intenso",
    image:
      "https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=800&q=80",
    stock: 30,
  },
  {
    id: 5,
    name: "Lungo Crema",
    price: 4990,
    description:
      "Caja de 10 capsulas. Tueste medio pensado para tazas largas (110 ml). Crema persistente, cuerpo medio y notas de cereal tostado.",
    category: "Suave",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    stock: 70,
  },
  {
    id: 6,
    name: "Cafe con Leche",
    price: 4990,
    description:
      "Caja de 10 capsulas. Tueste suave optimizado para mezclar con leche. Notas dulces, baja amargura, perfecto para el desayuno.",
    category: "Suave",
    image:
      "https://images.unsplash.com/photo-1542181961-9590d0c79dab?w=800&q=80",
    stock: 80,
  },
  {
    id: 7,
    name: "Etiopia Yirgacheffe",
    price: 11990,
    description:
      "Caja de 10 capsulas. Origen unico de Etiopia. Tueste claro con notas florales, citricas y un final limpio. Acidez delicada estilo barista.",
    category: "Suave",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    stock: 25,
  },
  {
    id: 8,
    name: "Descafeinado Premium",
    price: 5990,
    description:
      "Caja de 10 capsulas. Sin cafeina por proceso de agua (Swiss Water). Conserva el cuerpo y los aromas del cafe. Sabor pleno sin estimulantes.",
    category: "Descafeinado",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
    stock: 40,
  },
  {
    id: 9,
    name: "Descafeinado Lungo",
    price: 5490,
    description:
      "Caja de 10 capsulas. Cuerpo medio sin cafeina pensado para taza larga. Ideal de noche o despues de cenar.",
    category: "Descafeinado",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80",
    stock: 45,
  },
  {
    id: 10,
    name: "Vainilla Dolce",
    price: 5990,
    description:
      "Caja de 10 capsulas. Espresso saborizado con vainilla natural. Dulzor sutil, sin azucar agregada. Excelente para postres.",
    category: "Saborizado",
    image:
      "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80",
    stock: 55,
  },
  {
    id: 11,
    name: "Caramelo Macchiato",
    price: 5990,
    description:
      "Caja de 10 capsulas. Notas de caramelo tostado y mantequilla. Cuerpo cremoso y final largo. Perfecto con un toque de leche.",
    category: "Saborizado",
    image:
      "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800&q=80",
    stock: 50,
  },
  {
    id: 12,
    name: "Avellana Tostada",
    price: 5990,
    description:
      "Caja de 10 capsulas. Espresso con avellana natural tostada. Aroma envolvente, ideal de media tarde con un alfajor o medialuna.",
    category: "Saborizado",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
    stock: 45,
  },
];

export const categories = [
  "Intenso",
  "Suave",
  "Descafeinado",
  "Saborizado",
];

// Helpers para obtener productos.
export function getProductById(id) {
  return products.find((p) => p.id === Number(id));
}

export function getRelatedProducts(productId, category, limit = 4) {
  return products
    .filter((p) => p.id !== Number(productId) && p.category === category)
    .slice(0, limit);
}
