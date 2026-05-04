import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, Modal, ActivityIndicator, ImageBackground } from 'react-native';
import { Text, Divider, IconButton, TextInput, Button, Surface } from 'react-native-paper'; 
import QRCode from 'react-native-qrcode-svg'; // Generador del Cromo Digital
import { baseUrl, colorGaztaroaOscuro } from '../comun/comun';
import { connect } from 'react-redux';
import { postFavorito, postComentario } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        camisetas: state.camisetas,
        comentarios: state.comentarios,
        favoritos: state.favoritos
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorito: (camisetaId) => dispatch(postFavorito(camisetaId)),
    postComentario: (camisetaId, valoracion, autor, comentario) => 
        dispatch(postComentario(camisetaId, valoracion, autor, comentario))
})

class DetalleCamiseta extends Component {
    constructor(props) {
        super(props);
        this.state = { valoracion: 5, autor: '', comentario: '', showModal: false }
    }

    toggleModal = () => this.setState({ showModal: !this.state.showModal });

    enviarComentario(camisetaId) {
        this.props.postComentario(camisetaId, this.state.valoracion, this.state.autor, this.state.comentario);
        this.setState({ valoracion: 5, autor: '', comentario: '', showModal: false });
    }

    render() {
        const { camisetaId } = this.props.route.params;
        
        // 1. GESTIÓN DE CARGA
        if (this.props.camisetas.isLoading) {
            return <ActivityIndicator size="large" color={colorGaztaroaOscuro} style={{flex: 1}} />;
        }

        // 2. FILTRADO DE DATOS (Corrección de tipos Number/String)
        const camiseta = this.props.camisetas.camisetas.find(c => Number(c.id) === Number(camisetaId));
        const comentarios = this.props.comentarios.comentarios.filter(c => Number(c.camisetaId) === Number(camisetaId));
        const esFavorita = this.props.favoritos?.favoritos?.some(el => Number(el) === Number(camisetaId));

        if (!camiseta) return <View style={styles.error}><Text>Camiseta no encontrada en el Store</Text></View>;

        return (
            <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070' }} 
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.05 }} // Fondo de estadio sutil
            >
                <ScrollView style={styles.mainContainer}>
                    
                    {/* SECCIÓN 1: CABECERA VISUAL */}
                    <Surface style={styles.contenedorImagen} elevation={1}>
                        <Image 
                            source={{ uri: baseUrl + camiseta.imagen }}
                            style={styles.imagenPrincipal}
                            resizeMode="contain"
                        />
                    </Surface>

                    {/* SECCIÓN 2: INFO DEL PRODUCTO */}
                    <View style={styles.seccionContenido}>
                        <View style={styles.headerRow}>
                            <View style={{flex: 1}}>
                                <Text style={styles.titulo}>{camiseta.nombre}</Text>
                                {camiseta.destacado && <Text style={styles.badge}>Edición de Coleccionista</Text>}
                            </View>
                            <IconButton 
                                icon={esFavorita ? 'heart' : 'heart-outline'} 
                                color={esFavorita ? 'red' : '#000'}
                                size={35} 
                                onPress={() => this.props.postFavorito(camisetaId)} 
                            />
                        </View>
                        <Text style={styles.descripcion}>{camiseta.descripcion}</Text>
                        
                        <Button 
                            mode="contained" 
                            onPress={() => console.log("Añadir al carrito")}
                            style={styles.btnComprar}
                        >
                            Comprar ahora
                        </Button>
                    </View>

                    <Divider style={styles.divisor} />

                    {/* SECCIÓN 3: INTERACCIÓN SOCIAL (VOCES DE LA GRADA) */}
                    <View style={styles.comentariosSeccion}>
                        <View style={styles.rowTitulo}>
                            <Text style={styles.seccionTitulo}>Voces de la grada</Text>
                            <IconButton icon="plus-circle" color={colorGaztaroaOscuro} onPress={this.toggleModal} />
                        </View>
                        
                        {comentarios.map((item, index) => (
                            <Surface key={index} style={styles.comentarioItem} elevation={1}>
                                <Text style={styles.comentarioAutor}>{item.autor} • {"⭐".repeat(item.valoracion)}</Text>
                                <Text style={styles.comentarioTexto}>{item.comentario}</Text>
                            </Surface>
                        ))}
                    </View>

                    {/* SECCIÓN 4: EL CROMO DIGITAL */}
                    <View style={styles.seccionCromo}>
                        <Text style={styles.seccionTitulo}>Certificado Digital QR</Text>
                        <Surface style={styles.tarjetaCromo} elevation={4}>
                            <View style={styles.cromoHeader}>
                                <Text style={styles.cromoID}>PRODUCTO CERTIFICADO: #TM-{camiseta.id}99</Text>
                            </View>
                            
                            <View style={styles.qrWrapper}>
                                <QRCode
                                    value={`the12thman://cromo/${camiseta.id}`} 
                                    size={160}
                                    color={colorGaztaroaOscuro}
                                    backgroundColor="white"
                                />
                            </View>

                            <Text style={styles.cromoFooter}>
                                Comparte esta ficha para vender en el Marketplace o verificar tu propiedad.
                            </Text>
                        </Surface>
                    </View>

                    {/* MODAL DE COMENTARIOS */}
                    <Modal visible={this.state.showModal} animationType="slide" transparent={false}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitulo}>Deja tu opinión</Text>
                            <TextInput label="Nombre" mode="outlined" style={styles.input} value={this.state.autor} onChangeText={t => this.setState({autor: t})} />
                            <TextInput label="Comentario" mode="outlined" multiline numberOfLines={4} style={styles.input} value={this.state.comentario} onChangeText={t => this.setState({comentario: t})} />
                            <Button mode="contained" onPress={() => this.enviarComentario(camisetaId)} style={styles.btnModal}>Publicar</Button>
                            <Button onPress={this.toggleModal} color="red">Cancelar</Button>
                        </View>
                    </Modal>

                </ScrollView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: { flex: 1, backgroundColor: '#fff' },
    mainContainer: { flex: 1 },
    error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    contenedorImagen: { backgroundColor: '#fff', paddingVertical: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    imagenPrincipal: { width: '100%', height: 350 },
    seccionContenido: { padding: 25 },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    badge: { color: colorGaztaroaOscuro, fontSize: 12, fontWeight: 'bold' },
    descripcion: { fontSize: 15, color: '#666', marginTop: 10, lineHeight: 22 },
    btnComprar: { marginTop: 20, backgroundColor: colorGaztaroaOscuro, borderRadius: 10, paddingVertical: 5 },
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
    btnModal: { backgroundColor: colorGaztaroaOscuro, padding: 5, marginBottom: 10 }
});

export default connect(mapStateToProps, mapDispatchToProps)(DetalleCamiseta);