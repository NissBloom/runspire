# Vercel Postgres Setup Guide for Run Coach Pro

This guide will help you set up Vercel Postgres as the database for the Run Coach Pro website.

## 1. Create a Vercel Postgres Database

1. Log in to your Vercel account
2. Go to the Storage tab in your dashboard
3. Click "Create Database" and select Postgres
4. Follow the setup wizard to create your database
5. Once created, Vercel will automatically add the required environment variables to your project

## 2. Install Required Package

```bash
npm install @vercel/postgres
