import {ResolveFn} from '@angular/router';
import {Category} from '../../interfaces/category';

export const catalogResolver: ResolveFn<{
  categories: Array<Category>
}> = (route, _) => {

  const categoryId = route?.paramMap?.get('categoryId');

  const categories = [
    {
      name: 'Vinos Tintos',
      url: 'vinos-tintos',
      products: [
        {
          name: 'Catena Zapata Malbec Argentino 750ml',
          price: 95000,
          images: [
            {
              id: '123',
              url: 'https://acdn-us.mitiendanube.com/stores/001/384/985/products/malbec-argentino-20181-fd1b245d8f8a86f20f16642039177680-640-0.jpg',
              alt: 'Catena Zapata Malbec Argentino 750ml'
            }
          ],
          id: '124',
          description: 'Un vinito',
          discount: 10
        },
        {
          name: 'Birth of Cabernet Catena Zapata 750ml',
          price: 100000,
          images: [
            {
              id: '123',
              url: 'https://acdn-us.mitiendanube.com/stores/001/384/985/products/diseno-sin-titulo-19-1dcee8682854e6f50c17289160570710-1024-1024-2353278e0037c38cdf17290986542324-640-0.webp',
              alt: 'Birth of Cabernet Catena Zapata 750ml'
            }
          ],
          id: '124',
          description: 'Un vinito',
          discount: 5
        }
      ]
    },
    {
      name: 'Vinos Blancos',
      url: 'vinos-blancos',
      products: [
        {
          name: 'Santa Julia Tardio 750ml',
          price: 9500,
          images: [
            {
              id: '123',
              url: 'https://dcdn-us.mitiendanube.com/stores/001/170/302/products/santa-julia-tardio1-fe2086d36b6bd6779516722407201237-480-0.png',
              alt: 'Santa Julia Tardio 750ml'
            }
          ],
          id: '124',
          description: 'Un vinito',
          discount: 0
        }
      ]
    }
  ];

  console.log(categoryId ? categories.filter((category => category.url === categoryId)) : categories);

  return {
    categories: categoryId ? categories.filter((category => category.url === categoryId)) : categories
  }
};
