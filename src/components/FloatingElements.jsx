export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating Books */}
      <div className="absolute top-20 left-10 animate-float">
        <span className="text-4xl opacity-20">📚</span>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <span className="text-3xl opacity-15">✏️</span>
      </div>
      <div className="absolute top-60 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
        <span className="text-5xl opacity-10">⭐</span>
      </div>
      <div className="absolute bottom-40 right-10 animate-float" style={{ animationDelay: '3s' }}>
        <span className="text-4xl opacity-20">🖋️</span>
      </div>
      <div className="absolute bottom-20 left-1/3 animate-float" style={{ animationDelay: '4s' }}>
        <span className="text-3xl opacity-15">📝</span>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: '5s' }}>
        <span className="text-4xl opacity-10">💫</span>
      </div>
    </div>
  )
}