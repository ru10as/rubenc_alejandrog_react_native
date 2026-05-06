import { Component } from 'react';
import { ScrollView, View, StyleSheet, ImageBackground } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { baseUrl } from '../../comun/comun';
import { connect } from 'react-redux';
import { IndicadorActividad } from './IndicadorActividadComponent';

const mapStateToProps = state => ({
    camisetas: state.camisetas,
    cabeceras: state.cabeceras,
    novedades: state.novedades,
});

function RenderItem({ item, isLoading, errMess, onPress }) {
    if (isLoading) return <IndicadorActividad />;
    if (errMess) return <View><Text>{errMess}</Text></View>;
    if (!item) return <View />;

    return (
        <Card style={styles.card} onPress={onPress}>
            <ImageBackground
                source={{ uri: baseUrl + item.imagen }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
            >
                <View style={styles.textContainer}>
                    <Text style={styles.tituloSuperpuesto}>{item.nombre}</Text>
                </View>
            </ImageBackground>
            <Card.Content>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
            </Card.Content>
        </Card>
    );
}

class Home extends Component {
    render() {
        const { navigation } = this.props;

        const cabecera = this.props.cabeceras.cabeceras?.find(item => item.destacado);
        const camiseta = this.props.camisetas.camisetas?.find(item => item.destacado);
        const novedad = this.props.novedades.novedades?.find(item => item.destacado);

        return (
            <ScrollView>
                <RenderItem
                    item={camiseta}
                    isLoading={this.props.camisetas.isLoading}
                    errMess={this.props.camisetas.errMess}
                    onPress={camiseta ? () => navigation.navigate('DetalleCamiseta', { camisetaId: camiseta.id }) : null}
                />
                <RenderItem
                    item={novedad}
                    isLoading={this.props.novedades.isLoading}
                    errMess={this.props.novedades.errMess}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    card: { margin: 8 },
    descripcion: { marginTop: 20, marginBottom: 20 },
    tituloSuperpuesto: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
    },
    textContainer: { padding: 10, borderRadius: 5 },
    imageStyle: { resizeMode: 'cover' },
    imageBackground: {
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default connect(mapStateToProps)(Home);
