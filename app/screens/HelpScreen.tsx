import FixedContainer from '../components/container/FixedContainer';
import WebView from 'react-native-webview';

const HelpScreen = () => {
  return (
    <FixedContainer style={{ paddingHorizontal: 5 }}>
      <WebView
        source={{
          uri: 'https://gistcdn.githack.com/Santa0727/ad27e72873127f07b191c9a435d52122/raw/12287d43c921d8d1ae0a8716a9e00edcbdfc30a4/zendesk.html',
        }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
      />
    </FixedContainer>
  );
};

export default HelpScreen;
