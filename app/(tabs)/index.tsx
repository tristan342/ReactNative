import { StyleSheet } from 'react-native';
import PhotoGalery from "../../components/PhotoGalery";
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';


const TabOneScreen = () => {
  return (
    <View style={styles.container}>
      <PhotoGalery/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
export default TabOneScreen;
