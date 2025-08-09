export async function getAIResponse(question: string, context: string) {
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context }),
    });

    if (!res.ok) throw new Error('API Error');

    const data = await res.json();
    return data.answer || 'I could not find an answer.';
  } catch (err) {
    console.error('Error fetching AI response:', err);
    return null; // let retry handle it
  }
}
