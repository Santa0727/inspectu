import FixedContainer from '../components/container/FixedContainer';
import WebView from 'react-native-webview';

const HelpScreen = () => {
  return (
    <FixedContainer style={{ paddingHorizontal: 5 }}>
      <WebView
        source={{
          uri: 'https://gistcdn.githack.com/Santa0727/ad27e72873127f07b191c9a435d52122/raw/b7bc07d97c4d754c45d1d63f0e5cb99149e47e0c/zendesk.html',
        }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
      />
    </FixedContainer>
  );
};

export default HelpScreen;
