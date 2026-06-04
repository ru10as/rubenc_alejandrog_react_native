import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, Modal, ImageBackground } from 'react-native';
import { Text, Divider, IconButton, TextInput, Button, Surface } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { baseUrl, colorTiendaOscuro } from '../../comun/comun';
import { postFavorito, postComentario } from '../../redux/ActionCreators';
import { IndicadorActividad } from './IndicadorActividadComponent';

const mapStateToProps = state => ({
    camisetas: state.camisetas,
    comentarios: state.comentarios,
    favoritos: state.favoritos,
});

const mapDispatchToProps = dispatch => ({
    postFavorito: (camisetaId) => dispatch(postFavorito(camisetaId)),
    postComentario: (camisetaId, valoracion, autor, comentario) =>
        dispatch(postComentario(camisetaId, valoracion, autor, comentario)),
});

class DetalleCamiseta extends Component {
    constructor(props) {
        super(props);
        this.state = { valoracion: 5, autor: '', comentario: '', showModal: false };
    }

    toggleModal = () => this.setState({ showModal: !this.state.showModal });

    enviarComentario(camisetaId) {
        this.props.postComentario(camisetaId, this.state.valoracion, this.state.autor, this.state.comentario);
        this.setState({ valoracion: 5, autor: '', comentario: '', showModal: false });
    }

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
            <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000' }} 
                style={styles.background}
                blurRadius={2}
            >
                <ScrollView style={styles.mainContainer}>
                    <Surface style={styles.contenedorImagen} elevation={1}>
                        <Image
                            source={{ uri: camiseta.imagen }}
                            style={styles.imagenPrincipal}
                            resizeMode="contain"
                        />
                    </Surface>

                    <View style={styles.seccionContenido}>
                        <View style={styles.headerRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.titulo}>{camiseta.nombre}</Text>
                                {camiseta.destacado && <Text style={styles.badge}>{t('detalleCamisetaComponent.edicion_coleccionista')}</Text>}
                            </View>
                            <IconButton
                                icon={esFavorita ? 'heart' : 'heart-outline'}
                                iconColor={esFavorita ? 'red' : '#000'}
                                size={35}
                                onPress={() => this.props.postFavorito(camisetaId)}
                            />
                        </View>
                        <Text style={styles.descripcion}>{camiseta.descripciones?.[i18n.language] ?? camiseta.descripciones?.es ?? camiseta.descripcion}</Text>
                        <Button
                            mode="contained"
                            onPress={() => console.log('Comprar')}
                            style={styles.btnComprar}
                        >
                            {t('detalleCamisetaComponent.comprar')}
                        </Button>
                    </View>

                    <Divider style={styles.divisor} />

                    <View style={styles.comentariosSeccion}>
                        <View style={styles.rowTitulo}>
                            <Text style={styles.seccionTitulo}>{t('detalleCamisetaComponent.voces_grada')}</Text>
                            <IconButton icon="plus-circle" iconColor={colorTiendaOscuro} onPress={this.toggleModal} />
                        </View>
                        {comentarios.map((item, index) => (
                            <Surface key={index} style={styles.comentarioItem} elevation={1}>
                                <Text style={styles.comentarioAutor}>{item.autor} • {'⭐'.repeat(item.valoracion)}</Text>
                                <Text style={styles.comentarioTexto}>{item.comentario}</Text>
                            </Surface>
                        ))}
                    </View>

                    <View style={styles.seccionCromo}>
                        <Text style={styles.seccionTitulo}>{t('detalleCamisetaComponent.certificado_titulo')}</Text>
                        <Surface style={styles.tarjetaCromo} elevation={4}>
                            <View style={styles.cromoHeader}>
                                <Text style={styles.cromoID}>{t('detalleCamisetaComponent.certificado_id')}: #TM-{camiseta.id}99</Text>
                            </View>
                            <View style={styles.qrWrapper}>
                                <QRCode
                                    value={`the12thman://cromo/${camiseta.id}`}
                                    size={160}
                                    color={colorTiendaOscuro}
                                    backgroundColor="white"
                                />
                            </View>
                            <Text style={styles.cromoFooter}>{t('detalleCamisetaComponent.certificado_footer')}</Text>
                        </Surface>
                    </View>

                    <Modal visible={this.state.showModal} animationType="slide">
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitulo}>{t('detalleCamisetaComponent.modal_titulo')}</Text>
                            <TextInput
                                label={t('detalleCamisetaComponent.modal_nombre')}
                                mode="outlined"
                                style={styles.input}
                                value={this.state.autor}
                                onChangeText={txt => this.setState({ autor: txt })}
                            />
                            <TextInput
                                label={t('detalleCamisetaComponent.modal_comentario')}
                                mode="outlined"
                                multiline
                                numberOfLines={4}
                                style={styles.input}
                                value={this.state.comentario}
                                onChangeText={txt => this.setState({ comentario: txt })}
                            />
                            <Button
                                mode="contained"
                                onPress={() => this.enviarComentario(camisetaId)}
                                style={styles.btnModal}
                            >
                                {t('detalleCamisetaComponent.modal_publicar')}
                            </Button>
                            <Button textColor="red" onPress={this.toggleModal}>{t('detalleCamisetaComponent.modal_cancelar')}</Button>
                        </View>
                    </Modal>
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
    seccionTitulo: { fontSize: 18, fontWeight: 'bold', color: '#222' },
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
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(DetalleCamiseta));
