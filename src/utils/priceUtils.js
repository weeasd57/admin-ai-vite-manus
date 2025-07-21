/**
 * تحويل قيمة السعر إلى رقم بدقة عشرية صحيحة
 * @param {string|number} price - قيمة السعر
 * @returns {number} - السعر المحول بدقة عشرية من رقمين
 */
export function parsePrice(price) {
  if (!price || price === '') return 0;
  
  // تحويل إلى string أولاً للتعامل مع الأرقام والنصوص
  const priceStr = String(price).trim();
  
  // إزالة أي رموز عملة أو فواصل
  const cleanedPrice = priceStr.replace(/[^0-9.-]/g, '');
  
  // تحويل إلى رقم عشري
  const numericPrice = parseFloat(cleanedPrice);
  
  // التحقق من صحة الرقم
  if (isNaN(numericPrice) || numericPrice < 0) {
    return 0;
  }
  
  // تقريب إلى رقمين عشريين وإعادة التحويل إلى رقم لضمان الدقة
  return Math.round(numericPrice * 100) / 100;
}

/**
 * تنسيق السعر للعرض
 * @param {number} price - السعر
 * @param {string} currency - رمز العملة (افتراضي: USD)
 * @returns {string} - السعر منسق للعرض
 */
export function formatPrice(price, currency = 'USD') {
  if (!price || isNaN(price)) return '0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * التحقق من صحة السعر
 * @param {string|number} price - السعر للتحقق منه
 * @returns {boolean} - true إذا كان السعر صحيحاً
 */
export function isValidPrice(price) {
  if (!price || price === '') return false;
  
  const numericPrice = parseFloat(String(price).trim());
  return !isNaN(numericPrice) && numericPrice >= 0;
}

/**
 * تحويل السعر إلى تنسيق قاعدة البيانات
 * @param {string|number} price - السعر
 * @returns {number|null} - السعر للحفظ في قاعدة البيانات
 */
export function toDatabasePrice(price) {
  if (!price || price === '') return null;
  
  const parsedPrice = parsePrice(price);
  return parsedPrice > 0 ? parsedPrice : null;
}
