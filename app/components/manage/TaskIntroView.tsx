import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

const makeHtml = (content: string, basePx = 20) => `
<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --base: ${basePx}px; }
  html { -webkit-text-size-adjust: 100%; }
  body { margin: 0; padding: 8px; line-height: 1.6; font-size: var(--base) !important; }
  p, li, a, span, div { font-size: var(--base) !important; }
  h1 { font-size: calc(var(--base) * 1.8) !important; }
  h2 { font-size: calc(var(--base) * 1.5) !important; }
  h3 { font-size: calc(var(--base) * 1.25) !important; }
  img, video { max-width: 100%; height: auto; }
</style>
</head>
<body style="overflow:auto;">${content}</body>
</html>
`;

interface Props {
  content: string;
}

const TaskIntroView = ({ content }: Props) => (
  <View style={styles.webViewContainer}>
    <WebView
      source={{ html: makeHtml(content) }}
      style={styles.webView}
      scrollEnabled={true}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
      bounces={false}
      scalesPageToFit={false}
      onShouldStartLoadWithRequest={() => true}
    />
  </View>
);

const styles = StyleSheet.create({
  webViewContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    height: 200,
  },
  webView: {
    height: 200,
    backgroundColor: 'transparent',
  },
});

export default TaskIntroView;
