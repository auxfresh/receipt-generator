import { BankingReceiptData } from '@/types/receipt';

interface BankingReceiptPreviewProps {
  data: BankingReceiptData;
  logoUrl?: string;
}

export function BankingReceiptPreview({ data, logoUrl }: BankingReceiptPreviewProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto" id="banking-receipt-preview">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Logo Section */}
        <div className="flex items-center mb-6">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
          )}
          <span className="ml-3 text-xl font-bold text-purple-600">kuda.</span>
        </div>
        
        <div className="text-right mb-8">
          <h1 className="text-lg font-semibold text-gray-900">Transaction Details</h1>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Transaction Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              ₦{data.transactionAmount ? data.transactionAmount.toLocaleString() : '0.00'}
            </p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-sm text-gray-600 mb-2">Beneficiary Details</p>
            <p className="text-gray-900">{data.beneficiaryName || '-'}</p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-sm text-gray-600 mb-2">Sender Details</p>
            <p className="text-gray-900">{data.senderName || '-'}</p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-sm text-gray-600 mb-2">Paid On</p>
            <p className="text-gray-900">
              {data.paidOn ? new Date(data.paidOn).toLocaleString() : '-'}
            </p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-sm text-gray-600 mb-2">Fees</p>
            <p className="text-gray-900">
              ₦{data.fees ? data.fees.toLocaleString() : '0.00'}
            </p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-sm text-gray-600 mb-2">Description</p>
            <p className="text-gray-900">{data.description || '-'}</p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-sm text-gray-600 mb-2">Transaction Reference</p>
            <p className="text-gray-900">{data.transactionRef || '-'}</p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-sm text-gray-600 mb-2">Payment Type</p>
            <p className="text-gray-900">{data.paymentType || '-'}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 text-center mt-8">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
