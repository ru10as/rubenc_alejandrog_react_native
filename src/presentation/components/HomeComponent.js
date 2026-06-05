import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, ImageBackground } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { baseUrl } from '../../comun/comun';
import { connect } from 'react-redux';
import { IndicadorActividad } from './IndicadorActividadComponent';
import { useTranslation, withTranslation } from 'react-i18next';

const mapStateToProps = state => ({
    camisetas: state.camisetas,
    cabeceras: state.cabeceras,
    novedades: state.novedades,
});

function RenderItem({ item, isLoading, errMess, onPress }) {
    const { i18n } = useTranslation();

    if (isLoading) return <IndicadorActividad />;
    if (errMess) return <View style={styles.error}><Text>{errMess}</Text></View>;
    if (!item) return <View />;

    const nombre = item.nombres?.[i18n.language] || item.nombres?.['es'] || item.nombre;
    const descripcion = item.descripciones?.[i18n.language] || item.descripciones?.['es'] || item.descripcion;

    return (
        <Card style={styles.card} onPress={onPress}>
            <ImageBackground
                source={{ uri: item.imagen?.startsWith('http') ? item.imagen : baseUrl + item.imagen }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
            >
                <View style={styles.textContainer}>
                    <Text style={styles.tituloSuperpuesto}>{nombre}</Text>
                </View>
            </ImageBackground>
            <Card.Content>
                <Text style={styles.descripcion}>{descripcion}</Text>
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
            <ScrollView style={styles.main}>
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
    main: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { margin: 12, elevation: 4, borderRadius: 12, overflow: 'hidden' },
    descripcion: { marginTop: 15, marginBottom: 15, fontSize: 14, color: '#444', textAlign: 'justify' },
    tituloSuperpuesto: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    textContainer: { 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        width: '100%',
        alignItems: 'center'
    },
    imageStyle: { resizeMode: 'cover' },
    imageBackground: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: { padding: 20, alignItems: 'center' }
});

export default withTranslation()(connect(mapStateToProps)(Home));