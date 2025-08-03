# OJIR - Personal Finance Tracker

A comprehensive personal finance tracking application that syncs with Gmail to automatically import bank transaction emails.

## Features

- **Email Integration**: Automatically syncs bank transaction emails from Gmail
- **Transaction Parsing**: Intelligently parses transaction details from bank emails
- **Advanced Filtering**: Filter transactions by date, bank, payment method, and more
- **Master Data Management**: Database-driven bank and payment method management
- **Real-time Updates**: Live transaction updates with server-side filtering and pagination

## Master Data Management

The application uses database-driven master data for banks and payment methods instead of hardcoded values. This provides:

- **Extensibility**: Add new banks and payment methods without code changes
- **Consistency**: Centralized data management
- **Performance**: Optimized database queries for filtering

### Master Data Setup

The master data (banks and payment methods) is automatically seeded when the database is set up. The application includes:

- **6 Banks**: Bank Mandiri, BCA, BNI, BRI, CIMB Niaga, and Other Banks
- **5 Payment Methods**: QRIS, Bank Transfer, Virtual Account, BI-FAST, and Other Methods

### Adding New Banks/Payment Methods

New banks and payment methods can be added directly to the database:

```sql
-- Add a new bank
INSERT INTO ojir_bank (id, code, name, display_name, icon_path, is_active, sort_order)
VALUES (gen_random_uuid(), 'new-bank', 'New Bank Name', 'New Bank Display Name', '/icons/bank/new-bank.png', true, 10);

-- Add a new payment method
INSERT INTO ojir_payment_method (id, code, name, display_name, description, icon_path, is_active, sort_order)
VALUES (gen_random_uuid(), 'new-method', 'New Method', 'New Method Display', 'Description', '/icons/payment/new-method.png', true, 10);
```

## Development

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Google OAuth credentials

### Setup

1. **Clone the repository**
2. **Install dependencies**: `bun install`
3. **Set up environment variables** (see `.env.example`)
4. **Run database migrations**: `npx drizzle-kit push`
5. **Start development server**: `bun dev`

### Database Schema

The application uses Drizzle ORM with PostgreSQL. Key tables include:

- `ojir_transaction`: Transaction records from bank emails
- `ojir_bank`: Master data for banks
- `ojir_payment_method`: Master data for payment methods
- `user`: User accounts
- `auth_*`: NextAuth.js authentication tables

## Troubleshooting

### Filter Components Not Working

If the bank/payment method filters show "No banks available" or "No methods available":

1. **Check database**: Verify the `ojir_bank` and `ojir_payment_method` tables exist and contain data
2. **Refresh the page**: The filters should update automatically
3. **Check authentication**: Ensure you're logged in (filters require authentication)

## License

MIT License - see LICENSE file for details.
