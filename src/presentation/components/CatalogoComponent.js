import { Component } from 'react';
import { FlatList, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Divider, Text } from 'react-native-paper';
import { baseUrl } from '../../comun/comun';
import { connect } from 'react-redux';
import { IndicadorActividad } from './IndicadorActividadComponent';
import { withTranslation } from 'react-i18next'; // Importante para detectar el idioma

const mapStateToProps = state => ({
    camisetas: state.camisetas,
});

class Catalogo extends Component {
    render() {
        const { navigate } = this.props.navigation;
        const { t, i18n } = this.props; // i18n nos dice el idioma actual (es, en, eu)

        const renderItem = ({ item }) => {
            // Lógica de selección de idioma:
            // Buscamos el nombre en el idioma actual, si no existe, tiramos del español por defecto
            const nombreTraducido = item.nombres?.[i18n.language] || item.nombres?.['es'] || item.nombre;
            const descripcionTraducida = item.descripciones?.[i18n.language] || item.descripciones?.['es'] || item.descripcion;

            return (
                <View>
                    <List.Item
                        title={nombreTraducido}
                        description={descripcionTraducida}
                        titleNumberOfLines={0}
                        descriptionNumberOfLines={2} // Reducido para que el catálogo sea más limpio
                        onPress={() => navigate('DetalleCamiseta', { camisetaId: item.id })}
                        left={() => (
                            <View style={styles.imagenContainer}>
                                <Image
                                    source={{ uri: baseUrl + item.imagen }}
                                    style={styles.imagen}
                                    resizeMode="contain" // "contain" suele ir mejor para ver la camiseta entera
                                />
                            </View>
                        )}
                        titleStyle={styles.titulo}
                        descriptionStyle={styles.descripcion}
                        contentStyle={styles.contenido}
                    />
                    <Divider />
                </View>
            );
        };

        if (this.props.camisetas.isLoading) {
            return <IndicadorActividad />;
        }
        
        if (this.props.camisetas.errMess) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{this.props.camisetas.errMess}</Text>
                </View>
            );
        }

        return (
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <FlatList
                    data={this.props.camisetas.camisetas}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imagenContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    imagen: {
        width: 75,
        height: 75,
        borderRadius: 4,
    },
    contenido: { paddingVertical: 10 },
    titulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    descripcion: { fontSize: 13, color: '#666' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { color: 'red', textAlign: 'center' },
});

// Envolvemos con la traducción y luego con Redux
export default withTranslation()(connect(mapStateToProps)(Catalogo));