// /app/api/chat/route.ts
'use client'; 
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

function countMatches(regex: RegExp, text: string) {
  const m = text.match(regex);
  return m ? m.length : 0;
}

function sumNumericField(regex: RegExp, text: string) {
  const m = text.match(regex) || [];
  return m.reduce((s: number, str: string) => {
    const num = (str.match(/\d+/) || [0])[0];
   const safeNum = Number.isFinite(Number(num)) ? Number(num) : 0;
return s + safeNum;
  }, 0);
}

// heuristics
function outOfStockCount(context: string) {
  // JSON-like: "stock": 0
  const byJson = countMatches(/"stock"\s*:\s*0/g, context);
  // plain text lines like 'Out of stock: ProductX' (rare) - count occurrences
  const byText = countMatches(/out of stock/gmi, context);
  // The JSON match is most reliable; prefer JSON count, else text count
  return Math.max(byJson, byText);
}
function lowStockCount(context: string) {
  const matches = context.match(/"stock"\s*:\s*(\d+)/g) || [];
  return matches.filter((s: string) => {
    const n = s.match(/\d+/);
    return n && parseInt(n[0], 10) > 0 && parseInt(n[0], 10) <= 3;
  }).length;
}
function totalInventoryItems(context: string) {
  // sum stock fields
  const n = sumNumericField(/"stock"\s*:\s*\d+/g, context);
  if (n > 0) return n;
  // fallback: count product objects (by "name": or "id":)
  const productCount = countMatches(/"name"\s*:/g, context);
  return productCount;
}
function totalSalesAmount(context: string) {
  // try "amount": 123 or "total": 123
  const byAmount = sumNumericField(/"amount"\s*:\s*\d+/g, context);
  const byTotal = sumNumericField(/"total"\s*:\s*\d+/g, context);
  return Math.max(byAmount, byTotal);
}
function customersCount(context: string) {
  return countMatches(/"name"\s*:/g, context);
}

export async function POST(req: NextRequest) {
  const { question, context } = await req.json();

  if (!question || !context) return NextResponse.json({ answer: 'Missing question or context' }, { status: 400 });

  const lower = question.toLowerCase();

  // quick rule-based answers
  if (lower.includes('out of stock')) {
    const count = outOfStockCount(context);
    return NextResponse.json({ answer: `There are ${count} products that are out of stock.` });
  }
  if (lower.includes('low stock')) {
    const count = lowStockCount(context);
    return NextResponse.json({ answer: `There are ${count} products in low stock.` });
  }
  if (lower.includes('how many') && lower.includes('inventory') || lower.includes('total inventory')) {
    const total = totalInventoryItems(context);
    return NextResponse.json({ answer: `Total inventory items: ${total}.` });
  }
  if (lower.includes('sales') || lower.includes('total sales') || lower.includes('revenue')) {
    const sales = totalSalesAmount(context);
    if (sales > 0) return NextResponse.json({ answer: `Total sales amount is $${sales}.` });
  }
  if (lower.includes('customer') || lower.includes('how many customers') || lower.includes('customers')) {
    const c = customersCount(context);
    return NextResponse.json({ answer: `You have ${c} customers.` });
  }

  // If Gemini key not present -> respond with helpful fallback
  if (!GEMINI_KEY) {
    return NextResponse.json({ answer: 'Gemini API key missing on server. Only simple queries are supported.' }, { status: 500 });
  }

  // Call Gemini
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const trimmed = context.slice(0, 14000); // keep safe size
    const prompt = `
You are a precise assistant. Use ONLY the provided context below to answer the user's question.
If the user asks for a number (counts, totals), provide the number first and a 1-line explanation.

=== CONTEXT START ===
${trimmed}
=== CONTEXT END ===

Question: ${question}
Answer:
`.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // if model produced empty answer, fallback to heuristics
    if (!text || text.trim().length === 0) {
      // fallback try heuristics again (best-effort)
      if (lower.includes('inventory')) {
        return NextResponse.json({ answer: `Total inventory items: ${totalInventoryItems(context)}.` });
      }
      return NextResponse.json({ answer: 'No answer found in context.' });
    }

    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error('Gemini API Error:', err);
    // final fallback
    if (lower.includes('inventory')) {
      return NextResponse.json({ answer: `Total inventory items: ${totalInventoryItems(context)}.` });
    }
    return NextResponse.json({ answer: 'Failed to generate response using Gemini.' }, { status: 500 });
  }
}
