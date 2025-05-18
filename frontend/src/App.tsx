import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [startTime, setStartTime] = useState('00:00:00')
  const [endTime, setEndTime] = useState('00:00:00')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clipPath, setClipPath] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setClipPath('') // reset before each submit

    try {
      const clipResponse = await fetch('http://localhost:3000/api/clip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          startTime,
          endTime,
        }),
      });

      if (!clipResponse.ok) {
        let errorMsg = 'Failed to process video section';
        try {
          const errorData = await clipResponse.json();
          errorMsg = errorData.details || errorData.error || errorMsg;
        } catch {
          errorMsg = await clipResponse.text();
        }
        throw new Error(errorMsg);
      }

      // EXAMPLE: If your backend returns { clipPath: "/clips/clip123.mp4" }
      const data = await clipResponse.json();
      if (data.clipPath) {
        setClipPath(data.clipPath);
      }

      // If you still want to download the file, you can fetch it here:
      // const blob = await fetch(data.clipPath).then(res => res.blob());
      // ... (download code)

    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">YouTube Video Clipper</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ...inputs... */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Clip Video'}
        </button>
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
        {clipPath && (
          <div className="text-green-500 text-sm mt-2">
            Clip created successfully! Server path: {clipPath}
          </div>
        )}
      </form>
    </div>
  )
}

export default App
