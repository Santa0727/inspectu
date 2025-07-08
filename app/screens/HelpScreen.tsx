import FixedContainer from '../components/container/FixedContainer';
import WebView from 'react-native-webview';

const zendeskKey = 'b885303b625c52b2815f5b3ed89f5ccac6d74b3b816e4626';

const HelpScreen = () => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}"></script>
      <script>
        window.zE || (window.zE = []);
        window.zE('webWidget:on', 'open', function() {
        });
        window.zE('webWidget', 'open');
      </script>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          background: white;
        }
      </style>
    </head>
    <body></body>
    </html>
  `;

  return (
    <FixedContainer style={{ paddingHorizontal: 5, backgroundColor: 'black' }}>
      <WebView
        source={{ html }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        style={{ flex: 1 }}
      />
    </FixedContainer>
  );
};

export default HelpScreen;
