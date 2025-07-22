import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { ShoppingCart, Eye, Edit, FileText, Trash2, X } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { toast } from 'sonner';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [appSettings, setAppSettings] = useState(null);
  const { getOrders, updateOrder, deleteOrder, getAppSettings } = useSupabase();

  useEffect(() => {
    loadOrders();
    loadAppSettings();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const loadAppSettings = async () => {
    const settings = await getAppSettings();
    if (settings) {
      setAppSettings(settings);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price || 0).toFixed(2)}`;
  };

  // حساب المجموع الجزئي (سعر المنتجات فقط)
  const calculateSubtotal = (orderItems) => {
    if (!orderItems || !Array.isArray(orderItems)) return 0;
    return orderItems.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
  };

  // الحصول على تكلفة التوصيل
  const getDeliveryCost = () => {
    return appSettings?.delivery_cost || 0;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      toast.success('تم تحديث حالة الطلب بنجاح');
      setEditingStatus(null);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('فشل في تحديث حالة الطلب');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await deleteOrder(orderId);
        toast.success('تم حذف الطلب بنجاح');
        loadOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('فشل في حذف الطلب');
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const OrderDetailsModal = () => {
    if (!showDetails || !selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">تفاصيل الطلب #{selectedOrder.id?.slice(0, 8)}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">اسم العميل</p>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white break-words">{selectedOrder.customer_name || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">رقم الهاتف</p>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedOrder.phone || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">طريقة الدفع</p>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedOrder.payment_method || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">الحالة</p>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status || 'pending'}
                </Badge>
              </div>
            </div>
            
            {selectedOrder.address && (
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">عنوان التوصيل</p>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white break-words">{selectedOrder.address}</p>
              </div>
            )}

            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">عناصر الطلب</p>
              <div className="space-y-2">
                {selectedOrder.order_items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        الكمية: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{formatPrice(item.quantity * item.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
              <div className="space-y-2">
                {/* المجموع الجزئي */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">مجموع المنتجات:</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(calculateSubtotal(selectedOrder.order_items))}</span>
                </div>
                
                {/* تكلفة التوصيل */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">تكلفة التوصيل:</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(getDeliveryCost())}</span>
                </div>
                
                {/* خط فاصل */}
                <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                
                {/* المجموع الكلي */}
                <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">المجموع الكلي:</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">Manage customer orders and track their status</p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No orders found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Orders will appear here once customers start placing them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Order #{order.id?.slice(0, 8)}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-3">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status || 'pending'}
                    </Badge>
                    <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Customer</p>
                    <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                      {order.customer_name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                      {order.phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                      {order.payment_method || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Items</p>
                    <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                      {order.order_items?.length || 0} items
                    </p>
                  </div>
                </div>

                {/* ملخص الأسعار */}
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center text-xs sm:text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">مجموع المنتجات:</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(calculateSubtotal(order.order_items))}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">تكلفة التوصيل:</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(getDeliveryCost())}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-1">
                    <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                      <span className="text-gray-900 dark:text-white">الإجمالي:</span>
                      <span className="text-gray-900 dark:text-white">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {order.address && (
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Address</p>
                    <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 break-words">{order.address}</p>
                  </div>
                )}

                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Items</p>
                    <div className="space-y-2">
                      {order.order_items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.order_items.length > 2 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          +{order.order_items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                    className="flex-1 sm:flex-none"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">عرض التفاصيل</span>
                    <span className="sm:hidden">عرض</span>
                  </Button>
                  
                  {editingStatus === order.id ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-1"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="processing">قيد المعالجة</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="delivered">تم التوصيل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingStatus(null)}
                        className="flex-1 sm:flex-none"
                      >
                        إلغاء
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingStatus(order.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">تعديل الحالة</span>
                      <span className="sm:hidden">تعديل</span>
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">حذف</span>
                    <span className="sm:hidden">حذف</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <OrderDetailsModal />
    </div>
  );
}

