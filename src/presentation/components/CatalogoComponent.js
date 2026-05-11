import { Component } from 'react';
import { FlatList, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Divider, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import { IndicadorActividad } from './IndicadorActividadComponent';

const mapStateToProps = state => ({
    camisetas: state.camisetas,
});

class Catalogo extends Component {
    render() {
        const { navigate } = this.props.navigation;

        const renderItem = ({ item }) => (
            <View>
                <List.Item
                    title={item.nombre}
                    description={item.descripcion}
                    titleNumberOfLines={0}
                    descriptionNumberOfLines={6}
                    onPress={() => navigate('DetalleCamiseta', { camisetaId: item.id })}
                    left={() => (
                        <View style={styles.imagenContainer}>
                            <Image
                                source={{ uri: item.imagen }}
                                style={styles.imagen}
                                resizeMode="cover"
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
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={this.props.camisetas.camisetas}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    imagenContainer: {
        width: 70,
        height: 70,
        alignSelf: 'center',
        marginLeft: 8,
        marginRight: 4,
    },
    imagen: {
        width: 70,
        height: 70,
        borderRadius: 6,
    },
    contenido: { paddingRight: 8 },
    titulo: { fontSize: 16, fontWeight: 'bold' },
    descripcion: { fontSize: 14, lineHeight: 20 },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { color: 'red', textAlign: 'center' },
});

export default connect(mapStateToProps)(Catalogo);
