const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

// Voice configurations with emotional settings
export const voiceProfiles = {
  calm: {
    voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam - calm male voice
    name: 'Calm Narrator',
    emoji: '😌',
    description: 'Peaceful and soothing',
    settings: {
      stability: 0.75,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    }
  },
  cheerful: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella - cheerful female voice
    name: 'Cheerful Reader',
    emoji: '😄',
    description: 'Upbeat and energetic',
    settings: {
      stability: 0.65,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true
    }
  },
  dramatic: {
    voice_id: 'ErXwobaYiN019PkySvjV', // Antoni - dramatic male voice
    name: 'Dramatic Storyteller',
    emoji: '🎭',
    description: 'Intense and expressive',
    settings: {
      stability: 0.5,
      similarity_boost: 0.85,
      style: 0.6,
      use_speaker_boost: true
    }
  },
  mysterious: {
    voice_id: 'VR6AewLTigWG4xSOukaG', // Arnold - deep mysterious voice
    name: 'Mysterious Whisper',
    emoji: '🕵️',
    description: 'Dark and enigmatic',
    settings: {
      stability: 0.8,
      similarity_boost: 0.7,
      style: 0.4,
      use_speaker_boost: true
    }
  },
  horror: {
    voice_id: 'TxGEqnHWrfWFTfGW9XjX', // Josh - horror narrator
    name: 'Horror Narrator',
    emoji: '👻',
    description: 'Spine-chilling and eerie',
    settings: {
      stability: 0.6,
      similarity_boost: 0.9,
      style: 0.8,
      use_speaker_boost: true
    }
  },
  romantic: {
    voice_id: 'jsCqWAovK2LkecY7zXl4', // Freya - romantic female voice
    name: 'Romantic Reader',
    emoji: '💕',
    description: 'Warm and intimate',
    settings: {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.2,
      use_speaker_boost: true
    }
  },
  adventure: {
    voice_id: 'bVMeCyTHy58xNoL34h3p', // Jeremy - adventurous voice
    name: 'Adventure Guide',
    emoji: '🗺️',
    description: 'Bold and exciting',
    settings: {
      stability: 0.6,
      similarity_boost: 0.75,
      style: 0.5,
      use_speaker_boost: true
    }
  },
  wise: {
    voice_id: 'CYw3kZ02Hs0563khs1Fj', // Dave - wise narrator
    name: 'Wise Storyteller',
    emoji: '🧙‍♂️',
    description: 'Ancient and knowing',
    settings: {
      stability: 0.85,
      similarity_boost: 0.7,
      style: 0.1,
      use_speaker_boost: true
    }
  }
}

export async function generateSpeech(text, voiceProfile = 'calm') {
  try {
    const profile = voiceProfiles[voiceProfile]
    if (!profile) {
      throw new Error(`Voice profile "${voiceProfile}" not found`)
    }

    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${profile.voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: profile.settings
      })
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBlob = await response.blob()
    return URL.createObjectURL(audioBlob)
  } catch (error) {
    console.error('Error generating speech:', error)
    throw error
  }
}

export async function getAvailableVoices() {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const data = await response.json()
    return data.voices
  } catch (error) {
    console.error('Error fetching voices:', error)
    throw error
  }
}