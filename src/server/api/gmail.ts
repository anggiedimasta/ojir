import { google } from 'googleapis';
import type { GmailMessage, ParsedTransaction } from '~/entities/api/wallet';

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
  } = {}
): Promise<{ messages: GmailMessage[]; nextPageToken?: string }> {
  try {
    // Create OAuth2 client and set credentials
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    // Create Gmail client with authenticated OAuth2 client
    const gmail = google.gmail({
      version: 'v1',
      auth: oauth2Client,
    });

    // Default query to find bank transaction emails
    const defaultQuery = 'from:(noreply.livin@bankmandiri.co.id OR noreply@bca.co.id OR noreply@bri.co.id) subject:(payment OR transfer OR transaction)';
    const query = options.query || defaultQuery;

    // List messages
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
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
          userId: 'me',
          id: messageRef.id,
          format: 'full',
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

    throw new Error(`Failed to fetch Gmail messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function parseBankMandiriEmailFromHtml(htmlContent: string): ParsedTransaction | null {
  try {
    // Decode quoted-printable encoding first
    let decodedHtml = htmlContent
      .replace(/=3D/g, '=')
      .replace(/=\r?\n/g, '') // Remove soft line breaks
      .replace(/=[0-9A-F]{2}/g, (match) => {
        // Decode hex-encoded characters
        const hex = match.substring(1);
        return String.fromCharCode(parseInt(hex, 16));
      });



    // Use decoded HTML for pattern matching
    htmlContent = decodedHtml;



    // Check if this is a QR transfer email vs BI Fast transfer vs merchant payment
    const isQRTransfer = htmlContent.includes('QR Transfer Successful') || htmlContent.includes('QR transfer details');
    const isBIFastTransfer = htmlContent.includes('BI Fast Transfer Successful') || htmlContent.includes('BI Fast Ref. No.');

    let recipient = '';
    let location = '';
    let transactionType = 'payment';
    let acquirer = '';

    if (isBIFastTransfer) {


      // For BI Fast transfers, extract recipient person's name and their bank
      const recipientMatch = htmlContent.match(/<p[^>]*>Recipient<\/p>[^<]*<h4[^>]*>([^<]+)<\/h4>[^<]*<p[^>]*>([^<]+)<\/p>/is);

      if (recipientMatch) {
              recipient = recipientMatch[1]?.trim() || ''; // Person's name
      const recipientBank = recipientMatch[2]?.trim() || ''; // Bank name (e.g., "Bank Rakyat Indonesia - 039601005387539")

              // Extract bank name from the full string
        const bankMatch = recipientBank.match(/Bank\s+([^-]+)/i);
        if (bankMatch && bankMatch[1]) {
          // Clean up HTML entities and extra whitespace
          const cleanBankName = bankMatch[1].trim()
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          location = `Bank ${cleanBankName}`; // e.g., "Bank Rakyat Indonesia"
        } else {
          // Clean up HTML entities and extra whitespace
          const cleanBankName = (recipientBank || '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          location = cleanBankName;
        }
      }

      transactionType = 'transfer';


    } else if (isQRTransfer) {


      // For QR transfers, extract recipient person's name and their bank
      const recipientMatch = htmlContent.match(/<p[^>]*>Recipient<\/p>[^<]*<h4[^>]*>([^<]+)<\/h4>[^<]*<p[^>]*>([^<]+)<\/p>/is);

      if (recipientMatch) {
        recipient = recipientMatch[1]?.trim() || ''; // Person's name
        const recipientBank = recipientMatch[2]?.trim() || ''; // Bank name (e.g., "Bank BCA")

        // For transfers, the bank is not an acquirer but the recipient's bank
        // We can show this in the location field or create a specific field
        location = recipientBank;
      }

      transactionType = 'transfer';


    } else {


      // Extract recipient using HTML structure - look for h4 after "Recipient"
      // More flexible patterns to handle different HTML formatting
      const recipientMatch = htmlContent.match(/<p[^>]*>Recipient<\/p>[^<]*<h4[^>]*>([^<]+)<\/h4>/is) ||
                            htmlContent.match(/Recipient<\/p>\s*<h4[^>]*>([^<]+)<\/h4>/is) ||
                            htmlContent.match(/Recipient[^<]*<h4[^>]*>([^<]+)<\/h4>/is) ||
                            htmlContent.match(/<h4[^>]*style[^>]*text-align:left[^>]*>([^<]+)<\/h4>/is);
      recipient = recipientMatch?.[1]?.trim() || '';

      // Extract location - look for p tag that contains "JAKARTA" and "ID"
      const locationMatch = htmlContent.match(/<p[^>]*>([^<]*JAKARTA[^<]*-[^<]*ID[^<]*)<\/p>/is) ||
                           htmlContent.match(/>(JAKARTA[^<]*-[^<]*ID[^<]*)</is);
      location = locationMatch?.[1]?.trim() || '';

      // Extract acquirer for merchant payments
      const acquirerMatch = htmlContent.match(/<td[^>]*>Acquirer<\/td>\s*<td[^>]*>([^<]+)<\/td>/is);
      const rawAcquirer = acquirerMatch?.[1]?.trim() || '';
      // Clean up HTML entities and extra whitespace
      acquirer = rawAcquirer
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Extract date - more flexible pattern
    const dateMatch = htmlContent.match(/<td[^>]*>Date<\/td>\s*<td[^>]*>([^<]+)<\/td>/is) ||
                     htmlContent.match(/Date<\/td>[^<]*<td[^>]*>([^<]+)<\/td>/is) ||
                     htmlContent.match(/Date[^<]*>([^<]*\d{1,2}\s+\w+\s+\d{4}[^<]*)</is);
    const dateStr = dateMatch?.[1]?.trim();

    // Extract time - more flexible pattern
    const timeMatch = htmlContent.match(/<td[^>]*>Time<\/td>\s*<td[^>]*>([^<]+)<\/td>/is) ||
                     htmlContent.match(/Time<\/td>[^<]*<td[^>]*>([^<]+)<\/td>/is) ||
                     htmlContent.match(/Time[^<]*>([^<]*\d{2}:\d{2}:\d{2}[^<]*WIB[^<]*)</is);
    const timeStr = timeMatch?.[1]?.trim();

    // Extract amount - handle both "Amount" and "Total Transaction" for transfers
    let amountMatch;
    let rawAmountStr = '';

    if (isQRTransfer || isBIFastTransfer) {
      // For QR transfers and BI Fast transfers, use "Total Transaction" as the final amount (includes fees)
      amountMatch = htmlContent.match(/<td[^>]*>Total\s*Transaction<\/td>\s*<td[^>]*>(?:Rp|IDR)\s*([\d,.]+)<\/td>/is) ||
                   htmlContent.match(/Total\s*Transaction<\/td>[^<]*<td[^>]*>(?:Rp|IDR)\s*([\d,.]+)<\/td>/is);

      // If not found, fallback to regular amount
      if (!amountMatch) {
        amountMatch = htmlContent.match(/<td[^>]*>Amount<\/td>\s*<td[^>]*>(?:Rp|IDR)\s*([\d,.]+)<\/td>/is) ||
                     htmlContent.match(/Amount<\/td>[^<]*<td[^>]*>(?:Rp|IDR)\s*([\d,.]+)<\/td>/is) ||
                     htmlContent.match(/Transfer\s*Amount<\/td>[^<]*<td[^>]*>(?:Rp|IDR)\s*([\d,.]+)<\/td>/is);
      }
    } else {
      // For merchant payments, use regular "Transaction Amount"
      amountMatch = htmlContent.match(/<td[^>]*>Transaction\s*Amount<\/td>\s*<td[^>]*>(?:Rp|IDR)\s*([\d,.]+)<\/td>/is) ||
                   htmlContent.match(/Transaction\s*Amount<\/td>[^<]*<td[^>]*>(?:Rp|IDR)\s*([\d,.]+)<\/td>/is) ||
                   htmlContent.match(/Amount[^<]*>(?:Rp|IDR)\s*([\d,.]+)</is) ||
                   htmlContent.match(/(?:Rp|IDR)\s*([\d,.]+)/is);
    }

    rawAmountStr = amountMatch?.[1]?.trim() || '';

    // Extract transaction ref - more flexible
    const transactionRefMatch = htmlContent.match(/Transaction\s*Ref[^<]*No[^<]*<\/td>\s*<td[^>]*>([^<]+)<\/td>/is) ||
                               htmlContent.match(/Transaction\s*Ref[^<]*No[^<]*>([^<]*\d{10,}[^<]*)</is) ||
                               htmlContent.match(/Reference\s*No[^<]*<\/td>\s*<td[^>]*>([^<]+)<\/td>/is) ||
                               htmlContent.match(/Reference\s*No[^<]*>([^<]*\d{10,}[^<]*)</is) ||
                               htmlContent.match(/BI\s*Fast\s*Ref[^<]*No[^<]*<\/td>\s*<td[^>]*>([^<]+)<\/td>/is) ||
                               htmlContent.match(/BI\s*Fast\s*Ref[^<]*No[^<]*>([^<]*\d{10,}[^<]*)</is);
    const transactionRefNo = transactionRefMatch?.[1]?.trim();

    // Extract virtual account number from recipient area (only for merchant payments)
    let virtualAccountNo = '';
    if (!isQRTransfer && recipient) {
      // Look for numeric string after recipient name (common in virtual account emails)
      const vaMatch = htmlContent.match(new RegExp(`<h4[^>]*>${recipient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\/h4>\\s*<div[^>]*>([0-9]{10,})<\/div>`, 'is'));
      virtualAccountNo = vaMatch?.[1]?.trim() || '';
    }

    // Extract QRIS ref (only for merchant payments)
    let qrisRefNo = '';
    if (!isQRTransfer) {
      const qrisRefMatch = htmlContent.match(/QRIS\s*Ref[^<]*No[^<]*<\/td>\s*<td[^>]*>([^<]+)<\/td>/is) ||
                          htmlContent.match(/QRIS\s*Ref[^<]*No[^<]*>([^<]*\d{10,}[^<]*)</is);
      qrisRefNo = qrisRefMatch?.[1]?.trim() || '';
    }

    // Extract merchant PAN (only for merchant payments)
    const merchantPanMatch = !isQRTransfer ? htmlContent.match(/<td[^>]*>Merchant PAN<\/td>\s*<td[^>]*>([^<]+)<\/td>/is) : null;
    const merchantPan = merchantPanMatch?.[1]?.trim() || '';

    // Extract customer PAN (only for merchant payments)
    const customerPanMatch = !isQRTransfer ? htmlContent.match(/<td[^>]*>Customer PAN<\/td>\s*<td[^>]*>([^<]+)<\/td>/is) : null;
    const customerPan = customerPanMatch?.[1]?.trim() || '';

    // Extract terminal ID (only for merchant payments)
    const terminalIdMatch = !isQRTransfer ? htmlContent.match(/<td[^>]*>Terminal ID<\/td>\s*<td[^>]*>([^<]+)<\/td>/is) : null;
    const terminalId = terminalIdMatch?.[1]?.trim() || '';

    // Extract source of fund info
    const sourceOfFundMatch = htmlContent.match(/<p[^>]*>Source of Fund<\/p>\s*<h4[^>]*>([^<]+)<\/h4>\s*<p[^>]*>([^<]+)<\/p>/is);
    const sourceOfFund = sourceOfFundMatch?.[1]?.trim() || '';
    const sourceAccount = sourceOfFundMatch?.[2]?.trim() || '';



    if (!recipient || !rawAmountStr) {
      const missingFields = [];
      if (!recipient) missingFields.push('recipient');
      if (!rawAmountStr) missingFields.push('amount');

      return null;
    }

    // For QR transfers, don't do bank name processing since recipient is a person
    let actualRecipient = recipient;
    let actualAcquirer = acquirer;

    if (!isQRTransfer) {
      // Check if recipient is actually a bank name and should be moved to acquirer (only for merchant payments)
      const bankPatterns = [
        /^Bank\s+(BCA|BRI|BNI|MANDIRI|CIMB|PERMATA|DANAMON|MAYBANK)/i,
        /^(BCA|BRI|BNI|MANDIRI|CIMB|PERMATA|DANAMON|MAYBANK)\s*$/i,
      ];

      // If recipient looks like a bank name, try to extract merchant from other fields
      if (recipient && bankPatterns.some(pattern => pattern.test(recipient))) {
        // Move bank name to acquirer if not already set
        if (!actualAcquirer) {
          actualAcquirer = recipient;
        }

        // Try to find actual merchant name from h4 tags or other sources
        const allH4Matches = htmlContent.match(/<h4[^>]*>([^<]+)<\/h4>/gis);
        if (allH4Matches) {
          for (const h4Match of allH4Matches) {
            const h4Text = h4Match.replace(/<[^>]*>/g, '').trim();
            // Skip if it's a bank name, user name, or generic text
            if (!bankPatterns.some(pattern => pattern.test(h4Text)) &&
                !h4Text.match(/Payment|Transaction|Source/i) &&
                h4Text.length > 3) {
              actualRecipient = h4Text;
              break;
            }
          }
        }
      }
    }

    // Detect transaction direction based on email content and patterns
    let direction: "in" | "out" = "out"; // Default to expense

    // Check for income indicators in email content
    const incomePatterns = [
      /refund/i,
      /transfer.*received/i,
      /payment.*received/i,
      /deposit/i,
      /credit/i,
      /incoming/i
    ];

    const expensePatterns = [
      /payment.*successful/i,
      /transaction.*successful/i,
      /payment.*completed/i,
      /transfer.*successful/i, // Add transfer successful pattern
      /purchase/i,
      /withdrawal/i,
      /debit/i
    ];

    // Check email subject and content for direction indicators
    const emailContent = `${htmlContent}`;

    const hasIncomePattern = incomePatterns.some(pattern => pattern.test(emailContent));
    const hasExpensePattern = expensePatterns.some(pattern => pattern.test(emailContent));

    if (hasIncomePattern && !hasExpensePattern) {
      direction = "in";
    } else if (hasExpensePattern || (!hasIncomePattern && !hasExpensePattern)) {
      // Default to expense if unclear or has expense patterns
      // QR transfers are typically "out" (sending money)
      direction = "out";
    }



    // Parse Indonesian Rupiah format: "55.000,00" = 55000.00
    let amount = 0;
    if (rawAmountStr) {
      // Handle Indonesian format: periods are thousand separators, comma is decimal separator
      if (rawAmountStr.includes(',')) {
        // Split by comma to separate integer and decimal parts
        const parts = rawAmountStr.split(',');
        const integerPart = parts[0];
        const decimalPart = parts[1];
        if (integerPart) {
          // Remove periods (thousand separators) from integer part
          const cleanInteger = integerPart.replace(/\./g, '');
          // Combine as decimal number
          amount = parseFloat(`${cleanInteger}.${decimalPart || '00'}`);
        }
      } else {
        // No comma, just remove periods and treat as integer
        amount = parseFloat(rawAmountStr.replace(/\./g, ''));
      }
    }

    // Parse date and time
    let transactionDate = new Date();
    if (dateStr && timeStr) {
      // Convert "2 Aug 2025" and "20:44:34 WIB" to Date
      const dateTimeStr = `${dateStr} ${timeStr.replace(' WIB', '+07:00')}`;
      const parsedDate = new Date(dateTimeStr);
      if (!isNaN(parsedDate.getTime())) {
        transactionDate = parsedDate;
      }
    }

    return {
      recipient: actualRecipient,
      location: location,
      transactionDate,
      amount,
      currency: 'IDR',
      transactionRefNo: transactionRefNo || '',
      qrisRefNo,
      merchantPan,
      customerPan,
      acquirer: actualAcquirer,
      terminalId,
      sourceOfFund: sourceOfFund,
      sourceAccount: sourceAccount,
      bankSender: 'noreply.livin@bankmandiri.co.id',
      emailSubject: isQRTransfer ? 'Transfer Successful' : 'Payment is Successful!',
      transactionType: transactionType,
      status: 'successful',
      direction: direction,
      virtualAccountNo: virtualAccountNo,
    };
  } catch (error) {

    return null;
  }
}

export function parseBankMandiriEmail(message: GmailMessage): ParsedTransaction | null {
  try {
    // Get email headers
    const headers = message.payload.headers;
    const fromHeader = headers.find(h => h.name === 'From')?.value || '';
    const subjectHeader = headers.find(h => h.name === 'Subject')?.value || '';
    const dateHeader = headers.find(h => h.name === 'Date')?.value || '';

    // Only process Bank Mandiri emails
    if (!fromHeader.includes('noreply.livin@bankmandiri.co.id')) {
      return null;
    }

    // Try to get HTML content first for better parsing
    let htmlContent = '';
    let emailBody = '';

    // First try to get HTML from the main payload or parts
    if (message.payload.body?.data) {
      const content = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
      if (message.payload.mimeType === 'text/html') {
        htmlContent = content;
      } else {
        emailBody = content;
      }
    }
    // Check parts for HTML content
    else if (message.payload.parts) {
      for (const part of message.payload.parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          htmlContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
          break;
        }
        // Also get plain text as fallback
        if (part.mimeType === 'text/plain' && part.body?.data && !emailBody) {
          emailBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      }

      // Check nested parts if needed
      if (!htmlContent) {
        for (const part of message.payload.parts) {
          if (part.mimeType === 'multipart/alternative' && part.parts) {
            for (const nestedPart of part.parts) {
              if (nestedPart.mimeType === 'text/html' && nestedPart.body?.data) {
                htmlContent = Buffer.from(nestedPart.body.data, 'base64').toString('utf-8');
                break;
              }
              if (nestedPart.mimeType === 'text/plain' && nestedPart.body?.data && !emailBody) {
                emailBody = Buffer.from(nestedPart.body.data, 'base64').toString('utf-8');
              }
            }
            if (htmlContent) break;
          }
        }
      }
    }

    // Try HTML parsing first if we have HTML content
    if (htmlContent) {

      const htmlResult = parseBankMandiriEmailFromHtml(htmlContent);
      if (htmlResult) {

        return htmlResult;
      }

    }

    // Fall back to the existing regex-based parsing if HTML parsing fails
    if (!emailBody && htmlContent) {
      // If we only have HTML, convert it to text for regex parsing
      emailBody = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    if (!emailBody) {

      return null;
    }



    // Check if this is a QR transfer email vs BI Fast transfer vs merchant payment
    const isQRTransfer = subjectHeader.includes('QR Transfer Successful') || emailBody.includes('QR transfer details');
    const isBIFastTransfer = subjectHeader.includes('BI Fast Transfer Successful') || emailBody.includes('BI Fast Ref. No.');

    let recipient = '';
    let location = '';
    let transactionType = 'payment';
    let actualAcquirer = '';

    if (isBIFastTransfer) {


      // For BI Fast transfers, extract recipient person's name
      const recipientMatch = emailBody.match(/Recipient\s*([^\n\r]*?)\s*(?:Bank|Date|\s*&nbsp;|$)/i);

      if (recipientMatch) {
        recipient = recipientMatch[1]?.trim() || ''; // Person's name

        // Extract the bank name separately
        const bankMatch = emailBody.match(/Bank\s+([^-]+)/i);
        if (bankMatch && bankMatch[1]) {
          // Clean up HTML entities and extra whitespace
          const cleanBankName = bankMatch[1].trim()
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          location = `Bank ${cleanBankName}`; // e.g., "Bank Rakyat Indonesia"
        }
      }

      transactionType = 'transfer';


    } else if (isQRTransfer) {


      // For QR transfers, extract recipient person's name
      const recipientMatch = emailBody.match(/Recipient\s*([^\n\r]*?)\s*(?:Bank|Date|\s*&nbsp;|$)/i);

      if (recipientMatch) {
        recipient = recipientMatch[1]?.trim() || ''; // Person's name

        // Extract the bank name separately
        const bankMatch = emailBody.match(/Bank\s+(BCA|BRI|BNI|MANDIRI|CIMB|PERMATA|DANAMON|MAYBANK)[^A-Z]*/i);
        if (bankMatch && bankMatch[1]) {
          location = `Bank ${bankMatch[1]}`; // e.g., "Bank BCA"
        }
      }

      transactionType = 'transfer';


    } else {


      // Parse Bank Mandiri transaction details with more flexible patterns
      // Extract recipient merchant name - improved pattern to handle LIPPO in merchant names
      const recipientMatch = emailBody.match(/Recipient\s*([^\n\r]*?)\s*(?:Date|\s*&nbsp;|$)/i) ||
                            emailBody.match(/Recipient\s*:\s*([^\n\r]+?)(?:\s+JAKARTA|\s+Date|$)/i) ||
                            emailBody.match(/Recipient\s+([A-Z0-9\s]+(?:LIPPO|MALL|STORE|CAFE|RESTAURANT)?[A-Z0-9\s]*?)(?:\s+JAKARTA|\s+Date|\s*$)/i);

      // Clean up recipient if it contains extra data
      let cleanRecipient = recipientMatch?.[1]?.trim();
      if (cleanRecipient) {
        // Remove any trailing location data but keep LIPPO if it's part of merchant name
        cleanRecipient = cleanRecipient.replace(/\s*(?:JAKARTA(?:\s+[A-Z]+)?(?:\s*-\s*ID)?|Date).*$/i, '').trim();

        // Clean up any HTML entities or extra whitespace
        cleanRecipient = cleanRecipient.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

        // If recipient starts with colon, remove it (e.g., ": Tokopedia" -> "Tokopedia")
        cleanRecipient = cleanRecipient.replace(/^:\s*/, '');

        // If it's still too long, try to extract just the core merchant name
        if (cleanRecipient.length > 50) {
          const merchantMatch = cleanRecipient.match(/^([A-Z\s\d]+(?:MALL|PLAZA|STORE|SHOP|CAFE|RESTAURANT|LIPPO|PU)?[A-Z\s\d]*?)(?:\s+\d{10,})?$/i);
          if (merchantMatch && merchantMatch[1]) {
            cleanRecipient = merchantMatch[1].trim();
          }
        }
      }

      recipient = cleanRecipient || '';

      const locationMatch = emailBody.match(/(JAKARTA\s+BARAT\s*-\s*ID)/i) ||
                           emailBody.match(/(JAKARTA\s+TIMUR\s*-\s*ID)/i) ||
                           emailBody.match(/([A-Z\s]+)\s*-\s*ID/);
      location = locationMatch?.[1]?.trim() || '';

      const textAcquirerMatch = emailBody.match(/Acquirer\s+([^\n\r]+)/i);
      const rawAcquirer = textAcquirerMatch?.[1]?.trim() || '';
      // Clean up HTML entities and extra whitespace
      actualAcquirer = rawAcquirer
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Extract acquirer first (needed for bank detection logic)
    const fallbackAcquirerMatch = htmlContent.match(/<td[^>]*>Acquirer<\/td>\s*<td[^>]*>([^<]+)<\/td>/is);

    // Check if recipient is actually a bank name and should be moved to acquirer (only for merchant payments)
    let actualRecipient = recipient;
    if (!actualAcquirer) {
      actualAcquirer = fallbackAcquirerMatch?.[1]?.trim() || '';
    }

    if (!isQRTransfer) {
      const bankPatterns = [
        /^Bank\s+(BCA|BRI|BNI|MANDIRI|CIMB|PERMATA|DANAMON|MAYBANK)/i,
        /^(BCA|BRI|BNI|MANDIRI|CIMB|PERMATA|DANAMON|MAYBANK)\s*$/i,
      ];

      // If recipient looks like a bank name, try to extract merchant from other fields
      if (recipient && bankPatterns.some(pattern => pattern.test(recipient))) {
        // Move bank name to acquirer if not already set
        if (!actualAcquirer) {
          actualAcquirer = recipient;
        }

        // Try to find actual merchant name from h4 tags or other sources
        const allH4Matches = htmlContent.match(/<h4[^>]*>([^<]+)<\/h4>/gis);
        if (allH4Matches) {
          for (const h4Match of allH4Matches) {
            const h4Text = h4Match.replace(/<[^>]*>/g, '').trim();
            // Skip if it's a bank name, user name, or generic text
            if (!bankPatterns.some(pattern => pattern.test(h4Text)) &&
                !h4Text.match(/Payment|Transaction|Source/i) &&
                h4Text.length > 3) {
              actualRecipient = h4Text;
              break;
            }
          }
        }
      }
    }

    const dateMatch = emailBody.match(/Date\s+(\d{1,2}\s+\w+\s+\d{4})/i);
    const timeMatch = emailBody.match(/Time\s+(\d{2}:\d{2}:\d{2}\s+WIB)/i);

    // Handle different amount patterns for transfers vs payments
    let amountMatch;
    if (isQRTransfer || isBIFastTransfer) {
      // For QR transfers and BI Fast transfers, look for "Total Transaction" first, then fallback to "Amount"
      amountMatch = emailBody.match(/Total\s+Transaction\s+(?:Rp|IDR)\s+([\d,.]+)/i) ||
                   emailBody.match(/Amount\s+(?:Rp|IDR)\s+([\d,.]+)/i) ||
                   emailBody.match(/Transfer\s+Amount\s+(?:Rp|IDR)\s+([\d,.]+)/i) ||
                   emailBody.match(/(?:Rp|IDR)\s+([\d,.]+)/i);
    } else {
      // For merchant payments, use regular "Transaction Amount"
      amountMatch = emailBody.match(/Transaction\s+Amount\s+(?:Rp|IDR)\s+([\d,.]+)/i) ||
                   emailBody.match(/Amount\s+(?:Rp|IDR)\s+([\d,.]+)/i) ||
                   emailBody.match(/(?:Rp|IDR)\s+([\d,.]+)/i);
    }

    const transactionRefMatch = emailBody.match(/Transaction\s+Ref\.?\s+No\.?\s+(\d+)/i) ||
                               emailBody.match(/Ref\.?\s+No\.?\s+(\d+)/i) ||
                               emailBody.match(/Reference\s+No\.?\s+(\d+)/i) ||
                               emailBody.match(/BI\s+Fast\s+Ref\.?\s+No\.?\s+([A-Z0-9]+)/i);

    // QRIS ref only for merchant payments
    const qrisRefMatch = !isQRTransfer ? emailBody.match(/QRIS\s+Ref\.?\s+No\.?\s+(\d+)/i) : null;

    // Extract virtual account number for virtual account transactions (only for merchant payments)
    let virtualAccountNo = '';
    if (!isQRTransfer && actualRecipient && /tokopedia|shopee|bukalapak|blibli/i.test(actualRecipient)) {
      const vaMatch = emailBody.match(/(\d{10,})/);
      virtualAccountNo = vaMatch?.[1] || '';
    }

    const merchantPanMatch = !isQRTransfer ? emailBody.match(/Merchant\s+PAN\s+(\d+)/i) : null;
    const customerPanMatch = !isQRTransfer ? emailBody.match(/Customer\s+PAN\s+(\d+)/i) : null;
    const terminalIdMatch = !isQRTransfer ? emailBody.match(/Terminal\s+ID\s+(\d+)/i) : null;
        const sourceAccountMatch = emailBody.match(/\*{4}(\d+)/);

        // Extract source of fund data - look for the raw data in the email
    // This could be in various formats, so let's capture what we find
    let sourceOfFund = '';

            // Try to find source of fund in different possible formats
        // Make patterns more specific to avoid capturing HTML tags
        const sourceOfFundPatterns = [
          /Source\s+of\s+Fund\s*:\s*([^<>\n\r]+)/i,  // More specific - stop at HTML tags
          /Source\s+of\s+Fund\s*([^<>\n\r]+)/i,      // More specific - stop at HTML tags
          /Bank\s+Mandiri\s+Debit\s*([^<>\n\r]+)/i,  // More specific - stop at HTML tags
          /Debit\s+([^<>\n\r]+)/i,                    // More specific - stop at HTML tags
          /Account\s*:\s*([^<>\n\r]+)/i,              // More specific - stop at HTML tags
          /Card\s*:\s*([^<>\n\r]+)/i                  // More specific - stop at HTML tags
        ];

    for (const pattern of sourceOfFundPatterns) {
      const match = emailBody.match(pattern);
      if (match && match[1]) {
        sourceOfFund = match[1].trim();

        break;
      }
    }

                // If no pattern matched, try to find the account number and name separately
    if (!sourceOfFund) {
      // Look for the full account number format (****2191) in the email
      // Try multiple patterns to find the account number in different HTML structures
      const accountNumberPatterns = [
        /<p[^>]*>\s*\*{4}\d+\s*<\/p>/i,  // Account number in p tag
        /\*{4}\d+/i,                      // Any **** followed by digits
        /<td[^>]*>\s*\*{4}\d+\s*<\/td>/i  // Account number in td tag
      ];

      let accountNumber = '';
      for (const pattern of accountNumberPatterns) {
        const match = emailBody.match(pattern);
        if (match) {
          // Extract just the account number part
          const accountMatch = match[0].match(/\*{4}\d+/);
          if (accountMatch) {
            accountNumber = accountMatch[0];
            break;
          }
        }
      }

      // Look for account holder name in h4 tags
      const nameMatch = emailBody.match(/<h4[^>]*>\s*([A-Z\s]+)\s*<\/h4>/i);
      let name = '';
      if (nameMatch && nameMatch[1]) {
        name = nameMatch[1].trim();
        // Skip if it's a bank name or generic text
        if (name.match(/Bank|Payment|Transaction|Source|Recipient|Amount|Date|Time/i)) {
          name = '';
        }
      }



      if (accountNumber && name) {
        sourceOfFund = `${accountNumber} ${name}`;
      } else if (accountNumber) {
        sourceOfFund = accountNumber;
      } else if (name) {
        sourceOfFund = name;
      }
    }





    // Extract and validate required fields
    const finalRecipient = actualRecipient;
    const finalLocation = location;

    // Parse Indonesian Rupiah format: "55.000,00" = 55000.00
    let amount = 0;
    const rawAmountStr = amountMatch?.[1];

    if (rawAmountStr) {
      // Remove commas first for processing
      const amountStr = rawAmountStr.replace(/,/g, '');

      // Handle Indonesian format: periods are thousand separators, comma is decimal separator
      if (rawAmountStr.includes(',')) {
        // Split by comma to separate integer and decimal parts
        const parts = rawAmountStr.split(',');
        const integerPart = parts[0];
        const decimalPart = parts[1];
        if (integerPart) {
          // Remove periods (thousand separators) from integer part
          const cleanInteger = integerPart.replace(/\./g, '');
          // Combine as decimal number
          amount = parseFloat(`${cleanInteger}.${decimalPart || '00'}`);
        }
      } else {
        // No comma, just remove periods and treat as integer
        amount = parseFloat(amountStr.replace(/\./g, ''));
      }
    }



    if (!finalRecipient || !amount || amount <= 0) {
      const missingFields = [];
      if (!finalRecipient) missingFields.push('recipient');
      if (!amount || amount <= 0) missingFields.push('amount');

      return null;
    }

    // Detect transaction direction for fallback parsing as well
    let direction: "in" | "out" = "out"; // Default to expense

    const incomePatterns = [
      /refund/i,
      /transfer.*received/i,
      /payment.*received/i,
      /deposit/i,
      /credit/i,
      /incoming/i
    ];

    const expensePatterns = [
      /payment.*successful/i,
      /transaction.*successful/i,
      /payment.*completed/i,
      /transfer.*successful/i, // Add transfer successful pattern
      /purchase/i,
      /withdrawal/i,
      /debit/i
    ];

    const hasIncomePattern = incomePatterns.some(pattern => pattern.test(emailBody + subjectHeader));
    const hasExpensePattern = expensePatterns.some(pattern => pattern.test(emailBody + subjectHeader));

    if (hasIncomePattern && !hasExpensePattern) {
      direction = "in";
    } else {
      direction = "out";
    }

    // Parse date and time
    const dateStr = dateMatch?.[1];
    const timeStr = timeMatch?.[1];
    let transactionDate = new Date();

    if (dateStr && timeStr) {
      // Convert "2 Aug 2025" and "20:44:34 WIB" to Date
      const dateTimeStr = `${dateStr} ${timeStr.replace(' WIB', '+07:00')}`;
      const parsedDate = new Date(dateTimeStr);
      if (!isNaN(parsedDate.getTime())) {
        transactionDate = parsedDate;
      }
    }

    return {
      recipient: finalRecipient,
      location: finalLocation,
      transactionDate,
      amount,
      currency: 'IDR',
      transactionRefNo: transactionRefMatch?.[1] || '',
      qrisRefNo: qrisRefMatch?.[1],
      merchantPan: merchantPanMatch?.[1],
      customerPan: customerPanMatch?.[1],
      acquirer: actualAcquirer,
      terminalId: terminalIdMatch?.[1],
      sourceOfFund: sourceOfFund,
      sourceAccount: sourceAccountMatch ? `****${sourceAccountMatch[1]}` : '',
      bankSender: fromHeader,
      emailSubject: subjectHeader,
      transactionType: transactionType,
      direction: direction,
      status: 'successful',
      virtualAccountNo: virtualAccountNo,
    };
  } catch (error) {

    return null;
  }
}

export function parseTransactionEmail(message: GmailMessage): ParsedTransaction | null {
  const headers = message.payload.headers;
  const fromHeader = headers.find(h => h.name === 'From')?.value || '';

  // Route to appropriate parser based on sender
  if (fromHeader.includes('noreply.livin@bankmandiri.co.id')) {
    return parseBankMandiriEmail(message);
  }

  // TODO: Add parsers for other banks (BCA, BRI, etc.)
  // if (fromHeader.includes('noreply@bca.co.id')) {
  //   return parseBCAEmail(message);
  // }

  return null;
}

// Gmail Push Notification Setup
export async function setupGmailPushNotifications(accessToken: string, topicName: string) {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const gmail = google.gmail({
      version: 'v1',
      auth: oauth2Client,
    });

    // Watch for changes in the user's mailbox
    const watchResponse = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        topicName: topicName, // Your Pub/Sub topic
        labelIds: ['INBOX'], // Watch INBOX for new messages
      },
    });

    return watchResponse.data;
  } catch (error) {

    throw new Error(`Failed to setup push notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function stopGmailPushNotifications(accessToken: string) {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const gmail = google.gmail({
      version: 'v1',
      auth: oauth2Client,
    });

    // Stop watching
    await gmail.users.stop({
      userId: 'me',
    });

    return { success: true };
  } catch (error) {

    throw new Error(`Failed to stop push notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
