import { Component } from 'react';
import { FlatList, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Divider, Text } from 'react-native-paper'; // Importamos Text de paper para consistencia
import { baseUrl } from '../comun/comun';
import { connect } from 'react-redux';
import { IndicadorActividad } from './IndicadorActividadComponent';

const mapStateToProps = state => {
    return {
        camisetas: state.camisetas 
    }
}

class Calendario extends Component {
  render() {
    const { navigate } = this.props.navigation;

    const renderCalendarioItem = ({ item }) => {
      return (
        <View>
          <List.Item
            title={item.nombre}
            description={item.descripcion}
            titleNumberOfLines={0}
            descriptionNumberOfLines={6}
            onPress={() => navigate('DetalleCamiseta', { camisetaId: item.id })}
            left={(props) => (
              <Image
                source={{ uri: baseUrl + item.imagen }}
                style={[props.style, styles.imagen]}
                resizeMode="cover"
              />
            )}
            titleStyle={styles.titulo}
            descriptionStyle={styles.descripcion}
            contentStyle={styles.contenido}
          />
          <Divider />
        </View>
      );
    };

    // --- GESTIÓN DE ESTADOS (isLoading y errMess) ---

    if (this.props.camisetas.isLoading) {
      return (
        <IndicadorActividad />
      );
    }
    else if (this.props.camisetas.errMess) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{this.props.camisetas.errMess}</Text>
        </View>
      );
    }
    else {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            // Cargamos el array de camisetas que viene del servidor
            data={this.props.camisetas.camisetas} 
            renderItem={renderCalendarioItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </SafeAreaView>
      );
    } 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagen: {
    width: 60, // Un poco más grande para que se vean bien los detalles de las camisetas
    height: 60,
    alignSelf: 'center',
    borderRadius: 5,
  },
  contenido: {
    paddingRight: 8,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});

export default connect(mapStateToProps)(Calendario);