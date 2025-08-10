import { google } from "googleapis";
import type {
  EmailTransactionData,
  GmailMessage,
  ParsedTransaction,
} from "~/entities/api/wallet";

// Custom error class for auth errors that should trigger sign-out
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

interface GmailApiResponse {
  messages?: Array<{ id: string; threadId: string }>;
  nextPageToken?: string;
  resultSizeEstimate: number;
}

export async function fetchGmailMessages(
  accessToken: string,
  options: {
    maxResults?: number;
    pageToken?: string;
    labelIds?: string[];
    query?: string;
  } = {},
): Promise<{ messages: GmailMessage[]; nextPageToken?: string }> {
  try {
    // Create OAuth2 client and set credentials
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    // Create Gmail client with authenticated OAuth2 client
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    // Enhanced query to include top-up transactions
    const defaultQuery =
      'from:(noreply.livin@bankmandiri.co.id OR noreply@bca.co.id OR noreply@bri.co.id) subject:(payment OR transfer OR transaction OR "top-up" OR "topup")';
    const query = options.query || defaultQuery;

    // List messages
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: options.maxResults || 50,
      pageToken: options.pageToken,
      labelIds: options.labelIds,
      q: query,
    });

    const messageList = listResponse.data as GmailApiResponse;

    if (!messageList.messages || messageList.messages.length === 0) {
      return { messages: [], nextPageToken: messageList.nextPageToken };
    }

    // Fetch full message details
    const messages: GmailMessage[] = [];
    for (const messageRef of messageList.messages) {
      try {
        const messageResponse = await gmail.users.messages.get({
          userId: "me",
          id: messageRef.id,
          format: "full",
        });

        messages.push(messageResponse.data as GmailMessage);
      } catch (error) {
        // Continue with other messages
      }
    }

    return {
      messages,
      nextPageToken: messageList.nextPageToken,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Check for specific OAuth errors
    if (errorMessage.includes("invalid_grant")) {
      // This usually means the refresh token is invalid/revoked
      throw new AuthError(
        "Gmail access has been revoked. Please sign out and sign in again to re-authorize Gmail access.",
      );
    }

    if (errorMessage.includes("Invalid Credentials")) {
      // This might be a temporary issue, try to refresh first
      throw new AuthError(
        "Gmail access token has expired. Please sign out and sign in again to refresh your credentials.",
      );
    }

    if (
      errorMessage.includes("insufficient_permissions") ||
      errorMessage.includes("access_denied")
    ) {
      throw new AuthError(
        "Gmail access has been revoked. Please sign out and sign in again to re-authorize Gmail access.",
      );
    }

    throw new Error(`Failed to fetch Gmail messages: ${errorMessage}`);
  }
}

// Helper function to decode quoted-printable HTML content
function decodeQuotedPrintable(htmlContent: string): string {
  return htmlContent
    .replace(/=3D/g, "=")
    .replace(/=\r?\n/g, "") // Remove soft line breaks
    .replace(/=[0-9A-F]{2}/g, (match) => {
      // Decode hex-encoded characters
      const hex = match.substring(1);
      return String.fromCharCode(Number.parseInt(hex, 16));
    });
}

// Helper function to parse Indonesian Rupiah format
function parseIndonesianRupiah(amountStr: string): number {
  if (!amountStr) return 0;

  // Check if amount is negative
  const isNegative = amountStr.startsWith("-");
  const cleanAmount = isNegative ? amountStr.substring(1) : amountStr;

  // Handle Indonesian format: periods are thousand separators, comma is decimal separator
  let result = 0;
  if (cleanAmount.includes(",")) {
    // Split by comma to separate integer and decimal parts
    const parts = cleanAmount.split(",");
    const integerPart = parts[0];
    const decimalPart = parts[1];
    if (integerPart) {
      // Remove periods (thousand separators) from integer part
      const cleanInteger = integerPart.replace(/\./g, "");
      // Combine as decimal number and round to integer
      result = Math.round(
        Number.parseFloat(`${cleanInteger}.${decimalPart || "00"}`),
      );
    }
  } else {
    // No comma, just remove periods and treat as integer
    result = Number.parseFloat(cleanAmount.replace(/\./g, ""));
  }

  // Return absolute value (sign is handled by direction field)
  return Math.abs(result);
}

// Helper function to parse date and time from Bank Mandiri format
function parseBankMandiriDateTime(dateStr: string, timeStr: string): Date {
  if (!dateStr || !timeStr) return new Date();

  try {
    // Convert "27 Jul 2025" and "09:25:57 WIB" to Date
    const dateTimeStr = `${dateStr} ${timeStr.replace(" WIB", "+07:00")}`;
    const parsedDate = new Date(dateTimeStr);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  } catch (error) {
    // Fallback to current date if parsing fails
  }

  return new Date();
}

// Enhanced parser for Bank Mandiri top-up emails
function parseBankMandiriTopUpEmail(
  htmlContent: string,
  actualSender?: string,
): EmailTransactionData | null {
  try {
    // Decode HTML content
    const decodedHtml = decodeQuotedPrintable(htmlContent);

    // Check if this is a top-up email
    const isTopUp =
      decodedHtml.includes("Top-up Successful") ||
      decodedHtml.includes("Service Provider") ||
      decodedHtml.includes("PLN Prabayar");

    if (!isTopUp) {
      return null;
    }

    // Extract service provider and account number
    const serviceProviderMatch = decodedHtml.match(
      /<h4[^>]*>([^<]+)<\/h4>[^<]*<p[^>]*>\*{4}(\d+)<\/p>/is,
    );
    const serviceProvider = serviceProviderMatch?.[1]?.trim() || "";
    const accountNumber = serviceProviderMatch?.[2]?.trim() || "";

    // Extract date and time
    const dateMatch = decodedHtml.match(
      /<td[^>]*>Date<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const timeMatch = decodedHtml.match(
      /<td[^>]*>Time<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const dateStr = dateMatch?.[1]?.trim();
    const timeStr = timeMatch?.[1]?.trim();

    // Extract amounts - for top-ups we have Top-up Amount, Transaction Fee, and Total
    const topUpAmountMatch = decodedHtml.match(
      /<td[^>]*>Top-up\s*Amount<\/td>\s*<td[^>]*>Rp\s*([\d,.]+)<\/td>/is,
    );
    const transactionFeeMatch = decodedHtml.match(
      /<td[^>]*>Transaction\s*Fee<\/td>\s*<td[^>]*>Rp\s*([\d,.]+)<\/td>/is,
    );
    const totalAmountMatch = decodedHtml.match(
      /<td[^>]*>Total<\/td>\s*<td[^>]*>Rp\s*([\d,.]+)<\/td>/is,
    );

    const topUpAmount = parseIndonesianRupiah(
      topUpAmountMatch?.[1]?.trim() || "0",
    );
    const transactionFee = parseIndonesianRupiah(
      transactionFeeMatch?.[1]?.trim() || "0",
    );
    const totalAmount = parseIndonesianRupiah(
      totalAmountMatch?.[1]?.trim() || "0",
    );

    // Extract reference number
    const refMatch = decodedHtml.match(
      /<td[^>]*>Reference No\.?<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const transactionRefNo = refMatch?.[1]?.trim() || "";

    // Extract source of fund
    const sourceMatch = decodedHtml.match(
      /<h4[^>]*>([^<]+)<\/h4>[^<]*<p[^>]*>\*{4}(\d+)<\/p>/is,
    );
    const sourceOfFund = sourceMatch?.[1]?.trim() || "";
    const sourceAccount = sourceMatch?.[2]?.trim() || "";

    // Validate required fields
    if (!serviceProvider || !topUpAmount || topUpAmount <= 0) {
      return null;
    }

    return {
      recipient: serviceProvider,
      location: "",
      transactionDate: parseBankMandiriDateTime(dateStr || "", timeStr || ""),
      amount: topUpAmount, // Use Top-up Amount (the base amount)
      fee: transactionFee, // Use Transaction Fee
      totalAmount: totalAmount, // Use Total (amount + fee)
      currency: "IDR",
      transactionRefNo,
      qrisRefNo: "",
      merchantPan: "",
      customerPan: "",
      acquirer: "",
      terminalId: "",
      sourceOfFund,
      sourceAccount: sourceAccount || "",
      recipientBank: "",
      recipientBankAccount: "",
      transferPurpose: "",
      bankSender: actualSender || "",
      emailSubject: "",
      transactionType: "top-up",
      status: "successful",
      direction: "out",

      serviceProvider,
      accountNumber: accountNumber || "",
    };
  } catch (error) {
    return null;
  }
}

// Enhanced parser for Bank Mandiri transfer emails
function parseBankMandiriTransferEmail(
  htmlContent: string,
  actualSender?: string,
): EmailTransactionData | null {
  try {
    const decodedHtml = decodeQuotedPrintable(htmlContent);

    // Check if this is a transfer email
    const isQRTransfer =
      decodedHtml.includes("QR Transfer Successful") ||
      decodedHtml.includes("QR transfer details");
    const isBIFastTransfer =
      decodedHtml.includes("BI Fast Transfer Successful") ||
      decodedHtml.includes("BI Fast Ref. No.");

    if (!isQRTransfer && !isBIFastTransfer) {
      return null;
    }

    // Extract recipient information
    const recipientMatch = decodedHtml.match(
      /<p[^>]*>Recipient<\/p>[^<]*<h4[^>]*>([^<]+)<\/h4>[^<]*<p[^>]*>([^<]+)<\/p>/is,
    );
    const recipient = recipientMatch?.[1]?.trim() || "";
    const recipientBankFull = recipientMatch?.[2]?.trim() || "";

    // Extract recipient bank and account number
    let recipientBank = "";
    let recipientBankAccount = "";
    if (recipientBankFull) {
      const bankAccountMatch = recipientBankFull.match(
        /Bank\s+([^-]+)\s*-\s*(\d+)/i,
      );
      if (bankAccountMatch?.[1] && bankAccountMatch[2]) {
        const bankName = bankAccountMatch[1]
          .trim()
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        recipientBank =
          bankName === "Central Asia" ? "BCA" : `Bank ${bankName}`;
        recipientBankAccount = bankAccountMatch[2].trim();
      } else {
        // Fallback: try to extract just bank name
        const bankMatch = recipientBankFull.match(/Bank\s+([^-]+)/i);
        if (bankMatch?.[1]) {
          const cleanBankName = bankMatch[1]
            .trim()
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          recipientBank =
            cleanBankName === "Central Asia" ? "BCA" : `Bank ${cleanBankName}`;
        }
      }
    }

    // Extract date and time
    const dateMatch = decodedHtml.match(
      /<td[^>]*>Date<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const timeMatch = decodedHtml.match(
      /<td[^>]*>Time<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const dateStr = dateMatch?.[1]?.trim();
    const timeStr = timeMatch?.[1]?.trim();

    // Extract amounts - separate transfer amount, fee, and total
    const transferAmountMatch = decodedHtml.match(
      /<td[^>]*>Transfer\s*Amount<\/td>\s*<td[^>]*>Rp\s*([\d,.]+)<\/td>/is,
    );
    const feeMatch = decodedHtml.match(
      /<td[^>]*>Transfer\s*Fee<\/td>\s*<td[^>]*>Rp\s*([\d,.]+)<\/td>/is,
    );
    const totalTransactionMatch = decodedHtml.match(
      /<td[^>]*>Total\s*Transaction<\/td>\s*<td[^>]*>Rp\s*([\d,.]+)<\/td>/is,
    );

    const amount = parseIndonesianRupiah(
      transferAmountMatch?.[1] ? transferAmountMatch[1].trim() : "0",
    );
    const fee = parseIndonesianRupiah(feeMatch?.[1] ? feeMatch[1].trim() : "0");
    const totalAmount = parseIndonesianRupiah(
      totalTransactionMatch?.[1] ? totalTransactionMatch[1].trim() : "0",
    );

    // Extract transfer purpose
    const purposeMatch = decodedHtml.match(
      /<td[^>]*>Transfer\s*Purpose<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const transferPurpose = purposeMatch?.[1]?.trim() || "";

    // Extract reference number
    const refMatch =
      decodedHtml.match(
        /<td[^>]*>Reference\s*No\.?<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
      ) ||
      decodedHtml.match(
        /<td[^>]*>BI\s*Fast\s*Ref\.?\s*No\.?<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
      );
    const transactionRefNo = refMatch?.[1]?.trim() || "";

    // Extract source of fund
    const sourceMatch = decodedHtml.match(
      /<h4[^>]*>([^<]+)<\/h4>[^<]*<p[^>]*>\*{4}(\d+)<\/p>/is,
    );
    const sourceOfFund = sourceMatch?.[1]?.trim() || "";
    const sourceAccount = sourceMatch?.[2]?.trim() || "";

    // Validate required fields
    if (!recipient || !amount || amount <= 0) {
      return null;
    }

    return {
      recipient,
      location: "", // No location for transfers
      transactionDate: parseBankMandiriDateTime(dateStr || "", timeStr || ""),
      amount,
      fee,
      totalAmount,
      currency: "IDR",
      transactionRefNo,
      sourceOfFund,
      sourceAccount: sourceAccount || "",
      recipientBank,
      recipientBankAccount,
      transferPurpose,
      bankSender: actualSender || "",
      emailSubject: "",
      transactionType: "",
      status: "",
      direction: "out",
    };
  } catch (error) {
    return null;
  }
}

// Enhanced parser for Bank Mandiri merchant payment emails
function parseBankMandiriMerchantEmail(
  htmlContent: string,
  actualSender?: string,
): EmailTransactionData | null {
  try {
    const decodedHtml = decodeQuotedPrintable(htmlContent);

    // Check if this is a merchant payment email (but exclude PLN Prabayar which is a top-up)
    const isPLNPrabayar = decodedHtml.includes("PLN Prabayar");
    const isMerchantPayment =
      !isPLNPrabayar &&
      (decodedHtml.includes("Payment is Successful!") ||
        decodedHtml.includes("Transaction Amount") ||
        decodedHtml.includes("Merchant PAN"));

    if (!isMerchantPayment) {
      return null;
    }

    // Extract recipient merchant name - improved pattern to handle various HTML structures
    const recipientMatch =
      decodedHtml.match(
        /<p[^>]*>Recipient<\/p>[^<]*<h4[^>]*>([^<]+)<\/h4>/is,
      ) ||
      decodedHtml.match(
        /<h4[^>]*style[^>]*text-align:left[^>]*>([^<]+)<\/h4>/is,
      ) ||
      decodedHtml.match(/Recipient[^<]*<[^>]*>([^<]+)<\/h4>/is) ||
      decodedHtml.match(
        /<h4[^>]*>([^<]+)<\/h4>[^<]*<p[^>]*>JAKARTA[^<]*<\/p>/is,
      );
    const recipient = recipientMatch?.[1]?.trim() || "";

    // Extract location - look for <p> tag after the merchant name (h4)
    const locationMatch = decodedHtml.match(
      /<h4[^>]*>([^<]+)<\/h4>[^<]*<p[^>]*>([^<]+)<\/p>/is,
    );
    const location = locationMatch?.[2]?.trim() || "";

    // Extract acquirer
    const acquirerMatch = decodedHtml.match(
      /<td[^>]*>Acquirer<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const acquirer =
      acquirerMatch?.[1]
        ?.trim()
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim() || "";

    // Extract date and time
    const dateMatch = decodedHtml.match(
      /<td[^>]*>Date<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const timeMatch = decodedHtml.match(
      /<td[^>]*>Time<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const dateStr = dateMatch?.[1]?.trim();
    const timeStr = timeMatch?.[1]?.trim();

    // Extract transaction amount - improved pattern to handle various HTML structures
    const amountMatch =
      decodedHtml.match(
        /<td[^>]*>Transaction\s*Amount<\/td>\s*<td[^>]*>Rp\s*([\d,.]+)<\/td>/is,
      ) ||
      decodedHtml.match(
        /<td[^>]*>Amount<\/td>\s*<td[^>]*>Rp\s*([\d,.]+)<\/td>/is,
      ) ||
      decodedHtml.match(/Transaction\s*Amount[^<]*<[^>]*>Rp\s*([\d,.]+)/is) ||
      decodedHtml.match(/Amount[^<]*<[^>]*>Rp\s*([\d,.]+)/is);
    const amount = parseIndonesianRupiah(amountMatch?.[1]?.trim() || "0");

    // Extract transaction reference - improved pattern to handle various HTML structures
    const refMatch =
      decodedHtml.match(
        /<td[^>]*>Transaction\s*Ref[^<]*No[^<]*<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
      ) ||
      decodedHtml.match(
        /<td[^>]*>Reference\s*No[^<]*<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
      ) ||
      decodedHtml.match(/Transaction\s*Ref[^<]*No[^<]*[^<]*<[^>]*>([^<]+)/is) ||
      decodedHtml.match(/Reference\s*No[^<]*[^<]*<[^>]*>([^<]+)/is);
    const transactionRefNo = refMatch?.[1]?.trim() || "";

    // Extract additional fields for merchant payments
    const qrisRefMatch = decodedHtml.match(
      /<td[^>]*>QRIS\s*Ref[^<]*No[^<]*<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const merchantPanMatch = decodedHtml.match(
      /<td[^>]*>Merchant PAN<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const customerPanMatch = decodedHtml.match(
      /<td[^>]*>Customer PAN<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );
    const terminalIdMatch = decodedHtml.match(
      /<td[^>]*>Terminal ID<\/td>\s*<td[^>]*>([^<]+)<\/td>/is,
    );

    // Extract virtual account number and save to recipientBankAccount
    let virtualAccountNo = "";
    if (recipient) {
      const vaMatch = decodedHtml.match(
        new RegExp(
          `<h4[^>]*>${recipient.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\/h4>\\s*<div[^>]*>([0-9]{10,})<\/div>`,
          "is",
        ),
      );
      virtualAccountNo = vaMatch?.[1]?.trim() || "";
    }

    // Extract source of fund - try multiple patterns
    let sourceMatch = decodedHtml.match(
      /<p[^>]*>Source of Fund<\/p>\s*<h4[^>]*>([^<]+)<\/h4>\s*<p[^>]*>\*{4}(\d+)<\/p>/is,
    );

    if (!sourceMatch) {
      sourceMatch = decodedHtml.match(
        /<p[^>]*>Source of Fund<\/p>\s*<h4[^>]*>([^<]+)<\/h4>\s*<p[^>]*>([^<]+)<\/p>/is,
      );
    }

    if (!sourceMatch) {
      // Try a more flexible pattern
      sourceMatch = decodedHtml.match(
        /Source of Fund[^<]*<[^>]*>([^<]+)<[^>]*>[^<]*<[^>]*>\*{4}(\d+)/is,
      );
    }

    if (!sourceMatch) {
      // Try to find any pattern with **** followed by digits
      const anyMaskedMatch = decodedHtml.match(/\*{4}(\d+)/);
      if (anyMaskedMatch) {
        // Find the source of fund name before the masked account
        const beforeMasked = decodedHtml.substring(
          0,
          decodedHtml.indexOf(anyMaskedMatch[0]),
        );
        const sourceNameMatch = beforeMasked.match(
          /Source of Fund[^<]*<[^>]*>([^<]+)<[^>]*>/is,
        );
        sourceMatch = [
          anyMaskedMatch[0],
          sourceNameMatch?.[1] || "",
          anyMaskedMatch[1],
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try to find source of fund with just **** (no numbers)
      const sourceOfFundMatch = decodedHtml.match(
        /Source of Fund[^<]*<[^>]*>([^<]+)<[^>]*>/is,
      );
      const justMaskedMatch = decodedHtml.match(/\*{4}(?!\d)/); // **** without following digits
      if (sourceOfFundMatch && justMaskedMatch) {
        sourceMatch = [
          justMaskedMatch[0],
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try to match the specific HTML structure from the email with precise boundaries
      const sourceOfFundMatch = decodedHtml.match(
        /<div[^>]*>Source of Fund<\/div>\s*<div[^>]*>([^<]+)<\/div>\s*<div[^>]*>\*{4}<\/div>/is,
      );
      if (sourceOfFundMatch) {
        sourceMatch = [
          "****",
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try a more precise pattern that looks for the exact structure
      const sourceOfFundMatch = decodedHtml.match(
        /<div[^>]*>Source of Fund<\/div>\s*<div[^>]*>([^<]+)<\/div>\s*<div[^>]*>\*{4}<\/div>\s*<\/table>/is,
      );
      if (sourceOfFundMatch) {
        sourceMatch = [
          "****",
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try to find the source of fund section and extract just the name
      const sourceOfFundSection = decodedHtml.match(
        /<div[^>]*>Source of Fund<\/div>\s*<div[^>]*>([^<]+)<\/div>/is,
      );
      if (sourceOfFundSection) {
        sourceMatch = [
          "****",
          sourceOfFundSection[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try to find the exact source of fund name by looking for the specific div structure
      const sourceOfFundMatch = decodedHtml.match(
        /<div[^>]*>Source of Fund<\/div>\s*<div[^>]*style[^>]*font-weight:\s*600[^>]*>([^<]+)<\/div>/is,
      );
      if (sourceOfFundMatch) {
        sourceMatch = [
          "****",
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try to find the source of fund name by looking for the specific style attribute
      const sourceOfFundMatch = decodedHtml.match(
        /<div[^>]*>Source of Fund<\/div>\s*<div[^>]*text-align:\s*left;\s*margin:\s*0;\s*font-weight:\s*600[^>]*>([^<]+)<\/div>/is,
      );
      if (sourceOfFundMatch) {
        sourceMatch = [
          "****",
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try a more robust approach: find the source of fund section and extract just the name
      const sourceOfFundSection = decodedHtml.match(
        /<div[^>]*>Source of Fund<\/div>\s*<div[^>]*>([^<]+)<\/div>\s*<div[^>]*>\*{4}<\/div>/is,
      );
      if (sourceOfFundSection) {
        // Extract just the source of fund name, not the entire section
        const sourceOfFundName = sourceOfFundSection[1]?.trim() || "";
        sourceMatch = ["****", sourceOfFundName, ""] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try a very specific pattern that stops at the right boundary
      const sourceOfFundMatch = decodedHtml.match(
        /<div[^>]*>Source of Fund<\/div>\s*<div[^>]*>([^<]*?)\s*<\/div>\s*<div[^>]*>\*{4}<\/div>/is,
      );
      if (sourceOfFundMatch) {
        const sourceOfFundName = sourceOfFundMatch[1]?.trim() || "";
        sourceMatch = ["****", sourceOfFundName, ""] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try to find the exact pattern from the problematic email
      const sourceOfFundMatch = decodedHtml.match(
        /<div[^>]*>Source of Fund<\/div>\s*<div[^>]*>([^<]*?Credit Card[^<]*?Mandiri[^<]*?Platinum[^<]*?)<\/div>/is,
      );
      if (sourceOfFundMatch) {
        const sourceOfFundName = sourceOfFundMatch[1]?.trim() || "";
        sourceMatch = ["****", sourceOfFundName, ""] as RegExpMatchArray;
      }
    }

    const sourceOfFund = sourceMatch?.[1]?.trim() || "";
    const sourceAccount = sourceMatch?.[2]?.trim() || "";
    // Final fallback: remove masking from source account if it still has it
    const finalSourceAccount = sourceAccount.replace(/^\*{4}/, "") || "";

    // Special fix for the problematic transaction - clean up sourceOfFund if it contains email footer
    let finalSourceOfFund = sourceOfFund;
    if (
      finalSourceOfFund &&
      (finalSourceOfFund.includes("Save this email") ||
        finalSourceOfFund.includes("Thank you for using Livin"))
    ) {
      // Extract just the part before the email footer
      const cleanMatch = finalSourceOfFund.match(
        /^(.*?Credit Card.*?Mandiri.*?Platinum.*?)\s*\*{4}/is,
      );
      if (cleanMatch && typeof cleanMatch[1] === "string") {
        finalSourceOfFund = cleanMatch[1].trim();
      } else {
        // Fallback: just take everything before "Save this email"
        const beforeFooter = finalSourceOfFund.split("Save this email")[0];
        if (beforeFooter) {
          finalSourceOfFund = beforeFooter.trim();
        }
      }
    }

    // Ensure sourceOfFund doesn't exceed database limit (255 characters)
    if (finalSourceOfFund && finalSourceOfFund.length > 255) {
      // Try to extract just the essential part
      const essentialMatch = finalSourceOfFund.match(
        /^(.*?Credit Card.*?Mandiri.*?Platinum.*?)/i,
      );
      if (essentialMatch?.[1]) {
        finalSourceOfFund = essentialMatch[1].trim();
      } else {
        // Last resort: truncate to 255 characters
        finalSourceOfFund = finalSourceOfFund.substring(0, 255).trim();
      }
    }

    return {
      recipient,
      location,
      transactionDate: parseBankMandiriDateTime(dateStr || "", timeStr || ""),
      amount,
      fee: 0, // No fee for merchant payments
      totalAmount: amount, // Same as amount for merchant payments
      currency: "IDR",
      transactionRefNo,
      qrisRefNo: qrisRefMatch?.[1]?.trim(),
      merchantPan: merchantPanMatch?.[1]?.trim(),
      customerPan: customerPanMatch?.[1]?.trim(),
      acquirer,
      terminalId: terminalIdMatch?.[1]?.trim(),
      sourceOfFund: finalSourceOfFund,
      sourceAccount: finalSourceAccount,
      recipientBank: "",
      recipientBankAccount: virtualAccountNo || "",
      transferPurpose: "",
      bankSender: actualSender || "",
      emailSubject: "",
      transactionType: virtualAccountNo ? "virtual-account" : "",
      status: "",
      direction: "out",
    };
  } catch (error) {
    return null;
  }
}

export function parseBankMandiriEmailFromHtml(
  htmlContent: string,
  actualSubject?: string,
  actualSender?: string,
): ParsedTransaction | null {
  try {
    // Try parsing as top-up email first
    const topUpData = parseBankMandiriTopUpEmail(htmlContent, actualSender);
    if (topUpData) {
      return {
        recipient: topUpData.recipient,
        location: topUpData.location,
        transactionDate: topUpData.transactionDate,
        amount: topUpData.amount,
        fee: topUpData.fee,
        totalAmount: topUpData.totalAmount,
        currency: topUpData.currency,
        transactionRefNo: topUpData.transactionRefNo,
        qrisRefNo: topUpData.qrisRefNo,
        merchantPan: topUpData.merchantPan,
        customerPan: topUpData.customerPan,
        acquirer: topUpData.acquirer,
        terminalId: topUpData.terminalId,
        sourceOfFund: topUpData.sourceOfFund,
        sourceAccount: topUpData.sourceAccount,
        recipientBank: topUpData.recipientBank,
        recipientBankAccount: topUpData.recipientBankAccount,
        transferPurpose: topUpData.transferPurpose,
        bankSender: topUpData.bankSender,
        emailSubject: actualSubject || topUpData.emailSubject,
        transactionType: topUpData.transactionType,
        status: topUpData.status,
        direction: topUpData.direction,
      };
    }

    // Try parsing as transfer email
    const transferData = parseBankMandiriTransferEmail(
      htmlContent,
      actualSender,
    );
    if (transferData) {
      return {
        recipient: transferData.recipient,
        location: transferData.location,
        transactionDate: transferData.transactionDate,
        amount: transferData.amount,
        fee: transferData.fee,
        totalAmount: transferData.totalAmount,
        currency: transferData.currency,
        transactionRefNo: transferData.transactionRefNo,
        qrisRefNo: transferData.qrisRefNo,
        merchantPan: transferData.merchantPan,
        customerPan: transferData.customerPan,
        acquirer: transferData.acquirer,
        terminalId: transferData.terminalId,
        sourceOfFund: transferData.sourceOfFund,
        sourceAccount: transferData.sourceAccount,
        recipientBank: transferData.recipientBank,
        recipientBankAccount: transferData.recipientBankAccount,
        transferPurpose: transferData.transferPurpose,
        bankSender: transferData.bankSender,
        emailSubject: actualSubject || transferData.emailSubject,
        transactionType: transferData.transactionType,
        status: transferData.status,
        direction: transferData.direction,
      };
    }

    // Try parsing as merchant payment email
    const merchantData = parseBankMandiriMerchantEmail(
      htmlContent,
      actualSender,
    );
    if (merchantData) {
      return {
        recipient: merchantData.recipient,
        location: merchantData.location,
        transactionDate: merchantData.transactionDate,
        amount: merchantData.amount,
        fee: merchantData.fee,
        totalAmount: merchantData.totalAmount,
        currency: merchantData.currency,
        transactionRefNo: merchantData.transactionRefNo,
        qrisRefNo: merchantData.qrisRefNo,
        merchantPan: merchantData.merchantPan,
        customerPan: merchantData.customerPan,
        acquirer: merchantData.acquirer,
        terminalId: merchantData.terminalId,
        sourceOfFund: merchantData.sourceOfFund,
        sourceAccount: merchantData.sourceAccount,
        recipientBank: merchantData.recipientBank,
        recipientBankAccount: merchantData.recipientBankAccount,
        transferPurpose: merchantData.transferPurpose,
        bankSender: merchantData.bankSender,
        emailSubject: actualSubject || merchantData.emailSubject,
        transactionType: merchantData.transactionType,
        status: merchantData.status,
        direction: merchantData.direction,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function parseBankMandiriEmail(
  message: GmailMessage,
): ParsedTransaction | null {
  try {
    // Get email headers
    const headers = message.payload.headers;
    const fromHeader = headers.find((h) => h.name === "From")?.value || "";
    const subjectHeader =
      headers.find((h) => h.name === "Subject")?.value || "";

    // Only process Bank Mandiri emails
    if (!fromHeader.includes("noreply.livin@bankmandiri.co.id")) {
      return null;
    }

    // Extract HTML content from email
    let htmlContent = "";
    let emailBody = "";

    // Try to get HTML content from the main payload or parts
    if (message.payload.body?.data) {
      const content = Buffer.from(message.payload.body.data, "base64").toString(
        "utf-8",
      );
      if (message.payload.mimeType === "text/html") {
        htmlContent = content;
      } else {
        emailBody = content;
      }
    }

    // Check parts for HTML content
    if (message.payload.parts) {
      for (const part of message.payload.parts) {
        if (part.mimeType === "text/html" && part.body?.data) {
          htmlContent = Buffer.from(part.body.data, "base64").toString("utf-8");
          break;
        }
        // Also get plain text as fallback
        if (part.mimeType === "text/plain" && part.body?.data && !emailBody) {
          emailBody = Buffer.from(part.body.data, "base64").toString("utf-8");
        }
      }

      // Check nested parts if needed
      if (!htmlContent) {
        for (const part of message.payload.parts) {
          if (part.mimeType === "multipart/alternative" && part.parts) {
            for (const nestedPart of part.parts) {
              if (
                nestedPart.mimeType === "text/html" &&
                nestedPart.body?.data
              ) {
                htmlContent = Buffer.from(
                  nestedPart.body.data,
                  "base64",
                ).toString("utf-8");
                break;
              }
              if (
                nestedPart.mimeType === "text/plain" &&
                nestedPart.body?.data &&
                !emailBody
              ) {
                emailBody = Buffer.from(
                  nestedPart.body.data,
                  "base64",
                ).toString("utf-8");
              }
            }
            if (htmlContent) break;
          }
        }
      }
    }

    // Try HTML parsing first if we have HTML content
    if (htmlContent) {
      const htmlResult = parseBankMandiriEmailFromHtml(
        htmlContent,
        subjectHeader,
        fromHeader,
      );
      if (htmlResult) {
        return htmlResult;
      }
    }

    // Fall back to text-based parsing if HTML parsing fails
    if (!emailBody && htmlContent) {
      // Convert HTML to text for regex parsing
      emailBody = htmlContent
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    if (!emailBody) {
      return null;
    }

    // Enhanced fallback parsing for different transaction types
    const isTopUp =
      subjectHeader.includes("Top-up Successful") ||
      emailBody.includes("Service Provider");
    const isQRTransfer =
      subjectHeader.includes("QR Transfer Successful") ||
      emailBody.includes("QR transfer details");
    const isBIFastTransfer =
      subjectHeader.includes("BI Fast Transfer Successful") ||
      emailBody.includes("BI Fast Ref. No.");

    // Try simple PLN Prabayar format first (most specific)
    const simplePLNResult = parseSimplePLNPrabayar(
      emailBody,
      subjectHeader,
      fromHeader,
    );
    if (simplePLNResult) {
      return simplePLNResult;
    }

    // Parse based on transaction type
    if (isTopUp) {
      return parseTopUpFromText(emailBody, subjectHeader, fromHeader);
    }
    if (isQRTransfer || isBIFastTransfer) {
      return parseTransferFromText(
        emailBody,
        subjectHeader,
        isQRTransfer,
        fromHeader,
      );
    }
    return parseMerchantPaymentFromText(emailBody, subjectHeader, fromHeader);
  } catch (error) {
    return null;
  }
}

// Helper function to parse top-up transactions from text
function parseTopUpFromText(
  emailBody: string,
  subjectHeader: string,
  actualSender?: string,
): ParsedTransaction | null {
  try {
    // Extract service provider
    const serviceProviderMatch = emailBody.match(
      /Service Provider\s*([^\n\r]+)/i,
    );
    const serviceProvider = serviceProviderMatch?.[1]?.trim() || "";

    // Extract amounts
    const topUpAmountMatch = emailBody.match(
      /Top-up Amount\s+(?:Rp|IDR)\s+([\d,.]+)/i,
    );
    const transactionFeeMatch = emailBody.match(
      /Transaction Fee\s+(?:Rp|IDR)\s+([\d,.]+)/i,
    );
    const totalAmountMatch = emailBody.match(/Total\s+(?:Rp|IDR)\s+([\d,.]+)/i);

    const topUpAmount = parseIndonesianRupiah(
      topUpAmountMatch?.[1]?.trim() || "0",
    );
    const transactionFee = parseIndonesianRupiah(
      transactionFeeMatch?.[1]?.trim() || "0",
    );
    const totalAmount = parseIndonesianRupiah(
      totalAmountMatch?.[1]?.trim() || "0",
    );

    // Extract reference number
    const refMatch = emailBody.match(/Reference No\.?\s+(\d+)/i);
    const transactionRefNo = refMatch?.[1]?.trim() || "";

    // Extract source account
    const sourceMatch = emailBody.match(/\*{4}(\d+)/);
    const sourceAccount = sourceMatch?.[1]?.trim() || "";

    // Extract date and time
    const dateMatch = emailBody.match(/Date\s+(\d{1,2}\s+\w+\s+\d{4})/i);
    const timeMatch = emailBody.match(/Time\s+(\d{2}:\d{2}:\d{2}\s+WIB)/i);
    const dateStr = dateMatch?.[1];
    const timeStr = timeMatch?.[1];

    // Validate required fields
    if (!serviceProvider || !totalAmount || totalAmount <= 0) {
      return null;
    }

    // Final fallback: remove masking from source account if it still has it
    const finalSourceAccount = sourceAccount.replace(/^\*{4}/, "") || "";

    return {
      recipient: serviceProvider,
      location: "",
      transactionDate: parseBankMandiriDateTime(dateStr || "", timeStr || ""),
      amount: totalAmount,
      fee: 0, // No fee for top-ups
      totalAmount: totalAmount,
      currency: "IDR",
      transactionRefNo,
      sourceOfFund: "",
      sourceAccount: finalSourceAccount,
      recipientBank: "", // Not applicable for top-ups
      recipientBankAccount: "", // Not applicable for top-ups
      transferPurpose: "", // Not applicable for top-ups
      bankSender: actualSender || "",
      emailSubject: subjectHeader,
      transactionType: "",
      status: "",
      direction: "out",
    };
  } catch (error) {
    return null;
  }
}

// Helper function to parse transfer transactions from text
function parseTransferFromText(
  emailBody: string,
  subjectHeader: string,
  isQRTransfer: boolean,
  actualSender?: string,
): ParsedTransaction | null {
  try {
    // Extract recipient information
    const recipientMatch = emailBody.match(
      /Recipient\s*([^\n\r]*?)\s*(?:Bank|Date|\s*&nbsp;|$)/i,
    );
    const recipient = recipientMatch?.[1]?.trim() || "";

    // Extract bank name for location
    let location = "";
    const bankMatch = emailBody.match(/Bank\s+([^-]+)/i);
    if (bankMatch?.[1]) {
      const cleanBankName = bankMatch[1]
        .trim()
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      location = `Bank ${cleanBankName}`;
    }

    // Extract amount
    const totalTransactionMatch = emailBody.match(
      /Total\s+Transaction\s+(?:Rp|IDR)\s+([\d,.]+)/i,
    );
    const amountMatch = emailBody.match(/Amount\s+(?:Rp|IDR)\s+([\d,.]+)/i);
    const amount = parseIndonesianRupiah(
      totalTransactionMatch?.[1]?.trim() || amountMatch?.[1]?.trim() || "0",
    );

    // Extract reference number
    const refMatch =
      emailBody.match(/Reference\s+No\.?\s+(\d+)/i) ||
      emailBody.match(/BI\s+Fast\s+Ref\.?\s+No\.?\s+([A-Z0-9]+)/i);
    const transactionRefNo = refMatch?.[1]?.trim() || "";

    // Extract source account
    const sourceMatch = emailBody.match(/\*{4}(\d+)/);
    const sourceAccount = sourceMatch?.[1]?.trim() || "";

    // Extract date and time
    const dateMatch = emailBody.match(/Date\s+(\d{1,2}\s+\w+\s+\d{4})/i);
    const timeMatch = emailBody.match(/Time\s+(\d{2}:\d{2}:\d{2}\s+WIB)/i);
    const dateStr = dateMatch?.[1];
    const timeStr = timeMatch?.[1];

    // Validate required fields
    if (!recipient || !amount || amount <= 0) {
      return null;
    }

    // Final fallback: remove masking from source account if it still has it
    const finalSourceAccount = sourceAccount.replace(/^\*{4}/, "") || "";

    return {
      recipient,
      location,
      transactionDate: parseBankMandiriDateTime(dateStr || "", timeStr || ""),
      amount,
      fee: 0, // No fee for transfers
      totalAmount: amount,
      currency: "IDR",
      transactionRefNo,
      sourceOfFund: "",
      sourceAccount: finalSourceAccount,
      recipientBank: location, // Use location as recipient bank for transfers
      recipientBankAccount: "", // Not available in text format
      transferPurpose: "", // Not available in text format
      bankSender: actualSender || "",
      emailSubject: subjectHeader,
      transactionType: "",
      status: "",
      direction: "out",
    };
  } catch (error) {
    return null;
  }
}

// Helper function to parse simple PLN Prabayar format
function parseSimplePLNPrabayar(
  emailBody: string,
  subjectHeader: string,
  actualSender?: string,
): ParsedTransaction | null {
  try {
    // Check if this is a simple PLN Prabayar format
    const isPLNPrabayar =
      emailBody.includes("PLN Prabayar") &&
      emailBody.includes("Ref:") &&
      emailBody.includes("-Rp");

    if (!isPLNPrabayar) {
      return null;
    }

    // Extract amount (negative amount like "-Rp 50.000")
    const amountMatch = emailBody.match(/-Rp\s+([\d,.]+)/i);
    const amount = parseIndonesianRupiah(amountMatch?.[1]?.trim() || "0");

    // Extract reference number
    const refMatch = emailBody.match(/Ref:\s*(\d+)/i);
    const transactionRefNo = refMatch?.[1]?.trim() || "";

    // Extract date and time
    const dateTimeMatch = emailBody.match(
      /(\w+,\s*\d+\s+\w+\s+\d{4})\s+pukul\s+(\d{2}\.\d{2})/i,
    );
    const dateStr = dateTimeMatch?.[1];
    const timeStr = `${dateTimeMatch?.[2]?.replace(".", ":")}:00 WIB`;

    // Extract source account (handle both masked and unmasked formats)
    const sourceMatch =
      emailBody.match(/\*{4}(\d+)/) || emailBody.match(/(\d{4})\s*$/m);
    const sourceAccount = sourceMatch?.[1]?.trim() || "";

    // Extract account holder name
    const nameMatch = emailBody.match(/^([A-Z\s]+)$/m);
    const sourceOfFund = nameMatch?.[1]?.trim() || "";

    // Validate required fields
    if (!amount || amount <= 0 || !transactionRefNo) {
      return null;
    }

    // Final fallback: remove masking from source account if it still has it
    const finalSourceAccount = sourceAccount.replace(/^\*{4}/, "") || "";

    return {
      recipient: "PLN Prabayar",
      location: "",
      transactionDate: parseBankMandiriDateTime(dateStr || "", timeStr || ""),
      amount,
      fee: 0, // No fee for top-ups
      totalAmount: amount,
      currency: "IDR",
      transactionRefNo,
      sourceOfFund,
      sourceAccount: finalSourceAccount,
      recipientBank: "", // Not applicable for top-ups
      recipientBankAccount: "", // Not applicable for top-ups
      transferPurpose: "", // Not applicable for top-ups
      bankSender: actualSender || "",
      emailSubject: subjectHeader,
      transactionType: "top-up",
      status: "successful",
      direction: "out",
    };
  } catch (error) {
    return null;
  }
}

// Helper function to parse merchant payment transactions from text
function parseMerchantPaymentFromText(
  emailBody: string,
  subjectHeader: string,
  actualSender?: string,
): ParsedTransaction | null {
  try {
    // Extract recipient merchant name
    const recipientMatch =
      emailBody.match(/Recipient\s*([^\n\r]*?)\s*(?:Date|\s*&nbsp;|$)/i) ||
      emailBody.match(/Recipient\s*:\s*([^\n\r]+?)(?:\s+JAKARTA|\s+Date|$)/i);

    let recipient = recipientMatch?.[1]?.trim() || "";
    if (recipient) {
      // Clean up recipient
      recipient = recipient
        .replace(/\s*(?:JAKARTA(?:\s+[A-Z]+)?(?:\s*-\s*ID)?|Date).*$/i, "")
        .trim();
      recipient = recipient
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      recipient = recipient.replace(/^:\s*/, "");
    }

    // Extract location - look for location after recipient name
    const locationMatch = emailBody.match(
      /Recipient[\s\S]*?([A-Z\s]+(?:\s*-\s*[A-Z]+)?)\s*(?:Date|Time|Transaction|$)/i,
    );
    let location = "";
    if (locationMatch?.[1]) {
      // Extract the location part (usually after the merchant name)
      const locationPart = locationMatch[1].trim();
      // Look for location pattern (CITY - COUNTRY format)
      const cityCountryMatch = locationPart.match(/([A-Z\s]+)\s*-\s*([A-Z]+)/i);
      if (cityCountryMatch) {
        location = cityCountryMatch[0].trim();
      }
    }

    // Extract acquirer
    const acquirerMatch = emailBody.match(/Acquirer\s+([^\n\r]+)/i);
    const acquirer =
      acquirerMatch?.[1]
        ?.trim()
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim() || "";

    // Extract amount
    const amountMatch =
      emailBody.match(/Transaction\s+Amount\s+(?:Rp|IDR)\s+([\d,.]+)/i) ||
      emailBody.match(/Amount\s+(?:Rp|IDR)\s+([\d,.]+)/i);
    const amount = parseIndonesianRupiah(amountMatch?.[1]?.trim() || "0");

    // Extract reference number
    const refMatch =
      emailBody.match(/Transaction\s+Ref\.?\s+No\.?\s+(\d+)/i) ||
      emailBody.match(/Reference\s+No\.?\s+(\d+)/i);
    const transactionRefNo = refMatch?.[1]?.trim() || "";

    // Extract additional fields
    const qrisRefMatch = emailBody.match(/QRIS\s+Ref\.?\s+No\.?\s+(\d+)/i);
    const merchantPanMatch = emailBody.match(/Merchant\s+PAN\s+(\d+)/i);
    const customerPanMatch = emailBody.match(/Customer\s+PAN\s+(\d+)/i);
    const terminalIdMatch = emailBody.match(/Terminal\s+ID\s+(\d+)/i);

    // Extract source of fund and account
    let sourceMatch =
      emailBody.match(/Source of Fund\s*([^\n\r]*?)\s*(?:\*{4}(\d+)|$)/i) ||
      emailBody.match(/([^\n\r]*?)\s*\*{4}(\d+)/i);

    if (!sourceMatch) {
      // Try to find source of fund with just **** (no numbers)
      const sourceOfFundMatch = emailBody.match(
        /Source of Fund\s*([^\n\r]*?)/i,
      );
      const justMaskedMatch = emailBody.match(/\*{4}(?!\d)/); // **** without following digits
      if (sourceOfFundMatch && justMaskedMatch) {
        sourceMatch = [
          justMaskedMatch[0],
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try to match the specific text structure from the email
      const sourceOfFundMatch = emailBody.match(
        /Source of Fund\s*([^\n\r]*?)\s*\*\*\*\*/i,
      );
      if (sourceOfFundMatch) {
        sourceMatch = [
          "****",
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try a more precise pattern that stops at the end of the source of fund section
      const sourceOfFundMatch = emailBody.match(
        /Source of Fund\s*([^\n\r]*?)\s*\*\*\*\*\s*(?:\n|$)/i,
      );
      if (sourceOfFundMatch) {
        sourceMatch = [
          "****",
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try to find the exact pattern from the problematic email, but avoid using [^]* (negated empty character class)
      const sourceOfFundMatch = emailBody.match(
        /Source of Fund\s*((?:.|\n)*?Credit Card(?:.|\n)*?Mandiri(?:.|\n)*?Platinum(?:.|\n)*?)\s*\*\*\*\*/i,
      );
      if (sourceOfFundMatch) {
        sourceMatch = [
          "****",
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    if (!sourceMatch) {
      // Try a very specific pattern that stops at the right boundary
      const sourceOfFundMatch = emailBody.match(
        /Source of Fund\s*((?:.|\n)*?)\s*\*\*\*\*\s*(?:Save this email|Thank you|PT Bank|$)/i,
      );
      if (sourceOfFundMatch) {
        sourceMatch = [
          "****",
          sourceOfFundMatch[1] || "",
          "",
        ] as RegExpMatchArray;
      }
    }

    const sourceOfFund = sourceMatch?.[1]?.trim() || "";
    const sourceAccount = sourceMatch?.[2]?.trim() || "";

    // Extract date and time
    const dateMatch = emailBody.match(/Date\s+(\d{1,2}\s+\w+\s+\d{4})/i);
    const timeMatch = emailBody.match(/Time\s+(\d{2}:\d{2}:\d{2}\s+WIB)/i);
    const dateStr = dateMatch?.[1];
    const timeStr = timeMatch?.[1];

    // Validate required fields
    if (!recipient || !amount || amount <= 0) {
      return null;
    }

    // Final fallback: remove masking from source account if it still has it
    const finalSourceAccount = sourceAccount.replace(/^\*{4}/, "") || "";

    return {
      recipient,
      location,
      transactionDate: parseBankMandiriDateTime(dateStr || "", timeStr || ""),
      amount,
      fee: 0, // No fee for merchant payments
      totalAmount: amount, // Same as amount for merchant payments
      currency: "IDR",
      transactionRefNo,
      qrisRefNo: qrisRefMatch?.[1],
      merchantPan: merchantPanMatch?.[1],
      customerPan: customerPanMatch?.[1],
      acquirer,
      terminalId: terminalIdMatch?.[1],
      sourceOfFund: sourceOfFund || "",
      sourceAccount: finalSourceAccount,
      recipientBank: "", // Not applicable for merchant payments
      recipientBankAccount: "", // Not applicable for merchant payments
      transferPurpose: "", // Not applicable for merchant payments
      bankSender: actualSender || "",
      emailSubject: subjectHeader,
      transactionType: "",
      status: "",
      direction: "out",
    };
  } catch (error) {
    return null;
  }
}

export function parseTransactionEmail(
  message: GmailMessage,
): ParsedTransaction | null {
  const headers = message.payload.headers;
  const fromHeader = headers.find((h) => h.name === "From")?.value || "";

  // Route to appropriate parser based on sender
  if (fromHeader.includes("noreply.livin@bankmandiri.co.id")) {
    return parseBankMandiriEmail(message);
  }

  // TODO: Add parsers for other banks (BCA, BRI, etc.)
  // if (fromHeader.includes('noreply@bca.co.id')) {
  //   return parseBCAEmail(message);
  // }

  return null;
}

// Gmail Push Notification Setup
export async function setupGmailPushNotifications(
  accessToken: string,
  topicName: string,
) {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    // Watch for changes in the user's mailbox
    const watchResponse = await gmail.users.watch({
      userId: "me",
      requestBody: {
        topicName: topicName, // Your Pub/Sub topic
        labelIds: ["INBOX"], // Watch INBOX for new messages
      },
    });

    return watchResponse.data;
  } catch (error) {
    throw new Error(
      `Failed to setup push notifications: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function stopGmailPushNotifications(accessToken: string) {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    // Stop watching
    await gmail.users.stop({
      userId: "me",
    });

    return { success: true };
  } catch (error) {
    throw new Error(
      `Failed to stop push notifications: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
