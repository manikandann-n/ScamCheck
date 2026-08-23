# ScamCheck - Verify Before You Trust

A premium student opportunity verification platform that helps students evaluate internship and job opportunities for potential scams.

## Problem

Every day, students receive countless internship and job offers through WhatsApp, email, LinkedIn, Instagram, and Telegram. Many of these opportunities are scams designed to steal money, personal information, or both. Students often lack the tools to properly evaluate whether an opportunity is legitimate.

## Solution

ScamCheck is a comprehensive verification platform that analyzes opportunity texts for suspicious patterns, calculates an explainable risk score, identifies warning indicators, and provides actionable recommendations.

## Features

- **Real-time Analysis**: Paste any opportunity text and get instant risk assessment
- **Risk Score**: 0-100 score with visual gauge animation
- **Warning Indicators**: Detailed breakdown of each detected risk signal
- **Verification Checklist**: Comprehensive checklist covering key verification points
- **Analysis History**: Store and review all past analyses
- **Premium UI**: Modern, dark-themed interface with glassmorphism and smooth animations
- **Dashboard**: Visual analytics showing risk distribution and common warning signs
- **Screenshot Upload**: Upload screenshots for analysis (MVP with demo mode)

## Tech Stack

### Frontend
- React 18 with Hooks
- Vite for fast development
- Tailwind CSS with custom dark theme
- Lucide React for icons
- Recharts for data visualization
- React Router for navigation

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- Pydantic for validation
- MySQL database

### Architecture
React Frontend (Vite)
↓
FastAPI REST API
↓
Rule-Based Risk Engine
↓
MySQL Database


## Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- MySQL 8+

### 1. Clone the Repository
git clone https://github.com/yourusername/scamcheck.git
cd scamcheck