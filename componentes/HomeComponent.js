import { Component } from 'react';
import { ScrollView, View, StyleSheet, ImageBackground } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { baseUrl, colorTiendaOscuro } from '../comun/comun'; // Usamos vuestro nuevo color
import { connect } from 'react-redux';
import { IndicadorActividad } from './IndicadorActividadComponent';

const mapStateToProps = state => {
    return {
        camisetas: state.camisetas, //
        cabeceras: state.cabeceras,
        novedades: state.novedades   //
    }
}

function RenderItem(props) {
    const item = props.item;

    if (props.isLoading) { 
        return <IndicadorActividad />; 
    }
    else if (props.errMess) { 
        return( 
            <View>  
                <Text>{props.errMess}</Text> 
            </View> 
        ); 
    } 
    else if (item != null) { 
        return(
            <Card style={styles.card}>
                <ImageBackground 
                    source={{ uri: baseUrl + item.imagen }}
                    style={styles.imageBackground}
                    imageStyle={styles.imageStyle}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.tituloSuperpuesto}>
                            {item.nombre}
                        </Text>
                    </View>
                </ImageBackground>
                <Card.Content>
                    <Text style={styles.descripcion}>
                        {item.descripcion}
                    </Text>
                </Card.Content>
            </Card>
        ); 
    } 
    return <View></View>;
}

class Home extends Component {
    render() {
        // Buscamos el contenido destacado para la portada de la tienda
        const cabecera = this.props.cabeceras.cabeceras?.find(item => item.destacado);
        const camiseta = this.props.camisetas.camisetas?.find(item => item.destacado);
        const novedad = this.props.novedades.novedades?.find(item => item.destacado);

        return (
            <ScrollView>
                <RenderItem 
                    item={cabecera} 
                    isLoading={this.props.cabeceras.isLoading}
                    errMess={this.props.cabeceras.errMess}
                />
                <RenderItem 
                    item={camiseta} 
                    isLoading={this.props.camisetas.isLoading}
                    errMess={this.props.camisetas.errMess}
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
        color: 'white', // Podéis cambiar 'chocolate' por blanco para que resalte más en vuestra tienda
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Añadimos un fondo oscuro para que se lea mejor el nombre
        paddingHorizontal: 10
    },
    textContainer: { padding: 10, borderRadius: 5 },
    imageStyle: { resizeMode: 'cover' },
    imageBackground: {
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default connect(mapStateToProps)(Home);