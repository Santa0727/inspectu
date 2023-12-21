import Toast from 'react-native-root-toast';

export const toastError = (message: string) =>
  Toast.show(message, {
    backgroundColor: 'white',
    textColor: 'red',
    opacity: 0.95,
    position: 100,
  });

export const toastSuccess = (message: string) =>
  Toast.show(message, {
    backgroundColor: 'white',
    textColor: 'green',
    opacity: 0.95,
    position: 100,
  });

export const zeroPad = (num: number) => String(num).padStart(2, '0');
