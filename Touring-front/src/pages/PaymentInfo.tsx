import { FaWhatsapp, FaMoneyBillWave, FaClock, FaCheckCircle, FaInfoCircle, FaHandHoldingUsd } from 'react-icons/fa';
import { GiBank, GiPayMoney } from 'react-icons/gi';

const PaymentInformation = () => {
  return (
    <div className="bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden bg-[url('/payment_hero.jpeg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8D17B] to-[#E9B949]">
                Payment Options
              </span>
            </h1>
            <p className="text-xl text-white mb-8">
              Flexible payment solutions for your Olosuashi experience
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Payment Instructions */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <GiPayMoney className="text-5xl text-[#8B6B3D]" />
          </div>
          <h2 className="text-3xl font-bold text-[#2A2A2A] font-serif mb-6 text-center">
            Choose Your Payment Method
          </h2>
          
          <div className="bg-[#F8F4EA] rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-[#8B6B3D] mb-4 flex items-center">
              <FaInfoCircle className="mr-2" />
              Important Payment Notes
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <FaCheckCircle className="text-[#8B6B3D] mt-1 mr-2 flex-shrink-0" />
                <span>Full payment must be completed before your booking date</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-[#8B6B3D] mt-1 mr-2 flex-shrink-0" />
                <span>Send payment confirmation via WhatsApp after each transaction</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-[#8B6B3D] mt-1 mr-2 flex-shrink-0" />
                <span>We'll verify and confirm each payment within 2 business hours</span>
              </li>
            </ul>
          </div>

          {/* Payment Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Bank Transfer */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] w-12 h-12 rounded-full flex items-center justify-center text-xl mb-4">
                <GiBank className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#2A2A2A] mb-3">Bank Transfer (USD)</h3>
              <div className="space-y-2 text-gray-600">
                  <p><span className="font-semibold">Bank Name:</span> SAPPHIRE BANK</p>
                  <p><span className="font-semibold">Account Name:</span> OLOSUASHI MARA LIMITED</p>
                  <p><span className="font-semibold">Account Number:</span> 00806268621250</p>
                  <p><span className="font-semibold">Account Type:</span> FOREIGN CURRENCY ACCOUNT</p>
                  <p><span className="font-semibold">Currency:</span> US DOLLAR (USD)</p>
                </div>
            </div>

            {/* M-Pesa */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] w-12 h-12 rounded-full flex items-center justify-center text-xl mb-4">
                <FaMoneyBillWave className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#2A2A2A] mb-3">M-Pesa Payment</h3>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-semibold">Paybill:</span> 542542</p>
                <p><span className="font-semibold">Account:</span> 988287</p>
                <p><span className="font-semibold">Name:</span> OLOSUASHI MARA LTD</p>
              </div>
            </div>

            {/* Lipa Pole Pole */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-[#F8F4EA]">
              <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] w-12 h-12 rounded-full flex items-center justify-center text-xl mb-4">
                <FaHandHoldingUsd className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#2A2A2A] mb-3">Lipa Pole Pole</h3>
              <div className="space-y-2 text-gray-600">
                <p>Pay in small installments at your convenience</p>
                <p><span className="font-semibold">Minimum:</span> $50 per transaction</p>
                <p><span className="font-semibold">Options:</span> M-Pesa or Bank Transfer</p>
                <p><span className="font-semibold">Deadline:</span> Full payment 7 days before booking</p>
              </div>
            </div>
          </div>

          {/* Payment Confirmation */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-[#2A2A2A] font-serif mb-6 flex items-center">
              <FaCheckCircle className="text-[#8B6B3D] mr-3" />
              Payment Confirmation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-[#8B6B3D] mb-3 flex items-center">
                  <FaWhatsapp className="mr-2" />
                  WhatsApp Confirmation
                </h4>
                <p className="text-gray-600 mb-4">
                  After each payment (including installments), please send confirmation to:
                </p>
                <a 
                  href="https://wa.me/254708414577" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  <FaWhatsapp className="mr-2" />
                  Send to +254 708 414 577
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  Include your booking reference and payment details
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-[#8B6B3D] mb-3 flex items-center">
                  <FaMoneyBillWave className="mr-2" />
                  Cash Payment
                </h4>
                <p className="text-gray-600 mb-4">
                  You can also pay cash at our office (installments accepted):
                </p>
                <div className="bg-[#F8F4EA] p-4 rounded-lg">
                  <p className="font-medium">Olosuashi Mara Limited</p>
                  <p className="text-gray-600">Moi Avenue</p>
                  <p className="text-gray-600">Nairobi, Kenya</p>
                  <p className="text-gray-600">Open: Mon-Fri, 9AM-5PM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-[#8B6B3D] text-white rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold font-serif mb-6 flex items-center">
            <FaClock className="mr-3" />
            Payment Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                title: "Choose Method",
                desc: "Select full payment or Lipa Pole Pole"
              },
              {
                step: "2",
                title: "Make Payment",
                desc: "Transfer funds via your preferred method"
              },
              {
                step: "3",
                title: "Send Proof",
                desc: "WhatsApp receipt to +254 708 414 577"
              },
              {
                step: "4",
                title: "Get Confirmation",
                desc: "We'll verify within 2 business hours"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="bg-white/20 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mb-2 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-1 text-center">{item.title}</h3>
                <p className="text-sm text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Terms */}
        <section className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-[#2A2A2A] font-serif mb-6">
            Payment Terms & Conditions
          </h2>
          <div className="prose text-gray-600">
            <ul className="space-y-4">
              <li>
                <strong>Lipa Pole Pole (Installments):</strong> Minimum $50 per transaction. Full payment must be completed 7 days before your booking date.
              </li>
              <li>
                <strong>Payment Deadlines:</strong> One-time payments due within 24 hours. Installment plans have customized deadlines.
              </li>
              <li>
                <strong>Confirmation Required:</strong> Your booking is provisional until we verify full payment.
              </li>
              <li>
                <strong>Currency:</strong> Bank transfers must be in US Dollars (USD). M-Pesa in KES equivalent.
              </li>
              <li>
                <strong>Transaction Fees:</strong> Any transfer fees are the responsibility of the sender.
              </li>
              <li>
                <strong>Need Help?</strong> Contact <a href="mailto:info@olosuashi.com" className="text-[#8B6B3D]">info@olosuashi.com</a> for payment plans.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentInformation;