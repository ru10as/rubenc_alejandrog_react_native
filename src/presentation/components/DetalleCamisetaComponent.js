import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, Modal, ImageBackground } from 'react-native';
import { Text, Divider, Button, Surface, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { colorTiendaOscuro } from '../../comun/comun';
import { postFavorito, postComentario, anadirAlCarrito } from '../../redux/ActionCreators';
import { IndicadorActividad } from './IndicadorActividadComponent';
import fondoMaracana from '../../../assets/images/logo.png';

const mapStateToProps = state => ({
    camisetas: state.camisetas,
    comentarios: state.comentarios,
    favoritos: state.favoritos,
    usuario: state.usuario,
});

const mapDispatchToProps = dispatch => ({
    postFavorito: (camisetaId) => dispatch(postFavorito(camisetaId)),
    postComentario: (camisetaId, valoracion, autor, comentario) =>dispatch(postComentario(camisetaId, valoracion, autor, comentario)),
    anadirAlCarrito: (camiseta, talla) => dispatch(anadirAlCarrito(camiseta, talla)),
});

class DetalleCamiseta extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            valoracion: 5, 
            autor: '', 
            comentario: '', 
            showModal: false,
            visibleSnack: false,
            showLoginModal: false // Estado para el bloqueo de login
        };
    }

    toggleModal = () => this.setState({ showModal: !this.state.showModal });

    handleAnadirAlCarrito = (camiseta) => { // Dependiendo de si este logueado o no, se podra añadir al carrito
        const estaLogueado = this.props.usuario && this.props.usuario.user;

        if (!estaLogueado) {
            this.setState({ showLoginModal: true });
        } else {
            this.props.anadirAlCarrito(camiseta, 'M');
            this.setState({ visibleSnack: true });
        }
    };

    render() {
        const { camisetaId } = this.props.route.params;
        const { t, i18n } = this.props;

        if (this.props.camisetas.isLoading) {
            return <IndicadorActividad />;
        }

        const camiseta = this.props.camisetas.camisetas.find(c => String(c.id) === String(camisetaId));
        const comentarios = this.props.comentarios.comentarios.filter(c => String(c.camisetaId) === String(camisetaId));
        const esFavorita = this.props.favoritos?.some(el => String(el) === String(camisetaId));

        if (!camiseta) return <View style={styles.error}><Text>{t('detalleCamisetaComponent.error')}</Text></View>;

        return (
            <ImageBackground source={fondoMaracana} style={styles.background} blurRadius={2}>
                <ScrollView style={styles.mainContainer}>
                    <Surface style={styles.contenedorImagen} elevation={1}>
                        <Image source={{ uri: camiseta.imagen }} style={styles.imagenPrincipal} resizeMode="contain" />
                    </Surface>

                    <View style={styles.seccionContenido}>
                        <View style={styles.headerRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.titulo}>{camiseta.nombre}</Text>
                                {camiseta.destacado && <Text style={styles.badge}>{t('detalleCamisetaComponent.edicion_coleccionista')}</Text>}
                            </View>
                        </View>
                        <Text style={styles.descripcion}>{camiseta.descripciones?.[i18n.language] ?? camiseta.descripciones?.es ?? camiseta.descripcion}</Text>
                        <Button mode="contained" onPress={() => this.handleAnadirAlCarrito(camiseta)} style={styles.btnComprar}>
                            {t('detalleCamisetaComponent.comprar')}
                        </Button>
                    </View>

                    <Modal visible={this.state.showLoginModal} animationType="fade" transparent={true}>
                        <View style={styles.modalBloqueo}>
                            <Surface style={styles.contenedorBloqueo}>
                                <Text style={styles.modalTitulo}>{t('detalleCamisetaComponent.login_requerido') || 'Acceso restringido'}</Text>
                                <Text style={styles.modalTexto}>{t('detalleCamisetaComponent.mensaje_login') || 'Debes iniciar sesión para añadir productos al carrito.'}</Text>
                                
                                <Button 
                                    mode="contained" 
                                    style={[styles.btnModal, { backgroundColor: colorTiendaOscuro }]} 
                                    onPress={() => this.setState({ showLoginModal: false })}
                                >
                                    {t('detalleCamisetaComponent.cerrar') || 'Cerrar'}
                                </Button>
                            </Surface>
                        </View>
                    </Modal>

                    <Snackbar visible={this.state.visibleSnack} onDismiss={() => this.setState({ visibleSnack: false })} duration={2000}>
                        {t('detalleCamisetaComponent.anadida_al_carrito')}
                    </Snackbar>
                    <Divider style={styles.divisor} />
                    <View style={styles.comentariosSeccion}>
                        <Text style={styles.seccionTitulo}>{t('detalleCamisetaComponent.comentarios')}</Text>
                        {comentarios.map((item, index) => (
                            <View key={index} style={styles.comentarioItem}>
                                <Text style={styles.comentarioAutor}>{item.autor}</Text>
                                <Text style={styles.comentarioTexto}>{item.comentario}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    mainContainer: { flex: 1 },
    error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    contenedorImagen: { backgroundColor: '#fff', paddingVertical: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    imagenPrincipal: { width: '100%', height: 350 },
    seccionContenido: { padding: 25 },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    badge: { color: colorTiendaOscuro, fontSize: 12, fontWeight: 'bold' },
    descripcion: { fontSize: 15, color: '#666', marginTop: 10, lineHeight: 22 },
    btnComprar: { marginTop: 20, backgroundColor: colorTiendaOscuro, borderRadius: 10 },
    divisor: { marginHorizontal: 30, height: 1, backgroundColor: '#eee' },
    comentariosSeccion: { padding: 25 },
    rowTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    seccionTitulo: { fontSize: 18, fontWeight: 'bold', color: '#8b7a7aff', marginBottom:20 },
    comentarioItem: { padding: 15, marginBottom: 10, borderRadius: 12, backgroundColor: '#f9f9f9' },
    comentarioAutor: { fontWeight: 'bold', fontSize: 13 },
    comentarioTexto: { fontStyle: 'italic', marginTop: 4, color: '#555' },
    seccionCromo: { padding: 25, paddingBottom: 50, alignItems: 'center' },
    tarjetaCromo: { padding: 20, borderRadius: 25, backgroundColor: '#fff', alignItems: 'center', width: '100%' },
    cromoHeader: { marginBottom: 15 },
    cromoID: { fontSize: 10, color: '#999', letterSpacing: 1 },
    qrWrapper: { padding: 15, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ddd', borderRadius: 15 },
    cromoFooter: { marginTop: 15, fontSize: 11, color: '#888', textAlign: 'center' },
    modalContent: { flex: 1, padding: 40, justifyContent: 'center', backgroundColor: '#fff' },
    modalTitulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
    input: { marginBottom: 15 },
    btnModal: { backgroundColor: colorTiendaOscuro, padding: 5, marginBottom: 10 },
    modalBloqueo: { 
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 10,
        zIndex: 1000
    },
    contenedorBloqueo: { 
        padding: 25, 
        borderRadius: 15, 
        width: '80%', 
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    modalTitulo: { fontSize: 18,fontWeight: 'bold', marginBottom: 10,color: '#333'},
    modalTexto: { marginBottom: 20, textAlign: 'center',color: '#666'}
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(DetalleCamiseta));
