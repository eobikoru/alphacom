import { AppLayout } from "@/components/app-layout"
import { generateMetadata } from "@/components/seo/seo-head"
import { OrderSchema } from "@/components/seo/ecommerce-schema"

export const metadata = generateMetadata({
  title: "Order Confirmation | Premium Store",
  description: "Thank you for your order! Your purchase has been confirmed and will be processed shortly.",
  url: "/order-confirmation",
  noIndex: true,
  noFollow: true,
})

export default function OrderConfirmationPage() {
  // In a real app, this would come from the order data
  const orderData = {
    orderId: "ORD-2024-001",
    orderDate: new Date().toISOString(),
    orderStatus: "OrderProcessing",
    customer: {
      name: "John Doe",
      email: "john@example.com",
    },
    items: [
      { name: "Premium Laptop", price: 1299, quantity: 1 },
      { name: "Wireless Mouse", price: 79, quantity: 2 },
    ],
    total: 1457,
    currency: "USD",
    shippingAddress: {
      "@type": "PostalAddress",
      streetAddress: "123 Main St",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10001",
      addressCountry: "US",
    },
    billingAddress: {
      "@type": "PostalAddress",
      streetAddress: "123 Main St",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10001",
      addressCountry: "US",
    },
  }

  return (
    <>
      <OrderSchema {...orderData} />
      <AppLayout>
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
                <p className="text-xl text-gray-600 mb-6">
                  Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Details</h2>
                  <p className="text-gray-600">
                    Order Number: <span className="font-mono font-semibold">{orderData.orderId}</span>
                  </p>
                  <p className="text-gray-600">
                    Total: <span className="font-semibold">${orderData.total}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  )
}
