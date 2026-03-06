#!/bin/bash
echo "Starting Flask E-commerce Backend..."

# Unset any problematic environment variables
unset DATABASE_URL

# Set Flask environment
export FLASK_APP=run.py
export FLASK_ENV=development
export FLASK_DEBUG=1

# Force SQLite in environment
export DATABASE_URL=sqlite:///ecommerce.db

echo "Using database: $DATABASE_URL"
echo "Starting server..."

# Run the app
python run.py
