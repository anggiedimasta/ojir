import React from 'react';
import { Building2 } from 'lucide-react';
import Image from 'next/image';

interface BankIconProps {
  bankName: string;
  className?: string;
}

// Bank name mapping to logo files
const BANK_LOGO_MAP: Record<string, string> = {
  mandiri: '/icons/bank/mandiri.png',
  bca: '/icons/bank/bca.png',
  bri: '/icons/bank/bri.png',
  'bank rakyat indonesia': '/icons/bank/bri.png',
  'bank bri': '/icons/bank/bri.png',
  bni: '/icons/bank/bni.png',
  cimb: '/icons/bank/cimb.png',
  permata: '/icons/bank/permata.png',
  danamon: '/icons/bank/danamon.png',
  mega: '/icons/bank/mega.png',
  maybank: '/icons/bank/maybank.png',
  panin: '/icons/bank/panin.png',
  bukopin: '/icons/bank/bukopin.png',
  ocbc: '/icons/bank/ocbc.png',
  hsbc: '/icons/bank/hsbc.png',
  uob: '/icons/bank/uob.png',
  citi: '/icons/bank/citi.png',
  jago: '/icons/bank/jago.png',
  jenius: '/icons/bank/jenius.png',
  btn: '/icons/bank/btn.png',
  bjb: '/icons/bank/bjb.png',
  'bank syariah indonesia': '/icons/bank/bank syariah indonesia.png',
  'standard chartered': '/icons/bank/standard chartered.png',
  digibank: '/icons/bank/digibank.png',
  anz: '/icons/bank/anz.png',
  bi: '/icons/bank/bi.png',
};

// E-wallet mapping to logo files
const EWALLET_LOGO_MAP: Record<string, string> = {
  gopay: '/icons/ewallet/gopay.png',
  ovo: '/icons/ewallet/ovo.png',
  dana: '/icons/ewallet/dana.png',
  shopeepay: '/icons/ewallet/shopeepay.png',
  linkaja: '/icons/ewallet/linkaja.png',
  paypro: '/icons/ewallet/paypro.png',
  paypal: '/icons/ewallet/paypal.png',
  applepay: '/icons/ewallet/applepay.png',
  gpay: '/icons/ewallet/gpay.png',
  flip: '/icons/ewallet/flip.png',
  kudo: '/icons/ewallet/kudo.png',
  midtrans: '/icons/ewallet/midtrans.png',
  bluepay: '/icons/ewallet/bluepay.png',
  cashlez: '/icons/ewallet/cashlez.png',
  cashbac: '/icons/ewallet/cashbac.png',
  payfazz: '/icons/ewallet/payfazz.png',
  paytren: '/icons/ewallet/paytren.png',
  uangku: '/icons/ewallet/uangku.png',
};

export const BankIcon: React.FC<BankIconProps> = ({ bankName, className = "w-4 h-4" }) => {
  const getBankIcon = (bank: string) => {
    const normalizedBank = bank.toLowerCase();

    // Check banks first
    const matchedBankKey = Object.keys(BANK_LOGO_MAP).find(bankKey =>
      normalizedBank.includes(bankKey)
    );

    if (matchedBankKey && BANK_LOGO_MAP[matchedBankKey]) {
      return (
        <div className={`${className} rounded-sm overflow-hidden bg-white`}>
          <Image
            src={BANK_LOGO_MAP[matchedBankKey]}
            alt={`${bank} logo`}
            width={16}
            height={16}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to generic bank icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = `<svg class="w-full h-full text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L3 7v11h14V7l-7-5zM8 16H6v-4h2v4zm4 0h-2v-4h2v4zm4 0h-2v-4h2v4z"/></svg>`;
              }
            }}
          />
        </div>
      );
    }

    // Check e-wallets if no bank match
    const matchedEwalletKey = Object.keys(EWALLET_LOGO_MAP).find(ewalletKey =>
      normalizedBank.includes(ewalletKey)
    );

    if (matchedEwalletKey && EWALLET_LOGO_MAP[matchedEwalletKey]) {
      return (
        <div className={`${className} rounded-sm overflow-hidden bg-white`}>
          <Image
            src={EWALLET_LOGO_MAP[matchedEwalletKey]}
            alt={`${bank} logo`}
            width={16}
            height={16}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to generic bank icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = `<svg class="w-full h-full text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L3 7v11h14V7l-7-5zM8 16H6v-4h2v4zm4 0h-2v-4h2v4zm4 0h-2v-4h2v4z"/></svg>`;
              }
            }}
          />
        </div>
      );
    }

    // Default fallback
    return <Building2 className={className} />;
  };

  return getBankIcon(bankName);
};

// Bank Mandiri specific component using actual logo
export const BankMandiriBadge = () => (
  <div className="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
    <div className="w-4 h-4 rounded-sm overflow-hidden bg-white">
      <Image
        src={BANK_LOGO_MAP.mandiri || '/icons/bank/mandiri.png'}
        alt="Bank Mandiri logo"
        width={16}
        height={16}
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback if logo doesn't exist
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.innerHTML = '<svg class="w-full h-full text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L3 7v11h14V7l-7-5zM8 16H6v-4h2v4zm4 0h-2v-4h2v4zm4 0h-2v-4h2v4z"/></svg>';
          }
        }}
      />
    </div>
    <span className="text-xs font-medium text-blue-700">Bank Mandiri</span>
  </div>
);