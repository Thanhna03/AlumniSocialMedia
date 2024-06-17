import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1877f2', // Facebook blue
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  selectAvatarText: {
    marginVertical: 10,
    color: '#1877f2', // Facebook blue
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
    alignSelf: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1877f2', // Facebook blue
    borderRadius: 8,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Styles;
