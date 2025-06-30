const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function callGeminiAPI(prompt) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error
  }
}

export const writingPrompts = {
  improve: (text) => `Please improve this writing by making it more engaging, fixing grammar, and enhancing the flow while keeping the original meaning and style:\n\n${text}`,
  
  dramatic: (text) => `Rewrite this text to be more dramatic and emotionally intense, adding vivid descriptions and heightened emotions:\n\n${text}`,
  
  funny: (text) => `Rewrite this text to be funnier and more humorous, adding jokes, witty observations, or comedic situations while keeping the core message:\n\n${text}`,
  
  twist: (text) => `Add an unexpected plot twist or surprising ending to this story. Make it creative and engaging:\n\n${text}`,
  
  storyStarter: (genre) => {
    const genrePrompts = {
      fantasy: "Write an engaging opening paragraph for a fantasy story involving magic, mythical creatures, or an enchanted world.",
      horror: "Write a suspenseful opening paragraph for a horror story that creates an eerie atmosphere and hints at something sinister.",
      romance: "Write a charming opening paragraph for a romance story that introduces compelling characters and romantic tension.",
      scifi: "Write an intriguing opening paragraph for a science fiction story set in the future or involving advanced technology.",
      mystery: "Write a captivating opening paragraph for a mystery story that introduces an intriguing puzzle or crime to solve.",
      adventure: "Write an exciting opening paragraph for an adventure story filled with action and exploration.",
      thriller: "Write a heart-pounding opening paragraph for a thriller that immediately creates tension and suspense.",
      comedy: "Write a hilarious opening paragraph for a comedy story that sets up funny situations and characters.",
      drama: "Write a compelling opening paragraph for a dramatic story that explores deep human emotions and conflicts.",
      historical: "Write an immersive opening paragraph for a historical fiction story set in a specific time period.",
      western: "Write a rugged opening paragraph for a western story set in the American frontier.",
      dystopian: "Write a thought-provoking opening paragraph for a dystopian story set in a dark future society.",
      essay: "Write a strong opening paragraph for an academic essay that presents a clear thesis and engages the reader.",
      rap: "Write the opening verse for a rap song with clever wordplay, rhythm, and a compelling hook.",
      poetry: "Write a beautiful opening stanza for a poem that captures emotion and uses vivid imagery.",
      memoir: "Write a personal and engaging opening paragraph for a memoir that draws readers into a life story."
    }
    return genrePrompts[genre] || "Write an engaging opening paragraph for a creative story."
  }
}