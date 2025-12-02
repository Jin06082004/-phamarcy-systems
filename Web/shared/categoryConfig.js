/**
 * Cấu hình ánh xạ category_id sang trang tương ứng
 * Tất cả 10 categories đều có trang riêng
 */

export const categoryPageMap = {
  1: {
    url: '/Web/user/pages/pain-relief.html',
    name: 'Giảm đau - Hạ sốt',
    icon: '💊'
  },
  2: {
    url: '/Web/user/pages/antibiotics.html',
    name: 'Kháng sinh',
    icon: '💉'
  },
  3: {
    url: '/Web/user/pages/vitamins.html',
    name: 'Vitamin & Khoáng chất',
    icon: '🍊'
  },
  4: {
    url: '/Web/user/pages/digestive.html',
    name: 'Tiêu hóa',
    icon: '🍵'
  },
  5: {
    url: '/Web/user/pages/cold-flu.html',
    name: 'Cảm cúm - Dị ứng',
    icon: '🤧'
  },
  6: {
    url: '/Web/user/pages/products.html',
    name: 'Thực phẩm chức năng',
    icon: '🌿'
  },
  7: {
    url: '/Web/user/pages/personal-care.html',
    name: 'Chăm sóc cá nhân',
    icon: '🧴'
  },
  8: {
    url: '/Web/user/pages/mom-baby.html',
    name: 'Mẹ & Bé',
    icon: '👶'
  },
  9: {
    url: '/Web/user/pages/cardiovascular.html',
    name: 'Tim mạch - Huyết áp',
    icon: '❤️'
  },
  10: {
    url: '/Web/user/pages/stomach.html',
    name: 'Dạ dày - Đường ruột',
    icon: '🩺'
  }
};

/**
 * Kiểm tra xem category có trang riêng hay không
 */
export function hasPage(categoryId) {
  return !!categoryPageMap[categoryId];
}

/**
 * Lấy URL của trang category
 */
export function getPageUrl(categoryId) {
  return categoryPageMap[categoryId]?.url || '/Web/user/pages/drugs.html';
}

/**
 * Lấy danh sách categories có trang
 */
export function getCategoriesWithPages() {
  return Object.keys(categoryPageMap).map(Number);
}
