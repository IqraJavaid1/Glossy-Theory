# Glossy Theory — Django Backend Architecture & Setup

This directory contains the production-ready Python Django codebase designed for the **Glossy Theory** luxury makeup e-commerce platform.

## Quickstart

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set environment variables
cp ../.env.example .env

# 3. Apply database migrations
python manage.py makemigrations
python manage.py migrate

# 4. Create your administrator account
python manage.py createsuperuser

# 5. Run local development server
python manage.py runserver 8000
```

## Initial Superuser Credentials
You can create an administrator using:
```bash
python manage.py createsuperuser --username admin --email admin@glossytheory.com
```

## Structure
* `glossy_theory/` - Project settings, WSGI, ASGI, and root routing.
* `catalog/` - Categories, Products, ProductVariants, and Customer Reviews models.
* `orders/` - Order lifecycle, OrderItems, Shipping calculation, and fulfillment statuses.
* `inventory/` - Audit trails, stock levels, and transaction logs.
* `dashboard/` - Administrator dashboard views, analytical metrics, and moderation tools.
