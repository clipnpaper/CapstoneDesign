import { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-image', {
        prompt,
      });

      const prediction = response.data.prediction;

      // 대기 - 이미지 생성 완료까지 폴링 (optional)
      let image = null;
      while (!image) {
        const result = await axios.get(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`
          },
        });

        if (result.data.status === 'succeeded') {
          image = result.data.output[0];
          setImageUrl(image);
        } else if (result.data.status === 'failed') {
          throw new Error('Image generation failed');
        }

        await new Promise(r => setTimeout(r, 1000));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate image.');
    }
    setLoading(false);
  };

  return (
      <div style={{ padding: '2rem' }}>
        <h1>Replicate 이미지 생성기</h1>
        <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="프롬프트 입력"
            style={{ width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? '생성 중...' : '이미지 생성'}
        </button>

        {imageUrl && (
            <div style={{ marginTop: '2rem' }}>
              <img src={imageUrl} alt="Generated" style={{ width: '400px' }} />
            </div>
        )}
      </div>
  );
}

export default App;
