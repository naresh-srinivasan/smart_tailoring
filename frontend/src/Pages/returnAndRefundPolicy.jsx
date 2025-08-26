
import {
  FaBox,
  FaMoneyBillWave,
  FaUndoAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function ReturnRefund() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Return & Refund Policy
        </h1>
        <p className="text-gray-700">
          At <strong>Weave Nest</strong>, customer satisfaction is our top priority. 
          If you are not completely satisfied with your purchase, our Return & Refund Policy ensures a smooth and transparent process.
        </p>
      </div>

      {/* Returns Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start bg-gray-50 p-6 rounded-lg">
        <FaUndoAlt className="text-indigo-600 w-12 h-12 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Returns</h2>
          <div className="space-y-2 text-gray-700">
            <div>
              <strong>Eligibility:</strong> Items must be unused, unwashed, and in the original packaging. Returns must be initiated within <strong>14 days</strong> of receiving your order.
            </div>
            <div>
              <strong>Process:</strong>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Contact our Customer Support at <strong>support@weavenest.com</strong> or <strong>+91 8428343762</strong>.</li>
                <li>Provide your <strong>order number</strong> and reason for return.</li>
                <li>We will provide a <strong>return authorization</strong> and shipping instructions.</li>
              </ol>
            </div>
            <div>
              <strong>Exclusions:</strong> Customized or tailor-made items are non-returnable unless defective. Sale or discounted items may have different return conditions.
            </div>
          </div>
        </div>
      </div>

      {/* Refunds Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start bg-gray-50 p-6 rounded-lg">
        <FaMoneyBillWave className="text-green-600 w-12 h-12 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Refunds</h2>
          <div className="space-y-2 text-gray-700">
            <div>
              Refunds are issued to the <strong>original payment method</strong> within <strong>5–7 business days</strong> after receiving the returned item.
            </div>
            <div>
              Shipping charges are <strong>non-refundable</strong> unless the return is due to a defect or wrong item. Partial refunds may be applied if the item is damaged, missing parts, or not in its original condition.
            </div>
          </div>
        </div>
      </div>

      {/* Exchanges Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start bg-gray-50 p-6 rounded-lg">
        <FaBox className="text-yellow-500 w-12 h-12 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Exchange Policy</h2>
          <div className="space-y-2 text-gray-700">
            <div>
              Exchanges are available for items that are <strong>defective or damaged</strong> during shipping. Contact our support within <strong>7 days</strong> of delivery to initiate an exchange.
            </div>
            <div>
              Exchange items are subject to <strong>availability</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* Damaged Items Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start bg-gray-50 p-6 rounded-lg">
        <FaExclamationTriangle className="text-red-600 w-12 h-12 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Damaged or Incorrect Items</h2>
          <div className="space-y-2 text-gray-700">
            <div>
              If your order arrives <strong>damaged or incorrect</strong>, please notify us immediately with photos of the product.
            </div>
            <div>
              We will replace or refund the item at no extra cost.
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Contact Us</h2>
        <div className="space-y-1 text-gray-700">
          <div>Email: <strong>support@weavenest.com</strong></div>
          <div>Phone: <strong></strong></div>
          <div>Live Chat: Available on our website from 9 AM – 6 PM IST</div>
        </div>
      </div>
    </div>
  );
}