const { useState, useEffect, useRef } = React;

// 翻訳データを言語ごとにfetchする関数
async function loadTranslations(language) {
  try {
    const response = await fetch(`translations/${language}.json`);
    if (!response.ok) throw new Error('Failed to load translations');
    return await response.json();
  } catch (error) {
    console.error('Error loading translations:', error);
    // フォールバックとして英語を返す
    return await fetch('translations/en.json').then(res => res.json());
  }
}

function App() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('notConnected');
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState('');
  const [userName, setUserName] = useState('');
  const [remoteName, setRemoteName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [translations, setTranslations] = useState({});  // 動的にロードされた翻訳

  const peerInstance = useRef(null);
  const connRef = useRef(null);
  const cryptoKey = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 言語保存と翻訳ロード
  useEffect(() => {
    localStorage.setItem('language', language);
    loadTranslations(language).then(data => setTranslations(data));
  }, [language]);

  // 翻訳関数（translationsが空の場合、英語のデフォルトを使うが、ロード済みを想定）
  const t = (key) => translations[key] || '[Translation missing]';

  // 通知表示（以下省略: 元のコードと同じ）
  const showNotification = (msg) => {
    setNotification(t(msg));
    setTimeout(() => setNotification(''), 3000);
  };

  // 暗号化キーの生成（以下省略: 元のコードと同じ）
  const generateKey = async () => {
    try {
      return await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (e) {
      showNotification('keyGenerationFailed');
      return null;
    }
  };

  // ArrayBufferをBase64に変換（以下省略: 元のコードと同じ）
  // ... (encryptMessage, decryptMessage, exportKey, formatTimestamp, handleTyping, handleData などの関数は変更なし)

  // useEffect for Peer setup（以下省略: 元のコードと同じ）
  // ... (connectToPeer, sendMessage, handleKeyPress, handleMessageChange, copyPeerId, disconnect, handleNameSubmit も変更なし)

  // UI部分: 言語選択の<select>に新しいオプションを追加
  if (!isNameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center gradient-bg bg-clip-text text-transparent">
            {t('enterName')}
          </h1>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder={t('namePlaceholder')}
            className="w-full p-3 border rounded-lg border-gray-300 mb-4"
            onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t('language')}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border rounded-lg border-gray-300"
            >
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
              <option value="hi">हिन्दी</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>  {/* 新規追加 */}
              <option value="de">Deutsch</option>   {/* 新規追加 */}
            </select>
          </div>
          <button
            onClick={handleNameSubmit}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('start')}
          </button>
        </div>
      </div>
    );
  }

  // 残りのUI部分（変更なし: 元のコードと同じ）
  // ...
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
